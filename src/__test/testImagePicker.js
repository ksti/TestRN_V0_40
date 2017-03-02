
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

import BaseContainer from '../containers/BaseContainer';
import testFile from './testFile'
import FileUtil from '../common/FileUtil'
var RNFS = FileUtil.RNFS;
var DocumentPath = RNFS.DocumentDirectoryPath;

var Platform = require('react-native').Platform;
var ImagePicker = require('react-native-image-picker');
const base64 = require('base64-js');
import ImagePickerCrop from 'react-native-image-crop-picker';

import PublicToast from '../components/PublicToast'

// 测试 ThirdPartUtils
import ThirdPartUtils from '../common/ThirdPartUtils'

import httpRequest from '../common/HTTPRequest'

let HTTPRequest = new httpRequest();
// let strURL = 'https://moa.sinooceanland.com:10086/AnChangReportService/Interface_GetOrgInstitutionCodeService.service?userName=liming'
let uploadStrURL = 'http://mtest.sinooceanland.net/HouseAcceptance/File/Upload/'
let downloadStrURL = 'http://mtest.sinooceanland.net/HouseAcceptance/File/DownLoad'
let downloadPath = DocumentPath + '/downloadImages'
// let imageURl = 'http://mtest.sinooceanland.net/HouseAcceptance/Image/{taskcode}/{fileid}.jpg'
let imageURl = 'http://mtest.sinooceanland.net/HouseAcceptance/Image/'
let taskCode = '3d6b7cf1-0596-4b8e-9c01-52babca2e3bb';

// 工程验收下载上传接口调试
let projAcceptDownloadStrURL = 'http://wxtest.sinooceanland.net:9555/Seagull2Files/prodefine/0d8b934a-ec41-4231-9a10-cabcb573e8bc/549d70d7-f1aa-4c1e-9b51-147d9f7a24ba/1.jpg';
let projAcceptUploadStrURL = 'http://wxtest.sinooceanland.net:10086/THRWebApi/ImplementWebApi/AcceptanceApi/SaveCommonMaterials';
// projAcceptUploadStrURL = 'http://192.168.100.229:9096/yoga/index.php?r=act/upload';

var FtpUtil = NativeModules.FtpUtil;

var PAGE_SIZE = 20;

export default class testImagePicker extends BaseContainer{
  constructor(props){
    super(props);
    this.state={
      avatarSource: '',
      randomPhoto: null,
      textParams: {
        test: 'just for test',
        taskCode: taskCode,
      },
      projAcceptUploadParams: {
        ResourceID: 'yang67cd-5b9a-426d-8d65-ca6f49682016',
        MaterialClass: 'yang67cd-5b9a-426d-8d65-ca6f49682016',
        UserCode: 'eb55938c-ba97-4dda-ba8f-8bf8914ea245',
      }
    };

    this._isMounted = true;

    // this._fetchRandomPhoto();
  }

  componentDidMount() {
    this._addListeners();

    // 测试
    // 测试文件操作
    // testFile.testRNFS();
    // this.testHttpDownLoad('http://192.168.100.229:9096/files/5.jpg', {});
    // this.testFileDownLoad(downloadStrURL, (downloadPath + '/test.jpg'), {fileID: '3b3f6517d70d61f6172e3b8de5ddd454', taskCode: '03af07cf-5b7b-4865-9756-f20a801a9eae'});
    // this.testFileDownLoad(projAcceptDownloadStrURL, (downloadPath + '/test.jpg'), {});

    // this.testPostBase64();
    // this.testPostGetCommonMaterials();

    // this.testProjAcceptOfflineDownload();
    this._testThirdPartUtils();
  }

  componentWillUnmount() {
    this.listenProgress.remove();
    this._isMounted = false;
  }

  defaultNavigationTitle(){
      return{
          title:'测试imagePicker',
          tintColor:this.defaultTintColor()
      };
  }

  _addListeners = () => {
    this.listenProgress = NativeAppEventEmitter.addListener(
      'EventFTPProgressChanged',
      (progress) => this._handleProgress(progress)
    );
  }

