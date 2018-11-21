import { REQUEST_PROJECTS, RECEIVE_PROJECTS, REQUEST_ANNOTATIONS,
  RECEIVE_ANNOTATIONS, UPDATE_MODAL } from '../actions'

const initial = {
  projects: null,
  annotations: null,
  setUp: {},
  modal: true
}

const reducer = (state = initial, action) => {
  switch (action.type) {
    case REQUEST_PROJECTS:
    case REQUEST_ANNOTATIONS:
      return {
        ...state,
        error: null,
        fetching: true,
        fetched: false
      }
    case RECEIVE_PROJECTS:
      state = {
        ...state,
        fetching: false,
        fetched: true
      }

      if (action.error) {
        state.error = action.error
      } else {
        state.projects = action.data.results
      }
      return state
    case RECEIVE_ANNOTATIONS:
      state = {
        ...state,
        fetching: false,
        fetched: true
      }

      if (action.error) {
        state.error = action.error
      } else {
        state.annotations = action.data.features
      }
      return state
    case UPDATE_MODAL:
      return { ...state, modal: action.data }
    default:
      return state
  }
}

export default reducer
