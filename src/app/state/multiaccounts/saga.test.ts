import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import { expectSaga } from 'redux-saga-test-plan'
import * as oasis from '@oasisprotocol/client'
import { multiAccountsActions } from '.'
import { multiAccountsSaga, sign } from './saga'
import * as matchers from 'redux-saga-test-plan/matchers'
import { Ledger, LedgerSigner } from 'app/lib/ledger'
import { getBalance } from '../wallet/saga'
import { addressToPublicKey, publicKeyToAddress } from 'app/lib/helpers'
import { MultiAccountsStep } from './types'
import { WalletErrors } from 'types/errors'
import { OasisTransaction } from 'app/lib/transaction'

describe('multiAccounts Sagas', () => {
  describe('enumerateAccountsFromLedger', () => {
    it('should list accounts', async () => {
      const validAccount = {
        publicKey: await addressToPublicKey('oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk'),
        path: [44, 474, 0, 0, 0],
      }

      return expectSaga(multiAccountsSaga)
        .provide([
          [matchers.call.fn(TransportWebUSB.isSupported), true],
          [matchers.call.fn(TransportWebUSB.create), { close: () => {} }],
          [matchers.call.fn(Ledger.enumerateAccounts), [validAccount]],
          [matchers.call.fn(getBalance), {}],
        ])
        .dispatch(multiAccountsActions.enumerateAccountsFromLedger())
        .put(multiAccountsActions.setStep(MultiAccountsStep.Done))
        .put.actionType(multiAccountsActions.accountsListed.type)
        .silentRun(50)
    })

    it('should handle unsupported browsers', async () => {
      return expectSaga(multiAccountsSaga)
        .provide([
          [matchers.call.fn(TransportWebUSB.isSupported), false],
          [matchers.call.fn(TransportWebUSB.create), { close: () => {} }],
        ])
        .dispatch(multiAccountsActions.enumerateAccountsFromLedger())
        .put.like({ action: { payload: { code: WalletErrors.USBTransportNotSupported } } })
        .silentRun(50)
    })

    it('should handle transport errors', async () => {
      return expectSaga(multiAccountsSaga)
        .provide([
          [matchers.call.fn(TransportWebUSB.isSupported), true],
          [matchers.call.fn(TransportWebUSB.create), Promise.reject(new Error('No device selected'))],
        ])
        .dispatch(multiAccountsActions.enumerateAccountsFromLedger())
        .put.like({ action: { payload: { code: WalletErrors.LedgerNoDeviceSelected } } })
        .silentRun(50)
    })

    it('should bubble-up USB unknown errors', async () => {
      return expectSaga(multiAccountsSaga)
        .provide([
          [matchers.call.fn(TransportWebUSB.isSupported), true],
          [matchers.call.fn(TransportWebUSB.create), Promise.reject(new Error('Dummy error'))],
        ])
        .dispatch(multiAccountsActions.enumerateAccountsFromLedger())
        .put.like({ action: { payload: { code: WalletErrors.USBTransportError, message: 'Dummy error' } } })
        .silentRun(50)
    })

    it('should bubble-up other unknown errors', async () => {
      return expectSaga(multiAccountsSaga)
        .provide([
          [matchers.call.fn(TransportWebUSB.isSupported), true],
          [matchers.call.fn(TransportWebUSB.create), { close: () => {} }],
          [matchers.call.fn(Ledger.enumerateAccounts), Promise.reject(new Error('Dummy error'))],
        ])
        .dispatch(multiAccountsActions.enumerateAccountsFromLedger())
        .put.like({ action: { payload: { code: WalletErrors.UnknownError, message: 'Dummy error' } } })
        .silentRun(50)
    })
  })

  describe('enumerateAccountsFromMnemonic', () => {
    const mockAddress = 'dummyAddress'

    it('should list accounts', async () => {
      return expectSaga(multiAccountsSaga)
        .provide([
          [matchers.call.fn(oasis.hdkey.HDKey.getAccountSigner), {}],
          [matchers.call.fn(publicKeyToAddress), mockAddress],
          [matchers.call.fn(getBalance), {}],
        ])
        .dispatch(multiAccountsActions.enumerateAccountsFromMnemonic('mnemonic'))
        .put({ type: multiAccountsActions.setStep.type, payload: MultiAccountsStep.LoadingAccounts })
        .put({ type: multiAccountsActions.setStep.type, payload: MultiAccountsStep.Done })
        .put({ type: multiAccountsActions.setMnemonic.type, payload: 'mnemonic' })
        .put({
          type: multiAccountsActions.accountsListed.type,
          payload: [
            {
              address: mockAddress,
              balance: {},
              path: [44, 474, 0],
              selected: true,
            },
            {
              address: mockAddress,
              balance: {},
              path: [44, 474, 1],
              selected: false,
            },
            {
              address: mockAddress,
              balance: {},
              path: [44, 474, 2],
              selected: false,
            },
            {
              address: mockAddress,
              balance: {},
              path: [44, 474, 3],
              selected: false,
            },
            {
              address: mockAddress,
              balance: {},
              path: [44, 474, 4],
              selected: false,
            },
          ],
        })
        .silentRun(50)
    })
  })

  describe('sign', () => {
    it('Should sign and close the transport', () => {
      const mockSigner = { setTransport: jest.fn(), sign: jest.fn().mockResolvedValue(null) }
      const mockTransport = { close: jest.fn() }

      return expectSaga(sign, mockSigner as unknown as LedgerSigner, {} as any)
        .withState({ network: {} })
        .provide([
          [matchers.call.fn(TransportWebUSB.isSupported), true],
          [matchers.call.fn(TransportWebUSB.create), mockTransport],
          [matchers.call.fn(OasisTransaction.signUsingLedger), Promise.resolve()],
        ])
        .call([mockTransport, mockTransport.close])
        .run(50)
    })

    it('Should close the transport even on signature error', () => {
      const mockSigner = { setTransport: jest.fn(), sign: jest.fn().mockResolvedValue(null) }
      const mockTransport = { close: jest.fn() }

      return expectSaga(function* () {
        try {
          yield* sign(mockSigner as unknown as LedgerSigner, {} as any)
        } catch (err) {
          expect(err).toEqual(new Error('Dummy error'))
        }
      })
        .withState({ network: {} })
        .provide([
          [matchers.call.fn(TransportWebUSB.isSupported), true],
          [matchers.call.fn(TransportWebUSB.create), mockTransport],
          [matchers.call.fn(OasisTransaction.signUsingLedger), Promise.reject(new Error('Dummy error'))],
        ])
        .call([mockTransport, mockTransport.close])
        .run(50)
        .catch(e => {
          expect(e).toEqual(new Error('Dummy error'))
        })
    })
  })
})
