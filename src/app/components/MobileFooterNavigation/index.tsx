import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Text } from 'grommet'
import { LineChart, Money } from 'grommet-icons'
import styled from 'styled-components'
import { normalizeColor } from 'grommet/utils'
import { NavLink } from 'react-router-dom'
import { selectAddress } from 'app/state/wallet/selectors'

const StyledMobileFooterNavigation = styled(Box)`
  ${({ theme }) => console.log(theme)} // temp
  background-color: ${({ theme }) => normalizeColor('background-front', theme)};
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  box-shadow: ${({ theme }) =>
    `0px 0px ${theme.global?.borderSize?.xsmall} ${normalizeColor('background-front-border', theme)}`};
  border-top: ${({ theme }) =>
    `solid ${theme.global?.borderSize?.xsmall} ${normalizeColor('background-contrast', theme)}`};
  font-size: 0.875rem;
  line-height: 1;
  flex-direction: row;
`

interface MobileFooterNavigationProps {
  isAccountOpen: boolean
  isMobile: boolean
}

export const MobileFooterNavigation = ({ isAccountOpen, isMobile }: MobileFooterNavigationProps) => {
  const address = useSelector(selectAddress)

  if (!isMobile || !isAccountOpen) {
    return null
  }

  return (
    <StyledMobileFooterNavigation>
      <NavLink to={`/account/${address}`}>
        <Box as="span" justify="center" align="center">
          <Box as="span" margin="xsmall">
            <Money size="medium" />
          </Box>
          <Text size="small">Wallet</Text>
        </Box>
      </NavLink>

      <NavLink to={`/account/${address}/stake`}>
        <Box as="span" justify="center" align="center">
          <Box as="span" margin="xsmall">
            <LineChart size="medium" />
          </Box>
          <Text size="small">Staking</Text>
        </Box>
      </NavLink>
    </StyledMobileFooterNavigation>
  )
}
