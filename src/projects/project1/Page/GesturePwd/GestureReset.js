
import React,{Component} from 'react'
import {
    View,
    Text,
    AppRegistry,
    StyleSheet,
    TouchableOpacity
}from 'react-native'

import { Actions } from 'react-native-router-flux';

// 引入公用路径导航
import {
    commonPath,
    componentsPath,
    containersPath,
    resourcePath,
    //--- Business Path ---
    GlobalPath,
} from '../../PathIndex' // Page 目录的上个目录, 层级深度:2

/* import from .. 似乎不支持字符串表达式。。require()也是
import BaseContainer from containersPath(2) + '/BaseContainer';
import GlobalSize from GlobalPath(2) + '/GlobalSize';
import PublicToast from componentsPath(2) + '/PublicToast';
*/
import BaseContainer from '../../../../containers/BaseContainer';
import GlobalSize from '../../Global/GlobalSize';
import PublicToast from '../../../../components/PublicToast';

var PasswordGesture = require('react-native-gesture-password');
let maxTry = 3;
var numTry=0;
/*old输入原密码,new输入新密码,renew再次输入新密码*/
var resetState='old';
var newPassword = '';
var globalGesInfo = {};
var globalUserName = {};
export default class GestureLogin extends BaseContainer{
    constructor(props){
        super(props);
        resetState='old';
        newPassword='';
        numTry=0;
        
        this.state={
            message: '请输入原手势密码',
            status: 'normal'
        }
        globalGesInfo = props.globalGesInfo;//原手势信息
        globalUserName = props.globalUserName;
        
        global.storageUtil.getAllDataForKey(this.props.globalUserName)
        .then((objDatas)=>{
            globalGesInfo = objDatas[0];
            PublicToast.logMessage('interval手势密码信息:'+globalGesInfo.password+globalGesInfo.interval);
            this.setState({
                interval:globalGesInfo.interval,
            })
        });
        // PublicToast.logMessage('修改手势密码-原始信息:',global.gesInfo);
    }
    defaultNavigationTitle()
    {
        return {
            title: "修改手势密码",
            tintColor: this.defaultTintColor()
        };
    }
    onEnd=(password)=>{

        if (password.length<4) {
            this.setState({
                status: 'wrong',
                message: '最少连接四个点，请重新输入',
            });
            return;
        }
        PublicToast.logMessage('绘制密码:'+password);
        if (resetState=='old') {
            if (password == globalGesInfo.password) {
                PublicToast.logMessage('密码绘制正确');
                resetState='new';
                this.setState({
                    status: 'right',
                    message: '绘制新的解锁图案'
                });
            }else {
                numTry++;
                let numLeft = maxTry-numTry;
                PublicToast.logMessage('已经输入'+numLeft+'次');
                if (numLeft>0) {
                    this.setState({
                        status: 'wrong',
                        message: '密码错了，还可输入'+numLeft+'次',
                    });
                }else {
                    numTry=0;
                    //重新进入登录页
                    this.onForgetPwd();
                }
            }

        }else if (resetState == 'new') {
            resetState = 'renew';
            newPassword = password;
            this.setState({
                status: 'normal',
                message: '再次绘制解锁图案'
            });
        }else {
            if (password == newPassword) {
                let newInfo = {
                    isOpen:true,
                    password:newPassword,
                    interval:globalGesInfo.interval,
                }
                PublicToast.logMessage('重设成功');
                global.storageUtil.setKeyIdValue(globalUserName,GlobalSize.Global_GesPwdInfo,newInfo)
                .then(()=>{
                    PublicToast.logMessage('成功在账号'+globalUserName+'下缓存手势数据:',newInfo);
                })
                .catch(()=>{
                    PublicToast.logMessage('在'+globalUserName+'下缓存手势数据失败');
                })
                this.props.updateAction();
                Actions.pop();
            } else {
                this.setState({
                    status: 'wrong',
                    message: '与上一次绘制不一致，请重新绘制'
                });
            }
        }
    }
    onStart=()=>{
    }
    onReset=()=>{

    }
    onResetPassword=()=>{
        resetState = 'new';

        this.setState({
            status: 'normal',
            message: '绘制新的解锁图案',
        });
    }
    onForgetPwd=()=>{
        global.storageUtil.setKeyValue(GlobalSize.Global_shouldShowSetGesPwdPage,true);
        Actions.loginIn();
    }
    childrenCom=()=>{
        if (resetState == 'old') {
            return(
                <TouchableOpacity onPress={()=>this.onForgetPwd()} style={{position:'absolute',flex:1,top:GlobalSize.DeviceHeight-70,right:GlobalSize.DeviceWidth/2-50,height:40}}>
                    <View style={{alignItems:'center',justifyContent:'center'}}>
                        <Text style={{width:100,color:'white',fontSize:15,textAlign:'center'}} >重新登录</Text>
                    </View>
                </TouchableOpacity>
            );
        }else if(resetState == 'renew'){
            return(
                <TouchableOpacity onPress={()=>this.onResetPassword()} style={{position:'absolute',flex:1,top:GlobalSize.DeviceHeight-70,right:GlobalSize.DeviceWidth/2-50,height:40}}>
                    <View style={{alignItems:'center',justifyContent:'center'}}>
                        <Text style={{width:100,color:'white',fontSize:15,textAlign:'center'}} >重设</Text>
                    </View>
                </TouchableOpacity>
            );
        }else {
            return(
                <View></View>
            );
        }
    }
    render() {
        return (
            <PasswordGesture
                ref='pg'
                status={this.state.status}
                message={this.state.message}
                interval={5}
                onStart={() => this.onStart()}
                onEnd={(password) => this.onEnd(password)}
                onReset={()=>this.onReset()}
                >
                {this.defaultRenderNavigationBar() }
                {this.childrenCom()}
            </PasswordGesture>
        );
    }
}
