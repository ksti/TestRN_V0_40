
import { combineReducers } from 'redux'

var assign = require('object-assign');
import FlowCenter from './FlowCenterReducer';//流程中心
var reducers = assign({},
    FlowCenter,
);

module.exports = reducers;
