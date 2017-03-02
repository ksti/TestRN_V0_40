/**
 * Created by yingying on 16/7/22.
 */
//帮助首页

import {Actions} from 'react-native-router-flux';

//noinspection JSUnresolvedVariable
import React, {
    Componeimportnt
} from 'react'

//noinspection JSUnresolvedVariable
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ListView,
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
import BaseContainer from containersPath(2) + '/BaseContainer'
import GlobalSize from GlobalPath(2) + '/GlobalSize'
import PublicToast from componentsPath(2) + '/PublicToast'
*/
import BaseContainer from '../../../../containers/BaseContainer'
import GlobalSize from '../../Global/GlobalSize'
import PublicToast from '../../../../components/PublicToast'

var dataArray = [{'title': '有关待办问题'}, {'title': '反馈问题'}];

export default class HomeHelpContainer extends BaseContainer {
    constructor(props) {
        super(props);
        dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: dataSource
        };
    }
    defaultNavigationTitle() {
        return {
            title: "帮助",
            tintColor: this.defaultTintColor()
        };
    }
    componentDidMount() {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(dataArray)
        });
    }

    rowPressedAction = (data, rowID:number)=> {
        if (rowID == 0) {
            Actions.service({
                title: data.title,
                flowData: data.title
            },)

        } else if (rowID == 1) {
            Actions.feedback({
                title: data.title,
                flowData: data.title
            },)
        }
    };
    renderRow = (data, sectionID:number, rowID:number)=> {
        return (
            <TouchableOpacity onPress={()=>{this.rowPressedAction(data,rowID)}}>
                <View style={styles.container}>
                    <View style={styles.rightContainer}>
                        <Text style={styles.titleShow}>{data.title}</Text>
                    </View>
                    <Image style={styles.imageArrow} source={require('../../resource/images/App/ic_right_line.png')}/>
                </View>
            </TouchableOpacity>
        );
    };
    render() {
        return (
            <View style={{flex:1,backgroundColor:'white'}}>
                {this.defaultRenderNavigationBar()}
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                />
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
        paddingLeft: GlobalSize.cellPadding,
        paddingRight:GlobalSize.cellPadding,
        borderBottomWidth: 1,
        borderBottomColor: '#e4e4e4'
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
        width: 14,
        height: 14,
    },
    titleShow: {
        marginLeft: 10,
        fontSize:GlobalSize.fontSizeTitle,
        color:GlobalSize.colorBlackText,
    }
});
