import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { TransitionRoute, TransitionRouteProps } from 'app/components/TransitionRoute'
import { selectIsAddressInWallet } from 'app/state/selectIsAddressInWallet'

export const OpenWalletRequiredRoute = (props: TransitionRouteProps) => {
  const history = useHistory()
  const isAddressInWallet = useSelector(selectIsAddressInWallet)

  useEffect(() => {
    if (!isAddressInWallet) {
      history.push(`/open-wallet`)
    }
  }, [isAddressInWallet, history])

  return <TransitionRoute {...props} />
}
