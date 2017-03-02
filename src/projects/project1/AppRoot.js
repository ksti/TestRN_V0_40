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
 
import React from 'react';

import {
    AppRegistry,
    Navigator,
    StyleSheet,
    Text,
    Image,
    View,
    AppState,
    NativeModules,
    Alert,
} from 'react-native'

import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux'

// redux connect
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// 引入公用路径导航
import {
    commonPath,
    componentsPath,
    containersPath,
    resourcePath,
    reduxDataFlowPath,
    //--- Business Path ---
    GlobalPath,
    BusinessUtilPath,
    BusinessComponentPath,
} from './PathIndex' // Page 目录的上个目录, 层级深度:0

/* import from .. 似乎不支持字符串表达式。。require()也是
// 原生类 安卓(为了解决首页点击安卓物理返回按键退出应用)
import NativeCommonTools from commonPath() + '/NativeCommonTools'
// 所需的页面容器
import WebViewContainer from containersPath() + '/WebViewContainer'
import ErrorContainer from containersPath() + '/ErrorContainer'
import Login from './Page/Login/Login'

import GestureLogin from './Page/GesturePwd/GestureLogin'
import SetGesturePwd from './Page/GesturePwd/SetGesturePwd'
import LoadingDialog from componentsPath() + '/customComponents/GJSProgressHUD'
import PublicToast from componentsPath() + '/PublicToast'
import MyDialog from componentsPath() + '/MyDialog'
import GlobalSize from GlobalPath() + '/GlobalSize'
import RefreshToken from BusinessUtilPath() + '/RefreshToken'
import globalStorageUtil from commonPath() + '/GlobalStorageUtil'
*/

// 原生类 安卓(为了解决首页点击安卓物理返回按键退出应用)
import NativeCommonTools from '../../common/NativeCommonTools'
// 所需的页面容器
import WebViewContainer from '../../containers/WebViewContainer'
import ErrorContainer from '../../containers/ErrorContainer'
import Login from './Page/Login/Login'
import InitialRoot from './Page/Login/InitialRoot'

import GestureLogin from './Page/GesturePwd/GestureLogin'
import SetGesturePwd from './Page/GesturePwd/SetGesturePwd'
import LoadingDialog from '../../components/customComponents/GJSProgressHUD'
import PublicToast from '../../components/PublicToast'
import MyDialog from '../../components/MyDialog'
import GlobalSize from './Global/GlobalSize'
import RefreshToken from './BusinessUtil/RefreshToken'
import globalStorageUtil from '../../common/GlobalStorageUtil'

const reducerCreate = params => {
    const defaultReducer = Reducer(params);
    return (state, action) => {
        PublicToast.logMessage("ACTION:", action);
        return defaultReducer(state, action);
    }
};

const getSceneStyle = (/* NavigationSceneRendererProps */ props, computedProps) => {
    const style = {
        flex: 1,
        backgroundColor: '#333333'
    };
    return style;
};

var _userName='';
var _gesInfo=null;
var _tokenInfo=null;

export default class AppRoot extends React.Component {
    constructor(props){
        super(props);
        this.state={
            isLoginInitial:false,//是否直接进入登录页
            isLoading:true,
            isGesLoginInitial:false, // 是否直接进入手势认证页
        }
    }
    /* 
     * react-native-router-flux/src/Router.js 官方的实现
          handleBackAndroid() {
            const {
              backAndroidHandler,
              onBackAndroid,
              onExitApp,
            } = this.props;
            // optional for customizing handler
            if (backAndroidHandler) {        
              return backAndroidHandler();
            }

            try {
              Actions.pop();
              if (onBackAndroid) {
                onBackAndroid();
              }
              return true;
            } catch (err) {
              if (onExitApp) {
                return onExitApp();
              }

              return false;
            }
          }
     * 解读：
     * 1.如果有 backAndroidHandler props, 直接交给用户处理安卓物理返回按键事件
     * 2.如果没有 backAndroidHandler props, 会回调 onBackAndroid 和 onExitApp
     * 3.在2的情况下 onBackAndroid 调用是在有返回场景的情况下；onExitApp 是在根路由下被调用
    */

