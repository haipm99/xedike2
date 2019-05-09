import {combineReducers} from 'redux';
import error from './errorReducer';

const root = combineReducers({
    error
});

export default root;