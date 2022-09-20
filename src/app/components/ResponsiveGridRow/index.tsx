import { Box, Text } from 'grommet'
import React, { memo } from 'react'
import styled from 'styled-components'
import { normalizeColor } from 'grommet/utils'

interface ResponsiveGridRowProps {
  label: React.ReactNode
  withSeparator?: boolean
  value: React.ReactNode
}

const StyledResponsiveGridRowValue = styled(Box)`
  margin-bottom: ${({ theme }) => theme.global?.edgeSize?.xsmall};
  padding-bottom: ${({ theme }) => theme.global?.edgeSize?.small};

  @media only screen and (min-width: ${({ theme }) => `${theme.global?.breakpoints?.small?.value}px`}) {
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.global?.breakpoints?.small?.value}px`}) {
    border-bottom: solid
      ${({ theme }) => `${theme.global?.edgeSize?.hair} ${normalizeColor('background-front-border', theme)}`};
  }
`

export const ResponsiveGridRow = memo(({ label, value }: ResponsiveGridRowProps) => {
  return (
    <>
      <Box>
        <Text weight="bold">{label}</Text>
      </Box>
      <StyledResponsiveGridRowValue direction="row">{value}</StyledResponsiveGridRowValue>
    </>
  )
})
