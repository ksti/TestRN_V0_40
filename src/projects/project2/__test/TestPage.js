
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

import React,{Component} from 'react'
import {
  View,
  Image,
  AlertIOS,
  Linking,
  StatusBar,
  ScrollView,
  StyleSheet,
  Navigator,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Text,
  NativeModules,
  NativeAppEventEmitter,
} from 'react-native'

/*
 * react-native中CameraRoll模块提供了访问本地相册的功能。

 * 在react版本为0.23.0的项目中，不支持Android，而且在iOS中使用CameraRoll还需要我们手动操作：

 * iOS：

 * 将RCTCameraRoll.xcodeproj添加到我们的项目中：展开项目 > Libraies  右键Libraies点击 “Add Files to ‘项目名’ ”，找到 项目文件夹／node_modules/react-native/Libraries/CameraRoll/RCTCameraRoll.xcodeproj , 添加到项目里。
 * 我们要把libRCTCameraRoll.a这个库添加到主项目的Link Binary With Libraries中
 */
import {
  CameraRoll,
} from 'react-native'

import BaseContainer from '../../../containers/BaseContainer';

import FileUtil from '../../../common/FileUtil'
var RNFS = FileUtil.RNFS;
var DocumentPath = RNFS.DocumentDirectoryPath;

var Platform = require('react-native').Platform;

import httpRequest from '../../../common/HTTPRequest'

let HTTPRequest = new httpRequest();
let downloadStrURL = 'http://qq.yh31.com/tp/zjbq/201601291720586912.gif'
let downloadPath = DocumentPath + '/downloadFiles'

export default class testPage extends BaseContainer {
  constructor(props){
    super(props);
    this.state={
      avatarSource: {},
      randomPhoto: null,
      textParams: {
        test: 'just for test',
      },
    };

    this._isMounted = true;

    // this._fetchRandomPhoto();
  }

  componentDidMount() {
    //
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  defaultNavigationTitle(){
      return{
          title:'测试页面 For project2',
          tintColor:this.defaultTintColor()
      };
  }

  _test = () => {
    // 测试
    // 测试下载文件
    let fileName = downloadStrURL.split('/').pop();
    this.testFileDownLoad(downloadStrURL, downloadPath, fileName, {}, (success, filePath) => {
      if (success) {
        this.setState({
          avatarSource: this._setImageSourceWithPath(filePath),
        });
      };
      
    });
  }

  _fetchRandomPhoto = () => {
    CameraRoll.getPhotos(
      {first: PAGE_SIZE}
    ).then(
      (data) => {
        if (!this._isMounted) {
          return;
        }
        var edges = data.edges;
        var edge = edges[Math.floor(Math.random() * edges.length)];
        var randomPhoto = edge && edge.node && edge.node.image;
        if (randomPhoto) {
          this.setState({randomPhoto});
        }
      },
      (error) => undefined
    );
  }

  _setImageSourceWithPath = (path) => {
    let source = {uri: path, isStatic: true};
    if (Platform.OS === 'android') {
      source = {uri: ('file://' + path), isStatic: true};
    }
    return source;
  }

  testFileDownLoad = (downloadUrl, downloadPath, fileName, params, finished) => {
    _this = this;
    let downloadDest = downloadPath + '/' + fileName;
    let downloadOptions = {};
    // 测试
    FileUtil.createDir(downloadPath, {NSURLIsExcludedFromBackupKey: true}, function (error, result) {
      if (error) {
          console.log('callback error:', error.message);
      } else {
          console.log('callback result:', result);
          FileUtil.downloadFile(downloadUrl, downloadDest, params, true, downloadOptions, 
              function (error, responseData) {
                if (error) {
                    console.log('callback error:', error.message);
                    finished && finished(false, error);
                } else {
                    console.log('callback result:', responseData);
                    if (responseData && responseData.statusCode === 200) {
                      finished && finished(true, downloadDest);
                    } else {
                      finished && finished(false, responseData);
                    }
                }
          });
      }
    });
  }

  render(){
    return(
      <View style={[styles.container, {backgroundColor: 'white'}]}>
        {this.defaultRenderNavigationBar()}
        <StatusBar
           // barStyle="light-content"
           barStyle="default"
        />
        <Text style={[styles.text, {marginTop:20}]} onPress={() => this._test()}> 测试 </Text>
        <Image source={this.state.avatarSource} style={{height: 100, resizeMode: Image.resizeMode.contain}} />
      </View>  
    );
  }

}

var styles= StyleSheet.create({
  container:{
    flex:1,
    flexDirection:"column",
  },
  text:{
    color:'green',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
    fontWeight: 'bold',
  },
})

