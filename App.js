/**
 * @author GJS <1353990812@qq.com>
 *
 * GJS reserves all rights not expressly granted.
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 GJS
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
import React, { Component } from 'react';
import {AppState,NetInfo} from 'react-native';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import * as reducers from './src/reduxDataFlow/reducers';
import AppRoot from './AppRoot';
import { Actions } from 'react-native-router-flux';

import {storageUtil} from './src/common/storage'
import PublicToast from './src/components/PublicToast'

//apply thunk
const createStoreWithThunk = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithThunk(reducer);

const storeState = store.getState();
PublicToast.logMessage(storeState);

global.storageUtil = storageUtil;

export default class App extends Component {
    componentDidMount() {
        // NetInfo.addEventListener(
        //     'change',
        //     this._handleConnectionInfoChange
        // );
        // NetInfo.fetch().done(
        //     (isConnected) => {
        //         PublicToast.logMessage('now,app is' + (isConnected ? 'online' : 'offline'));
        //      }
        // )
    }
    componentWillUnmount() {
        // NetInfo.removeEventListener(
        //     'change',
        //     this._handleConnectionInfoChange
        // );
    }
    // _handleConnectionInfoChange=(connectionInfo)=>{
    //     PublicToast.logMessage('connectionInfo:',connectionInfo);
        // PublicToast.showMessage(connectionInfo);
    // }
    render() {
		return (
			<Provider store={store}>
			    <AppRoot />
			</Provider>
		);
	}
}
