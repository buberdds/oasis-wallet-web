/**
 *
 * TransactionPreview
 *
 */
import {
  Box,
  Grid,
  ResponsiveContext,
  Text,
  NameValueList,
  NameValuePair,
  Card,
  CardHeader,
  CardBody,
} from 'grommet'
import React, { memo, useContext } from 'react'
import { normalizeColor } from 'grommet/utils'
import styled from 'styled-components'

import { AmountFormatter } from '../AmountFormatter'
import { PrettyAddress } from '../PrettyAddress'
import { ResponsiveGridRow } from '../ResponsiveGridRow'
import { TransactionPreview as Preview } from 'app/state/transaction/types'
import { useTranslation } from 'react-i18next'
import { TransactionTypeFormatter } from '../TransactionTypeFormatter'

interface Props {
  preview: Preview
  walletAddress: string
  chainContext: string
}

export const TransactionPreview = memo((props: Props) => {
  const isMobile = React.useContext(ResponsiveContext) === 'small'
  const { t } = useTranslation()
  const size = useContext(ResponsiveContext)
  const { preview, walletAddress, chainContext } = props

  return (
    <>
      {/* <Box>
        <Card height="small" width="small" background="light-1">
          <CardHeader pad="medium">Header</CardHeader>
          <CardBody pad="medium">Body</CardBody>
        </Card>
      </Box> */}
      <Box>
        {/* <StyledDescriptionList data-testid="account-balance-summary">
          <dt>{t('transaction.preview.type', 'Type')}</dt>
          <dd data-testid="account-balance-total">
            <TransactionTypeFormatter type={preview.transaction.type} />
          </dd>

          <dt>{t('transaction.preview.from', 'From')}</dt>
          <dd>
            <Text style={{ fontFamily: 'Roboto mono' }}>
              <PrettyAddress address={walletAddress} />
            </Text>
          </dd>

          <dt>{t('transaction.preview.to', 'To')}</dt>
          <dd>
            <Text style={{ fontFamily: 'Roboto mono' }}>
              <PrettyAddress address={preview.transaction.to} />
            </Text>
          </dd>
        </StyledDescriptionList> */}

        <StyledDescriptionList data-testid="account-balance-summary">
          <dt>
            <Text size={isMobile ? 'medium' : 'large'}>{t('transaction.preview.amount', 'Amount')}</Text>
          </dt>
          <dd data-testid="account-balance-total">
            <AmountFormatter amount={preview.transaction.amount} smallTicker={true} />
          </dd>

          <dt>{t('transaction.preview.fee', 'Fee')}</dt>
          <dd>
            <AmountFormatter amount={preview.fee!} smallTicker={true} />
          </dd>

          <dt>{t('transaction.preview.gas', 'Gas')}</dt>
          <dd>
            <AmountFormatter amount={preview.gas!} hideTicker />
          </dd>
        </StyledDescriptionList>
      </Box>

      {/* <Box>
        <NameValueList>
          <NameValuePair name="foo">Asd</NameValuePair>
        </NameValueList>
      </Box> */}
      <Grid columns={size !== 'small' ? ['auto', 'auto'] : ['auto']} gap={{ column: 'small', row: 'xsmall' }}>
        <ResponsiveGridRow
          label={t('transaction.preview.type', 'Type')}
          value={<TransactionTypeFormatter type={preview.transaction.type} />}
        />
        <ResponsiveGridRow
          label={t('transaction.preview.from', 'From')}
          value={
            <Text style={{ fontFamily: 'Roboto mono' }}>
              <PrettyAddress address={walletAddress} />
            </Text>
          }
        />
        {preview.transaction.type === 'transfer' && (
          <ResponsiveGridRow
            label={t('transaction.preview.to', 'To')}
            value={
              <Text style={{ fontFamily: 'Roboto mono' }}>
                <PrettyAddress address={preview.transaction.to} />
              </Text>
            }
          />
        )}
        {(preview.transaction.type === 'addEscrow' || preview.transaction.type === 'reclaimEscrow') && (
          <ResponsiveGridRow
            label={t('transaction.preview.validator', 'Validator')}
            value={
              <Text style={{ fontFamily: 'Roboto mono' }}>
                <PrettyAddress address={preview.transaction.validator} />
              </Text>
            }
          />
        )}
        <Box>
          {/* <StyledDescriptionList data-testid="account-balance-summary">
          <dt>{t('transaction.preview.type', 'Type')}</dt>
          <dd data-testid="account-balance-total">
            <TransactionTypeFormatter type={preview.transaction.type} />
          </dd>

          <dt>{t('transaction.preview.from', 'From')}</dt>
          <dd>
            <Text style={{ fontFamily: 'Roboto mono' }}>
              <PrettyAddress address={walletAddress} />
            </Text>
          </dd>

          <dt>{t('transaction.preview.to', 'To')}</dt>
          <dd>
            <Text style={{ fontFamily: 'Roboto mono' }}>
              <PrettyAddress address={preview.transaction.to} />
            </Text>
          </dd>
        </StyledDescriptionList> */}

          <StyledDescriptionList data-testid="account-balance-summary">
            <dt>
              <Text size={isMobile ? 'medium' : 'large'}>{t('transaction.preview.amount', 'Amount')}</Text>
            </dt>
            <dd data-testid="account-balance-total">
              <AmountFormatter amount={preview.transaction.amount} smallTicker={true} />
            </dd>

            <dt>{t('transaction.preview.fee', 'Fee')}</dt>
            <dd>
              <AmountFormatter amount={preview.fee!} smallTicker={true} />
            </dd>

            <dt>{t('transaction.preview.gas', 'Gas')}</dt>
            <dd>
              <AmountFormatter amount={preview.gas!} hideTicker />
            </dd>
          </StyledDescriptionList>
        </Box>
        {/* <ResponsiveGridRow
          label={t('transaction.preview.amount', 'Amount')}
          value={<AmountFormatter amount={preview.transaction.amount} smallTicker />}
        />
        {preview.transaction.type === 'reclaimEscrow' && (
          <ResponsiveGridRow
            label={t('transaction.preview.shares', 'Gigashares')}
            value={<AmountFormatter amount={preview.transaction.shares} hideTicker />}
          />
        )}
        <ResponsiveGridRow
          label={t('transaction.preview.fee', 'Fee')}
          value={<AmountFormatter amount={preview.fee!} smallTicker />}
        />
        <ResponsiveGridRow
          label={t('transaction.preview.gas', 'Gas')}
          value={<AmountFormatter amount={preview.gas!} hideTicker />}
        /> */}
        <ResponsiveGridRow
          label={t('transaction.preview.genesisHash', 'Genesis hash')}
          value={
            <Box
              border={{
                color: 'background-contrast-2',
                side: 'left',
                size: '3px',
              }}
              background={{
                color: 'background-contrast',
                opacity: 0.04,
              }}
              width="75%"
              pad="xsmall"
            >
              {chainContext}
            </Box>
          }
        />
      </Grid>
    </>
  )
})

