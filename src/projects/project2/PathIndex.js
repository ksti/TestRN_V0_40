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

/**
 * './'  -------------- project2
 * '../../'  ---------- projects->src
 * '../../../'  ------- projects->src->root
 */
/**
 * @param {index} Number // 引入 PathIndex 的文件相对于 PathIndex.js 所在目录的层级(深度)
 * @return {String}
 */
const testPath = function(index: Number = 0) {
	let prePath = './';
	for (let i = 0; i < index; i++) {
		prePath += '../';
	};
	return prePath + '../../__test';
};
const commonPath = function(index: Number = 0) {
	let prePath = './';
	for (let i = 0; i < index; i++) {
		prePath += '../';
	};
	return prePath + '../../common';
};
const componentsPath = function(index: Number = 0) {
	let prePath = './';
	for (let i = 0; i < index; i++) {
		prePath += '../';
	};
	return prePath + '../../components';
};
const containersPath = function(index: Number = 0) {
	let prePath = './';
	for (let i = 0; i < index; i++) {
		prePath += '../';
	};
	return prePath + '../../containers';
};
const resourcePath = function(index: Number = 0) {
	let prePath = './';
	for (let i = 0; i < index; i++) {
		prePath += '../';
	};
	// return prePath + '../../../resource';
	return prePath + 'resource'; // 当前目录下有resource文件夹
};
const reduxDataFlowPath = function(index: Number = 0) {
	let prePath = './';
	for (let i = 0; i < index; i++) {
		prePath += '../';
	};
	return prePath + '../../reduxDataFlow';
};

/**
 * Business Path
 */
const GlobalPath = function(index: Number = 0) {
	// let prePath = './'; // 也可以
	let prePath = index > 0 ? '' : './';
	for (let i = 0; i < index; i++) {
		prePath += '../';
	};
	return prePath + 'Global';
};
const BusinessUtilPath = function(index: Number = 0) {
	let prePath = index > 0 ? '' : './';
	for (let i = 0; i < index; i++) {
		prePath += '../';
	};
	return prePath + 'BusinessUtil';
};
const BusinessComponentPath = function(index: Number = 0) {
	let prePath = index > 0 ? '' : './';
	for (let i = 0; i < index; i++) {
		prePath += '../';
	};
	return prePath + 'BusinessComponent';
};

export default Paths = {
	testPath,
    commonPath,
    componentsPath,
    containersPath,
    resourcePath,
    reduxDataFlowPath,
    //--- Business Path ---
    GlobalPath,
	BusinessUtilPath,
	BusinessComponentPath,
};

