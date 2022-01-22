import * as O from "fp-ts/lib/Option";
import * as F from 'fp-ts/function'


// 
// ------------ EXAMPLE 1: Calculate age of a car ---------
// 

interface Car {
  name: string
  year?: number
}

/**
 * Calculate the age of a car
 * 
 * @param year either none or a number
 * @returns 
 */
const getAge = (year: O.Option<number>): number => O.isNone(year) ? 0 : new Date().getFullYear() - year.value

const getCarAge = (car: Car) => F.pipe(
  car.year, 
  O.fromNullable, 
  val => getAge(val)
)


const carWithYear: Car = {name: 'Ford', year: 1990}
const carWithoutYear: Car = {name: 'Toyota'}
const carWithUndefinedYear: Car = {name: 'Toyota', year: undefined}

// console.log(getCarAge(carWithYear)) // 32
// console.log(getCarAge(carWithoutYear)) // 0
// console.log(getCarAge(carWithUndefinedYear)) // 0

// 
// ----- EXAMPLE 2: Non-empty array --------
// 
const nonEmptyArray = <A>(arr: A): O.Option<A> => {
  return Array.isArray(arr) && arr.length > 0 ? O.some(arr) : O.none
}

const bookLists = [
  undefined,
  null,
  [],
  ['Harry Potter']
]

const getValidBookList = (list: unknown[]) => F.pipe(
  list, 
  // Map invalid or empty arr in the list to Option type
  (list) => list.map(nonEmptyArray),
  // Filter out item having none type
  (list) => list.filter(O.isSome),
  // Get the value
  (list) => list.map(i => i.value)
)

// console.log(getValidBookList(bookLists)) // [['Harry Potter']]

