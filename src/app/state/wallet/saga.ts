import { hdkey } from '@oasisprotocol/client'
import { PayloadAction } from '@reduxjs/toolkit'
import { hex2uint, parseRpcBalance, publicKeyToAddress, shortPublicKey, uint2hex } from 'app/lib/helpers'
import nacl from 'tweetnacl'
import { call, fork, put, select, take, takeEvery, takeLatest } from 'typed-redux-saga'
import { selectMnemonic, selectSelectedAccounts } from 'app/state/multiaccounts/selectors'

import { walletActions } from '.'
import { MultiAccountsListAccount } from '../multiaccounts/types'
import { getOasisNic } from '../network/saga'
import { transactionActions } from '../transaction'
import { selectAddress, selectWallets } from './selectors'
import { AddWalletPayload, Wallet, WalletType } from './types'

// Ensure a unique walletId per opened wallet
// Maybe we should switch to something like uuid later
let walletId = 0

/**
 * Opened wallet saga
 * Will later be used to sign arbitrary messages
 */
export function* walletSaga() {}

export function* rootWalletSaga() {
  // Wait for an openWallet action (Mnemonic, Private Key, Ledger) and add them if requested
  yield* takeEvery(walletActions.openWalletFromPrivateKey, openWalletFromPrivateKey)
  yield* takeEvery(walletActions.openWalletFromMnemonic, openWalletFromMnemonic)
  yield* takeEvery(walletActions.openWalletsFromLedger, openWalletsFromLedger)
  yield* takeEvery(walletActions.addWallet, addWallet)

  // Reload balance of matching wallets when a transaction occurs
  yield* fork(refreshAccountOnTransaction)
  yield* takeEvery(walletActions.fetchWallet, loadWallet)

  // Allow switching between wallets
  yield* takeLatest(walletActions.selectWallet, selectWallet)

  // Start the wallet saga in parallel
  yield* fork(walletSaga)

  // Listen to closeWallet
  yield* takeEvery(walletActions.closeWallet, closeWallet)
}

export function* getBalance(publicKey: Uint8Array) {
  const nic = yield* call(getOasisNic)
  const short = yield* call(shortPublicKey, publicKey)
  const account = yield* call([nic, nic.stakingAccount], {
    height: 0,
    owner: short,
  })

  return parseRpcBalance(account)
}

function* getWalletByAddress(address: string) {
  const wallets = yield* select(selectWallets)
  const wallet = Object.values(wallets).find(w => w.address === address)

  return wallet ? wallet : undefined
}
/**
 * Take multiple ledger accounts that we want to open
 */
export function* openWalletsFromLedger() {
  const accounts: MultiAccountsListAccount[] = yield* select(selectSelectedAccounts)
  const newWalletId = walletId
  for (const account of accounts) {
    yield* put(
      walletActions.addWallet({
        id: walletId++,
        address: account.address,
        publicKey: account.publicKey,
        type: WalletType.Ledger,
        balance: account.balance,
        path: account.path,
        selectImmediately: false,
      }),
    )
  }
  const existingWallet = yield* call(getWalletByAddress, accounts[0].address)
  yield* put(walletActions.selectWallet(existingWallet ? existingWallet.id : newWalletId))
}

export function* openWalletFromPrivateKey({ payload: privateKey }: PayloadAction<string>) {
  const type = WalletType.PrivateKey
  const publicKeyBytes = nacl.sign.keyPair.fromSecretKey(hex2uint(privateKey)).publicKey
  const walletAddress = yield* call(publicKeyToAddress, publicKeyBytes)
  const publicKey = uint2hex(publicKeyBytes)
  const balance = yield* call(getBalance, publicKeyBytes)

  yield* put(
    walletActions.addWallet({
      id: walletId++,
      address: walletAddress,
      publicKey,
      privateKey,
      type: type!,
      balance,
      selectImmediately: true,
    }),
  )
}

export function* openWalletFromMnemonic() {
  const accounts: MultiAccountsListAccount[] = yield* select(selectSelectedAccounts)
  const mnemonic = yield* select(selectMnemonic)
  const newWalletId = walletId
  for (const account of accounts) {
    const derivePathAccountIndex = account.path.at(-1)
    const signer = yield* call(hdkey.HDKey.getAccountSigner, mnemonic!, derivePathAccountIndex)

    yield* put(
      walletActions.addWallet({
        address: account.address,
        balance: account.balance,
        id: walletId++,
        path: account.path,
        privateKey: uint2hex(signer.secretKey),
        publicKey: uint2hex(signer.publicKey),
        selectImmediately: false,
        type: WalletType.Mnemonic,
      }),
    )
  }
  const existingWallet = yield* call(getWalletByAddress, accounts[0].address)
  yield* put(walletActions.selectWallet(existingWallet ? existingWallet.id : newWalletId))
}

/**
 * Adds a wallet to the existing wallets
 * If the wallet exists already, do nothingg
 * If it has "selectImmediately", we select it immediately
 */
export function* addWallet({ payload: newWallet }: PayloadAction<AddWalletPayload>) {
  const existingWallet = yield* call(getWalletByAddress, newWallet.address)
  if (!existingWallet) {
    yield* put(walletActions.walletOpened(newWallet))
  }

  const walletId = existingWallet ? existingWallet.id : newWallet.id

  if (newWallet.selectImmediately) {
    yield* put(walletActions.selectWallet(walletId))
  }
}

export function* closeWallet() {
  yield* put(walletActions.walletClosed())
}

export function* selectWallet({ payload: index }: PayloadAction<number>) {
  yield* put(walletActions.walletSelected(index))
}

function* loadWallet(action: PayloadAction<Wallet>) {
  const wallet = action.payload
  const balance = yield* call(getBalance, hex2uint(wallet.publicKey))
  yield* put(
    walletActions.updateBalance({
      walletId: wallet.id,
      balance,
    }),
  )
}

/**
 * When a transaction is done, and it is related to the account we currently have in state
 * refresh the data.
 */
function* refreshAccountOnTransaction() {
  while (true) {
    const { payload } = yield* take(transactionActions.transactionSent)
    if (payload.type !== 'transfer') {
      // @TODO: This should be done for other types of transactions too
      return
    }

    const from = yield* select(selectAddress)
    const to = payload.to

    const wallets = yield* select(selectWallets)
    const matchingWallets = Object.values(wallets).filter(w => w.address === to || w.address === from)
    for (const wallet of matchingWallets) {
      yield* put(walletActions.fetchWallet(wallet))
    }
  }
}
