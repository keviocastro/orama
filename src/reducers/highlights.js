import {
    HIGHLIGHTS_RECEIVED,
    HIGHLIGHTS_REQUEST,
} from './../actions/highlights'

const initialState = {
    isFetching: false,
    requestError: '',
    partners: [],
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case HIGHLIGHTS_REQUEST:
            return {
                ...state,
                isFetching: true,
                requestError: ''
            }
        case HIGHLIGHTS_RECEIVED:
            return {
                ...state,
                partners: action.partners,
                isFetching: false,
            }
        default:
            return state
    }
}

export default reducer