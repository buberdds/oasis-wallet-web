import React, { useState } from 'react'
import { Box, Button, Collapsible, FormField, TextInput } from 'grommet'
import { useTranslation } from 'react-i18next'

type FeesSectionProps = {
  feeAmount: string
  feeGas: string
  ticker: string
}

export const FeesSection = ({ feeAmount, feeGas, ticker }: FeesSectionProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <Box pad={{ vertical: 'medium' }}>
      <Box align="start">
        <Button
          margin={{ bottom: 'medium' }}
          secondary
          size="small"
          onClick={() => setOpen(!open)}
          label={t('paraTimes.amount.advanced', 'Advanced')}
        />
      </Box>
      <Collapsible open={open}>
        <FormField name="feeAmount">
          <TextInput
            name="feeAmount"
            type="text"
            placeholder={t('paraTimes.amount.feeAmountPlaceholder', 'Fee Amount (nano {{ticker}})', {
              ticker,
            })}
            value={feeAmount}
          />
        </FormField>
        <FormField name="feeGas">
          <TextInput
            name="feeGas"
            type="text"
            placeholder={t('paraTimes.amount.feeGasPlaceholder', 'Fee gas')}
            value={feeGas}
          />
        </FormField>
      </Collapsible>
    </Box>
  )
}
