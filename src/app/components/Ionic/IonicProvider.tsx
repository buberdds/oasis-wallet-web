import { createContext, FC, PropsWithChildren, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'

const IonicContext = createContext<undefined>(undefined)

const IonicContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate()

  useEffect(() => {
    /**
     * The back button refers to the physical back button on an Android device and should not be confused
     * with either the browser back button or ion-back-button.
     */
    const backButtonListenerHandle = App.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        App.exitApp()
      } else {
        navigate(-1)
      }
    })

    return () => {
      backButtonListenerHandle.remove()
    }
  }, [navigate])

  return <IonicContext.Provider value={undefined}>{children}</IonicContext.Provider>
}

export const IonicProvider: FC<PropsWithChildren> = ({ children }) => {
  if (Capacitor.isNativePlatform()) {
    return <IonicContextProvider>{children}</IonicContextProvider>
  }

  return children
}