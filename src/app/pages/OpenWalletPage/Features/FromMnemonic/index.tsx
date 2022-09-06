import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { MnemonicValidation } from 'app/components/MnemonicValidation'
import { multiAccountsActions } from 'app/state/multiaccounts'
import { MultiAccountsSelectionModal } from 'app/pages/OpenWalletPage/Features/MultiAccountsSelectionModal'

export function FromMnemonic() {
  const dispatch = useDispatch()
  const [showMultiAccountsModal, setShowMultiAccountsModal] = useState(false)
  const successHandler = (mnemonic: string) => {
    dispatch(multiAccountsActions.enumerateAccountsFromMnemonic(mnemonic))
    setShowMultiAccountsModal(true)
  }
  return (
    <>
      <MnemonicValidation successHandler={successHandler} />
      {showMultiAccountsModal && (
        <MultiAccountsSelectionModal
          abort={() => {
            setShowMultiAccountsModal(false)
          }}
          type="mnemonic"
        />
      )}
    </>
  )
}
