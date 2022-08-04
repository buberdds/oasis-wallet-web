import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Select,
  Anchor,
  Paragraph,
  Box,
  Button,
  Heading,
  Tab,
  Tabs,
  Text,
  TextInput,
  Form,
  FormField,
} from 'grommet'
import { FormNext, Down, CaretLeftFill, CaretNext, CaretRightFill } from 'grommet-icons/icons'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { AmountFormatter } from '../../components/AmountFormatter'

interface TransactionFormProps {
  canSendToConsensus: boolean
  paraTimeLabel: string
}

const TransactionForm = ({ canSendToConsensus, paraTimeLabel }: TransactionFormProps) => {
  let { paratime } = useParams()
  const [toParatime, setToParatime] = useState(true)
  const [ethBalance, setEthBalance] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const selectOptions = [`Deposit to ${paraTimeLabel} ParaTime`, `Withdraw from ${paraTimeLabel} ParaTime`]
  const isCipher = paratime === 'cipher'
  const isEmerald = paratime === 'emerald'

  useEffect(() => {
    setToParatime(true)
    setEthBalance('')
    setPrivateKey('')
  }, [paratime])

  return (
    <Box style={{ width: '50%' }} round="5px" background="background-front" align="center">
      {/* <Paragraph margin="none" textAlign="center" style={{ maxWidth: '100%' }}>
        You are going to send tokens to <strong>asd ParaTime</strong>.
      </Paragraph> */}
      <Form style={{ width: '100%', maxWidth: '470px' }}>
        <FormField
          label="Transfer Type"
          htmlFor="select"
          // help={
          //   <Text weight="lighter" size="small">
          //     Text to help the user know what is possible
          //   </Text>
          // }
          // error={
          //   <Box align="center" background="background-front">
          //     <Text weight="bolder" size="small">
          //       Custom Text to call attention to an issue with this field
          //     </Text>
          //   </Box>
          // }
        >
          <Select
            id="select"
            placeholder="placeholder"
            options={selectOptions}
            value={toParatime ? selectOptions[0] : selectOptions[1]}
            onChange={() => setToParatime(!toParatime)}
          />
        </FormField>
        {isEmerald && !toParatime ? (
          <Box align="end">
            {ethBalance && (
              <Text weight="bolder" size="small">
                Available: <AmountFormatter amount={ethBalance} smallTicker />
              </Text>
            )}
          </Box>
        ) : (
          <Box align="end">
            <Text weight="bolder" size="small">
              Available: <AmountFormatter amount="200000000000" smallTicker />
            </Text>
          </Box>
        )}

        {isEmerald && !toParatime ? (
          <>
            {!ethBalance ? (
              <>
                <FormField htmlFor="privateKey" name="privateKey" label="Ethereum-compatible private key">
                  <TextInput
                    id="privateKey"
                    name="privateKey"
                    value={privateKey}
                    placeholder={'Enter a private key'}
                    onChange={event => setPrivateKey(event.target.value)}
                    required
                  />
                </FormField>
                <Box direction="row" justify="end" margin={{ top: 'medium' }}>
                  <Button
                    type="submit"
                    label="Next"
                    style={{ borderRadius: '4px' }}
                    onClick={() => setEthBalance('550000000000')}
                    primary
                  />
                </Box>

                <Box margin={{ top: 'large', bottom: 'small' }}>
                  <Text size="small" textAlign="center">
                    You can learn how to export your private key from your Ethereum wallet by reading our{' '}
                    <Anchor
                      href="https://docs.oasis.dev/general/manage-tokens/how-to-transfer-rose-into-evm-paratime/#metamask"
                      target="_blank"
                      rel="noopener"
                      color="brand"
                    >
                      documentation
                    </Anchor>
                    . Never share your private key with anyone.
                  </Text>
                </Box>
              </>
            ) : (
              <>
                <FormField htmlFor="recipient-id" name="recipient" label="Recipient">
                  <TextInput
                    id="recipient-id"
                    name="recipient"
                    value=""
                    placeholder={
                      isCipher ? 'oasis1qqnk4au603zs94k0d0n7c0hkx8t4p6r87s60axru' : 'Enter an address'
                    }
                    onChange={() => {}}
                    required
                  />
                </FormField>
                <FormField htmlFor="amount-id" name="amount" label="Amount">
                  <TextInput
                    id="amount-id"
                    name="amount"
                    placeholder="0"
                    type="number"
                    step="any"
                    min="0"
                    value=""
                    onChange={() => {}}
                    required
                  />
                </FormField>
                <Box direction="row" justify="end" margin={{ top: 'medium' }}>
                  <Button
                    type="submit"
                    label="Send"
                    style={{ borderRadius: '4px' }}
                    onClick={() => {}}
                    primary
                  />
                </Box>
              </>
            )}
          </>
        ) : (
          <>
            {' '}
            <FormField htmlFor="recipient-id" name="recipient" label="Recipient">
              <TextInput
                id="recipient-id"
                name="recipient"
                value=""
                placeholder={isCipher ? 'oasis1qqnk4au603zs94k0d0n7c0hkx8t4p6r87s60axru' : 'Enter an address'}
                onChange={() => {}}
                required
              />
            </FormField>
            <FormField htmlFor="amount-id" name="amount" label="Amount">
              <TextInput
                id="amount-id"
                name="amount"
                placeholder="0"
                type="number"
                step="any"
                min="0"
                value=""
                onChange={() => {}}
                required
              />
            </FormField>
            <Box direction="row" justify="end" margin={{ top: 'medium' }}>
              <Button type="submit" label="Send" style={{ borderRadius: '4px' }} onClick={() => {}} primary />
            </Box>
          </>
        )}
      </Form>
      {/* <TransactionStatus error={error} success={success} /> */}
    </Box>
  )
}

