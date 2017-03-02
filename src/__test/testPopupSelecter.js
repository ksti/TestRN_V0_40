
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
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * 
 */
 
import React,{Component} from 'react'
import {
  View,
  Image,
  StatusBar,
  ScrollView,
  StyleSheet,
  Navigator,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native'

import Orientation from 'react-native-orientation'

import PublicToast from '../components/PublicToast'
import BaseContainer from '../containers/BaseContainer';
import httpRequest from '../common/HTTPRequest'

let HTTPRequest = new httpRequest();
// let strURL = 'https://moa.sinooceanland.com:10086/AnChangReportService/Interface_GetOrgInstitutionCodeService.service?userName=liming'
let strURL = 'https://moa.sinooceanland.com:10086/AnChangReportService/Interface_SaleSearchInterfaceService.service'
// let parameter = {};
parameter = {OrgCode: '', CityCode: '', ProjectCode: '', TimeCategory: 'Year', DateStar: '', DateEnd: ''};


import PopupSelecter from '../components/PopupView/PopupSelecter'
import RelativeContainer from '../components/customPopupPage/RelativeContainer'
import PopupFormPageDetail1 from '../projects/project1/Page/ProjectAcceptance/components/PopupFormPageDetail1'
import PopupFormPageDetail2 from '../projects/project1/Page/ProjectAcceptance/components/PopupFormPageDetail2'

export default class testPopupSelecter extends BaseContainer{
  constructor(props){
    super(props);
    this.state={
      animateType: 'none',
      dataSource: [
        {text: 'hello'},
        {text: 'world'},
        {text: 'hello'},
        {text: 'little'},
      ],
      imageSource: [
        // {
        //   name: '加号',
        //   // uri: require('../../resource/images/App/jiahao.png'),
        //   uri: 'file:../../resource/images/App/jiahao.png',
        //   local: require('../../resource/images/App/jiahao.png'),
        // }
      ],
      infoData: {
        checkProject: "混凝土塌落度",
        code: "e468128f-514f-4c11-bc40-9a60fed3b9e8",
        headerLeftText: "混凝土塌落度",
        headerRightText: "保存",
        id: "2",
        inspectionStandard: "混凝土塌落度控制在设计要求及规范以内",
        isQualified: 0,
        rowIndex: 2,
        situation: "",
        remarkStr: 'xxx--->ooo',
        specificProject: "混凝土塌落度控制在设计要求及规范以内",
      },
    };
  }

  componentWillMount() {
    //The getOrientation method is async. It happens sometimes that
    //you need the orientation at the moment the js starts running on device.
    //getInitialOrientation returns directly because its a constant set at the
    //beginning of the js code.
    var initial = Orientation.getInitialOrientation();
    if (initial === 'PORTRAIT') {
      //do stuff
    } else {
      //do other stuff
    }
  }

  componentDidMount() {
    // Orientation.lockToPortrait(); //this will lock the view to Portrait
    //Orientation.lockToLandscape(); //this will lock the view to Landscape
    Orientation.unlockAllOrientations(); //this will unlock the view to all Orientations

    Orientation.addOrientationListener(this._orientationDidChange);

    // test PopupFormPageDetail2
    let testSelectedArray = [
      // {
      //   "id": "7",
      //   "code": "2",
      //   "disqualificationParticular": "施工现场大门未采用门柱式的双开大门；"
      // },
      // {
      //   "id": "8",
      //   "code": "2",
      //   "disqualificationParticular": "规格与集团标准要求不符："
      // },
      {
        "id": "9",
        "code": "2",
        "disqualificationParticular": "材质与集团标准要求不符；"
      },
      {
        "id": "10",
        "code": "2",
        "disqualificationParticular": "门扇未标施工单位企业标识；"
      },
      {
        "id": "11",
        "code": "2",
        "disqualificationParticular": "门扇颜色非蓝底白字；"
      }
    ]
    this.PopupFormPageDetail2.getWrappedInstance().setSelectedCommonProblems(testSelectedArray);
  }

  componentWillUnmount() {
    Orientation.getOrientation((err,orientation)=> {
      console.log("Current Device Orientation: ", orientation);
    });
    Orientation.removeOrientationListener(this._orientationDidChange);
  }

  defaultNavigationTitle(){
      return{
          title:'测试 PopupSelector',
          tintColor:this.defaultTintColor()
      };
  }

   _orientationDidChange = (orientation) => {
    if (orientation == 'LANDSCAPE') {
      //do something with landscape layout
    } else {
      //do something with portrait layout
    }
  }

  popupPage = (animateType, identifier) => {
    this.setState({
      animateType,
    })
    // this.basePopupPage.show(null, 200, 250);
    // this.basePopupPage.show();
    // this[identifier].show(null, Dimensions.get('window').width - 50, (this.state.dataSource.length + 1) * 44);
    this[identifier].show();
  }

  _onClose = (savedData, identifier, changed) => {
    this[identifier].dismiss();
  }

  _onSelect = (rowData, sectionID, rowID, identifier) => {
    PublicToast.showMessage('U selected : ' + rowData.text);
    this[identifier].dismiss();
  }
        

  render(){

    return(
      <View style={[styles.container, {backgroundColor: 'white'}]}>
        {this.defaultRenderNavigationBar()}
        <StatusBar
           // barStyle="light-content"
           barStyle="default"
        />
        <Text style={[styles.text, {marginTop:2}]} onPress={() => this.popupPage('popup', 'PopupSelecterRelative')}> 'PopupSelecterRelative' </Text>
        <PopupSelecter
          // animateType={this.state.animateType}
          animateType='popup' 
          ref={(PopupSelecter) => {this.PopupSelecterRelative = PopupSelecter}}
          // width={200}
          // height={(this.state.dataSource.length + 1) * 44}
          position='relative'
          headerLeftText='左边标题'
          headerRightText='右边按钮'
          dataSource={this.state.dataSource}
        />
        <Text style={[styles.text, {marginTop:2}]} onPress={() => this.popupPage('popup', 'PopupSelecterRelative2')}> 'PopupSelecterRelative2' </Text>
        <View 
          pointerEvents='box-none'
          // style={{
          //   flex: 1, 
          //   position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, 
          //   zIndex: 888,
          //   overflow: 'hidden',
          // }}
          style={{
            // flex: 1, 
            height: 1, 
            zIndex: 888,
            overflow: 'visible',
          }}
        >
          <PopupSelecter
            // animateType={this.state.animateType}
            animateType='popup' 
            ref={(PopupSelecter) => {this.PopupSelecterRelative2 = PopupSelecter}}
            // width={200}
            // height={(this.state.dataSource.length + 1) * 44}
            position='relative'
            headerLeftText='左边标题'
            headerRightText='右边按钮'
            dataSource={this.state.dataSource}
          />
        </View>
        <Text style={[styles.text, {marginTop:2}]} onPress={() => this.popupPage('popup', 'PopupSelecterRelative3')}> 'PopupSelecterRelative drop down' </Text>
        <RelativeContainer>
          <PopupSelecter
            // animateType={this.state.animateType}
            animateType='dropdown' 
            ref={(PopupSelecter) => {this.PopupSelecterRelative3 = PopupSelecter}}
            // width={200}
            // height={(this.state.dataSource.length + 1) * 44}
            position='relative'
            headerLeftText='左边标题'
            headerRightText='右边按钮'
            onSelect={(rowData, sectionID, rowID) => this._onSelect(rowData, sectionID, rowID, 'PopupSelecterRelative3')}
            dataSource={this.state.dataSource}
          />
        </RelativeContainer>
        <Text style={[styles.text, {marginTop:2}]} onPress={() => this.popupPage('popup', 'PopupSelecter')}> 'PopupSelector' </Text>
        <Text style={[styles.text, {marginTop:2}]} onPress={() => this.popupPage('popup', 'PopupSelecter2')}> 'PopupSelector2' </Text>
        <Text style={[styles.text, {marginTop:2}]} onPress={() => this.PopupFormPageDetail1.getWrappedInstance().show()}> 'PopupFormPageDetail1' </Text>
        <Text style={[styles.text, {marginTop:2}]} onPress={() => this.PopupFormPageDetail2.getWrappedInstance().show()}> 'PopupFormPageDetail2' </Text>
        <PopupSelecter
          // animateType={this.state.animateType}
          animateType='popup' 
          ref={(PopupSelecter) => {this.PopupSelecter = PopupSelecter}}
          // width={200}
          // height={(this.state.dataSource.length + 1) * 44}
          position='absolute'
          headerLeftText='左边标题'
          headerRightText='右边按钮'
          dataSource={this.state.dataSource}
        />
        <PopupSelecter
          // animateType={this.state.animateType}
          animateType='popup' 
          ref={(PopupSelecter) => {this.PopupSelecter2 = PopupSelecter}}
          // width={200}
          // height={(this.state.dataSource.length + 1) * 44}
          headerLeftText='左边标题'
          headerRightText='右边按钮'
          closeButton={(
            <Image source={require('../../resource/images/App/ic_delete.png')} style={[{width: 20, height: 20}]} />
          )}
          onClose={(savedData) => this._onClose(savedData, 'PopupSelecter2')}
          onSelect={(rowData, sectionID, rowID) => this._onSelect(rowData, sectionID, rowID, 'PopupSelecter2')}
          dataSource={this.state.dataSource}
        />
        <PopupFormPageDetail1
          // animateType={this.state.animateType}
          animateType='popup'
          ref={(PopupFormPageDetail1) => {this.PopupFormPageDetail1 = PopupFormPageDetail1}}
          width={Dimensions.get('window').width}
          height={300}
          leftWidth={85}
          headerLeftText='钢筋笼'
          headerRightText='保存'
          onClose={(savedData) => this._onClose(savedData, 'PopupFormPageDetail1')}
          inspectionStandard='的嘎嘎国家来看楼兰古国军绿色偶几个垃圾费啦；房间的熟老地方；安抚；啊的嘎嘎国家来看楼兰古国军绿色偶几个垃圾费啦；房间的熟老地方；安抚；啊的嘎嘎国家来看楼兰古国军绿色偶几个垃圾费啦；房间的熟老地方；安抚；啊的嘎嘎国家来看楼兰古国军绿色偶几个垃圾费啦；房间的熟老地方；安抚；啊的嘎嘎国家来看楼兰古国军绿色偶几个垃圾费啦；房间的熟老地方；安抚；啊的嘎嘎国家来看楼兰古国军绿色偶几个垃圾费啦；房间的熟老地方；安抚；啊的嘎嘎国家来看楼兰古国军绿色偶几个垃圾费啦；房间的熟老地方；安抚；啊的嘎嘎国家来看楼兰古国军绿色偶几个垃圾费啦；房间的熟老地方；安抚；啊'
          max={9}
          hiddenWhenMax={true}
          imageSource={this.state.imageSource}
        />
        <PopupFormPageDetail2
          // animateType={this.state.animateType}
          animateType='popup'
          ref={(PopupFormPageDetail2) => {this.PopupFormPageDetail2 = PopupFormPageDetail2}}
          width={Dimensions.get('window').width}
          height={300}
          leftWidth={85}
          infoData={this.state.infoData}
          onClose={(savedData, changed) => this._onClose(savedData, 'PopupFormPageDetail2', changed)}
          max={9}
          hiddenWhenMax={true}
          imageSource={this.state.imageSource}
        />

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