const StyledDescriptionList = styled.dl`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  border-top: solid
    ${({ theme }) => `${theme.global?.edgeSize?.hair} ${normalizeColor('background-front-border', theme)}`};
  margin: ${({ theme }) => theme.global?.edgeSize?.xsmall} 0 0;
  padding: ${({ theme }) =>
    `${theme.global?.edgeSize?.small} ${theme.global?.edgeSize?.small} ${theme.global?.edgeSize?.xsmall}`};

  dt,
  dd {
    margin: 0;

    :first-of-type {
      font-weight: bold;
    }
  }

  @media only screen and (min-width: ${({ theme }) => `${theme.global?.breakpoints?.small?.value}px`}) {
    dt {
      width: 40%;
    }

    dd {
      width: 60%;
    }

    dt,
    dd {
      :not(:last-of-type) {
        margin-bottom: ${({ theme }) => theme.global?.edgeSize?.xsmall};
      }

      :first-of-type {
        font-size: ${({ theme }) => theme.text?.large?.size};
        line-height: ${({ theme }) => theme.text?.large?.height};
        margin-bottom: ${({ theme }) => theme.global?.edgeSize?.small};
      }
    }
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.global?.breakpoints?.small?.value}px`}) {
    dt {
      width: 30%;
    }

    dd {
      width: 70%;
      text-align: right;
    }

    dt,
    dd {
      font-size: 16px;

      :not(:last-of-type) {
        margin-bottom: ${({ theme }) => theme.global?.edgeSize?.xxsmall};
      }

      :first-of-type {
        font-size: ${({ theme }) => theme.text?.medium?.size};
        line-height: ${({ theme }) => theme.text?.medium?.height};
        margin-bottom: ${({ theme }) => theme.global?.edgeSize?.xsmall};
      }
    }
  }
`
