/**
 *
 * AmountFormatter
 *
 */
import { selectTicker } from 'app/state/network/selectors'
import * as React from 'react'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import { Text } from 'grommet'
import { StringifiedBigInt } from 'types/StringifiedBigInt'
import { formatBaseUnitsAsRose, formatGweiAsWrose } from 'app/lib/helpers'
import { grommetCustomTheme } from '../../../styles/theme/ThemeProvider'

export interface AmountFormatterProps {
  amount: StringifiedBigInt | null
  baseUnit?: boolean
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  hideTicker?: boolean
  size?: string
  smallTicker?: boolean
}

/**
 * Formats base unit amounts to ROSEs
 */
export const AmountFormatter = memo(
  ({
    amount,
    baseUnit = true,
    minimumFractionDigits,
    maximumFractionDigits,
    hideTicker,
    size,
    smallTicker,
  }: AmountFormatterProps) => {
    const ticker = useSelector(selectTicker)
    if (amount == null) return <>-</>

    const formatter = baseUnit ? formatBaseUnitsAsRose : formatGweiAsWrose
    const amountString = formatter(amount, {
      minimumFractionDigits: minimumFractionDigits ?? 1,
      maximumFractionDigits: maximumFractionDigits ?? 15,
    })

    const tickerProps = smallTicker
      ? {
          size: 'xsmall',
          weight: 600,
          color: grommetCustomTheme.global?.colors?.lightText,
        }
      : {}

    return (
      <>
        {amountString}
        {!hideTicker && (
          <Text margin={{ left: 'xxsmall' }} size={size} {...tickerProps}>
            {ticker}
          </Text>
        )}
      </>
    )
  },
)
