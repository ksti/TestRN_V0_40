import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    ScrollView,
    TouchableOpacity,
    Button,
} from 'react-native';

import { Actions } from 'react-native-router-flux';

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
import BaseContainer from containersPath(2) + '/BaseContainer'
import GlobalSize from GlobalPath(2) + '/GlobalSize'
import PublicToast from componentsPath(2) + '/PublicToast'
import LoadingDialog from componentsPath(2) + '/customComponents/GJSProgressHUD'
import globalStorageUtil from commonPath(2) + '/GlobalStorageUtil'
import RefreshToken from BusinessUtilPath(2) + '/RefreshToken'
import httpRequest from commonPath(2) + '/HTTPRequest'
*/
import BaseContainer from '../../../../containers/BaseContainer'
import GlobalSize from '../../Global/GlobalSize'
import PublicToast from '../../../../components/PublicToast'
import LoadingDialog from '../../../../components/customComponents/GJSProgressHUD'
import globalStorageUtil from '../../../../common/GlobalStorageUtil'
import RefreshToken from '../../BusinessUtil/RefreshToken'
import httpRequest from '../../../../common/HTTPRequest'

let HTTPRequest = new httpRequest();

var globalGesInfo = {};
var globalUserName = '';
export default class ProfileSetPage extends BaseContainer {
    constructor(props){
        super(props);
        this.state ={
            isOpenGesPwd:true,//默认开启
            userimgurl: null,
            userInfo:props.userInfo,
        }
    }
    defaultNavigationTitle(){
        return {
            title: "个人设置",
            tintColor: this.defaultTintColor()
        };
    }
    componentDidMount(){
        PublicToast.logMessage('将要显示？');
        this.updateAction();
        this.fetchUserImage();
        if (!(this.props.userInfo && this.props.userInfo.property)) {
            
            this.onFetchUserInfo();
        }
    }
    componentDidUpdate(){
        PublicToast.logMessage('将要更新？');
    }
    //刷新数据
    updateAction=()=>{
        this.refs.loading.show();
        global.storageUtil.getValue(GlobalSize.Global_UserName)
        .then((userName)=>{
            globalUserName=userName;
            global.storageUtil.getAllDataForKey(userName)
            .then((objDatas)=>{
                globalPassword = objDatas[0].password;
                globalGesInfo = objDatas[0];
                console.log('手势密码信息:'+globalGesInfo.isOpen+globalGesInfo.password+globalGesInfo.interval);
                this.setState({
                    isOpenGesPwd:globalGesInfo.isOpen,
                })
                this.refs.loading.dismiss();
            })
            .catch(()=>{
                PublicToast.logMessage('手势密码数据错误，关闭手势');
                this.refs.loading.dismiss();
                this.setState({
                    isOpenGesPwd:globalGesInfo.isOpen,
                })
            })
        })
        .catch(()=>{
            this.refs.loading.dismiss();
            this.setState({
                isOpenGesPwd:false,
            })
        })
    }
    onCancelOpen=(isCancelOpen)=>{
    PublicToast.logMessage('onCancelOpen调用'+isCancelOpen);
        if (isCancelOpen==true) {
            //关闭
            PublicToast.logMessage('---------cancelOpen');
            let newInfo = {
                isOpen:false,
                password:'',
                interval:'',
            }
            global.storageUtil.setKeyIdValue(globalUserName,GlobalSize.Global_GesPwdInfo,newInfo)
            .then(()=>{
                    gesturePwd = newInfo;
                    PublicToast.logMessage('关闭手势:'+gesturePwd.isOpen+gesturePwd.password+' '+gesturePwd.interval);
                    this.setState({
                        isOpenGesPwd:false,
                    })
            })
            .catch(()=>{
                PublicToast.logMessage('手势关闭失败');
            })
        }else{
            //开启
            PublicToast.logMessage('--------Open');
            
            this.setState({
                isOpenGesPwd:true,
            })
        }
        
    }
    onChangeOpenPwd=()=>{
        // PublicToast.logMessage(this.state.isOpenGesPwd==true?'关闭手势密码':'关闭手势密码');
        let isOpen = !this.state.isOpenGesPwd;
        //开启
        if (isOpen == true) {
            Actions.setGesturePwd({
                userName:globalUserName,
                onCancelOpen:(isCancel)=>this.onCancelOpen(isCancel),
            });
            return;
        };
        //关闭
        let newInfo = {
            isOpen:isOpen,
            password:'',//不管是开启还是关闭，这里密码都设置初始值空
            interval:globalGesInfo.interval,//初始值20分钟
        }
        global.storageUtil.setKeyIdValue(globalUserName,GlobalSize.Global_GesPwdInfo,newInfo)
        .then(()=>{
            gesturePwd = newInfo;
            PublicToast.logMessage('开/关缓存:'+newInfo.isOpen+newInfo.password+' '+newInfo.interval);
            if (newInfo.isOpen == true) {
                this.setState({
                    isOpenGesPwd:true,
                })
                Actions.setGesturePwd({
                    userName:globalUserName,
                    onCancelOpen:()=>this.onCancelOpen(),
                });
            }else {
                this.setState({
                    isOpenGesPwd:false,
                })
            }
        }).catch(()=>{
            if (newInfo.isOpen == true) {
                PublicToast.showMessage('手势开启失败,请稍后重试');
            }else {
                PublicToast.showMessage('手势关闭失败,请稍后重试');
            }
        });
    }

