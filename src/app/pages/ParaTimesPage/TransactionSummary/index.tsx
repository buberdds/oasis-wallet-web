import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { ParaTimeContent } from '../ParaTimeContent'
import { ParaTimeFormFooter } from '../ParaTimeFormFooter'
import { useParaTimes } from '../useParaTimes'

export const TransactionSummary = () => {
  const { t } = useTranslation()
  const { isDepositing, isEvmcParaTime, paraTimeName, resetTransactionForm } = useParaTimes()

  return (
    <ParaTimeContent
      description={
        <Trans
          i18nKey="paraTimes.summary.description"
          t={t}
          values={{
            actionType: isDepositing
              ? t('paraTimes.summary.into', 'into')
              : t('paraTimes.summary.from', 'from'),
            address: '0xb794f5ea0ba39494ce839613fffba7427957926',
            isEvmc: isEvmcParaTime ? t('paraTimes.common.evmc', '(EVMc)') : '',
            paraTime: paraTimeName,
            value: '100',
          }}
          defaults="You have successfully transferred <strong>{{value}} ROSE</strong> tokens {{actionType}} the following wallet on the <strong>{{paraTime}}</strong> {{isEvmc}} ParaTime: <strong>{{address}}</strong>"
        />
      }
    >
      <ParaTimeFormFooter
        primaryLabel={t('paraTimes.summary.navigate', 'Navigate to ParaTimes Transfers')}
        primaryAction={resetTransactionForm}
        withNotice
      />
    </ParaTimeContent>
  )
}
