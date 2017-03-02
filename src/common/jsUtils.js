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
 * @providesModule jsUtils
 * @flow
 */

// js utils
export const jsUtils = {
	isArray: function(obj) {  
	  return Object.prototype.toString.call(obj) === '[object Array]';   
	},
}

export const jsUtils2 = {
	isArray2: function(obj) {  
	  return Object.prototype.toString.call(obj) === '[object Array]';   
	},
}

export default jsUtils; /* import 在没有module.exports但有export default时以此为准 */ 
						/* var jsUtils = require('jsUtils') // jsUtils,jsUtls2,default */
						/* import jsUtils from '../../common/jsUtils' // isArray */
						/* 如果也没有export default时import会报错'Cannot convert undefined or null to object' */
						/* var jsUtils = require('jsUtils') // jsUtils,jsUtls2 */

//module.exports = jsUtils2; /* import 和 require 在有module.exports时都是以此为准,在没有时以export为准 */ 
						  /* var jsUtils = require('jsUtils') // isArray */
						  /* import jsUtils from '../../common/jsUtils' // isArray */