    _backAndroidHandler = () => {
        // PublicToast.showMessage('_backAndroidHandler');
        try {
          Actions.pop();
          return true;
        } catch (err) {
          return this._onExitApp();
        }
    }

    _onBackAndroid = () => {
        // PublicToast.showMessage('_onBackAndroid'); // 在不传 backAndroidHandler 有 onBackAndroid 时调用
        return true;
    }

    _onExitApp = () => {
        // PublicToast.showMessage('_onExitApp'); // 在不传 backAndroidHandler 有 onExitApp 时调用
        this._exit();
        return true;
    }

    // 退出程序  
    _exit = () => {
        // 当前页面为root页面时的处理  
        if (this.lastBackPressed && (this.lastBackPressed + 2000 >= Date.now())) {  
            //最近2秒内按过back键，可以退出应用。 
            //alert 亲，你真的要离开我吗
            Alert.alert('提示','亲，你真的要离开我吗?', 
                        [{text:'取消',onPress:() => {}}, 
                         {text:'确定',onPress:() => { NativeCommonTools.onBackPressed(); }} 
                        ]);
            return true;
        }  
        this.lastBackPressed = Date.now();  
        PublicToast.showMessage('再按一次退出应用');
        return true;
    }

    componentWillUnmount(){
        PublicToast.logMessage('App.js willUnMount');
        AppState.removeEventListener('change',this._handleAppStateChange);
    }
    componentDidMount() {
        PublicToast.logMessage('App.js DidMount:',AppState.currentState);
        AppState.addEventListener('change', this._handleAppStateChange);

        this.refs.loading.show();
        //获取用户姓名，如果存在，就判断手势密码和token刷新，否则，判为第一次登录
        global.storageUtil.getValue(GlobalSize.Global_UserName)
        .then((curUserName)=>{
            //验证token是否有效，手势密码是否需要输入
            _userName=curUserName;
            // businessUserInfo.saveGlobalUserInfo(()=>{}); // 将 userInfo 存入 global

            this.verifyIsNeedGesLogin();
        })
        .catch((error)=>{
            PublicToast.logMessage('没有在本地找到最后一次登录的账号纪录');
            //进入登录页
            this.setState({
                isLoading:false,
                isLoginInitial:true,
            })
        })
    }
    /*
        app前后台切换时的回调
        --退出时记录退出时间
        --进入时preVerifyGesInfo判断
    */
    _handleAppStateChange=(appState)=>{
        PublicToast.logMessage('Change AppState:',appState);
        if (appState == 'inactive') {
            //记录当前时间
            this.saveAppBackgroundTime();
        }else if (appState == 'background') {
            //inactive->background---->active
            //记录当前时间
            this.saveAppBackgroundTime();
        }else {//active
            PublicToast.logMessage('App手势缓存');
            globalStorageUtil.removeKey(GlobalSize.Global_IsHomeNow, null,(error, result) => {
                if (error) {
                    PublicToast.logMessage('退出app业务区,删除Global_IsHomeNow信息失败88'+result);
                } else {
                    PublicToast.logMessage('退出app业务区,删除Global_IsHomeNow信息成功8');
                }
            });
            this.preVerifyGesInfo();
        }
    }
    /* 
        app重新启动时，判断是否具备判断手势登录的缓存信息（token和手势密码等信息）
        --如果具备继续判断verifyNextStepWithGesInfoAndTokenInfo
        --如果不具备进入登录页
    */
    verifyIsNeedGesLogin = () => {
        global.userName = _userName;
        //1.判断是否有token信息，如果有则进一步判断，如果没有（第一次）则进入登录页
        globalStorageUtil.getValue(GlobalSize.Global_TokenInfo, null, // id null
            (error, result) => {
                if (error) {
                    console.log('error: --> ' + error.message);
                    this.setState({
                        isLoading:false,
                        isLoginInitial:true,
                    })
                    Actions.loginIn();
                } else {
                    if (result) {
                        let savedTokenInfo = result;
                        console.log('savedTokenInfo: --> ' + savedTokenInfo);
                        _tokenInfo =result;
                        global.accessToken = _tokenInfo.accessToken; // 保存 accessToken 信息
                        global.refreshToken = _tokenInfo.refreshToken; // 保存 refreshToken 信息
                        global.expiresIn = _tokenInfo.expiresIn; // 保存 expiresIn 信息
                        global.expiresTime = _tokenInfo.expiresTime; // 保存 expiresTime 信息
                        global.tokenType = _tokenInfo.tokenType; // 保存 tokenType 信息
                        //2.判断是否能获取缓存的手势信息，如果能获取到则继续判断，否则进入登录页重新设置手势信息
                        global.storageUtil.getAllDataForKey(_userName)
                            .then((objDatas)=>{
                                PublicToast.logMessage('获取账号'+_userName+'下的缓存数据objDatas:'+objDatas);
                                let gestureInfo = objDatas[0];
                                _gesInfo=gestureInfo;
                                PublicToast.logMessage('App手势缓存:',gestureInfo.isOpen,gestureInfo.password,gestureInfo.interval);
                                PublicToast.logMessage('app rootMount－验证下一步操作');
                                this.verifyNextStepWithGesInfoAndTokenInfo();
                            })
                            .catch((error)=>{
                                PublicToast.logMessage('没有找到登录的账号的手势密码缓存数据'+error.message);
                                this.setState({
                                    isLoading:false,
                                    isLoginInitial:true,
                                })
                                Actions.loginIn();
                            })
                    }else {
                        this.setState({
                            isLoading:false,
                            isLoginInitial:true,
                        })
                        Actions.loginIn();
                    }
                }
        });
    }
    /*
        获取手势手势所需要的信息（userName，手势信息，登陆的token等信息，）
        --如果具备 verifyNextStepWithGesInfoAndTokenInfo
        --如果不具备 进入登录页
    */
    preVerifyGesInfo = () => {
        global.storageUtil.getValue(GlobalSize.Global_UserName)
        .then((curUserName)=>{
            global.storageUtil.getAllDataForKey(curUserName)
            .then((objDatas)=>{
                PublicToast.logMessage('获取账号'+curUserName+'下的缓存数据objDatas:'+objDatas);
                let gestureInfo = objDatas[0];
                _gesInfo = gestureInfo;
                PublicToast.logMessage('App手势缓存:' + gestureInfo.isOpen + gestureInfo.password + gestureInfo.interval);
                globalStorageUtil.getValue(GlobalSize.Global_TokenInfo, null, // id null
                        (error, result) => {
                            if (error) {
                                // console.log('error: --> ' + error.message);
                                Actions.loginIn();
                            } else {
                                if (result) {
                                    let savedTokenInfo = result;
                                    _tokenInfo =result;
                                    global.accessToken = _tokenInfo.accessToken; // 保存 accessToken 信息
                                    global.refreshToken = _tokenInfo.refreshToken; // 保存 refreshToken 信息
                                    global.expiresIn = _tokenInfo.expiresIn; // 保存 expiresIn 信息
                                    global.expiresTime = _tokenInfo.expiresTime; // 保存 expiresTime 信息
                                    global.tokenType = _tokenInfo.tokenType; // 保存 tokenType 信息
                                    // 下一步
                                    PublicToast.logMessage('app唤醒－验证下一步操作');
                                    this.verifyNextStepWithGesInfoAndTokenInfo();
                                }else {
                                    Actions.loginIn();
                                }
                            }
                    });
                
            })
            .catch((error)=>{
                PublicToast.logMessage('没有找到登录的账号的手势密码缓存数据'+error.message);
                this.setState({
                    isLoading:false,
                    isLoginInitial:true,
                })
                Actions.loginIn();
            })
        })
        .catch((error)=>{
            //没有取到
            PublicToast.logMessage('没有在本地找到最后一次登录的账号纪录');
            this.setState({
                isLoading:false,
                isLoginInitial:true,
            })
            Actions.loginIn();
        })
    }
    // 验证手势是否开启，后台停滞时间是否超出最大时长，决定是进入首页，登录页还是手势认证页
    verifyGesInfo = (gesInfo, currentDate) => {
        if (gesInfo) {
            let gesIsOpen = gesInfo.isOpen;
            let gesInterval = gesInfo.interval;

            if (gesIsOpen) {
                PublicToast.logMessage('手势密码开启');
                global.storageUtil.getValue('inactiveTime')
                .then((inactiveTime)=>{
                    //对比当前时间与inactive的时间差，然后判断是否需要需要手势密码
                    PublicToast.logMessage('上次退出的时间:'+inactiveTime);
                    let oldDate = new Date(inactiveTime);
                    PublicToast.logMessage('转换后的时间:'+oldDate.getTime());
                    if (inactiveTime) {
                        let divDate = currentDate-oldDate.getTime();
                        PublicToast.logMessage('距上次退出的时间差：'+divDate);
                        let intervalTime = gesInfo.interval;
                        PublicToast.logMessage('设置的间隔时长/分钟:'+intervalTime);
                        
                        var timeDiv = intervalTime*60*1000;
                        // if (intervalTime <30) {
                        //     timeDiv = intervalTime*1000;
                        // };
                        // PublicToast.logMessage('timeDiv:'+timeDiv);
                        if (divDate > timeDiv) { // 1分钟 ＝ 1*60*1000ms
                            //间隔大于设置的时限,显示手势登录
                            PublicToast.logMessage('间隔大于设置的时限,显示手势登录');
                            this.setState({
                                isLoading:false,
                                isLoginInitial:true,
                            })
                            Actions.gestureLogin();
                        }else {
                            PublicToast.logMessage('间隔小于设置的时限,刷新token');
                            this.setState({
                                isLoading:false,
                                isLoginInitial:true,
                            })
                            Actions.tabbar();
                            global.storageUtil.setKeyValue(GlobalSize.Global_IsHomeNow,true)
                            .then(()=>{
                                PublicToast.logMessage('进入app业务区,保存信息成功1');
                            })
                            .catch(()=>{
                                PublicToast.logMessage('进入app业务区,保存信息失败1');
                            })                        
                        }
                    }else {
                        //第一次启动,进入登录页
                        this.setState({
                            isLoading:false,
                            isLoginInitial:true,
                        })
                        Actions.loginIn();

                        return;
                    }
                })
                .catch((error)=>{
                    PublicToast.logMessage('没有找到登录的账号的手势密码缓存数据'+error.message);
                    // 清掉了 inactiveTime, 进入登录页
                    this.setState({
                        isLoading:false,
                        isLoginInitial:true,
                    })
                    Actions.loginIn();
                });
            }else{
                this.setState({
                    isLoading:false,
                    isLoginInitial:true,
                })
                Actions.tabbar();
                global.storageUtil.setKeyValue(GlobalSize.Global_IsHomeNow,true)
                .then(()=>{
                    PublicToast.logMessage('进入app业务区,保存信息成功2');
                })
                .catch(()=>{
                    PublicToast.logMessage('进入app业务区,保存信息失败2');
                })   
            }
        }else{
            this.setState({
                isLoading:false,
                isLoginInitial:true,
            })
            Actions.tabbar();
            global.storageUtil.setKeyValue(GlobalSize.Global_IsHomeNow,true)
            .then(()=>{
                PublicToast.logMessage('进入app业务区,保存信息成功3');
            })
            .catch(()=>{
                PublicToast.logMessage('进入app业务区,保存信息失败4');
            })   
        }
    }
    /* 
        验证手势的逻辑 
        -- 间隔小于10小时,进入preVerifyGesInfo，只刷新token 
        -- 时间间隔在10小时－14天，可以在验证手势时来刷新token
        -- 时间超过14天，去登录
    */
    verifyNextStepWithGesInfoAndTokenInfo = () => {
        if (!_tokenInfo) {
            this.setState({
                isLoading:false,
                isLoginInitial:true,
            })
            return;
        };

        let gesInfo = _gesInfo;
        let tokenInfo = _tokenInfo;

        let tokenExpireTime = tokenInfo.expiresTime;
        let tokenExpiresIn = tokenInfo.expiresIn || 10;
        let timeLastLogin = new Date(tokenInfo.loginTime).getTime();
        let currentDate = new Date().getTime();
        let divTokenTime = currentDate-timeLastLogin;

        let expireDays = 14;
        // 测试代码
        // expireDays = 30;
        // expireDays = expireDays/60/60/24;
        // tokenExpiresIn = 20/60/60;
        // PublicToast.logMessage('divTokenTime='+divTokenTime+'-'+expireDays*((60*1000)*60)*24+'-'+'--'+tokenExpiresIn*((60*1000)*60))
        if (divTokenTime>expireDays*((60*1000)*60)*24) {
            //超过14天，登录
            PublicToast.logMessage('时间超过14天');
            this.setState({
                isLoading:false,
                isLoginInitial:true,
            })
            Actions.loginIn();
        }else if(divTokenTime>tokenExpiresIn*((60*1000)*60)){
            PublicToast.logMessage('时间间隔在10小时－14天');
            RefreshToken.refreshToken();
            this.verifyGesInfo(gesInfo, currentDate);
        }else{
            //刷新 token,不带提示
            PublicToast.logMessage('间隔小于10小时，只刷新token')
            RefreshToken.refreshToken(true);

            this.verifyGesInfo(gesInfo, currentDate);
        }
    }
    saveAppBackgroundTime=()=>{
        let currentDate = new Date();
        global.storageUtil.getValue(GlobalSize.Global_IsHomeNow)
        .then((isHomeNow)=>{
            PublicToast.logMessage('退出app业务区,获取Global_IsHomeNow信息成功8');
            //在业务页退出app，存储退出时间
            global.storageUtil.setKeyValue('inactiveTime',currentDate.getTime())
            .then(()=>{
                PublicToast.logMessage('进入后台的时间是:'+currentDate.getTime());
            }).catch((error)=>{
                PublicToast.logMessage('进入后台时间存储失败:'+error.message);
            })

        })
        .catch(()=>{
            //在非业务页（登录页或手势设置和认证页）退出app，不存储退出时间
            PublicToast.logMessage('退出app业务区,获取Global_IsHomeNow信息失败8');
        })

    }
    render() {
        if (this.state.isLoading == true) {
            return(
                <View style={{flex:1,backgroundColor:'white'}}>
                    <LoadingDialog ref={'loading'} />
                </View>
            )
        }else {
            return (
                <Router createReducer={reducerCreate} getSceneStyle={getSceneStyle} /*backAndroidHandler={this._backAndroidHandler}*/ onBackAndroid={this._onBackAndroid} onExitApp={this._onExitApp}>
                    <Scene key="modal" component={Modal}>
                        <Scene key="root" hideNavBar={true}>
                            <Scene key='initialRoot' component={InitialRoot}/>
                            <Scene key='loginIn' type='reset' initial={this.state.isLoginInitial} component={Login}/>
                            <Scene key='gestureLogin' type='reset' initial={this.state.isGesLoginInitial} component={GestureLogin}/>
                            <Scene key='setGesturePwd' component={SetGesturePwd}/>
                            {require('./Page/Scenes')}
                        </Scene>
                        <Scene key="error" component={ErrorContainer} hideNavBar={true}/>
                    </Scene>
                </Router>
            );
        }
    }
}
