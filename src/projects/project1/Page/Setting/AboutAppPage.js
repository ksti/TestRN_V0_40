/**
 * Created by huazai on 16/9/30.
 * 关于我们 
 */ 
import React,{ Component
} from 'react'
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Navigator
}from 'react-native'

import {Actions} from 'react-native-router-flux'; 

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
*/
import BaseContainer from '../../../../containers/BaseContainer'
import GlobalSize from '../../Global/GlobalSize'
import PublicToast from '../../../../components/PublicToast'

export default class AboutAppPage extends BaseContainer {
    constructor(props) {
        super(props); 
        this.state = { 
        };
    }
    defaultNavigationTitle() {
        return {
            title: "关于",
            tintColor: this.defaultTintColor()
        };
    }
    componentDidMount() {  
    } 
    render() {
        return (<View/>);
    }
    render() {
        return (
            <View style={{flex:1,backgroundColor:'white'}}>
                {this.defaultRenderNavigationBar()}
                <ScrollView>
                <View style={styles.topView}>
                    <Image style={styles.logoIcon} source={require('../../resource/images/App/managerpsd.png')}/>
                    <Text style={styles.versionText}>{this.props.versionNum}</Text>
                </View>
                <View>
                    <View style={{flexDirection:"row",alignItems:'center'}}>
                        <View style={[{height:25,marginBottom:10,marginTop:10,marginLeft:10,marginRight:10,width:5,backgroundColor:'#FE5201'}]}/>
                        <Text style={[styles.titleShow,{fontSize:GlobalSize.fontSizeTitle,}]}>功能介绍</Text>
                    </View>
                    <View style={{height:1,backgroundColor:GlobalSize.colorBgGray}}></View>
                    <View style={styles.unitRow}>
                         <Text style={styles.titleShow}>1.流程中心</Text>
                         <View style={{margin:5}} />
                         <Text style={styles.contentText}>本版本已上线191个审批流程。</Text>
                    </View>
                    <View style={styles.unitRow}>
                         <Text style={styles.titleShow}>2.签到</Text>
                         <View style={{margin:5}} />
                         <Text style={styles.contentText}>支持手机打卡，上、下班时间精准管理。</Text>
                    </View>
                    <View style={styles.unitRow}>
                         <Text style={styles.titleShow}>3.拟单</Text>
                         <View style={{margin:5}} />
                         <Text style={styles.contentText}>解决了企业日常办公需求，同时可查看自己所有的代办、流转中、已办结的工作任务。审批流程与后台系统同步，真正做到了移动审批。</Text>
                    </View>
                    <View style={styles.unitRow}>
                         <Text style={styles.titleShow}>4.订会议室</Text>
                         <View style={{margin:5}} />
                         <Text style={styles.contentText}>根据个人需要预定会议室。</Text>
                    </View>
                    <View style={styles.unitRow}>
                         <Text style={styles.titleShow}>5.新闻中心</Text>
                         <View style={{margin:5}} />
                         <Text style={styles.contentText}>实时了解企业内部新闻，了解企业重大事件。</Text>
                    </View>
                    <View style={styles.unitRow}>
                         <Text style={styles.titleShow}>6.通知纪要</Text>
                         <View style={{margin:5}} />
                         <Text style={styles.contentText}>实时了解单位通知、部门通知、会议纪要等重要信息。</Text>
                    </View>
                    <View style={styles.unitRow}>
                         <Text style={styles.titleShow}>7.远洋学院</Text>
                         <View style={{margin:5}} />
                         <Text style={styles.contentText}>学习成长的路引，职场修炼的秘籍。</Text>
                    </View>
                    <View style={styles.unitRow}>
                         <Text style={styles.titleShow}>8.通讯录</Text>
                         <View style={{margin:5}} />
                         <Text style={[styles.contentText,{marginBottom:15}]}>企业组织架构一目了然，随时随地，快速找人。</Text>
                    </View>
                </View>
                </ScrollView>
            </View>
        );
    }
}
var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: GlobalSize.cellPadding,
        borderBottomWidth: 1,
        borderBottomColor: GlobalSize.colorBorderGray,
    },
    topView:
    {
        flex:1,
        backgroundColor:GlobalSize.colorBgGray,
        height:160,
        justifyContent:'center',
        alignItems:'center'
    },
    versionText:
    {
        fontSize: GlobalSize.FontSizeTitle,
        marginTop:5,
        color: GlobalSize.colorGrayText,
    },
    logoIcon:
    { 
        height:80,
        width:80
    },
    rightContainer: {
        flex: 1,
        flexDirection: 'row',
        height: 40,
        alignItems: 'center'

    },
    arrowStyle: {
        alignSelf: 'flex-end'
    },
    imageArrow: {
        marginBottom: 13,
        width: 14,
        height: 14,
        alignSelf: 'flex-end',
        alignItems: 'center'
    },
    titleShow: {
        fontSize:GlobalSize.fontSizeSubTitle,
        color:GlobalSize.colorBlackText,
    },
    contentText:{
        marginLeft:10,
        color:GlobalSize.colorBlackText,
        fontSize:GlobalSize.fontSizeSubTitle,
        lineHeight:GlobalSize.lineHeight,
    },
    unitRow:{
        marginTop:15,
        marginLeft:10,
        marginRight:10,
    }
});
