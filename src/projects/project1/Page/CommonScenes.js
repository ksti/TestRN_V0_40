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

// 引入公用路径导航
import {
    commonPath,
    componentsPath,
    containersPath,
    resourcePath,
} from '../PathIndex' // Page 目录的上个目录, 层级深度:1

// 公共页面
/* import from .. 似乎不支持字符串表达式。。require()也是
import YuanxinWebViewPage from componentsPath(1) + '/WebViewPage/YuanxinWebViewPage' // 基于YuanxinWebView的网页浏览页面
import SeePhotoBrowser from componentsPath(1) + '/SeePhotoBrowser' // 查看照片 PhotoBrowser
import WebViewContainer from containersPath(1) + '/WebViewContainer' // 基于RN的WebView的网页浏览页面
*/
import YuanxinWebViewPage from '../../../components/WebViewPage/YuanxinWebViewPage' // 基于YuanxinWebView的网页浏览页面
import SeePhotoBrowser from '../../../components/SeePhotoBrowser' // 查看照片 PhotoBrowser
import WebViewContainer from '../../../containers/WebViewContainer' // 基于RN的WebView的网页浏览页面

const scenes = [
    {
        key:'yuanxinWebViewPage',
        comp:YuanxinWebViewPage,
    },
    {
        key:'seePhotoBrowser',
        comp:SeePhotoBrowser,
    },
    {
        key:'webViewContainer',
        comp:WebViewContainer,
    },
    
];

export default scenes;

