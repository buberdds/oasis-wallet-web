import * as oasis from '@oasisprotocol/client'
import { ContextSigner, Signer } from '@oasisprotocol/client/dist/signature'
import * as oasisRT from '@oasisprotocol/client-rt'
import BigNumber from "bignumber.js"
import { WalletError, WalletErrors } from 'types/errors'

import { addressToPublicKey, shortPublicKey } from './helpers'

type OasisClient = oasis.client.NodeInternal

export const signerFromPrivateKey = (privateKey: Uint8Array) => {
  return oasis.signature.NaclSigner.fromSecret(privateKey, 'this key is not important')
}

/** Transaction Wrapper */
export type TW<T> = oasis.consensus.TransactionWrapper<T>

// h/t extension wallet
async function getEvmBech32Address(evmAddress: any) {
  if (!evmAddress) {
    return ''
  }
  let newEvmAddress = evmAddress
  if (newEvmAddress.indexOf('0x') === 0) {
    newEvmAddress = newEvmAddress.substr(2)
  }
  const evmBytes = oasis.misc.fromHex(newEvmAddress)
  let address = await oasis.address.fromData(
    oasisRT.address.V0_SECP256K1ETH_CONTEXT_IDENTIFIER,
    oasisRT.address.V0_SECP256K1ETH_CONTEXT_VERSION,
    evmBytes,
  )
  const bech32Address = oasisRT.address.toBech32(address)
  return bech32Address
}
export class OasisTransaction {
  protected static genesis?: oasis.types.GenesisDocument

  public static async buildReclaimEscrow(
    nic: OasisClient,
    signer: Signer,
    account: string,
    shares: bigint,
  ): Promise<TW<oasis.types.StakingReclaimEscrow>> {
    const tw = oasis.staking.reclaimEscrowWrapper()
    const nonce = await OasisTransaction.getNonce(nic, signer)
    tw.setNonce(nonce)
    tw.setFeeAmount(oasis.quantity.fromBigInt(0n))
    tw.setBody({
      account: await addressToPublicKey(account),
      shares: oasis.quantity.fromBigInt(shares),
    })

    const gas = await tw.estimateGas(nic, signer.public())
    tw.setFeeGas(gas)

    return tw
  }

  public static async buildAddEscrow(
    nic: OasisClient,
    signer: Signer,
    account: string,
    amount: bigint,
  ): Promise<TW<oasis.types.StakingEscrow>> {
    const tw = oasis.staking.addEscrowWrapper()
    const nonce = await OasisTransaction.getNonce(nic, signer)
    tw.setNonce(nonce)
    tw.setFeeAmount(oasis.quantity.fromBigInt(0n))
    tw.setBody({
      account: await addressToPublicKey(account),
      amount: oasis.quantity.fromBigInt(amount),
    })

    const gas = await tw.estimateGas(nic, signer.public())
    tw.setFeeGas(gas)

    return tw
  }

  public static async buildTransfer(
    nic: OasisClient,
    signer: Signer,
    to: string,
    amount: bigint,
  ): Promise<TW<oasis.types.StakingTransfer>> {
    const tw = oasis.staking.transferWrapper()
    const nonce = await OasisTransaction.getNonce(nic, signer)
    tw.setNonce(nonce)
    tw.setFeeAmount(oasis.quantity.fromBigInt(0n))
    tw.setBody({
      to: await addressToPublicKey(to),
      amount: oasis.quantity.fromBigInt(amount),
    })

    const gas = await tw.estimateGas(nic, signer.public())
    tw.setFeeGas(gas)

    return tw
  }

  public static async buildToParatime(
    nic: OasisClient,
    signer: Signer,
    targetAddress: string /* staking.Allow */,
    fromAddress: string,
    amountArg: bigint,
  ) /*: Promise<TW<oasis.types.StakingTransfer>> */ {
    const runtimeId = '00000000000000000000000000000000000000000000000072c8215e60d5bca7'

    const CONSENSUS_RT_ID = oasis.misc.fromHex(runtimeId)
    const consensusWrapper = new oasisRT.consensusAccounts.Wrapper(CONSENSUS_RT_ID)
    const txWrapper = consensusWrapper.callDeposit()

    const accountsWrapper = new oasisRT.accounts.Wrapper(CONSENSUS_RT_ID)
    const bech32Address = await oasis.staking.addressFromBech32(fromAddress)
    const nonce = await accountsWrapper.queryNonce().setArgs({ address: bech32Address }).query(nic)

    const decimal = new BigNumber(10).pow(18) /* Emerald */
    const amount = BigInt(new BigNumber(amountArg).multipliedBy(decimal).toFixed())
    const DEPOSIT_AMOUNT = [oasis.quantity.fromBigInt(amount), oasisRT.token.NATIVE_DENOMINATION]

    const realAddress = await getEvmBech32Address(targetAddress)
    let uint8ArrayAddress = await oasis.staking.addressFromBech32(realAddress)
    txWrapper.setBody({
      amount: DEPOSIT_AMOUNT,
      to: uint8ArrayAddress,
    })
    const feeAmount = 0n
    const feeGas = BigInt(15000)
    txWrapper
      .setFeeAmount([oasis.quantity.fromBigInt(feeAmount), oasisRT.token.NATIVE_DENOMINATION])
      .setFeeGas(feeGas)
      .setFeeConsensusMessages(1)

    const signerInfo = ({
        address_spec: {signature: {ed25519: signer.public()}},
        nonce,
    });
    txWrapper.setSignerInfo([signerInfo]);

    return txWrapper
  }

  public static async signUsingLedger<T>(
    chainContext: string,
    signer: ContextSigner,
    tw: TW<T>,
  ): Promise<void> {
    await tw.sign(signer, chainContext)

    // @todo Upstream bug in oasis-app, the signature is larger than 64 bytes
    tw.signedTransaction.signature.signature = tw.signedTransaction.signature.signature.slice(0, 64)
  }

  public static async sign<T>(chainContext: string, signer: Signer, tw: TW<T>): Promise<void> {
    const theSigner = new oasis.signature.BlindContextSigner(signer)
    return tw.sign([theSigner], chainContext)
  }

  public static async submit<T>(nic: OasisClient, tw: TW<T>): Promise<void> {
    try {
      await tw.submit(nic)
    } catch (e: any) {
      const grpcError = e?.cause?.metadata?.['grpc-message'] || e.message

      if (!grpcError) {
        throw new WalletError(WalletErrors.UnknownError, grpcError, e)
      }

      switch (grpcError) {
        case 'transaction: invalid nonce':
          throw new WalletError(WalletErrors.InvalidNonce, 'Invalid nonce')
        case 'consensus: duplicate transaction':
          throw new WalletError(WalletErrors.DuplicateTransaction, 'Duplicate transaction')
        default:
          throw new WalletError(WalletErrors.UnknownGrpcError, grpcError, e)
      }
    }
  }

  protected static async getNonce(nic: OasisClient, signer: Signer): Promise<bigint> {
    const nonce = await nic.consensusGetSignerNonce({
      account_address: await shortPublicKey(signer.public()),
      height: 0,
    })

    return BigInt(nonce || 0)
  }
}
