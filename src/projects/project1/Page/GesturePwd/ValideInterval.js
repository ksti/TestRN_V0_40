
import React,{Component} from 'react'
import {
    View,
    Text,
    Image,
    AppRegistry,
    StyleSheet,
    ListView,
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

let validTime=[
    {
        time:'5分钟',
        code:5,
    },{
        time:'10分钟',
        code:10,
    },{
        time:'20分钟',
        code:20,
    },{
        time:'30分钟',
        code:30,
    },{
        time:'60分钟',
        code:60,
    }
]

export default class ValideInterval extends BaseContainer{
    constructor(props){
        super(props);
        PublicToast.logMessage('props.gestureInfo.interval:'+props.gestureInfo.interval);
        this.state={
            interval: props.gestureInfo.interval,
            dataSource:new ListView.DataSource({
                rowHasChanged:(r1,r2)=> r1!==r2
            })
        }
    }
    defaultNavigationTitle()
    {
        return {
            title: "手势登录有效时长",
            tintColor: this.defaultTintColor()
        };
    }
    componentDidMount(){
        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(validTime),
        })
        global.storageUtil.getAllDataForKey(this.props.userName)
        .then((objDatas)=>{
            globalGesInfo = objDatas[0];
            PublicToast.logMessage('interval手势密码信息:'+globalGesInfo.password+globalGesInfo.interval);
            this.setState({
                interval:globalGesInfo.interval,
            })
        });
    }
    rowSelected=(item)=>{
        this.setState({
            interval:item.code,
        })
    }
    doneSetting=()=>{
        var newInfo = this.props.gestureInfo;
        newInfo.isOpen=true;
        newInfo.interval=this.state.interval;
        global.storageUtil.setKeyIdValue(this.props.userName,GlobalSize.Global_GesPwdInfo,newInfo)
        .then(()=>{
            global.gesInfo = newInfo;
            // PublicToast.logMessage('setInterval手势密码信息:'+global.gesInfo.isOpen+global.gesInfo.password);
            Actions.pop();
        });
    }
    renderRow=(item,index)=>{
        var isSelected=false;
        if (this.state.interval==item.code) {
            isSelected = true;
        }
        return(
            <TouchableOpacity onPress={()=>{this.rowSelected(item)}} style={[{flex:1,height:45}]} >
                <View style={{flex:1,alignItems:'center',flexDirection:'row'}}>
                    <Text style={styles.titleText}>{item.time}</Text>
                    <Image style={{height:20,width:20,alignItems:'flex-end',marginRight:10}} source={isSelected?require('../../resource/images/App/ic_btn_selected.png') :require('../../resource/images/App/ic_btn_default.png')} />
                </View>
                <View style={{height:1,backgroundColor:GlobalSize.colorBorderGray}}></View>
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <View style={styles.container}>
                {this.defaultRenderNavigationBar() }
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow= {this.renderRow}
                    enableEmptySections = {true}
                    showsVerticalScrollIndicator={false}
                 />
                 <TouchableOpacity
                     onPress={() => this.doneSetting() }
                     style={styles.btnSearch}
                     >
                     <View style={{justifyContent:'center',height:40}}>
                         <Text style={{ textAlign: 'center',color:'white' }}>确定</Text>
                     </View>
                 </TouchableOpacity>
             </View>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
    },
    btnSearch:{
        marginBottom:40,
        height:40,
        width:GlobalSize.DeviceWidth-10*2,
        marginLeft:10,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:GlobalSize.colorRedButton,
        borderRadius:5,
    },
    titleText:{
        width:GlobalSize.DeviceWidth-10*2-30,
        marginLeft:10,
        fontSize:GlobalSize.FontSizeTitle,
        color:GlobalSize.colorBlackText,
        textAlign:'left'
    }
})