    _clear = () => {
        this._clearTokenInfo();
        this._clearProjAccept();
        this._clearBaseAppCache();
    }

    // 清除TokenInfo
    _clearTokenInfo = () => {
        globalStorageUtil.removeKey(GlobalSize.Global_TokenInfo, null, // id null
            (error, result) => {
                if (error) {
                    console.log('error: --> ' + error.message);
                    PublicToast.logMessage('清除 TokenInfo 失败');
                } else {
                    if (result) {
                        PublicToast.logMessage('清除 TokenInfo 成功');
                    }else {
                        PublicToast.logMessage('清除 TokenInfo 失败');
                    }
                }
        });
    }

    // 清除工程验收下的一些存储数据
    _clearProjAccept = () => {
        global.projAcceptSelectTenderInfo = undefined;
        globalStorageUtil.clearMap(GlobalSize.Global_ProjAccept, // id null
            (error, result) => {
                if (error) {
                    console.log('error: --> ' + error.message);
                    PublicToast.logMessage('清除 工程验收 失败');
                } else {
                    if (result) {
                        PublicToast.logMessage('清除 工程验收 成功');
                    }else {
                        PublicToast.logMessage('清除 工程验收 失败');
                    }
                }
        });
    }
    //清除底层框架的某些缓存数据
    _clearBaseAppCache = () =>{
        globalStorageUtil.removeKey(GlobalSize.Global_IsHomeNow, null,(error, result) => {
            if (error) {
                PublicToast.logMessage('退出app业务区,删除Global_IsHomeNow信息失败88'+result);
            } else {
                PublicToast.logMessage('退出app业务区,删除Global_IsHomeNow信息成功8');
            }
        });
    }
    //退出登录
    onLoginOut=()=>{
        global.accessToken = null; // 清除 accessToken 信息
        global.refreshToken = null; // 清除 refreshToken 信息
        global.expiresIn = null; // 清除 expiresIn 信息
        global.expiresTime = null; // 清除 expiresTime 信息
        global.tokenType = null; // 清除 tokenType 信息
        this._clear(); // 清除一些本地存储的数据

        Actions.loginIn();
    }
    onResetGesPwd=()=>{
            Actions.gestureReset({
                globalUserName:globalUserName,
                globalGesInfo:globalGesInfo,
                updateAction:this.updateAction,
            });
    }
    onSetValidTime=()=>{
            Actions.setValidTime({
                userName:globalUserName,
                gestureInfo:globalGesInfo,
                // updateAction:this.updateAction,
            });
    }
    onRenderGestureItems=()=>{
        if (this.state.isOpenGesPwd) {
            return(
                <View style={{flex:1,height:80}}>
                    <View style={styles.splitLine}></View>
                    <TouchableOpacity onPress={()=>this.onResetGesPwd()} style={styles.itemList}>
                        <View style={{flex:1,flexDirection:'row'}}>
                            <Text style={[styles.itemInnerLeft]} >修改手势密码</Text>
                            <View style={{flex:1}}></View>
                            <Image style={{width:20,height:20}}
                                source={require('../../resource/images/App/ic_right_line.png')}>
                            </Image>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.splitLine}></View>
                    <TouchableOpacity onPress={()=>this.onSetValidTime()} style={styles.itemList}>
                        <View style={{flex:1,flexDirection:'row'}}>
                            <Text style={{fontSize: GlobalSize.fontSizeTitle,color: GlobalSize.colorBlackText,}} >设置手势登录有效时长</Text>
                            <View style={{flex:1}}></View>
                            <Image style={{width:20,height:20}}
                                source={require('../../resource/images/App/ic_right_line.png')}>
                            </Image>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.splitLine}></View>
                </View>
            )
        }else {
            return(
                <View style={styles.splitLine}></View>
            )
        }
    }
    render(){
        var userName='';
        var account = '';
        var department = '   ';
        var email = '';
        var phone = '';
        if (typeof(this.state.userInfo)!='undefined' && typeof(this.state.userInfo.property) != 'undefined') {
            userName = this.state.userInfo.displayName;
            account = this.state.userInfo.property.logoN_NAME;
            department =this.state.userInfo.department?this.props.userInfo.department:'  ';
            email = this.state.userInfo.property.e_mail;
            phone = this.state.userInfo.property.mp;
        };
        let source = this.state.userimgurl ? {uri:this.state.userimgurl} : require('../../resource/images/App/wode2.png');
        PublicToast.logMessage('soruce:'+source);
        return (
            <View style={styles.container}>
                {this.defaultRenderNavigationBar()}
                <ScrollView >
                    <View style={{backgroundColor:'white'}}>
                        <View
                            style={{
                                flex: 1, 
                                height: 120,
                                marginTop:15,
                                flexDirection: 'column', 
                                alignItems: 'center'
                            }}
                        >
                            <Image 
                                defaultSource={require('../../resource/images/App/wode2.png')}
                                style={[styles.headImg]}
                                source={this.state.userimgurl?{uri:this.state.userimgurl}:require('../../resource/images/App/wode2.png')}></Image>
                        </View>
                        <View style={styles.itemListFirst}>
                            <Text style={styles.itemInnerLeft} >姓名</Text>
                            <Text style={styles.itemInnerRight} >{userName}</Text>
                        </View>
                        <View style={styles.splitLine}>
                        </View>
                        <View style={styles.itemList}>
                            <Text style={styles.itemInnerLeft} >账号信息</Text>
                            <Text style={styles.itemInnerRight} >{account}</Text>
                        </View>

                        <View style={styles.splitLine}></View>

                        <View style={styles.itemListFlex}>
                            <Text style={styles.itemInnerLeft} >部门</Text>
                            <Text style={[styles.itemInnerRight, {paddingTop:12, paddingBottom:12, }]}>{department}</Text>
                        </View>

                        <View style={styles.splitLine}></View>
                        <View style={styles.itemListFlex}>
                            <Text style={styles.itemInnerLeft} >邮箱</Text>
                            <Text style={[styles.itemInnerRight, {paddingTop:12, paddingBottom:12, }]} >{email}</Text>
                        </View>

                        <View style={styles.splitLine}></View>

                        <View style={styles.itemList}>
                            <Text style={styles.itemInnerLeft} >手机</Text>
                            <Text style={styles.itemInnerRight} >{phone}</Text>
                        </View>
                        <View style={styles.splitLine}></View>
                        <TouchableOpacity onPress={()=>this.onChangeOpenPwd()} style={styles.itemList}>
                            <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                                <Text style={styles.itemInnerLeft} >手势密码</Text>
                                <View style={{flex:1}}></View>
                                <Image style={{width:50,height:30}}
                                    source={this.state.isOpenGesPwd?require('../../resource/images/App/ic_switch_ges_on.png'):require('../../resource/images/App/ic_switch_ges_off.png')}>
                                </Image>
                            </View>
                        </TouchableOpacity>
                        {this.onRenderGestureItems()}
                        
                    </View>
                    <TouchableOpacity
                            onPress={() => this.onLoginOut()}
                            activeOpacity={0.8} >
                            <View style={styles.btnContainer}>
                                <Text style={{ color: 'white',fontSize: GlobalSize.fontSizeTitle}} >退出登录</Text>
                            </View>
                        </TouchableOpacity>
                </ScrollView>
                <LoadingDialog ref={'loading'} text={'正在加载...'}/>
            </View>
        );
    }
    onFetchUserInfo=()=>{
        if (global.userInfo && global.userInfo.id) {
            this.setState({
                name: global.userInfo.displayName,
                email: global.userInfo.property.e_mail,
                userInfo: Object.assign({}, this.state.userInfo, global.userInfo),
            });
        }else {
            RefreshToken.onFetchUserInfo((isSuccess,result)=>{
                if (isSuccess) {
                    PublicToast.logMessage('用户信息请求成功:'+result.id);
                    this.setState({
                        userInfo: result,
                    });
                }else {
                    PublicToast.showMessage('用户信息请求失败');
                }
            });
        }
    }
    fetchUserImage=()=>{
        HTTPRequest.requestGetWithUrl(GlobalSize.ProductURL+"yuanxinApi/Employee/LoadEmployee", [],
            function (error, responseData,response) {
                if (error) {
                    PublicToast.logMessage('error' + error.message);
                    PublicToast.showMessage('请求数据失败');
                    if (response &&response.status == 401) {
                       RefreshToken.refreshToken();
                   }
                } else {
                    if (responseData) {
                        var userInfo = this.state.userInfo;
                        userInfo['photo']=responseData.file;
                        this.setState({
                            userimgurl: responseData.file,
                            userInfo:userInfo,
                        });
                    } else {
                        PublicToast.showMessage('请求数据失败');
                    }
                }

            }.bind(this));
    }
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: GlobalSize.colorBgGray,
    },
    headImg:{
        width: 120,
        height: 120,
        resizeMode: Image.resizeMode.contain,
        // backgroundColor: 'red'
    },

    itemListFirst:{
        paddingLeft: 10,
        paddingRight:10,
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
    },
    itemList:{
        paddingLeft: 10,
        paddingRight:10,
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
    },
    itemListFlex:{
        paddingLeft: 10,
        paddingRight:10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    splitLine:{
        flex: 1,
        height: 1,
        backgroundColor: GlobalSize.colorBorderGray,
    },
    itemInnerLeft:{
        flex: 1,
        fontSize: GlobalSize.fontSizeTitle,
        color: GlobalSize.colorBlackText,
    },
    itemInnerRight:{
        flex: 2,
        fontSize: GlobalSize.fontSizeTitle,
        color: GlobalSize.colorBlackText,
    },
    btnContainer:{
        backgroundColor: GlobalSize.colorRedButton,
        flex: 1,
        height: 40,
        borderRadius: 8,
        marginLeft:GlobalSize.cellPadding,
        marginRight:GlobalSize.cellPadding,
        marginTop: 15,
        marginBottom:30,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
