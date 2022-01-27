import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import * as F from 'fp-ts/lib/function';

// We can use TE.map to create a function that will accept a TE and operate on it's value
const addOneMap = TE.map<number, number>(num => num + 1);

// Similar version but using TE.chain
// We need to however wrap the return value within TE.right
const addOneChain = TE.chain((num: number) => TE.right(num += 1))

const fn = F.pipe(
  TE.right(4),
  addOneMap,
  addOneChain
)

;(async () => {
  const val = await fn()
  console.log(val)
})()