export const Paratimes = () => {
  const { t } = useTranslation()
  let { paratime } = useParams()
  const dispatch = useDispatch()
  const labels = {
    emerald: 'Emerald',
    cipher: 'Cipher',
  }
  const paraTimeLabel = labels[paratime]
  const canSendToConsensus = paratime !== 'emerald'

  return (
    <Box pad="medium" background="background-front">
      <Heading level={3} margin={{ bottom: 'small', top: 'none' }}>
        {paraTimeLabel} Paratime{' '}
        <span style={{ marginLeft: '3px', fontSize: '16px', color: '#a3a3a3' }}>
          (000000....e2eaa99fc008f87f)
        </span>
      </Heading>

      <Box align="center" gap="medium" pad={{ vertical: 'medium' }} fill="horizontal">
        <TransactionForm canSendToConsensus={canSendToConsensus} paraTimeLabel={paraTimeLabel} />
      </Box>

      {/* {!canSendToConsensus && (
        <Box>
          <Paragraph size="small" margin="none" textAlign="center" style={{ maxWidth: '100%' }}>
            To send tokens back from <strong>{paraTimeLabel} ParaTime</strong> to <strong>Consensus</strong>{' '}
            layer you have to import your wallet using{' '}
            <Anchor href="https://google.com" target="_blank" rel="noopener" color="brand">
              Ethereum-compatible private key
            </Anchor>
            .
          </Paragraph>
        </Box>
      )} */}

      {/* <Tabs>
        <Tab title="To ParaTime" icon={<FormNext />}>
          <Box align="center" gap="medium" pad={{ vertical: 'medium' }} fill="horizontal">
            <Paragraph margin="none" textAlign="center" style={{ maxWidth: '100%' }}>
              You are going to send tokens to <strong>Emerald ParaTime</strong>.
            </Paragraph>
            <TransactionForm />
          </Box>
        </Tab>
        <Tab title="To Consensus" icon={<FormNext />}>
          <Box align="center" gap="medium" pad={{ vertical: 'medium' }} fill="horizontal">
            <Paragraph margin="none" textAlign="center" style={{ maxWidth: '100%' }}>
              To send tokens back from <strong>Emerald ParaTime</strong> to <strong>Consensus</strong> layer
              you have to import your wallet using{' '}
              <Anchor href="https://google.com" target="_blank" rel="noopener" color="brand">
                Ethereum-compatible private key
              </Anchor>
              .
            </Paragraph>
            <Paragraph margin="none" textAlign="center" style={{ maxWidth: '100%' }}>
              Alternative: Transaction Form with private key text input
            </Paragraph>

            <Paragraph margin="none" textAlign="center" style={{ maxWidth: '100%' }}>
              Alternative 2: Or allow both: importing wallet and form with priv key
            </Paragraph>
          </Box>
        </Tab>
      </Tabs> */}
    </Box>
  )
}
