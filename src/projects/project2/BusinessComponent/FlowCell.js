
import React,{Component} from 'react'
import {
    Image,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native'
import { Actions } from 'react-native-router-flux';

import GlobalSize from '../Global/GlobalSize'
import GlobalStyle  from '../Global/GlobalStyle'
import PublicToast from '../../../components/PublicToast'

export default class HomeMenuCard extends Component {
    rowPressedAction=(data, sectionID, rowID)=>{
        this.props.rowPressedAction && this.props.rowPressedAction(data, sectionID, rowID);
    };
    render(){
        const {data, sectionID, rowID} = this.props;
        // PublicToast.logMessage('flowCellSectionAndROw:'+sectionID+'--'+rowID);
        var showTime;
        if (data.deliverTime.slice(0,2) !== '00') {
            showTime = data.deliverTime.split("T")[0];
        }else {
            showTime = data.completedTime.split("T")[0];
        }
        let source;
        if (data.enabled && (data.readTime !== '0001-01-01T00:00:00')) {
            source = require('../resource/images/App/ic_flow_on.png');
        } else if(data.enabled){
            source = require('../resource/images/App/ic_flow_redFlag.png');
        }else{
            source = require('../resource/images/App/ic_flow_finished.png');
        }
        // PublicToast.logMessage('source iamge:'+source);
        // PublicToast.logMessage('data:'+data.taskTitle+'时间=='+showTime+'-'+data.readTime);
        return(
                <TouchableOpacity key={data.taskID+data.rendTime} onPress={()=>{this.rowPressedAction(data, sectionID, rowID)}} style={{ width: GlobalSize.DeviceWidth ,backgroundColor:GlobalSize.colorBgGray}} >
                    <View style={styles.rowContainer}>
                        <View style={styles.contentContainer}>
                            <Image style={styles.imageIcon}
                                   // source={data.enabled ?require('../../resource/images/App/ic_flow_on.png') :require('../../resource/images/App/ic_flow_finished.png')}
                                   source={source}
                                />
                            <Text style={data.enabled ?[styles.titleText]:[styles.titleTextUnTouch]} numberOfLines={2}>{data.taskTitle}</Text>
                        </View>
                        <Text style={[styles.dateText]}>{showTime}</Text>
                    </View>
                </TouchableOpacity>
            );
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor:GlobalSize.colorBgGray,
        flex:1
    },
    rowContainer:{
        backgroundColor:'white',
        padding:GlobalSize.cellPadding,
        marginBottom:1
    },
    contentContainer:{
        flexDirection:'row'
    },
    imageIcon:{
        width:15,
        height:15,
        marginTop:4,
        // backgroundColor:'blue',
    },
    titleText:{
        color:GlobalSize.colorBlackText,
        fontSize:GlobalSize.fontSizeTitle,
        marginLeft:GlobalSize.cellPadding/2,
        marginBottom:GlobalSize.cellTextSeparater,
        width:GlobalSize.DeviceWidth-15-3*GlobalSize.cellPadding,
        lineHeight:GlobalSize.lineHeight,
        // backgroundColor:'red'
    },
    dateText:{
        alignSelf:'flex-end',
        fontSize:GlobalSize.fontSizeSubTitle,
        color:GlobalSize.colorGrayText,
    },
    titleTextUnTouch:{
        fontSize:GlobalSize.fontSizeTitle,
        color:GlobalSize.colorGrayText,
        marginLeft:GlobalSize.cellPadding/2,
        width:GlobalSize.DeviceWidth-15-3*GlobalSize.cellPadding,
        lineHeight:GlobalSize.lineHeight
    }
})
