import React, { Component } from 'react';
import {
    StyleSheet,
    Platform,
    View,
    Text,
    Alert,
    ListView,
    TouchableOpacity,
    Image,
    RefreshControl,
    ScrollView,
    InteractionManager,
    ActivityIndicator,
} from 'react-native';

import NavigationBar from 'react-native-navbar';

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux'

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
import ActionConstants from reduxDataFlowPath(2) + '/constants/ActionConstants';
import { loadFlowCenterWaitDataHomeFromServer } from reduxDataFlowPath(2) + '/actions';

import GlobalStyle from GlobalPath(2) + '/GlobalStyle'
import GlobalSize from GlobalPath(2) + '/GlobalSize'
import BaseContainer from containersPath(2) + '/BaseContainer'
import ListRefreshControl from BusinessComponentPath(2) + '/ListRefreshControl'
import ListFooter from BusinessComponentPath(2) + '/ListFooter'
import NavBarButton from componentsPath(2) + '/NavBarButton'
import HomeMenuCard from './components/HomeMenuCard'
import FlowCell from BusinessComponentPath(2) + '/FlowCell'
import PublicToast from componentsPath(2) + '/PublicToast'
import HttpRequest from commonPath(2) + '/HTTPRequest'
*/
import ActionConstants from '../../../../reduxDataFlow/constants/ActionConstants';
import { loadFlowCenterWaitDataHomeFromServer } from '../../../../reduxDataFlow/actions';

import GlobalStyle from '../../Global/GlobalStyle'
import GlobalSize from '../../Global/GlobalSize'
import BaseContainer from '../../../../containers/BaseContainer'
import ListRefreshControl from '../../BusinessComponent/ListRefreshControl'
import ListFooter from '../../BusinessComponent/ListFooter'
import NavBarButton from '../../../../components/NavBarButton'
import HomeMenuCard from './components/HomeMenuCard'
import FlowCell from '../../BusinessComponent/FlowCell'
import PublicToast from '../../../../components/PublicToast'
import HttpRequest from '../../../../common/HTTPRequest'

let HTTPRequest = new HttpRequest(true);
var pageIndex=0;
let pageSize = 10;

