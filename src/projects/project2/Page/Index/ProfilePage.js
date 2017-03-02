import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ToastAndroid,
    Navigator,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
    Platform,
    Alert,
    AlertIOS
} from 'react-native';
import {Actions} from 'react-native-router-flux';

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
import httpRequest from commonPath(2) + '/HTTPRequest'
import GlobalSize from GlobalPath(2) + '/GlobalSize';
import PublicToast from componentsPath(2) + '/PublicToast'
import DBStorage from commonPath(2) + '/DBStorage'
*/
import BaseContainer from '../../../../containers/BaseContainer'
import httpRequest from '../../../../common/HTTPRequest'
import GlobalSize from '../../Global/GlobalSize';
import PublicToast from '../../../../components/PublicToast'
import DBStorage from '../../../../common/DBStorage'

let HTTPRequest = new httpRequest();
let versionNum='V2.0.1';
export default class ProfilePage extends BaseContainer {
    constructor(props) {
        super(props);
        this.state = {
            userimgurl: null,
            name: 'GJS',
            email: '1353990812@qq.com',
            userInfo:{},
        }
    }
    componentDidMount() {
    }
    //标题
    defaultNavigationTitle() {
        return {
            title: "我",
            tintColor: this.defaultTintColor()
        };
    }
    defaultRenderNavigationBarLeftButton() {
        return <View></View>
    }
    onEnterSettingPage=()=>{
        Actions.profileSet({
            title:'个人设置',
            userInfo:this.state.userInfo,
        })
    }
    onEnterAboutApp=()=>{
        Actions.aboutAppPage({versionNum:versionNum});
    }
    render() {
        let source = this.state.userimgurl ? {uri:this.state.userimgurl} : require('../../resource/images/App/wode2.png');
        return (
            <View style={{flex:1,backgroundColor:GlobalSize.colorBgGray}}>
                {this.defaultRenderNavigationBar()}
                <ScrollView showsVerticalScrollIndicator={true}
                            contentContainerStyle={styles.contentContainer}>
                    <View style={styles.container}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 1}}>
                                <View style={{ backgroundColor:'white',height:120 ,flexDirection: 'row'}}>
                                    <View style={{justifyContent: 'center',marginLeft:20,width:80}}>
                                        <Image 
                                            defaultSource={require('../../resource/images/App/wode2.png')}
                                            source={source}
                                            style={{width:80,height:80,resizeMode:'cover', alignSelf:'center',justifyContent: 'center',backgroundColor:'white'}}/>
                                    </View>
                                    <View style={{justifyContent: 'center',marginLeft:20}}>
                                        <View style={{height: 80}}>
                                            <Text style={{color: GlobalSize.colorBlackText, fontSize: GlobalSize.fontSizeTitle, textAlign: 'left', marginTop: 4, width: GlobalSize.DeviceWidth-120-10}}>{
                                                this.state.name
                                            }</Text>
                                            <View style={{flex: 1}}/>
                                            <Text style={{color: GlobalSize.colorBlackText, fontSize: GlobalSize.fontSizeTitle, textAlign: 'left', marginBottom: 4, marginRight: 10, width: GlobalSize.DeviceWidth-120-10, lineHeight:GlobalSize.lineHeight}} numberOfLines={2}>
                                                邮箱：{this.state.email}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{flex: 1,height:10,backgroundColor:'#eeeeee'}}></View>
                        <TouchableHighlight
                            style={styles.highlightStyle}
                            // style={{ backgroundColor:"#ffffff",paddingTop: 10,paddingBottom:10,paddingLeft:10,paddingRight:10, borderBottomWidth: StyleSheet.hairlineWidth,
                             // borderBottomColor: '#cdcdcd',borderTopColor:'#cdcdcd',borderTopWidth:StyleSheet.hairlineWidth,justifyContent: 'center'}}
                            underlayColor="#ffffff"
                            onPress={()=>this.onEnterSettingPage()}
                             >
                            <View style={{ flexDirection: 'row'}}>
                                <View style={{justifyContent: 'center'}}>
                                    <Image source={require('../../resource/images/App/shezhi.png')}
                                           style={{width:25,height:25}}/>
                                </View>
                                <View style={{flex: 1,justifyContent: 'center'}}>
                                    <Text
                                        style={styles.rowTitleText}>个人设置</Text>
                                </View>
                                <View style={{justifyContent: 'center'}}>
                                    <Image source={require('../../resource/images/App/youjiantou.jpg')}
                                           style={styles.rowAccessoryImg}/>
                                </View>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={styles.highlightStyle}
                            underlayColor="#ffffff"
                            onPress={ ()=>
                                showMessage('该功能还未上线，敬请期待！')
                                  }
                        >
                            <View style={{ flexDirection: 'row'}}>
                                <View style={{justifyContent: 'center'}}>
                                    <Image source={require('../../resource/images/App/kaoqin.png')}
                                           style={{width:25,height:25}}/>
                                </View>
                                <View style={{flex: 1,justifyContent: 'center'}}>
                                    <Text
                                        style={styles.rowTitleText}>我的考勤</Text>
                                </View>
                                <View style={{justifyContent: 'center'}}>
                                    <Image source={require('../../resource/images/App/youjiantou.jpg')}
                                           style={styles.rowAccessoryImg}/>
                                </View>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={styles.highlightStyle}
                            underlayColor="#ffffff"
                            onPress={ ()=>
                                   showMessage('该功能还未上线，敬请期待！')
                                }
                        >
                            <View style={{ flexDirection: 'row'}}>
                                <View style={{justifyContent: 'center'}}>
                                    <Image source={require('../../resource/images/App/wodehuiyishi.png')}
                                           style={{width:25,height:25}}/>
                                </View>
                                <View style={{flex: 1,justifyContent: 'center'}}>
                                    <Text
                                        style={styles.rowTitleText}>我的会议室</Text>
                                </View>
                                <View style={{justifyContent: 'center'}}>
                                    <Image source={require('../../resource/images/App/youjiantou.jpg')}
                                           style={styles.rowAccessoryImg}/>
                                </View>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={styles.highlightStyle}
                            underlayColor="#ffffff"
                            onPress={ ()=>
                               showMessage('该功能还未上线，敬请期待！')
                                    }
                        >

                            <View style={{ flexDirection: 'row'}}>
                                <View style={{justifyContent: 'center'}}>
                                    <Image source={require('../../resource/images/App/wodehuodong.png')}
                                           style={{width:25,height:25}}/>
                                </View>
                                <View style={{flex: 1,justifyContent: 'center'}}>
                                    <Text
                                        style={styles.rowTitleText}>我的活动</Text>
                                </View>
                                <View style={{justifyContent: 'center'}}>
                                    <Image source={require('../../resource/images/App/youjiantou.jpg')}
                                           style={styles.rowAccessoryImg}/>
                                </View>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={styles.highlightStyle}
                            underlayColor="#ffffff"
                            onPress={ ()=>this.onEnterAboutApp() } > 
                            <View style={{ flexDirection: 'row'}}>
                                <View style={{justifyContent: 'center'}}>
                                    <Image source={require('../../resource/images/App/aboutapp.png')}
                                           style={{width:25,height:25}}/>
                                </View>
                                <View style={{flex: 1,justifyContent: 'center'}}>
                                    <Text
                                        style={styles.rowTitleText}>关于</Text>
                                </View>
                                <View style={{flex: 1,justifyContent: 'center'}}>
                                    <Text style={styles.versionText}>{versionNum}</Text>
                                </View>
                                <View style={{justifyContent: 'center'}}>
                                    <Image source={require('../../resource/images/App/youjiantou.jpg')}
                                           style={styles.rowAccessoryImg}/>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
                </ScrollView>
            </View>
        );

    }
}

//提示信息
function showMessage(msg) {
    // if (Platform.OS === 'android') {
    //     ToastAndroid.show(msg, ToastAndroid.SHORT)
    //     // Alert.alert(msg);
    // } else {
    //     AlertIOS.alert(msg);
    // }
    PublicToast.showMessage(msg);
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    contentContainer: {
        backgroundColor: "white",
    },
    versionText:{
        fontSize: GlobalSize.fontSizeTitle,
        color: GlobalSize.colorGrayText,
        textAlign:'right',
    },
    row: {
        padding: 10,
        height: 44,
    },
    rowTitleText:{
        fontSize:GlobalSize.fontSizeTitle,
        color:GlobalSize.colorBlackText,
        textAlign: 'left',
        justifyContent: 'center',
        marginLeft:10
    },
    rowAccessoryImg:{ 
        justifyContent: 'center',
        marginRight:10,
        height:15,
        width:10
    },
    highlightStyle:{  
        backgroundColor:"#ffffff",
        paddingTop: 12,
        paddingBottom:12,
        paddingLeft:10,
        paddingRight:10, 
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#cdcdcd'
    },
});
