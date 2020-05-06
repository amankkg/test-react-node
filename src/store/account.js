import {handleActions} from 'redux-actions'

import * as on from '../actions'

const defaultState = {
  signedIn: false,
  profile: null,
  message: null,
  status: 0, // -1 - failed, 0 - idle, 1 - fetching, 2 - ok
}

export const account = handleActions(
  {
    [on.account.fetch.start]: () => ({
      message: null,
      status: 1,
    }),
    [on.account.fetch.ok]: (state, action) => ({
      profile: action.payload.profile,
      status: 2,
    }),
    [on.account.fetch.fail]: (state, action) => ({
      // message: action.error
    }),
  },
  defaultState,
)
