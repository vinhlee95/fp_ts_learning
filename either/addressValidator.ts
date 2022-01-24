/**
 * This is an example of a pipe of address validators
 * The validator should check:
 * - Email is valid
 * - Address exists
 * - City is valid (belong to a list)
 */
import * as F from 'fp-ts/function'
import * as E from 'fp-ts/Either'

type Address = {
  email: string
  line1: string
  city: string
}

type AddressValidationError = {errorCode: string}

type AddressValidationFlow = (address: Address) => E.Either<AddressValidationError, Address>

const validateEmail: AddressValidationFlow = (address) => {
  const regexp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/
  const isValidEmail = (email: string) => regexp.test(email)
  return isValidEmail(address.email) ? E.right(address) : E.left({errorCode: 'INVALID_EMAIL'})
}

const validateLine1: AddressValidationFlow = (address) => {
  const isValidLine1 = (maxLength: number) => (line1: string) => !!line1 && line1.length < maxLength

  return isValidLine1(20)(address.line1) ? E.right(address) : E.left({errorCode: 'INVALID_LINE_1'})
}

const validateCity: AddressValidationFlow = (address) => {
  const VALID_CITIES = ['Tokyo', 'Helsinki', 'Oslo', 'Denver', 'Berlin']
  const isValidCity = (city: string) => !!city && VALID_CITIES.indexOf(city) !== -1

  return isValidCity(address.city) ? E.right(address) : E.left({errorCode: 'INVALID_CITY'})
}

const flow = F.flow(
  // E<Error, Address>
  validateEmail,
  E.chain(validateLine1),
  E.chain(validateCity),
  E.fold(
    console.error,
    address => console.log('Valid address', address),
  )
)

const validateAddress = (address: Address) => F.pipe(
  address,
  flow
)

validateAddress({
  email: 'test@test.com',
  // line1: 'foobar foobar foobar foobar foobar foobar', // <- errorCode: 'INVALID_LINE_1'
  line1: 'Valid line 1',
  city: 'Helsinki',
})

// console.log({result})