  _handleProgress = (progress) => {
    console.log('tag: ' + progress.tag + ' --> percent: ' + progress.percent);
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

  showImagePicker = () => {
    // More info on all the options is below in the README...just some common use cases shown here
    var options = {
      title: 'Select Avatar',
      customButtons: {
        'Choose Photo from Facebook': 'fb',
      },
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };


    

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info below in README)
     */
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      PublicToast.showMessage("#############"+JSON.stringify(response));
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
         PublicToast.showMessage("==============="+response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data...
        const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        const imageDataBase64 = 'data:image/jpeg;base64,' + response.data;
        const imageDataByteArray = base64.toByteArray(response.data);
        // or a reference to the platform specific asset location
        if (Platform.OS === 'ios') {
          const source = {uri: response.uri.replace('file://', ''), isStatic: true};
          // this.testFTP(response.uri.replace('file://', ''));          
          let fileUri = response.uri.replace('file://', '');
          let fileName = fileUri.split('/').pop();
          // 测试预验收上传
          this.testHttpUpload(fileName, fileUri); // 测试 http upload
          return;
          // 测试工程验收上传
          let uploadData = [];
          uploadData.push({
            FileName: 'test0001.jpg',
            FileContent: response.data,
            OperateType: '1',
          })
          // this.testHttpUploadForProjAccept({ObjMaterial: uploadData}); // 测试 http upload

          // test post
          let uploadParamters = Object.assign({}, this.state.projAcceptUploadParams, {ObjMaterial: JSON.stringify(uploadData)});
          this.testPost(projAcceptUploadStrURL, uploadParamters);
        } else {
          const source = {uri: response.uri, isStatic: true};
          let fileUri = response.uri;
          let fileName = fileUri.split('/').pop();
          // this.testHttpUpload(fileName, fileUri); // 测试 http upload
        }

        this.setState({
          avatarSource: source
        });
      }
    });
  }

  showSinglePicker = () => {
    ImagePickerCrop.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true
    }).then(image => {
      console.log(image);
      PublicToast.showMessage('xxx：' + image);
      // You can display the image using either data...
      const source = {uri: 'data:image/jpeg;base64,' + image.data, isStatic: true};

      // or a reference to the platform specific asset location
      if (Platform.OS === 'ios') {
        const source = {uri: image.path.replace('file://', ''), isStatic: true};
        
        let uploadData = [];
        uploadData.push({
          FileName: 'test.jpg',
          FileContent: image.data,
        })
        // this.testHttpUploadForProjAccept({ObjMaterial: uploadData}); // 测试 http upload

        // test post
        let uploadParamters = Object.assign({}, this.state.projAcceptUploadParams, {ObjMaterial: JSON.stringify(uploadData)});
        this.testPost(projAcceptUploadStrURL, uploadParamters);
      } else {
        const source = {uri: image.path, isStatic: true};
      }

      this.setState({
        avatarSource: source
      });
    }).catch(error => {
      console.log(error.message);
      setTimeout(() => PublicToast.showMessage('yyy：' + error.message), 10000);
    });
  }

  showMultiplePicker = () => {
    ImagePickerCrop.openPicker({
      multiple: true,
      includeBase64: true
    }).then(images => {
      console.log(images);
      PublicToast.showMessage('xxx：' + images);
    }).catch(error => {
      console.log(error.message);
      PublicToast.showMessage('yyy：' + error.message);
    });
  }

  selectFromCamera = () => {
    ImagePickerCrop.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true
    }).then(image => {
      console.log(image);
      PublicToast.showMessage('xxx：' + image);
      // You can display the image using either data...
      const source = {uri: 'data:image/jpeg;base64,' + image.data, isStatic: true};

      // or a reference to the platform specific asset location
      if (Platform.OS === 'ios') {
        const source = {uri: image.path.replace('file://', ''), isStatic: true};
      } else {
        const source = {uri: image.path, isStatic: true};
      }

      this.setState({
        avatarSource: source
      });
    }).catch(error => {
      console.log(error.message);
      PublicToast.showMessage('yyy：' + error.message);
    });
  }

  testFTP = (localPath) => {
    FtpUtil.setupSeverHostname('192.168.100.229:21', 'test', 'admin');
    // FtpUtil.listingPath('/', (error, listing) => {
    //   console.log('listing: ' + listing)
    // });
    let fileName = localPath;
    fileName = fileName.split('/').pop();
    FtpUtil.uploadFileAtLocalPath(localPath, 'uploadios/' + fileName, '1', (error, success) => {
      if (error) {
        console.log('error: ' + error.message);
      } else {
        console.log('success: ' + success);
      }      
    });
  }

  testHttpUpload = (fileName, fileUri) => {
    // 测试
    let uploadParamters = Object.assign({}, this.state.textParams, {'file': {uri: fileUri, type: 'multipart/form-data', name: fileName || 'image.jpg'}});
    HTTPRequest.setRequestHeader({
      'Content-Type': 'multipart/form-data',
    })
    HTTPRequest.upload(uploadStrURL, uploadParamters,
      function (error, responseData, response) {
          if (error) {
              PublicToast.showMessage('请求数据失败');
          }else {
              if (responseData) {
                  //
                  console.log('responseData:' + responseData);
              }else {
                  PublicToast.showMessage('请求数据失败');
              }
          }
      }.bind(this));

    HTTPRequest.updateProgress = (progress) => {
      console.log(progress);
    }
    HTTPRequest.transferComplete = (responseText, response) => {
      let tempXhr = response;
      console.log('success------------------------')
      console.log('response:' + response);
      console.log('responseText:' + responseText);
      console.log('-------------------------------')
    }
    HTTPRequest.transferFailed = (responseText, response) => {
      let tempXhr = response;
      console.log('failed-------------------------')
      console.log('response:' + response);
      console.log('responseText:' + responseText);
      console.log('-------------------------------')
    }
  }

  testPost = (strURL, parameter) => {
    HTTPRequest.contentType = 'form';
    HTTPRequest.normal = true;
    HTTPRequest.handleResponse = true;
    HTTPRequest.setTimeout(60000);
    HTTPRequest.requestPostWithUrl(strURL,parameter,
      function(error,responseData,response){
          if (error) {
              console.log('error: --> ' + error.message + 'response: --> ' + response);
          }else {
              /*
              if (responseData) {
                  console.log('responseData: --> ' + responseData);
              } else {
                  console.log('response: --> ' + response);
              }
              */
              if (response && response.status == 200) {
                  console.log('responseStatus: --> ' + response.status);
                  response.text().then((text) => {
                      console.log('responseText: --> ' + text);
                  }).catch(err => {
                      console.log('error: --> ' + err.message + 'response: --> ' + response);
                  });
              } else {
                  //
                  response && console.log('responseStatus: --> ' + response.status);
                  response && response.text().then((text) => {
                      console.log('responseText: --> ' + text);
                  }).catch(err => {
                      console.log('error: --> ' + err.message + 'response: --> ' + response);
                  });
              }
          }
    });
  }

  testPostBase64 = () => {
    let uploadData = [];
    let fileContent = /*'data:image/jpeg;base64,' + */'iVBORw0KGgoAAAANSUhEUgAAAKkAAAAtCAIAAABalty2AAAEyElEQVR4Ae2bf0yUdRjAPxw/DmGighDiYQPEDDCygn7YTNpyoUiUS2Zr2XKUWWabCiq2WUFYjlqNGK0NM6K8ypaZ2Y9/CsccMcWSNakkDFFL0EA4OLiT3te7473To9VuuX3f9/vd7e55nvf7vDzP8+F5v9/35QgaXRqK04EcxquASYI3HnR3xibDZi4Tl+yN+zsg2Uv2xq2AcTOXfS/ZG7cCxs1c9r1kb9wKGDdz2feSvXErYNzMZd9L9jqrgOXmgBKKTWLOAwGdQQTnEBGC/O8xLl7FnBxKspk+m1ty/fh3tfPdDj92lylnNcvX8UIBLZ+NO0f8Azplf/2dtB9m4Bwzs7l/A0caGBnSYN0wn307NdUUzMQ4gjyGoCDyi/ihkd+amTzNY/V8Okbo7/YoYn/qkX16PglJbCt0kxm0Uf0Y509qoF77SZMVaZKFyiaCQ91GhX1kFLNu5PVWn2ku5VgzFff6sQto0h37kHAe2cqJNs78+G9xKH1cs5Ygz7b3oa2cP82uci6O+jlDn06aXklNd+xTskjJ4FiLhi00jPmrsF3QLEpbK809NkYG+N7q1mYvYnoypXm0fTV2XK+C7tivqCTYK6mBXnr+4J7lmMOJiefsKUaGGbZjjvBDdGkZBU/xxdv0tfN0HaNX9P1gP7Wr/TiKaQoaLfDqADFz0KIurGDJkxw+QHQcW27V7Io0N5/NH7E+ixPjrAWRsdT+zkAfJXdgNrOy2sc9Op4Zs+g+Q1GCj11kxatFRE7DHXveKhqs2EdV9sruPcSs5eSSQ8MJ83S8ctl3DOMcUecoG70nqgkzU/MyZ4+rlucXqO/KUA5lLqa4nj87KV/msunjXV/sK1fS9i3LXlLZJGZQ8ql2/Ve4KmvBpj04PF9KNpmo2cShd4mIYcNu0rIZHPADtegtbr+P+m18/Sp2fxP8+Ihh0hf7I59oVe/pwlqBAjh0Ag9vIeTSLVxUNK0HadjlntbRpAqrdzJnHlVreLBYVS3pxCWpgmtMT1UXgq4W0nMuGUZpO6g+ORB/6Gu9d/FYUUPqXG29T8ulbC/732dhIQc+56a7eHSqD7iEDGLSOPohb7bzcRVJiSxZ6zPBW7noZPMC2hq9bYLK+ur7KyFYMtlYzzdWWvaq7Pdt5xoL249Qlkvvaff0U60or7FhLWdP1ZhG0RvEJ/Ninmbp7dJkkSXPAw2Rcxg39tgU1n/AhR7q1uK0q9McNnY8Q2IqpftJzvLvONBNz3HtNWxTtwjeFofX42H/pxDDql/2M++mshnl3uy5RT5P4H9tYuNCLMm80sizu8Wg9P9EqcdrvtLWyrD30vkztes498vlpetopHgeOY9jLb38kLeemMmUa5mRhuOit1k3sh7ZK3Dsg3QeovQ2jZPTyZBNU08epW6NprqkiZPVpwJjQ9nwF7+n3vh9+c6YTU+CHvf5EZNQ/iJr+8uHU0gYE6JU4z/80/HEqQwPYe93O0bGM8VCbwe2PpzDPmfThaJH9roAcxWS0O9e7yoUT/AfIdkLDjCA8CX7AIonuKtkLzjAAMKX7AMonuCukr3gAAMIX7IPoHiCu0r2ggMMIHzJPoDiCe4q2QsOMIDwJfsAiie4q0n9RpschqyAyTntOkMmLpPmb6s1MZ+xbCOWAAAAAElFTkSuQmCC';
    let file1 = {
      FileName: 'test.jpg',
      FileContent: fileContent,
      OperateType: '1',
    }
    uploadData.push(file1);
    // this.testHttpUploadForProjAccept({ObjMaterial: file1}); // 测试 http upload

    // test post
    let uploadParamters = Object.assign({}, this.state.projAcceptUploadParams, {ObjMaterial: JSON.stringify(uploadData)});
    this.testPost(projAcceptUploadStrURL, uploadParamters);
  }

  testPostGetCommonMaterials = () => {
    this.testPost(
      'http://wxtest.sinooceanland.net:10086/THRWebApi/ImplementWebApi/AcceptanceApi/GetCommonMaterials', 
      {
        ResourceID: 'yang67cd-5b9a-426d-8d65-ca6f49682016',
        MaterialClass: 'yang67cd-5b9a-426d-8d65-ca6f49682016'
      }
    );
  }

  testHttpUploadForProjAccept = (uploadData) => {
    // 测试
    let uploadParamters = Object.assign({}, this.state.projAcceptUploadParams, uploadData);
    HTTPRequest.normal = true;
    HTTPRequest.upload(projAcceptUploadStrURL, uploadParamters,
      function (error, responseData, response) {
          if (error) {
              PublicToast.showMessage('请求数据失败');
          }else {
              if (responseData) {
                  //
                  console.log('responseData:' + responseData);
              }else {
                  PublicToast.showMessage('请求数据失败');
              }
          }
      }.bind(this));

    HTTPRequest.updateProgress = (progress) => {
      console.log(progress);
    }
    HTTPRequest.transferComplete = (responseText, response) => {
      let tempXhr = response;
      console.log('success------------------------')
      console.log('response:' + response);
      console.log('responseText:' + responseText);
      console.log('-------------------------------')
    }
    HTTPRequest.transferFailed = (responseText, response) => {
      let tempXhr = response;
      console.log('failed-------------------------')
      console.log('response:' + response);
      console.log('responseText:' + responseText);
      console.log('-------------------------------')
    }
  }

  testHttpDownLoad = (downloadUrl, params) => {
    _this = this;
    // 测试
    HTTPRequest.download(downloadUrl, params,
      function (error, responseData, response) {
          if (error) {
              PublicToast.showMessage('请求数据失败');
          }else {
              if (responseData) {
                  //
                  console.log('responseData:' + responseData);
                  let source = {uri: response._response};
                  FileUtil.createDir(downloadPath, {NSURLIsExcludedFromBackupKey: true}, function (error, result) {
                      if (error) {
                          console.log('callback error:', error.message);
                      } else {
                          console.log('callback result:', result);
                          FileUtil.createFile(downloadPath + '/test.jpg', 
                              base64.fromByteArray(responseData), 
                              'base64', 
                              {overwrite: true}, 
                              function (error, result) {
                                if (error) {
                                    console.log('callback error:', error.message);
                                } else {
                                    console.log('callback result:', result);
                                    _this.setState({
                                      avatarSource: {uri: downloadPath + '/test.jpg'},
                                    });
                                }
                          });
                      }
                  });
              }else {
                  PublicToast.showMessage('请求数据失败');
              }
          }
      }.bind(this));

    HTTPRequest.updateProgress = (progress) => {
      console.log(progress);
    }
    HTTPRequest.downloadProgress = (progress) => {
      console.log('downloadProgress:' + progress);
    }
    HTTPRequest.transferComplete = (responseText, response) => {
      let tempXhr = response;
      console.log('success------------------------')
      console.log('response:' + response);
      console.log('responseText:' + responseText);
      console.log('-------------------------------')
    }
    HTTPRequest.transferFailed = (responseText, response) => {
      let tempXhr = response;
      console.log('failed-------------------------')
      console.log('response:' + response);
      console.log('responseText:' + responseText);
      console.log('-------------------------------')
    }
  }

  testFileDownLoad = (downloadUrl, downloadDest, params) => {
    _this = this;
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
                } else {
                    console.log('callback result:', responseData);
                    if (responseData && responseData.statusCode === 200) {
                      _this.setState({
                        avatarSource: {uri: downloadPath + '/test.jpg'},
                      });
                    };
                }
          });
      }
    });
  }

  _testThirdPartUtils = () => {
    ThirdPartUtils.UUIDGeneratorBatch(10, (uuidArray) => {
      console.log('uuidArray:' + uuidArray);
    });
    ThirdPartUtils.UUIDGeneratorBatch(1, (uuid) => {
      console.log('uuid:' + uuid);
    });
    ThirdPartUtils.UUIDGeneratorBatch(1).then((uuid) => {
      console.log('uuid---:' + uuid);
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
        <Text style={[styles.text, {marginTop:20}]} onPress={() => this.showImagePicker()}> show imagePicker </Text>
        <Image source={this.state.avatarSource} style={{height: 100, resizeMode: Image.resizeMode.contain}} />
        <Text style={[styles.text, {marginTop:20}]} onPress={() => this.showSinglePicker()}> show single imagePicker </Text>
        <Text style={[styles.text, {marginTop:20}]} onPress={() => this.showMultiplePicker()}> show mutiple imagePicker </Text>
        <Text style={[styles.text, {marginTop:20}]} onPress={() => this.selectFromCamera()}> select from camera </Text>
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

