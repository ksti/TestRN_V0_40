
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
import {Scene} from 'react-native-router-flux';

// test list
import TestsListView from './testsListView'
// test pages
// import TestFile from './testFile'
import TestImagePicker from './testImagePicker'
import TestPopupPage from './testPopupPage'
import TestPopupSelecter from './testPopupSelecter'

// project test pages 
let scenesForTestProject;
import scenesForTestProject1 from '../projects/project1/__test/scenesForTest'
import scenesForTestProject2 from '../projects/project2/__test/scenesForTest'

// other
import SQLiteDemo from './SQLiteDemo'

// 引入工程配置
import Config from '../common/Config'
switch (Config.project) {
    case 'project1': // 工程1
        scenesForTestProject = scenesForTestProject1;
        break;
    case 'project2': // 工程2
        scenesForTestProject = scenesForTestProject2;
        break;

    default:
        break;
};

let testComponent = TestPopupSelecter;

let scenes = [
    {
        key: 'test',
        comp: TestsListView,
    },
    {
        key: 'TestImagePicker',
        comp: TestImagePicker,
    },
    {
        key:'TestPopupPage',
        comp:TestPopupPage,
    },
    {
        key: 'TestPopupSelecter',
        comp: TestPopupSelecter,
    },
    {
        key: 'TestSomeOnePage',
        comp: testComponent,
    },{
        key:'SQLiteDemo',
        comp:SQLiteDemo,
    },
];

// scenes.concat(scenesForTestProject1, scenesForTestProject2);
// scenes.concat(scenesForTestProject);
scenes = new Array().concat(scenes, scenesForTestProject);

// module.exports =
// (
//     <Scene key="test">
//        	<Scene key='testsListView' /*initial={true}*/ hideNavBar={true} component={TestsListView} />
//     	{
//     	    scenes.map(item =>
//     	        <Scene key={item.key} component={item.comp} />)
//     	}
//     </Scene>
// );


export default scenes;


