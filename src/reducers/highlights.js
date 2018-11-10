import {
    HIGHLIGHTS_RECEIVED,
    HIGHLIGHTS_REQUEST,
    HIGHLIGHTS_REQUEST_ERROR,
} from './../actions/highlights'

const initialState = {
    isFetching: true,
    requestError: '',
    partners: [],
}
 
const reducer = (state = initialState, action) => {
    switch(action.type){
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
                isFetching: true,
            }
        case HIGHLIGHTS_REQUEST_ERROR:
            return {
                ...state,
                requestError: action.error,
                isFetching: false
            }
        default:
            return state
    }
}

export default reducer