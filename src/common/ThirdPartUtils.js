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
 * 
 */

import React, {PropTypes, Component} from 'react';

import {
	Platform,
	NativeModules,
} from 'react-native'

// UUIDGenerator
import UUIDGenerator from 'react-native-uuid-generator'

/**
 * @param {Number} count
 * @param {Function} callback
 * @return {Promise}
 */
function UUIDGeneratorIterate(count: Number, callback: Function) {
	if (callback) {
		UUIDGenerator.getRandomUUID((uuid) => {
			count--;
			if (count < 1) { // 停止条件1
				callback(uuid);
				return;
			};
			if (typeof uuid === 'string' && uuid.length > 0) { // 停止条件2
	        	callback(uuid);
	        } else {
	        	UUIDGeneratorIterate(count, callback);
	        }
		});
	} else {
		return new Promise((resolve, reject) => {
			UUIDGenerator.getRandomUUID().then((uuid) => {
		        count--;
				if (count < 1) { // 停止条件1
					resolve(uuid);
				} else {
					if (typeof uuid === 'string' && uuid.length > 0) { // 停止条件2
			        	resolve(uuid);
			        } else {
			        	return UUIDGeneratorIterate(count, callback);
			        }
				}				
		    });
		});
	}
}

/**
 * @param {Number} count
 * @param {Function} callback
 * @param {Array} uuidArray
 * @return {Promise}
 */
function UUIDGeneratorBatchIterate(count: Number, callback: Function, uuidArray: Array) {
	if (!Array.isArray(uuidArray)) {
		uuidArray = [];
	};
	if (callback) {
		UUIDGeneratorIterate(10, (uuid) => {
			uuidArray.push(uuid);
			count--;
			if (count < 1) { // 停止条件
				let result = uuidArray;
				if (uuidArray.length === 1) {
					result = uuidArray[0];
				};
				callback(result);
			} else {
				UUIDGeneratorBatchIterate(count, callback, uuidArray);
			}
		});
	} else {
		return new Promise((resolve, reject) => {
			UUIDGeneratorIterate(10, (uuid) => {
				uuidArray.push(uuid);
				count--;
				if (count < 1) { // 停止条件
					let result = uuidArray;
					if (uuidArray.length === 1) {
						result = uuidArray[0];
					};
					resolve(result);
				} else {
					return UUIDGeneratorBatchIterate(count, callback, uuidArray);
				}
			});
		});
	}
	
}

// third-part utils
const thirdPartUtils = {
	// 1.---------------------------
	/*
	 * UUIDGeneratorBatch
	 * 批量生产 uuid
	*/
    UUIDGeneratorBatch(count: Number, callback: Function) {
    	if (callback) {
    		UUIDGeneratorBatchIterate(count, callback);
    	} else {
    		return UUIDGeneratorBatchIterate(count, callback);
    	}
    },
}

export default thirdPartUtils; 



