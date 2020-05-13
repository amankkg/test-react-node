import {statuses} from '../constants'

export const handleStartedAction = (state) => ({
  ...state,
  status: statuses.PENDING,
  error: null,
})

export const handleFinishedAction = (state, action) => {
  if (action.error)
    return {...state, status: statuses.ERROR, error: action.payload.message}

  return {...state, ...action.payload, status: statuses.OK, error: null}
}
