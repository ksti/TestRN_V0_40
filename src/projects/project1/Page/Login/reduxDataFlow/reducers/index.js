
import { combineReducers } from 'redux'

var assign = require('object-assign');

import Login from './Login'
var reducers = assign({},
    Login,
);

module.exports = reducers;
