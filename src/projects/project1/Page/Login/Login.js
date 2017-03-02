import React,{
    Component
} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    AsyncStorage,
    NetInfo,
}from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';

import Orientation from 'react-native-orientation'

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
} from '../../PathIndex' // Page 目录的上个目录, 层级深度:2

/* import from .. 似乎不支持字符串表达式。。require()也是
import { loginIn } from './reduxDataFlow/actions';
import GlobalSize from GlobalPath(2) + '/GlobalSize'
import BaseContainer from containersPath(2) + '/BaseContainer'
import PublicToast from componentsPath(2) + '/PublicToast'
import LoadingDialog from componentsPath(2) + '/customComponents/GJSProgressHUD'
import RefreshToken from BusinessUtilPath(2) + '/RefreshToken'
import LoginNameUpdateClear from BusinessUtilPath(2) + '/LoginNameUpdateClear'
import globalStorageUtil from commonPath(2) + '/GlobalStorageUtil'
*/

import { loginIn } from './reduxDataFlow/actions';
import GlobalSize from '../../Global/GlobalSize'
import BaseContainer from '../../../../containers/BaseContainer'
import PublicToast from '../../../../components/PublicToast'
import LoadingDialog from '../../../../components/customComponents/GJSProgressHUD'
import RefreshToken from '../../BusinessUtil/RefreshToken'
import LoginNameUpdateClear from '../../BusinessUtil/LoginNameUpdateClear'
import globalStorageUtil from '../../../../common/GlobalStorageUtil'

const dismissKeyboard = require('dismissKeyboard')

var shouldShowSetPage = ''; //默认显示啊
var newAccess_token='';