class WorkHome extends BaseContainer {
    constructor(props) {
        super(props);
        _this = this;
        this.state=({
            dataSource: new ListView.DataSource({
                rowHasChanged:(r1,r2)=>true
            }),
            flowCenterData:[],
            isLoading :false,
            isAllLoading :true,
        })
        pageIndex=0;
    }
    defaultRenderNavigationBarRightButton(){
       return(
           <NavBarButton
              style={GlobalStyle.rightButton}
              image={require('../../resource/images/App/bangzhu.png') }
              handler={() => Actions.workHomeHelp({ title: "帮助" }) }
           />
        )
    }
    defaultRenderNavigationBarLeftButton(){
        return <View></View>
    }
    componentDidMount(){
        pageIndex=0;
        this.props.dispatch(loadFlowCenterWaitDataHomeFromServer({page:pageIndex,pagesize:pageSize}));
    }
    componentWillReceiveProps(nextProps){
        this._handleNextProps(nextProps);
    }
    _handleNextProps = (nextProps) => {
        var flowCenterData = nextProps.flowState.flowHomeData;
        this.printProps(nextProps);
        
        if (nextProps.flowState.type == ActionConstants.FLOWCENTERHOME_FINISH) {
            this.setState({
                flowCenterData:flowCenterData,
                // dataSource:this.state.dataSource.cloneWithRows(flowCenterData),
                isLoading:nextProps.flowState.isLoadingFlowCenter,
                isAllLoading:false,
            })
        }else if (nextProps.flowState.type == ActionConstants.FLOWCENTERHOME_ERROE ) {
            PublicToast.logMessage('首页列表请求失败');
            this.setState({
                isLoading:false,
                isAllLoading:false,
            })
        }else if (nextProps.flowState.type == ActionConstants.FLOWCENTERHOME_LOADING) {
            this.setState({
                isLoading:true,
            })
        }else if(nextProps.flowState.type==ActionConstants.FLOWHASREAD_SUCCESS){
            let rowIndex = nextProps.flowState.rowIndex;
            let rowID = nextProps.flowState.rowID;
            let flowType= nextProps.flowState.flowType;
            PublicToast.logMessage('FLOWHASREAD_SUCCESS');
            if (flowType==0) {
                //更新代办已读
                let newData = this.state.flowCenterData;
                PublicToast.logMessage('flowCenterData'+newData.length+rowIndex);
                if (newData.length>rowIndex) {
                    newData[rowIndex]['readTime']='1111-01-01T00:00:00';
                    this.setState({
                        flowCenterData:newData,
                    });
                };
                
            };
        }
    }
    printProps = (nextProps) => {
        let flowCenterData = nextProps.flowState.flowHomeData;
        // console.log('flowCenterData:' + flowCenterData);
    }
    pushToFlowCenterView=()=>{
        Actions.flowCenter({title:'流程中心',showItem:'waitHandle'});
    };
    //初始数据
    fetchDataSource=()=>{
        pageIndex=0;
        this.setState({
            isAllLoading:true,
        })
        PublicToast.logMessage('页数==='+pageIndex);
        this.props.dispatch(loadFlowCenterWaitDataHomeFromServer({page:pageIndex,pagesize:pageSize}));
    };
    loadMore=()=>{
        pageIndex++;
        this.props.dispatch(loadFlowCenterWaitDataHomeFromServer({page:pageIndex,pagesize:pageSize}));
    };
    _renderRow=(rowData: Object, sectionID: number, rowID: number)=>{
        // PublicToast.logMessage('this.state.dataSource:' + this.state.dataSource);
        // PublicToast.logMessage('workHome_renderRow:'+sectionID+'--'+rowID);
        return(
            <FlowCell
                key={rowID}
                data={rowData}
                sectionID={sectionID}
                rowID={rowID}
                flowType={0}
                rowPressedAction={(data) => {
                    if (data.enabled) { 
                        Actions.flowDetail({
                            title: "流程详情",
                            url: data.url,
                            rowID: rowID,
                            taskID: data.taskID,
                            flowType: 0,
                        })
                    }else {
                        PublicToast.showMessage('该审批流还未在移动端上线');
                    }
                }}
            />
        )
    };
    renderFooter=()=>{
        if (this.state.flowCenterData.length == 0) {
            return (
                <View style={{height:10}}></View>
            )
        }else{
            return (
                <ListFooter
                    onPress={this.loadMore}
                    isAllLoaded ={this.state.isAllLoad}
                    isLoading ={pageIndex>0 && this.state.isLoading}
                />
            );
        }
    }
    render() {
        return (
            <View style={[styles.container]}>
                {this.defaultRenderNavigationBar() }
                <HomeMenuCard />
                <View style={{height:GlobalSize.cellPadding,backgroundColor:GlobalSize.colorBorderGray}}></View>
                <View style={[styles.container,{marginBottom:50}]}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={this.pushToFlowCenterView} style={{flex:1,flexDirection:'row',marginBottom:2}}>
                            <View style={[{flex:1},{flexDirection:'row'},{alignItems:'center'}]}>
                              <Image source={require('../../resource/images/App/daiban.png')} style={[{width:20},{height:20}]} />
                              <Text style={styles.headerTitle}>待办</Text>
                            </View>

                            <View style={[{flex:1},{flexDirection:'row'},{alignItems:'center',justifyContent:'flex-end'}]}>
                                <Text style={styles.headerAccessory}>流程中心</Text>
                                <Image source={require('../../resource/images/App/ic_arrow_lightColor.png')} style={[{width:16},{height:16}]} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <ListView
                            dataSource={this.state.dataSource.cloneWithRows(this.state.flowCenterData)}
                            renderRow={this._renderRow.bind(this)}
                            enableEmptySections = {true}
                            onEndReachedThreshold={10}
                            refreshControl={
                                <ListRefreshControl
                                    refreshing={this.state.isAllLoading}
                                    onRefresh={this.fetchDataSource}
                                />
                            }
                            renderFooter={this.renderFooter}
                        />                        
                </View>
            </View>
        );
    }
}

const flowCenterState=(state)=>{
    return{
        flowState:state.flowCenterState
    }
};
export default connect(flowCenterState)(WorkHome)

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
    webViewStyle: {
        flex: 1
    },
    header:{
        flexDirection:'row',
        height:50,
        paddingLeft:GlobalSize.cellPadding,
        paddingRight:GlobalSize.cellPadding,
        backgroundColor:'white',
        alignItems:'center',
        marginBottom:1,
    },
    headerTitle:{
        flex:1,
        fontSize:16,
        marginLeft:5,
        justifyContent:'center',
        color:GlobalSize.colorBlackText,
    },
    headerAccessory:{
        fontSize:GlobalSize.fontSizeSubTitle,
        color:GlobalSize.colorGrayText,
        textAlign:'right'
    },

});
