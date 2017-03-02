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

import React,{Component} from 'react'
import {StyleSheet} from 'react-native'
import {Scene} from 'react-native-router-flux';

// 引入公用路径导航
import {testPath} from '../PathIndex' // Page 目录的上个目录, 层级深度:1


// 公共页面
import scenesForCommon from './CommonScenes'

// 测试页面
/* import from .. 似乎不支持字符串表达式。。require()也是
import scenesForTest from testPath(1) + '/scenesForTest'
*/
import scenesForTest from '../../../__test/scenesForTest'

// 业务页面
import scenesForGesturePwd from './GesturePwd/Scenes'
import scenesForLogin from './Login/Scenes'
import scenesForSetting from './Setting/Scenes'
import scenesForWorkFlow from './WorkFlow/Scenes'

const scenes = new Array().concat(
    scenesForCommon,
    scenesForTest,
    scenesForGesturePwd,
    scenesForLogin,
    scenesForSetting,
    scenesForWorkFlow,
);

export default scenes;

