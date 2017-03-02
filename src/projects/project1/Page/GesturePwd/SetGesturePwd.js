
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
import BaseContainer from containersPath(2) + '/BaseContainer'
import GlobalSize from GlobalPath(2) + '/GlobalSize'
import PublicToast from componentsPath(2) + '/PublicToast'
*/
import BaseContainer from '../../../../containers/BaseContainer'
import GlobalSize from '../../Global/GlobalSize'
import PublicToast from '../../../../components/PublicToast'

const PasswordGesture = require('react-native-gesture-password');
var gesturePwd = ''; //新手势密码
var isVerify=false;//是否是重复验证密码阶段
export default class SetGesturePwd extends BaseContainer{
    constructor(props){
        super(props);
        this.state={
            message: '绘制解锁图案',
            status: 'normal',
            isDoneSet:false,
        }
        isVerify=false;
        gesturePwd = '';
    }
    defaultNavigationTitle()
    {
        return {
            title: "设置手势密码",
            tintColor: this.defaultTintColor()
        };
    }
    componentWillUnmount(){
        this.cancelOpenGesture();
    }
    cancelOpenGesture=()=>{
        if (this.props.onCancelOpen){
            PublicToast.logMessage('取消设置手势密码:'+this.state.isDoneSet);
            this.props.onCancelOpen(!this.state.isDoneSet);
        }
    }
    onEnd=(password)=>{
        if (password.length<4) {
            PublicToast.logMessage('密码少于4位');
            this.setState({
                status: 'wrong',
                message: '最少连接四个点，请重新输入',
            });
            return;
        }
        if (isVerify == false) {
            PublicToast.logMessage('初次绘制密码:'+password);
            isVerify = true;
            gesturePwd = password;
            this.setState({
                status: 'normal',
                message: '再次绘制解锁图案'
            });
        }else if (isVerify==true && password == gesturePwd) {
            PublicToast.logMessage('重复绘制密码成功:'+password);
            this.setState({
                isDoneSet:true,
            })
            let newInfo = {
                isOpen:true,
                password:gesturePwd,
                interval:20,//默认20分钟
            };
            global.storageUtil.getValue(GlobalSize.Global_UserName)
            .then((curUserName)=>{
                global.storageUtil.setKeyIdValue(curUserName,GlobalSize.Global_GesPwdInfo,newInfo)
                .then(()=>{
                    // global.gesInfo =newInfo;
                    PublicToast.logMessage('set手势缓存:'+newInfo.isOpen+newInfo.password+' '+newInfo.interval);
                    if (this.props.onCancelOpen) {
                        Actions.pop();
                    }else {
                        Actions.tabbar();
                        global.storageUtil.setKeyValue(GlobalSize.Global_IsHomeNow,true)
                        .then(()=>{
                            PublicToast.logMessage('进入app业务区,保存信息成功6');
                        })
                        .catch(()=>{
                            PublicToast.logMessage('进入app业务区,保存信息失败6');
                        })
                    }
                }).catch(()=>{
                    PublicToast.showMessage('设置手势密码失败,请重试');
                    this.onResetPwd();
                })
            })
            .catch(()=>{
                PublicToast.logMessage('获取用户信息失败');
                Actions.pop();
            })
        } else{
            PublicToast.logMessage('重复绘制密码失败:'+password);
            this.setState({
                status: 'wrong',
                message: '与上一次绘制不一致，请重新绘制'
            });
        }
    }
    onStart=()=>{
    }
    //跳过设置密码＝不设置手势密码
    onCloseGesVerify=()=>{
        if (this.props.onCancelOpen) {
            //回到个人设置页
            Actions.pop();
        }else {
            //关闭手势密码,直接进入首页
            let pwdInfo = {
                isOpen:false,
                password:'',
                interval:'',
            }
            PublicToast.logMessage('userName:'+this.props.userName);
            global.storageUtil.setKeyIdValue(this.props.userName,GlobalSize.Global_GesPwdInfo,pwdInfo)
            .then(()=>{
                global.gesInfo = pwdInfo;
                PublicToast.logMessage('关闭手势成功');
            });
            Actions.tabbar();
            global.storageUtil.setKeyValue(GlobalSize.Global_IsHomeNow,true)
            .then(()=>{
                PublicToast.logMessage('进入app业务区,保存信息成功7');
            })
            .catch(()=>{
                PublicToast.logMessage('进入app业务区,保存信息失败7');
            })
        }
    }
    onResetPwd=()=>{
        isVerify = false;
        password = '';
        this.setState({
            status: 'normal',
            message: '绘制解锁图案'
        });
    }
    childrenCom=()=>{
        PublicToast.logMessage('isVerify:'+isVerify?'非验证':'验证');
        if (isVerify == false) {
            return(
                <TouchableOpacity onPress={()=>this.onCloseGesVerify()} style={styles.oneBtnContainer}>
                    <View style={{alignItems:'center',justifyContent:'center'}}>
                        <Text style={{width:100,color:'white',fontSize:15,textAlign:'center'}} >{this.props.onCancelOpen?'取消' :'跳过'}</Text>
                    </View>
                </TouchableOpacity>
            );
        }else {
            return(
                <View style={styles.twoBtnViewContainer}>
                    <TouchableOpacity onPress={()=>this.onCloseGesVerify()} style={styles.btnContainer} >
                        <View style={{justifyContent:'center'}}>
                            <Text style={{textAlign:'center',color:'white'}} >{this.props.onCancelOpen?'取消' :'跳过'}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.onResetPwd()} style={styles.btnContainer}>
                        <View style={{justifyContent:'center'}}>
                            <Text style={{textAlign:'center',color:'white'}} >重设</Text>
                        </View>
                    </TouchableOpacity>
                </View>
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

                >
                {this.defaultRenderNavigationBar() }
                {this.childrenCom()}
            </PasswordGesture>
        );
    }
}

const styles=StyleSheet.create({

    twoBtnViewContainer:{
        position:'absolute',
        flex:1,
        top:GlobalSize.DeviceHeight-70,
        right:10,
        left:10,
        height:40,
        flexDirection:'row',
        justifyContent:'center',
    },
    btnContainer:{
        marginLeft:10,
        marginRight:10,
        flex:1,
    },
    oneBtnContainer:{
        position:'absolute',
        flex:1,
        top:GlobalSize.DeviceHeight-70,
        right:GlobalSize.DeviceWidth/2-50,
        height:40,
    }

})
