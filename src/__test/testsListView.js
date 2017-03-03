
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

// import React from 'react';

import {
  Navigator, 
  StyleSheet, 
  Text, 
  Image, 
  View,
  ListView,
  TouchableOpacity,
  StatusBar,
  Dimensions, 
  ToastAndroid,
  BackAndroid
} from 'react-native'

import {
  Scene, 
  Reducer, 
  Router, 
  Switch, 
  TabBar, 
  Modal, 
  Schema, 
  Actions
} from 'react-native-router-flux'

import Orientation from 'react-native-orientation'

import NavBarButton from '../components/NavBarButton';
import BaseContainer from '../containers/BaseContainer';
import httpRequest from '../common/HTTPRequest'
import ReduxActions from '../reduxDataFlow/actions';


let HTTPRequest = new httpRequest();
// let strURL = 'https://moa.sinooceanland.com:10086/AnChangReportService/Interface_GetOrgInstitutionCodeService.service?userName=liming'
let strURL = 'https://moa.sinooceanland.com:10086/AnChangReportService/Interface_SaleSearchInterfaceService.service'
// let parameter = {};
let parameter = {OrgCode: '', CityCode: '', ProjectCode: '', TimeCategory: 'Year', DateStar: '', DateEnd: ''};

let testPushTo = 'testPageForProject2'; // 要跳转的 Scene key, 在引入 Scenes 时创建的唯一标识
let dataSource = [
    {
        key: 'TestImagePicker',
        text: 'TestImagePicker',
    },
    {
        key:'TestPopupPage',
        text:'TestPopupPage',
    },
    {
        key: 'TestPopupSelecter',
        text: 'TestPopupSelecter',
    },
    {
        key: 'TestSomeOnePage',
        text: 'TestSomeOnePage',
    },
    {
        key: testPushTo,
        text: 'TestPushToAnyPage',
    },
];


