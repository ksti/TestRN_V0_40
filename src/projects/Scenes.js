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

import Config from '../common/Config'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
    },
    navigationBar:{  //头部标题文字
        backgroundColor: '#333333'
    },
    navigationTitle: { //头部导航
        color: 'white',
        fontSize: 15
    }
});

let scenes = <Scene key='project' />;
switch (Config.project) {
    case 'project1': // 工程1
        scenes = require('./project1/Page/Scenes');
        break;
    case 'project2': // 工程2
        scenes = require('./project2/Page/Scenes');
        break;

    default:
        break;
};

module.exports =
(
    /*
        注意，在这个分支里，入口只能从最外层Scene的key开始进入，
        当前Scence内的所有路由中默认都以第一个默认页面为根路由，
        内部路由能互相跳转，但是不能被外部直接访问，
        只有根路由可以被外部通过外部Scene的key访问到，例Actions.project1，
    */
    // <Scene key='project' type='reset' hideNavBar={true} >
    //     {scenes}
    // </Scene>
    scenes

);
