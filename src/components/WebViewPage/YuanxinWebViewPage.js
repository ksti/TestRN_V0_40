
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
 * 网页浏览页面
 */

import React,{
    Component
} from 'react'
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    WebView,
    requireNativeComponent,
    NativeModules,
    InteractionManager,
}from 'react-native'

import { Actions } from 'react-native-router-flux';
import BaseContainer from '../../containers/BaseContainer'
import httpRequest from '../../common/HTTPRequest'
import PublicToast from '../PublicToast'
import LoadingView from '../LoadingView'
import YuanxinWebview from '../WebView/YuanxinWebView'

let HTTPRequest = new httpRequest();

export default class WebViewPage extends BaseContainer {
    constructor(props){
        super(props);
        this.state={
            isLoading: true,
            renderPlaceholderOnly: true,
        }
    }

    componentDidMount(){
        PublicToast.logMessage('详情请求地址:'+this.props.url);
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                renderPlaceholderOnly: false
            });
        });
    }

    componentDidUnMount(){
        this.setState({
            isLoading:false,
            renderPlaceholderOnly: false,
        })
    }

    _renderPlaceholderView() {
        return (
            <View style={style.bgGray}>
                {this.defaultRenderNavigationBar()}
                    <LoadingView />
            </View>
        );
    }

    defaultNavigationTitle(){
        return{
            title:this.props.title ||'网页内容',
            tintColor:this.defaultTintColor()
        };
    }

    _onLoad = () => {
        PublicToast.logMessage('webView onLoad');
    }

    _onLoadStart = () => {
        PublicToast.logMessage('webView onLoadStart');
    }
    
    _onLoadEnd = () => {
        this.setState({
            isLoading: false,
            renderPlaceholderOnly: false,
        });
    }
    
    _onError = () => {
        this.setState({
            isLoading: false,
            renderPlaceholderOnly: false,
        });
    }
    
    _onProgress = (progress) => {
        PublicToast.logMessage('webView onProgress: ' + progress);
    }
    

    _renderYuanxinWebView = () => {
        const {
          url,
        } = this.props;

        if (url) {
            return(
                <View style={style.bgGray}>
                    {this.defaultRenderNavigationBar()}
                    <View style={{flex:1}}>
                        <YuanxinWebview 
                            style={{flex:1}} 
                            url={url}
                            clearCookies={true}
                            onLoadStart={this._onLoadStart}
                            onLoad={this._onLoad}
                            onLoadEnd={this._onLoadEnd}
                            onError={this._onError}
                            onProgress={this._onProgress}
                        />
                        {
                            this.state.isLoading==true?
                            <LoadingView style={{
                                position:'absolute',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0}}/>
                            :null                  
                        }
                    </View>
                </View>
            );
        } else {
            return (
                <View style={style.bgGray}>
                    {this.defaultRenderNavigationBar()}
                </View>
            );
        }
    }

    render(){
        if (this.state.renderPlaceholderOnly) {
            return this._renderPlaceholderView();
        };
        return this._renderYuanxinWebView();
    }
    onShouldStartLoadWithRequest=()=> {
        // Implement any custom loading logic here, don't forget to return!
        return true;
    };

}
const styles = StyleSheet.create({
    container: {
        flex:1
    },
    webViewStyle: {
        flex: 1
    },
    bgGray: {
        flex:1,
        backgroundColor: '#efeff4',//主背景色
    }
});
