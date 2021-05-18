/**
 *
 * DelegationList
 *
 */
import { AmountFormatter } from 'app/components/AmountFormatter'
import { ReclaimEscrowForm } from 'app/components/ReclaimEscrowForm'
import { ShortAddress } from 'app/components/ShortAddress'
import { selectAccountAddress } from 'app/state/account/selectors'
import { useStakingSlice } from 'app/state/staking'
import { selectSelectedAddress, selectValidatorDetails } from 'app/state/staking/selectors'
import { DebondingDelegation, Delegation, ValidatorDetails } from 'app/state/staking/types'
import { selectActiveWallet } from 'app/state/wallet/selectors'
import { Box, Text } from 'grommet'
import { Down, StatusCritical, StatusGood } from 'grommet-icons'
import React, { memo } from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { dataTableStyles } from 'styles/theme/ThemeProvider'

import { ValidatorInformations } from '../ValidatorList/ValidatorInformations'

interface DelegationProps {
  data: Delegation | DebondingDelegation
  validatorDetails: ValidatorDetails | null
  canReclaim: boolean
}
const DelegationItem = memo((props: DelegationProps) => {
  const delegation = props.data
  const validator = props.data.validator
  const canReclaim = props.canReclaim
  const details = props.validatorDetails

  return (
    <Box pad="medium" background="background-contrast" data-testid="validator-item">
      {validator && <ValidatorInformations validator={validator} details={details} />}
      {!validator && <>Unknown validator</>}
      {canReclaim && (
        <ReclaimEscrowForm
          address={delegation.validatorAddress}
          maxAmount={delegation.amount}
          shares={delegation.shares}
        />
      )}
      {/* {isWalletOpen && <AddEscrowForm validatorAddress={validator.address} />} */}
    </Box>
  )
})

interface Props {
  type: 'active' | 'debonding'
  delegations: Delegation[]
}

/**
 * Renders the list of delegations
 */
export const DelegationList = memo((props: Props) => {
  const type = props.type
  const delegations = props.delegations

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const actions = useStakingSlice().actions

  const validatorDetails = useSelector(selectValidatorDetails)
  const selectedAddress = useSelector(selectSelectedAddress)

  const accountAddress = useSelector(selectAccountAddress)
  const activeWallet = useSelector(selectActiveWallet)
  const canReclaim = type === 'active' && activeWallet?.address === accountAddress

  const rowClicked = (row: Delegation) => {
    if (selectedAddress === row.validatorAddress) {
      dispatch(actions.validatorDeselected())
    } else {
      dispatch(actions.validatorSelected(row.validatorAddress))
    }
  }

  // All possible columns
  const columnTypes: Record<
    'icon' | 'status' | 'name' | 'amount' | 'fee' | 'epoch',
    IDataTableColumn<Delegation>
  > = {
    icon: {
      name: '',
      cell: datum => (
        <img
          src="https://avatars.githubusercontent.com/u/52803776?s=200&v=4"
          height="16px"
          width="16px"
          alt=""
        />
      ),
      width: '34px',
    },
    status: {
      name: '',
      cell: datum =>
        datum.validator && datum.validator.status === 'active' ? (
          <StatusGood color="status-ok" />
        ) : (
          <StatusCritical color="status-critical" />
        ),
      width: '34px',
    },
    name: {
      name: t('validator.name', 'Name'),
      cell: datum =>
        datum.validator && datum.validator.name ? (
          datum.validator.name
        ) : (
          <Text data-tag="allowRowEvents">
            <ShortAddress address={datum.validatorAddress} />
          </Text>
        ),
    },
    amount: {
      name:
        type === 'active'
          ? t('delegations.delegatedAmount', 'Delegated Amount')
          : t('delegations.reclaimedAmount', 'Reclaimed Amount'),
      selector: 'amount',
      cell: datum =>
        datum.amount && (
          <AmountFormatter amount={datum.amount} minimumFractionDigits={1} maximumFractionDigits={4} />
        ),
      sortable: true,
      sortFunction: (row1, row2) => Number(row1) - Number(row2),
    },
    fee: {
      name: t('validator.fee', 'Fee'),
      selector: 'fee',
      sortable: true,
      width: '100px',
      cell: datum => (datum.validator?.fee !== undefined ? `${datum.validator.fee}%` : 'Unknown'),
    },
    epoch: {
      name: t('delegations.debondingEpoch', 'Debonding Epoch'),
      selector: 'epoch',
      sortable: true,
      // width: '120px',
      // cell: datum => (datum.validator?.fee !== undefined ? `${datum.validator.fee}%` : 'Unknown'),
    },
  }

  const columns =
    type === 'active'
      ? [columnTypes.icon, columnTypes.status, columnTypes.name, columnTypes.amount, columnTypes.fee]
      : [columnTypes.icon, columnTypes.name, columnTypes.amount, columnTypes.epoch]

  return (
    <DataTable
      noHeader={true}
      columns={columns}
      data={delegations}
      style={{}}
      customStyles={dataTableStyles}
      expandableRowsHideExpander
      expandableRows={true}
      expandableRowsComponent={
        <DelegationItem data={{} as any} validatorDetails={validatorDetails} canReclaim={canReclaim} />
      }
      expandableRowExpanded={row => row.validatorAddress === selectedAddress}
      sortIcon={<Down />}
      theme="blank"
      onRowClicked={rowClicked}
      highlightOnHover
      pointerOnHover
    />
  )
})