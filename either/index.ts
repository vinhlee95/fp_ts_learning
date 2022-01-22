import * as F from 'fp-ts/function'
import * as E from 'fp-ts/lib/Either'
import * as J from 'fp-ts/lib/Json'

// 
// --------- PARSE JSON ---------
//
const dataToParse = {name: 'foo', age: 20}

const parseJson = (data: any) => F.pipe(
  J.parse(data),
  E.fold(
    e => console.log(`Error parsing: ${e}`),
    (parsedData) => console.log(parsedData)
  )
)

// parseJson(JSON.stringify(dataToParse))
// parseJson(dataToParse)

// 
// ---------- PARSE JSON OF MULTIPLE OBJECTS ----------
// 
const parseJsonTwoObjects = (obj1: string, obj2: string) => F.pipe(
  // E<unknown | JSON>
  J.parse(obj1),
  // Chain the parsed response and parse obj2 to aggregate the results
  E.chain(res1 =>
    F.pipe(
      J.parse(obj2),
      E.map(res2 => ([res1, res2]))
    )
  ),
  E.fold(
    // If J.parse failed for either obj1 or obj2, this will be executed
    e => console.log(`Error parsing 2 objects: ${e}`),
    combinedRes => console.log('Parsed data: ', combinedRes)
  )
)

parseJsonTwoObjects(
  JSON.stringify({foo: 'foo', bar: 'bar'}),
  JSON.stringify(undefined)
)