class Login extends BaseContainer{
    constructor(props){
        super(props);
        this.state={
            username:global.userName?global.userName:'',
            password:'',
            loading:false,
        }
        // NetInfo.isConnected.fetch().done((isConnected) => {
        //     PublicToast.logMessage('Now,App is '+isConnected+ (isConnected ? 'online' : 'offline'));
        //     if (isConnected == false) {
        //         PublicToast.showMessage('未检测到可用的网络');
        //     }
        // });
    }
    componentWillMount() {
        // 只允许竖屏
        Orientation.lockToPortrait();
    }
    componentDidMount(){
        PublicToast.logMessage('Login.js--componentDidMount');
        global.access_token='';
    }
    defaultNavigationTitle(){
      return {
            title:'远薪移动办公',
            tintColor:this.defaultTintColor()
        };
    }
    defaultRenderNavigationBarLeftButton(){
        return <View></View>
    }
    componentWillReceiveProps(nextProps){
        PublicToast.logMessage('willReceiveProps:将要接收到props');
        PublicToast.logMessage('this.props.status'+nextProps.status);

        if (nextProps.status == this.props.status) {
            PublicToast.logMessage('状态没有改变');
            // this.setState({
            //     loading:false,
            // })
            this.refs.loading.dismiss();
            return;
        }else if (nextProps.status == 'doing') {
            // this.setState({
            //     loading:true,
            // })
            this.refs.loading.show();
        }else if(nextProps.status=='done'){

            this.saveLoginInfo(nextProps.userInfo);
        }else{
            // this.setState({
            //     loading:false,
            // })
            this.refs.loading.dismiss();
            PublicToast.logMessage('不知道的status'+nextProps);
        }
    }
    loginRequest=()=>{
        //过滤用户名开头的空格
        var userName = this.state.username.replace(/^\s+|\s+$/g,"");
        if(!userName ||userName.length==0 || !this.state.password ||this.state.password.length==0){
            PublicToast.showMessage('请输入用户名和密码');
            return;
        }
        PublicToast.logMessage('发出登录请求'+userName+';');
        this.setState({
            username:userName,
            password:this.state.password,
        })
        let login={
            username:userName,
            // password:this.state.password,
            grant_type:'password',
        };
        dismissKeyboard();
        this.props.dispatch(loginIn(login));
    }
    saveLoginInfo=(userInfo)=>{
        _userName = this.state.username;
        _this = this;
        global.userInfo = userInfo;
        
        global.access_token = userInfo.access_token;

        RefreshToken.onFetchUserInfo();
        
        //获取本地缓存的用户名，判断是否是切换账号
        global.storageUtil.getValue(GlobalSize.Global_UserName)
        .then((resUserName)=>{
            console.log(resUserName+'-'+_userName+'-'+this.state.username);
            if (resUserName == _userName) {
                PublicToast.logMessage('同一个账号了');
                global.storageUtil.getValue(GlobalSize.Global_shouldShowSetGesPwdPage)
                .then((shouldShow)=>{
                    console.log('要设置密码了'+shouldShow);
                    shouldShowSetPage = shouldShow?'true':'false';
                    this.pushToMain();
                })
                .catch((error)=>{
                    shouldShowSetPage = 'true';
                    this.pushToMain();
                })
            }else {
                PublicToast.logMessage('更换账号');
                shouldShowSetPage = 'false';
                this.saveUserName();
            }
        })
        .catch(()=>{
            PublicToast.logMessage('没又缓存userName');
            shouldShowSetPage = 'true';
            this.saveUserName();
        })

        //获取手势信息
        global.storageUtil.getAllDataForKey(_userName)
        .then((objDatas)=>{
            if (objDatas.length>0) {
                PublicToast.logMessage('成功获取到当前账号下手势信息');
            }else {
                PublicToast.logMessage('没有找到当前账号下的手势信息,建议重新设置');
                shouldShowSetPage = 'true';
            }
            this.pushToMain();
        })
        .catch((error)=>{
            //当前设备上没有手势密码纪录
            PublicToast.logMessage('获取当前账号下手势信息失败');
            shouldShowSetPage = 'true';
            this.pushToMain();
        })

        //如果切换账号，清除数据库所有数据
        LoginNameUpdateClear.clear(this.state.username);
        
        // PublicToast.logMessage('userInfo.accessToken:'+userInfo.access_token);
        // PublicToast.logMessage('global.refreshToken:'+userInfo.refresh_token);
        //保存accessToken信息
        global.storageUtil.setKeyValue(GlobalSize.Global_AccessToken,userInfo.access_token).then((ret) => {
            global.accessToken=userInfo.access_token;
            newAccess_token = userInfo.access_token;
            RefreshToken.onFetchUserInfo((isSuccess,result)=>{
                if (isSuccess) {
                    PublicToast.logMessage('用户信息请求成功:'+result.id);
                }else {
                    PublicToast.showMessage('用户信息请求失败');
                }

                this.pushToMain();
            });
            PublicToast.logMessage('save success: ' + global.accessToken);
        }).catch(error => {
            PublicToast.logMessage('save error: ' + error.message);
            this.pushToMain();
        });

        //保存refreshToken信息
        global.storageUtil.setKeyValue(GlobalSize.Global_RefreshToken,userInfo.refresh_token).then((ret) => {
            global.refreshToken=userInfo.refresh_token;
            PublicToast.logMessage('save success: ' + userInfo.refresh_token);
        }).catch(error => {
            PublicToast.logMessage('save error: ' + error.message);
        });

        // 保存信息 tokenInfo
        let tokenInfo = {};
        // {
        //     GlobalSize.Global_RefreshToken: userInfo.refresh_token,
        //     GlobalSize.Global_AccessToken: userInfo.access_token,
        //     GlobalSize.Global_ExpiresIn: userInfo.expires_in,
        //     GlobalSize.Global_ExpiresTime: userInfo.expires_time,
        //     GlobalSize.Global_TokenType: userInfo.token_type,
        //     GlobalSize.Global_LoginTime: new Date(),
        // }
        tokenInfo[GlobalSize.Global_RefreshToken] = userInfo.refresh_token;
        tokenInfo[GlobalSize.Global_AccessToken] = userInfo.access_token;
        tokenInfo[GlobalSize.Global_ExpiresIn] = userInfo.expires_in;
        tokenInfo[GlobalSize.Global_ExpiresTime] = userInfo.expires_time;
        tokenInfo[GlobalSize.Global_TokenType] = userInfo.token_type;
        tokenInfo[GlobalSize.Global_LoginTime] = new Date().getTime();

        global.accessToken = userInfo.access_token; // 保存 accessToken 信息
        global.refreshToken = userInfo.refresh_token; // 保存 refreshToken 信息
        global.expiresIn = userInfo.expires_in; // 保存 expiresIn 信息
        global.expiresTime = userInfo.expires_time; // 保存 expiresTime 信息
        global.tokenType = userInfo.token_type; // 保存 tokenType 信息
        globalStorageUtil.setKeyValue(GlobalSize.Global_TokenInfo, tokenInfo, (error, result) => {
            if (error) {
                PublicToast.logMessage('save error: ' + error.message);
            } else {
                if (result) {
                    PublicToast.logMessage('save success: ' + result);
                }else {
                    //
                }
            }
        });
    }
    saveUserName=()=>{
        global.storageUtil.setKeyValue(GlobalSize.Global_UserName,this.state.username)
        .then((ret) => {
            global.userName = _userName;
            // PublicToast.logMessage('save success: ' + global.username);
            PublicToast.logMessage('userName存储成功:'+_userName);
        }).catch(error => {
            // PublicToast.logMessage('save error: ' + error.message);
            PublicToast.logMessage('userName存储失败:'+_userName);
        });
        //存储账号信息
        let objAccount = {
            'userName':this.state.username,
            'password':this.state.password,
        }
        
        global.storageUtil.setKeyValue(GlobalSize.Global_AccountInfo,objAccount)
        .then((ret)=>{
            global.accountInfo=objAccount;
        }).catch(error=>{
            PublicToast.logMessage('账号信息存储失败');
        })
    }
    pushToMain=()=>{
        //在更新access_token和确定是否显示设置密码之前，不切换
        if (newAccess_token.length==0 ||shouldShowSetPage.length==0) {
            return;
        };
        global.storageUtil.setKeyValue(GlobalSize.Global_shouldShowSetGesPwdPage,false);
        //如果是第一次登录或从找回密码进入，则去设置手势密码，否则去首页
        if (this.refs.loading) {
            this.refs.loading.dismiss();
        };
        if (shouldShowSetPage == 'true') {
            Actions.setGesturePwd({
                userName:this.state.username,
            });
        }else{
            Actions.tabbar();
            global.storageUtil.setKeyValue(GlobalSize.Global_IsHomeNow,true)
            .then(()=>{
                PublicToast.logMessage('进入app业务区,保存信息成功4');
            })
            .catch(()=>{
                PublicToast.logMessage('进入app业务区,保存信息失败4');
            }) 
        }

    }
    onChangeName(text){
        this.setState({'username': text});
    }
    onChangePswd(text){
        this.setState({'password': text});
    }
    render(){
        return(
            <View style={{flex:1,backgroundColor:GlobalSize.colorBgGray}}>
                {this.defaultRenderNavigationBar() }
                    <View style={styles.loginMainCon}>
                        <View style={styles.loginIconContainer}>
                            <Image style={{width:60,height:60}} source={require('../../resource/images/App/ic_login.png')}></Image>
                        </View>
                        <View style={styles.formStyle}>
                            <View style={[styles.formInput,styles.formInputSplit]}>
                                <Image style={styles.imageIcon} source={require('../../resource/images/App/zhanghu.png')}/>
                                <TextInput
                                    ref="login_name"
                                    placeholder='请输入域账户'
                                    style={[styles.loginInput]}
                                    underlineColorAndroid='transparent'
                                    onChangeText={this.onChangeName.bind(this)}
                                    value={this.state.username}
                                />
                            </View>
                            <View style={styles.formInput}>

                                <Image style={styles.imageIcon} source={require('../../resource/images/App/mima.png')}/>
                                <TextInput
                                    ref="login_psw"
                                    style={styles.loginInput}
                                    underlineColorAndroid='transparent'
                                    secureTextEntry={true}
                                    placeholder='请输入域密码'
                                    onChangeText={this.onChangePswd.bind(this)}
                                    value={this.state.password}
                                    />
                            </View>
                        </View>
                        <TouchableOpacity onPress={()=>this.loginRequest()} activeOpacity={0.8}>
                            <View style={styles.btn}>
                                <Text style={styles.loginBtn1}>登录</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{height:40,bottom:30}}>
                            <Text style={{color:GlobalSize.colorGrayText,textAlign:'center',justifyContent:'center',alignItems:'center'}}>@2016 远薪移动办公</Text>
                    </View>
                    <LoadingDialog ref='loading'/>
            </View>
        );
    }
}

