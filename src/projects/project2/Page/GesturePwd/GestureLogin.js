// var React = require('react');
// var {
//     AppRegistry,
//     } = require('react-native');

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
    BusinessUtilPath,
    BusinessComponentPath,
} from '../../PathIndex' // Page 目录的上个目录, 层级深度:2

/* import from .. 似乎不支持字符串表达式。。require()也是
import BaseContainer from containersPath(2) + '/BaseContainer'
import GlobalSize from GlobalPath(2) + '/GlobalSize'
import RefreshToken from BusinessUtilPath(2) + '/RefreshToken'
import LoadingDialog from componentsPath(2) + '/customComponents/GJSProgressHUD'
import PublicToast from componentsPath(2) + '/PublicToast'
*/

import BaseContainer from '../../../../containers/BaseContainer'
import GlobalSize from '../../Global/GlobalSize'
import RefreshToken from '../../BusinessUtil/RefreshToken'
import LoadingDialog from '../../../../components/customComponents/GJSProgressHUD'
import PublicToast from '../../../../components/PublicToast'

var PasswordGesture = require('react-native-gesture-password');
var globalPassword = '';//缓存密码
var numTry=0;
let maxTry = 3;
export default class GestureLogin extends BaseContainer{
    constructor(props){
        super(props);
        this.state={
            message: '请输入手势密码',
            status: 'normal',
        }
        numTry = 0;
    }
    defaultNavigationTitle()
    {
        return {
            title: "输入手势密码",
            tintColor: this.defaultTintColor()
        };
    }
    defaultRenderNavigationBarLeftButton(){
        return(
            <View></View>
        )
    }
    componentDidMount(){
        this.refs.loading.show();
        global.storageUtil.getValue(GlobalSize.Global_UserName)
        .then((userName)=>{
            global.storageUtil.getAllDataForKey(userName)
            .then((objDatas)=>{
                globalPassword = objDatas[0].password;
                this.refs.loading.dismiss();
            })
            .catch(()=>{
                this.refs.loading.dismiss();
                Actions.loginIn();
                // PublicToast.showMessage('GestureLogin:手势密码数据错误，请登录重置');
            })
        })
        .catch(()=>{
            // PublicToast.showMessage('用户缓存数据错误，请登录重置');
            this.refs.loading.dismiss();
            Actions.loginIn();
        })
    }
    onEnd=(password)=>{

        if (password == globalPassword) {
            this.setState({
                status: 'right',
                message: '密码正确'
            });
            //手势登录成功，则刷新token
            this.refs.loading.show();
            RefreshToken.refreshToken(true, ()=>{
                this.refs.loading.dismiss();
                Actions.tabbar();

                global.storageUtil.setKeyValue(GlobalSize.Global_IsHomeNow,true)
                .then(()=>{
                    PublicToast.logMessage('进入app业务区,保存信息成功5');
                })
                .catch(()=>{
                    PublicToast.logMessage('进入app业务区,保存信息失败5');
                })
            });
            
        } else {
            numTry++;
            let numLeft = maxTry-numTry;
            if (numLeft>0) {
                this.setState({
                    status: 'wrong',
                    message: '密码错误，还可输入'+numLeft+'次',
                });
            }else {
                this.onForgetPwd();
            }
        }
    }
    onStart=()=>{
    }
    onReset=()=>{
    }
    onForgetPwd=()=>{
        // console.log('忘记密码');
        PublicToast.showMessage('忘记手势密码,请重新登录');
        global.storageUtil.setKeyValue(GlobalSize.Global_shouldShowSetGesPwdPage,true);

        Actions.loginIn();
        
        global.storageUtil.getValue(GlobalSize.Global_UserName)
            .then((curUserName)=>{
                global.storageUtil.removeKey(curUserName,GlobalSize.Global_GesPwdInfo, null, // id null
                    (error, result) => {
                        if (error) {
                            PublicToast.logMessage('清除 Global_GesPwdInfo 失败');
                        } else {
                            if (result) {
                                PublicToast.logMessage('清除 Global_GesPwdInfo 成功');
                            }else {
                                PublicToast.logMessage('清除 Global_GesPwdInfo 失败');
                            }
                        }
                });
            })
            .catch(()=>{
            })
    }
    childrenCom=()=>{
        // console.log('重新登录');
        return(
            <TouchableOpacity onPress={()=>this.onForgetPwd()} style={{position:'absolute',flex:1,top:GlobalSize.DeviceHeight-70,right:GlobalSize.DeviceWidth/2-50,height:40}}>
                <View style={{alignItems:'center',justifyContent:'center'}}>
                    <Text style={{width:100,color:'white',fontSize:15,textAlign:'center'}} >忘记密码</Text>
                </View>
            </TouchableOpacity>
        );
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
                <LoadingDialog ref={'loading'} text={'正在加载...'}/>
            </PasswordGesture>
        );
    }
}
