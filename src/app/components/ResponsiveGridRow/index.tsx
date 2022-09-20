import { Box, BoxProps, ResponsiveContext, Text } from 'grommet'
import React, { memo } from 'react'
import styled from 'styled-components'
import { normalizeColor } from 'grommet/utils'

interface ResponsiveGridRowProps {
  label: React.ReactNode
  withSeparator?: boolean
  value: React.ReactNode
}

interface StyledResponsiveGridRowValueProps extends BoxProps {
  withSeparator?: boolean
}

const StyledResponsiveGridRowValue = styled(Box)<StyledResponsiveGridRowValueProps>`
  @media only screen and (max-width: ${({ theme }) => `${theme.global?.breakpoints?.small?.value}px`}) {
    margin-bottom: ${({ theme }) => theme.global?.edgeSize?.xsmall};
    padding-bottom: ${({ theme }) => theme.global?.edgeSize?.small};
    ${({ theme }) =>
      `
      border-bottom: solid ${theme.global?.edgeSize?.hair} ${normalizeColor(
        'background-front-border',
        theme,
      )};
`};
  }
`

// border-bottom: solid  ${theme.global?.edgeSize?.hair} ${normalizeColor('background-front-border', theme )};

export const ResponsiveGridRow = memo(({ label, value, withSeparator }: ResponsiveGridRowProps) => {
  return (
    <>
      <Box>
        <Text weight="bold">{label}</Text>
      </Box>
      {withSeparator ? (
        <StyledResponsiveGridRowValue
        // responsive={false}
        // margin={{ bottom: 'xsmall' }}
        // pad={{ bottom: 'small' }}
        >
          {value}
        </StyledResponsiveGridRowValue>
      ) : (
        <Box>{value}</Box>
      )}
    </>
  )
})
