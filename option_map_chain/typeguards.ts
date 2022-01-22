type SuccessResponse = {success: true, payload: string}
type FailureResponse = {success: false, error: string}

type ApiResponse = SuccessResponse | FailureResponse

/**
 * Typical typeguard for success type
 * 🚧🚧🚧 Typo here (res.success === true instead of false) but TS is fine with that 
 * 
 * @param res 
 * @returns 
 */
const isSuccessResponse = (res: ApiResponse): res is SuccessResponse => res.success === false // <- WHOOPS 💣

// 
// ---- ⭐️⭐️⭐️ BETTER SOLUTION: parsed responses -----
// and use Refinement to infer the type of the parsed object
// 
import * as O from "fp-ts/lib/Option";
import * as R from 'fp-ts/lib/Refinement'

// TS will complain if we made a typo e.g. res.success === false
const parseSuccessRes = (res: ApiResponse): O.Option<SuccessResponse> => res.success === true ? O.some(res) : O.none

// This will infer the type of the res object to be SuccessResponse 
// if parseSuccessRes return an Option 
const isSuccessRes = R.fromOptionK(parseSuccessRes)


const getResponsePayload = (res: ApiResponse): string | undefined => {
  // Parse the response
  if(!isSuccessRes(res)) {
    // The type of res is inferred to be FailureResponse
    console.log('Failure', {error: res.error})
    return undefined
  }

  // The type of res is inferred to be SuccessResponse
  return res.payload
}

console.log(getResponsePayload({success: true, payload: 'success payload'})) // success payload
console.log(getResponsePayload({success: false, error: 'failure payload'}))  // undefined