const loginState=(state)=>{
    return{
        status:state.Login.status,
        isLoggedIn:state.Login.isLoggedIn,
        userInfo:state.Login.userInfo,
        loginState:state.Login,
    }
}
export default Login = connect(loginState)(Login);

var styles = StyleSheet.create({
    loginMainCon: {
        marginTop: GlobalSize.cellPadding,
        height: GlobalSize.DeviceHeight-100,
    },
    formStyle: {
        backgroundColor:'white',
        marginTop: 20,
        height: 80,
        marginLeft:10,
        marginRight:10
    },
    formInput:{
        flexDirection:'row',
        height: 40,
        justifyContent:'center',
        alignItems:'center',
    },
    formInputSplit:{
        borderBottomWidth:1,
        borderBottomColor:GlobalSize.colorBorderGray,
    },
    loginInput: {
        borderColor: 'black',
        paddingLeft: 10,
        paddingRight:10,
        marginRight:10,
        fontSize:15,
        flex: 1,
        color:GlobalSize.colorBlackText,
        backgroundColor:'transparent',
        paddingTop:0,
        paddingBottom:0,
    },
    btn: {
      height:GlobalSize.heightBtnMain,
      justifyContent:'center',
      marginTop:20,
      marginLeft:GlobalSize.cellPadding,
      width: GlobalSize.DeviceWidth-2*GlobalSize.cellPadding,
      backgroundColor: GlobalSize.colorRedButton,
      borderRadius:5,
    },
    loginBtn1: {
        textAlign: 'center',
        color:'white',
        fontSize:GlobalSize.fontSizeTitle,
    },
    loginIconContainer:{
        justifyContent:'center',
        alignItems:'center',
        height:100,
    },
    imageIcon:{
        width:15,
        height:20,
        // marginTop:5,
        marginLeft:5,
        marginRight:5,
        // marginBottom:5,
    }
})
