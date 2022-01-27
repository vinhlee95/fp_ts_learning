import * as F from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import axios from 'axios'

type SuccessResponse = {success: true, payload: {data: any}}
type FailureResponse = {success: false, error: {code: number, description: string}}
type Response = TE.TaskEither<FailureResponse, SuccessResponse>

const SUCCESS_URL = 'https://httpstat.us/200'
const FAILURE_URL = 'https://httpstat.us/400'

const fetch = (url: string): Response => F.pipe(
  TE.tryCatch(
    () => axios.get(url),
    (error) => axios.isAxiosError(error) ? error.response?.data : {description: 'Unknown error'}
  ),
  TE.fold(
    e => TE.left({success: false, error: e}),
    res => TE.right({success: true, payload: res})
  )
)

const simpleFetch = (url: string): Response => F.pipe(
  TE.tryCatch(
    () => axios.get(url),
    (error) => axios.isAxiosError(error) ? error.response?.data : {description: 'Unknown error'}
  ),
  TE.map(resp => resp.data)
)

// Success case
;(async () => {
  const res = await fetch(SUCCESS_URL)()
  if(E.isRight(res)) {
    console.log(SUCCESS_URL, res.right.payload.data)
  } else {
    console.log(SUCCESS_URL, res.left.error)
  }
})()

// // Failure case
;(async () => {
  const res = await fetch(FAILURE_URL)()
  if(E.isRight(res)) {
    console.log(FAILURE_URL, res.right.payload.data)
  } else {
    console.log(FAILURE_URL, res.left.error)
  }
})()


;(async () => {
  const res = await simpleFetch(FAILURE_URL)()
  if(E.isRight(res)) {
    console.log(FAILURE_URL, res.right)
  } else {
    console.log(FAILURE_URL, res.left)
  }
})()

