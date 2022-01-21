import * as F from 'fp-ts/function'

// 
// ------ PIPE --------
// A -> (A->B) -> (B->C) -> (C->D)
// 
interface Item {name: string, price: number}

const item: Item = {name: 'shoes', price: 100}

const calculateTax = (item: Item, percentage: number = 0.24) => ({...item, price: item.price + item.price * percentage})
const calculateServiceFee = (item: Item) => ({...item, price: item.price + 10})

// console.log(pipe(item, calculateTax, calculateServiceFee))

// Let's log the price after each step
const logPrice = (item: Item) => {
  console.log('Current price is: ', item.price)
  return item
}

// console.log(F.pipe(item, logPrice, calculateTax, logPrice, calculateServiceFee))

// 
// ------------- FLOW -------------
// (A->B) -> (B->C) -> (C->D) -> (D->E)
// 
const calculateTotalPriceFlow = F.flow(logPrice, calculateTax, logPrice, calculateServiceFee)
console.log(calculateTotalPriceFlow(item))

// Same result with F.pipe
// console.log(F.pipe(item, calculateTotalPriceFlow))
