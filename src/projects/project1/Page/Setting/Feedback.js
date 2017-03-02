/**
 * Created by yingying on 16/7/18.
 */

// 反馈页面

import {Actions} from 'react-native-router-flux';
import React, {
    Component
} from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ListView,
    Alert,
    Linking,
}from 'react-native'

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
import httpRequest from commonPath(2) + '/HTTPRequest'
import BaseContainer from containersPath(2) + '/BaseContainer'
import GlobalSize from GlobalPath(2) + '/GlobalSize'
import PublicToast from componentsPath(2) + '/PublicToast'
*/
import httpRequest from '../../../../common/HTTPRequest'
import BaseContainer from '../../../../containers/BaseContainer'
import GlobalSize from '../../Global/GlobalSize'
import PublicToast from '../../../../components/PublicToast'

let HTTPRequest = new httpRequest();

let dataAll = {
    'sec1': {
        0: {'prompt': '姓名:', 'rowTitle': 'GJS', 'rowType': 'name'},
        1: {'prompt': '部门:', 'rowTitle': '???', 'rowType': 'detName'},
        2: {'prompt': '邮箱:', 'rowTitle': '1353990812@qq.com', 'rowType': 'email'},
        3: {'prompt': '电话:', 'rowTitle': '+8613468929449', 'rowType': 'tele'}
    },

    'sec2': {
        0: {'prompt': '姓名:', 'rowTitle': 'xxx', 'rowType': 'name'},
        1: {'prompt': '部门:', 'rowTitle': '???', 'rowType': 'detName'},
        2: {'prompt': '邮箱:', 'rowTitle': '???', 'rowType': 'email'},
        3: {'prompt': '电话:', 'rowTitle': '???', 'rowType': 'tele'}
    },
    'sec3': {
        0: {'prompt': '姓名:', 'rowTitle': 'ooo', 'rowType': 'name'},
        1: {'prompt': '部门:', 'rowTitle': '???', 'rowType': 'detName'},
        2: {'prompt': '邮箱:', 'rowTitle': '???', 'rowType': 'email'},
        3: {'prompt': '电话:', 'rowTitle': '???', 'rowType': 'tele'}
    }

};
var alertMessage = '';


/** 帮助-反馈 **/


export default class Feedback extends BaseContainer {

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });
        this.state = {
            dataSource: dataSource
        };
    }
    defaultNavigationTitle() {
        return {
            title: '反馈',
            tintColor: this.defaultTintColor()
        };

    }
    componentWillMount() {

        PublicToast.logMessage(dataAll);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRowsAndSections(dataAll),
            loaded: true
        });
    }
    rowPressedAction = (rowData, rowID:number)=> {

        if (rowData.rowType === 'email') {
            Linking.openURL('mailto://' + rowData.rowTitle);

        } else if (rowData.rowType === 'tele') {
            Linking.openURL('tel://' + rowData.rowTitle);
        }
    };
    renderSectionHeader = (sectionData, sectionID) => {
        if (sectionID === 'sec1') {
            return null;
        };
        PublicToast.logMessage('分区数据===' + {sectionData});
        return (
            <View style={[styles.sectionStyle,{backgroundColor : GlobalSize.colorBgGray}]}>
                <Text style={styles.rowText}></Text>
            </View>
        )
    }
    renderRow = (rowData, sectionID:number, rowID:number)=> {
        PublicToast.logMessage('row数据' + rowData.prompt + '行数:' + rowID);
        if (rowData.rowType === 'name' || rowData.rowType === 'detName') {
            return (
                <TouchableOpacity onPress={()=>{this.rowPressedAction(rowData,rowID)}}>
                    <View style={styles.rowStyle}>
                        <View>
                            <Text style={styles.rowTextPrompt}>{rowData.prompt}</Text>
                            <View style={{flex:1}}>
                            </View>
                        </View>

                        <View style={[{flex:1,marginLeft: 5,}]}>
                            <Text style={{color:GlobalSize.colorBlackText,fontSize:GlobalSize.fontSizeTitle}}>{
                                rowData.rowTitle
                            }</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        } else if (rowData.rowType === 'tele') {
            return (
                <TouchableOpacity 
                    onPress={()=> this.rowPressedAction(rowData,rowID)} >
                    <View style={styles.rowStyle}>
                        <View>
                            <Text style={styles.rowTextPrompt}>{rowData.prompt}</Text>
                            <View style={{flex:1}}>
                            </View>
                        </View>

                        <View style={[{flex:1,marginLeft: 5,}]}>
                            <Text style={{color: 'blue',fontSize:GlobalSize.fontSizeTitle}}>{rowData.rowTitle}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        } else if (rowData.rowType === 'email') {
            return (
                <TouchableOpacity 
                    onPress={()=>this.rowPressedAction(rowData,rowID)} >

                    <View style={styles.rowStyle}>
                        <View>
                            <Text style={styles.rowTextPrompt}>{rowData.prompt}</Text>
                        </View>

                        <View style={[{flex:1,marginLeft: 5,}]}>
                            <Text style={{color:'blue',fontSize:GlobalSize.fontSizeTitle}}>{rowData.rowTitle}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity onPress={()=>{this.rowPressedAction(rowData,rowID)}}>
                    <View style={styles.rowStyle}>
                        <View>
                            <Text style={styles.rowTextPrompt}>{rowData.prompt}</Text>
                            <View style={{flex:1}}>
                            </View>
                        </View>

                        <View style={[{flex:1,marginLeft: 5,}]}>
                            <Text style={{color:GlobalSize.colorBlackText,fontSize:GlobalSize.fontSizeTitle}}>{rowData.rowTitle}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }
    };
    render() {
        return (
            <View style={{flex:1,backgroundColor:GlobalSize.colorBgGray}}>
                {this.defaultRenderNavigationBar()}
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    enableEmptySections={true}
                    renderSectionHeader={this.renderSectionHeader}
                />
            </View>
        );
    }
}

var styles = StyleSheet.create({
    sectionStyle: {
        flex: 1
    },

    titleShow: {
        marginLeft: 10,
        fontSize:GlobalSize.fontSizeTitle,
        color:GlobalSize.colorBlackText,
    },
    rowStyle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: GlobalSize.cellPadding,
        backgroundColor: 'white',
        // marginTop:10,
        paddingBottom:10,
        borderBottomWidth: 1,
        borderBottomColor: '#e4e4e4'
    },
    rowText0: {
        color: GlobalSize.colorBlackText,
        fontSize:GlobalSize.fontSizeTitle,
    },
    //电话邮箱的字体颜色
    rowText: {
        color: 'blue',
        fontSize:GlobalSize.fontSizeTitle,
        lineHeight:GlobalSize.lineHeight,
    },
    rowTextPrompt: {
        width: 100,
        color:GlobalSize.colorGrayText,
        fontSize:GlobalSize.fontSizeTitle,
    },
    rowTextBlack: {
        color: '#333333',
        fontSize:GlobalSize.fontSizeTitle,
    },

});
