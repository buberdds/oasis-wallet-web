import { isValidEthPrivateKey, isValidEthPrivateKeyLength, privateToEthAddress } from './eth-helpers'

describe('isValidEthPrivateKeyLength', () => {
  it('should check whether or not a given key length is valid', () => {
    expect(
      isValidEthPrivateKeyLength('c0e43d8755f201b715fd5a9ce0034c568442543ae0a0ee1aec2985ffe40edb99'),
    ).toEqual(true)
    expect(
      isValidEthPrivateKeyLength('c0e43d8755f201b715fd5a9ce0034c568442543ae0a0ee1aec2985ffe40edb990'),
    ).toEqual(false)
    expect(
      isValidEthPrivateKeyLength('c0e43d8755f201b715fd5a9ce0034c568442543ae0a0ee1aec2985ffe40edb9'),
    ).toEqual(false)
  })
})

describe('isValidEthPrivateKey', () => {
  it('should check whether or not a given key is valid', () => {
    expect(
      isValidEthPrivateKeyLength('0000000000000000000000000000000000000000000000000000000000000001'),
    ).toEqual(true)
    expect(isValidEthPrivateKey('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364142')).toEqual(
      false,
    )
  })
})

describe('privateToEthAddress', () => {
  it('should return Eth address from Eth private key', () => {
    expect(privateToEthAddress('c0e43d8755f201b715fd5a9ce0034c568442543ae0a0ee1aec2985ffe40edb99')).toEqual(
      '0xDce075E1C39b1ae0b75D554558b6451A226ffe00',
    )
  })
})
