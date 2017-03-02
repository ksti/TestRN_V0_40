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
import {
    commonPath,
    componentsPath,
    containersPath,
    resourcePath,
} from '../PathIndex' // Page 目录的上个目录, 层级深度:1

/* import from .. 似乎不支持字符串表达式。。require()也是
import TabIcon from componentsPath(1) + '/TabIcon'
*/
import TabIcon from '../../../components/TabIcon'
import WorkHome from './Index/WorkHome'
import BusinessHome from './Index/BusinessHome'
import ProfilePage from './Index/ProfilePage'

import scenes from './ScenesIndex'

let workHomeImage = require('../resource/images/TabBar/workhome.png');
let workHomeSelectImage = require('../resource/images/TabBar/workhomeselected.png');
let businessHomeImage = require('../resource/images/TabBar/businesshome.png');
let businessHomeSelectImage = require('../resource/images/TabBar/businesshomeselected.png');
let profileImage = require('../resource/images/TabBar/profile.png');
let profileSelectImage = require('../resource/images/TabBar/profileselected.png');

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

module.exports =
(
    /*
        注意，在这个分支里，入口只能从最外层Scene的key开始进入，
        当前Scence内的所有路由中默认都以第一个默认页面为根路由，
        内部路由能互相跳转，但是不能被外部直接访问，
        只有根路由可以被外部通过外部Scene的key访问到，例Actions.tabbar，
        访问的其实是其下的第一个 <Scene key='main'>
    */
    <Scene key="tabbar" type='reset' hideNavBar={true} >
        <Scene key="main" tabs={true} tabBarStyle={{backgroundColor:'#fff', borderTopColor:'#efeff4',borderTopWidth:2 }}>
            <Scene key="home" hideNavBar={true} initial={true} title="工作通" icon={TabIcon} component={WorkHome} navigationBarStyle={styles.navigationBar} titleStyle={styles.navigationTitle}  defaultImage={workHomeImage} selectImage={workHomeSelectImage} />
            <Scene key="business" hideNavBar={true} title="企业圈" icon={TabIcon} component={BusinessHome} navigationBarStyle={styles.navigationBar} titleStyle={styles.navigationTitle} defaultImage={businessHomeImage} selectImage={businessHomeSelectImage} />
            <Scene key="profile" hideNavBar={true} title="我" icon={TabIcon} component={ProfilePage} navigationBarStyle={styles.navigationBar} titleStyle={styles.navigationTitle} defaultImage={profileImage} selectImage={profileSelectImage} />
        </Scene>
        {
    	    scenes.map(item =>
    	        <Scene key={item.key} component={item.comp} />)
    	}
    </Scene>

);