export default class testsList extends BaseContainer{
  constructor(props){
    super(props);
    this.state={
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(dataSource),
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
  }

  componentWillUnmount() {
    Orientation.getOrientation((err,orientation)=> {
      console.log("Current Device Orientation: ", orientation);
    });
    Orientation.removeOrientationListener(this._orientationDidChange);
  }

  defaultNavigationTitle(){
      return{
          title:'测试 testsListView',
          tintColor:this.defaultTintColor()
      };
  }

  _handlePop = () => {
    console.log('Object.keys(Actions): ' + Object.keys(Actions));
    Actions.pop();
    // Actions.popTo('tabbar'); // [react-native-router-flux] Cannot find element name named tabbar within current state
    // Actions.tabbar(); // [react-native-router-flux] missed route data for key=tabbar
    var testReduxActions = ReduxActions;
    console.log('ReduxActions: ' + testReduxActions);
  }

  defaultRenderNavigationBarLeftButton()
  {

    // return {
    //    title: '返回',
    //    tintColor: this.defaultTintColor(),
    //    handler: this._handlePop,
    //    style: styles.leftButton
    // }
    return(
      <NavBarButton
        style={styles.leftButton}
        image={require('../../resource/images/App/ic_nav_back.png') }
        handler={() => this._handlePop()}
      />
    );
  }

   _orientationDidChange = (orientation) => {
    if (orientation == 'LANDSCAPE') {
      //do something with landscape layout
    } else {
      //do something with portrait layout
    }
  }

  _onSelect = (rowData, sectionID, rowID) => {
    // if (this.props._onSelect) {
    //   this.props._onSelect(rowData);
    // };
    // console.log('Object.keys(Actions): ' + Object.keys(Actions));
    // let getFunc = Actions.get;
    // console.log('getFunc:' + getFunc);
    // let iterateFunc = Actions.iterate;
    // console.log('iterateFunc:' + iterateFunc);
    // Actions[rowData.key]();
    (Actions[rowData.key])();
  }

  _renderRow = (rowData: Object, sectionID: number, rowID: number) => {
      return (
        <TouchableOpacity 
          style={{flex: 1}}
          onPress={() => this._onSelect(rowData, sectionID, rowID)}
        >
            <View style={[styles.row]}>
              <Text style={[styles.text, {fontSize:15, color:'#3b3b3b', marginLeft:0, marginTop:13}]}>
                {rowData.text}
              </Text>
            </View>
            <View style={{width:Dimensions.get('window').width, height:0.7, backgroundColor:'#D0D0D0'}}/>
        </TouchableOpacity>
      );
    }


  // render() {
  //     // return <Router createReducer={reducerCreate} scenes={scenes} />
  //     //   //   <Router createReducer={reducerCreate} backAndroidHandler={backAndroidHandler} onBackAndroid ={onBackAndroid}  onExitApp={onExitApp} >
  //     return (
  //        <Router createReducer={reducerCreate} getSceneStyle={getSceneStyle}  >
  //             <Scene key="modal" component={Modal}>
  //                 <Scene key="root" hideNavBar={true}>
  //                     <Scene key='initialRoot' component={InitialRoot}/>
  //                     <Scene key='loginIn' type='reset' initial={true} component={Login}/>
  //                     <Scene key="tabbar" type='reset' >
  //                         <Scene key="main" tabs={true} tabBarStyle={{backgroundColor:'#fff', borderTopColor:'#efeff4',borderTopWidth:2 }}>
  //                             <Scene key="home" hideNavBar={true} initial={true} title="工作通" icon={TabIcon} component={WorkHomeContainer} navigationBarStyle={styles.navigationBar} titleStyle={styles.navigationTitle}  Image={require('./images/TabBar/workhome.png') } selectImage={require('./images/TabBar/workhomeselected.png') }>
  //                             </Scene>
  //                             <Scene key="project" hideNavBar={true} title="企业圈" icon={TabIcon} component={BusinessHomeContainer} navigationBarStyle={styles.navigationBar} titleStyle={styles.navigationTitle} Image={require('./images/TabBar/businesshome.png') } selectImage={require('./images/TabBar/businesshomeselected.png') }>
  //                             </Scene>
  //                             <Scene key="Profile" hideNavBar={true} component={ProfilePage} title="我" icon={TabIcon} navigationBarStyle={styles.navigationBar} titleStyle={styles.navigationTitle} Image={require('./images/TabBar/profile.png') } selectImage={require('./images/TabBar/profileselected.png') } />
  //                         </Scene>
  //                     </Scene>
  //                     {
  //                         routers.pages.map(item =>
  //                             <Scene key={item.key} component={item.comp} />)
  //                     }
  //                 </Scene>
  //                 <Scene key="error" component={ErrorContainer}  hideNavBar={true}/>
  //             </Scene>
  //         </Router>
  //     );
  // }

  render() {
      return (
        <View 
          style={[styles.container, {backgroundColor: 'white'}]}
        >
          {this.defaultRenderNavigationBar()}
          <StatusBar
             // barStyle="light-content"
             barStyle="default"
          />
          <ListView
            enableEmptySections={true}
            dataSource={this.state.ds}
            renderRow={this._renderRow}
          />
        </View>
      );

      // return (
      //   <View 
      //     style={[styles.container, {backgroundColor: 'white', marginTop: StatusBar.height}]}
      //   >
      //     <StatusBar
      //        // barStyle="light-content"
      //        barStyle="default"
      //     />
      //     <ListView
      //       enableEmptySections={true}
      //       dataSource={this.state.ds}
      //       renderRow={this._renderRow}
      //     />
      //   </View>
      // );
  }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
        justifyContent: "center",
        // alignItems: "center", // 这句会破坏包在其中的 {this.defaultRenderNavigationBar()} 布局
    },
    navigationBar: {  //头部标题文字
        backgroundColor: '#333333'
    },
    navigationTintColor: {
        color: 'white',
    },
    navigationTitle: { //头部导航
        color: 'white',
        fontSize: 17,
        marginTop:10,
    },
    leftButton:{
        backgroundColor: "transparent",
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    rightButton:{
        backgroundColor: "transparent",
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginRight:10,
    },
    text: {
      textAlign: 'center',
      marginLeft: 6,
      marginTop: 13,
      flex: 1,
      fontSize: 15,
      color: '#3b3b3b',
    },
    row: {
      flex: 1,
      height: 44,
      flexDirection: 'row',
      overflow: 'hidden',
    },
});
