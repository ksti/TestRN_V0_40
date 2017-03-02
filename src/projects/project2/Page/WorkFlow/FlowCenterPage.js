// 流程中心
import React, {
    Component
} from 'react'
import {
    View,
    Text,
    StyleSheet,
    ListView,
    Image,
    Alert,
    TouchableOpacity,
}from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
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
import ActionConstants from reduxDataFlowPath(2) + '/constants/ActionConstants';
import * as allActions from reduxDataFlowPath(2) + '/actions';
import BaseContainer from containersPath(2) + '/BaseContainer';
import ButtonUpDown from componentsPath(2) + '/ButtonUpDown';
import GlobalSize from GlobalPath(2) + '/GlobalSize'
import GlobalStyle from GlobalPath(2) + '/GlobalStyle'
import {loadFlowCenterWaitDataFromServer, loadOtherFlowFromServer} from reduxDataFlowPath(2) + '/actions';
import ListRefreshControl from BusinessComponentPath(2) + '/ListRefreshControl'
import ListFooter from BusinessComponentPath(2) + '/ListFooter'
import LoadingView from componentsPath(2) + '/LoadingView'
import PublicToast from componentsPath(2) + '/PublicToast'
import FlowCell from BusinessComponentPath(2) + '/FlowCell'
*/
import ActionConstants from '../../../../reduxDataFlow/constants/ActionConstants';
import * as allActions from '../../../../reduxDataFlow/actions';
import BaseContainer from '../../../../containers/BaseContainer';
import ButtonUpDown from '../../../../components/ButtonUpDown';
import GlobalSize from '../../Global/GlobalSize'
import GlobalStyle from '../../Global/GlobalStyle'
import {
    loadFlowCenterWaitDataFromServer, 
    loadOtherFlowFromServer
} from '../../../../reduxDataFlow/actions';
import ListRefreshControl from '../../BusinessComponent/ListRefreshControl'
import ListFooter from '../../BusinessComponent/ListFooter'
import LoadingView from '../../../../components/LoadingView'
import PublicToast from '../../../../components/PublicToast'
import FlowCell from '../../BusinessComponent/FlowCell'

var pageIndex = 0;
let pageSize = 10;
let lineOneMenu = [{
    title: '我的待办',
    selectedTitle: '我的待办',
    image: require('../../resource/images/App/wodedaiban.png'),
    selectedImage: require('../../resource/images/App/wodedaiban1.png'),
    key: "myWaitHandleList"
}, {
    title: '我的流转',
    selectedTitle: '我的流转',
    image: require('../../resource/images/App/wodeliuzhuan.png'),
    selectedImage: require('../../resource/images/App/wodeliuzhuan1.png'),
    key: "myFlowList"
}, {
    title: '已经办结',
    selectedTitle: '已经办结',
    image: require('../../resource/images/App/yijingbanjie.png'),
    selectedImage: require('../../resource/images/App/yijingbanjie1.png'),
    key: "isFinishedList"
}];
var currentShowItemIndex = null; //当前显示的Item

var _this;
let flowSourceData =[];
class FlowCenterPage extends BaseContainer {
    constructor(props) {
        super(props);
        flowSourceData =[];
        if (this.props.showItem === 'flowing') {
            currentShowItemIndex = 1;
        } else if (this.props.showItem === 'isFinished') {
            currentShowItemIndex = 2;
        } else if (this.props.showItem === 'waitHandle') {
            currentShowItemIndex = 0;
        }
        _this = this;
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2)=>r1 !== r2
            }),
            isLoading: true,
            isRefreshing: true,
            visible: false,
            lineOneMenu: lineOneMenu,
            currentSeletedIndex: currentShowItemIndex
        };

        const {dispatch} = props;
        this.actions = bindActionCreators(allActions, dispatch);
    }
     
    defaultNavigationTitle() {
        return {
            title: this.props.title,
            tintColor: this.defaultTintColor()
        };
    }
    componentDidUpdate() {
        if (this.flowCenterListRef) {
            if (pageIndex === 0 && this.state.isRefreshing === false ) {
                this.flowCenterListRef.scrollTo({ x: 0, y: 1, animated: false });
                setTimeout(() => {
                    if (this.flowCenterListRef) {
                        this.flowCenterListRef.scrollTo({ x: 0, y: 0, animated: false });
                    };
                }, 100);
            }            
        };
    }
    componentWillReceiveProps(nextProps) {
        var flowCenterData = nextProps.flowState.flowData;
        
        PublicToast.logMessage('willReceiveProps:将要接收到props' + nextProps.flowState.type, +flowCenterData);

        if (nextProps.flowState.type) {
            switch (nextProps.flowState.type) {
                case ActionConstants.FLOWCENTER_LOADING:
                {
                    this.setState({
                        isLoading: true,
                    })
                }
                    break;
                case ActionConstants.FLOWCENTER_ERROE:
                {
                    this.setState({
                        isLoading: false,
                        isRefreshing: false,
                    })
                    break;
                }
                case ActionConstants.FLOWCENTER_FINISH:
                {
                    flowSourceData=flowCenterData;
                    this.setState({
                        isLoading: false,
                        isRefreshing: false,
                        isAllLoaded: flowCenterData.length < 10 ? true : false,
                        dataSource: this.state.dataSource.cloneWithRows(flowCenterData),
                    })
                    break;
                }
                case ActionConstants.FLOWHASREAD_SUCCESS:{

                    PublicToast.logMessage('FLOWHASREAD_SUCCESS'+nextProps.flowState.rowIndex+'-'+flowSourceData.length);
                    let rowIndex = nextProps.flowState.rowIndex;
                    let flowType=nextProps.flowState.flowType;
                    //判断当前返回的类型是否是正在显示的类型,相同类型可以更新，不同类型就不必更新了
                    if (flowSourceData.length>rowIndex) {
                        flowSourceData[rowIndex]['readTime']='1101-01-01T00:00:00';
                    };
                    let selectedType = this.state.currentSeletedIndex;
                    if (flowType == selectedType) {
                        this.setState({ 
                            dataSource: new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!=r2}).cloneWithRows(flowSourceData),
                        })
                    }
                    
                    break;
                }
                default:
                {
                    this.setState({
                        isLoading: false,
                    })
                };
            }
        }
        ;

    }

    /** 菜单切换刷新数据 **/
    refreshData(index) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows([]),
            isLoading: true,
        })
        let moduleStates = this.props.moduleStates;
        var tempSelectedIndex = this.state.currentSeletedIndex;
        this.fetchDataSource(index);
        PublicToast.logMessage('index==' + index);
        switch (index) {
            case 0:
            {
                if (this.state.currentSeletedIndex !== index) {
                    this.setState({currentSeletedIndex: index});
                    this.refs.itemTodo.setSelected(true);
                }
                break;
            }
            case 1:
                if (this.state.currentSeletedIndex !== index) {
                    this.setState({currentSeletedIndex: index});
                    this.refs.itemFlow.setSelected(true);
                }
                break;
            case 2:
            {
                if (this.state.currentSeletedIndex !== index) {
                    this.setState({currentSeletedIndex: index});
                    this.refs.itemOk.setSelected(true);
                }
                break;
            }
            default:
                alert("尚未开通");
        }
        switch (tempSelectedIndex) {
            case 0:
            {
                if (this.state.currentSeletedIndex !== index) {
                    this.refs.itemTodo.setSelected(false);
                }
                break;
            }
            case 1:
                if (this.state.currentSeletedIndex !== index) {
                    this.refs.itemFlow.setSelected(false);
                }
                break;
            case 2:
            {
                if (this.state.currentSeletedIndex !== index) {
                    this.refs.itemOk.setSelected(false);
                }
                break;
            }
            default:
        }
        PublicToast.logMessage('currentIndex===' + this.state.currentSeletedIndex)
    }

    renderItems = (dataArr)=> {
        var selected2;
        var selected3;
        var selected1;
        if (this.props.showItem === 'waitHandle') {
            selected1 = 'true';
        }
        if (this.props.showItem === 'flowing') {
            selected2 = 'true';
        }
        if (this.props.showItem === 'isFinished') {
            selected3 = 'true';
        }
        return dataArr.map((items, i)=> {
            switch (i) {
                case 0:
                {
                    return (
                        <ButtonUpDown
                            initial={selected1}
                            ref='itemTodo'
                            key={'button'+i}
                            style={{backgroundColor:'black'}}
                            onPress={()=>{this.refreshData(i)}}
                            image={items.image}
                            selectedImage={items.selectedImage}
                            text={items.title}
                            selectedText={items.selectedTitle}
                            styleText={{color:'white',fontSize:GlobalSize.fontSizeTitle}}
                            selectedStyleText={{color:'#FF4815',fontSize:GlobalSize.fontSizeTitle}}
                            // styleBg={{backgroundColor:'black'}}
                        />
                    )
                }
                    break;
                case 1:
                {
                    return (
                        <ButtonUpDown
                            initial={selected2}
                            ref='itemFlow'
                            key={'button'+i}
                            style={{backgroundColor:'black'}}
                            onPress={()=>{this.refreshData(i)}}
                            image={items.image}
                            selectedImage={items.selectedImage}
                            text={items.title}
                            selectedText={items.selectedTitle}
                            styleText={{color:'white',fontSize:GlobalSize.fontSizeTitle}}
                            selectedStyleText={{color:'#FF4815',fontSize:GlobalSize.fontSizeTitle}}
                        />
                    )
                }
                    break;
                case 2:
                {
                    return (
                        <ButtonUpDown
                            initial={selected3}
                            ref='itemOk'
                            key={'button'+i}
                            style={{backgroundColor:'black'}}
                            onPress={()=>{this.refreshData(i)}}
                            image={items.image}
                            selectedImage={items.selectedImage}
                            text={items.title}
                            selectedText={items.selectedTitle}
                            styleText={{color:'white',fontSize:GlobalSize.fontSizeTitle}}
                            selectedStyleText={{color:'#FF4815',fontSize:GlobalSize.fontSizeTitle}}
                        />
                    )
                }
                    break;
                default:
            }
        });
    };

    componentDidMount() {
        setTimeout(() => {
            PublicToast.logMessage('延迟1秒');
            _this.fetchDataSource();
        }, 1000);

    };

    //下拉刷新
    fetchDataSource = (index)=> {
        pageIndex = 0;
        this.setState({
            isRefreshing: true,
        })
        PublicToast.logMessage('页数===' + pageIndex);
        // this._scrollView.scrollTo({y: 0, x: 0, animated: true});//scrollView 置顶

        setTimeout(() => {
            if (this.state.currentSeletedIndex == 0) {
                this.props.dispatch((dispatch) => dispatch(loadFlowCenterWaitDataFromServer({
                    page: pageIndex,
                    pagesize: pageSize
                })));
            } else if (this.state.currentSeletedIndex == 1) {
                this.props.dispatch((dispatch) => dispatch(loadOtherFlowFromServer({
                    processStatus: 'Running', 
                    page: pageIndex,
                    pagesize: pageSize,
                })));
            } else {
                this.props.dispatch((dispatch) => dispatch(loadOtherFlowFromServer({
                    processStatus: 'Completed',
                    page: pageIndex,
                    pagesize: pageSize
                })));
            }
        }, 1000);
    };
    //上拉加载
    onhuadong = ()=> {
        pageIndex++;
        setTimeout(() => {
            PublicToast.logMessage('延迟1秒');
            if (this.state.currentSeletedIndex === 0) {
                this.props.dispatch((dispatch) => dispatch(loadFlowCenterWaitDataFromServer({
                    page: pageIndex,
                    pagesize: pageSize
                })));
            } else if (this.state.currentSeletedIndex === 1) {
                this.props.dispatch((dispatch) => dispatch(loadOtherFlowFromServer({
                    processStatus: 'Running',
                    page: pageIndex,
                    pagesize: pageSize
                })));
            } else {
                this.props.dispatch((dispatch) => dispatch(loadOtherFlowFromServer({
                    processStatus: 'Completed',
                    page: pageIndex,
                    pagesize: pageSize
                })));
            }
        }, 1000);
    };
    //点击加载更多数据
    fetchFooterMoreData = ()=> {
        pageIndex++;
        PublicToast.logMessage('页数++===' + pageIndex);
        if (this.state.currentSeletedIndex === 0) {
            this.props.dispatch((dispatch) => dispatch(loadFlowCenterWaitDataFromServer({
                page: pageIndex,
                pagesize: pageSize
            })));
        } else if (this.state.currentSeletedIndex === 1) {
            this.props.dispatch(loadOtherFlowFromServer({
                processStatus: 'Running',
                page: pageIndex,
                pagesize: pageSize
            }));
        } else {
            this.props.dispatch(loadOtherFlowFromServer({
                processStatus: 'Completed',
                page: pageIndex,
                pagesize: pageSize
            }));
        }
    };
    renderRow = (data,sectionID,rowID)=> { 
        return (
            <FlowCell
                sectionID={sectionID}
                rowID={rowID}
                flowType={this.state.currentSeletedIndex}
                data={data}
                rowPressedAction={(data) => {
                    if (data.enabled) { 
                        Actions.flowDetail({
                            title: "流程详情",
                            url: data.url,
                            rowID: rowID,
                            taskID: data.taskID,
                            flowType: this.state.currentSeletedIndex,
                        })
                    }else {
                        PublicToast.showMessage('该审批流还未在移动端上线');
                    }
                }}
            />
        )
    };
    renderFooter = ()=> {
        return (
            <ListFooter
                onPress={() => this.fetchFooterMoreData() }
                isAllLoaded={this.state.isAllLoaded}
                isLoading={this.state.isLoading&&pageIndex>0}
            />
        );
    };

    render() {
        PublicToast.logMessage('数据源:' + this.state.dataSource);
        return (
            <View style={{flex:1,backgroundColor:GlobalSize.colorBgGray}}>
                {this.defaultRenderNavigationBar()}
                <View style={{height:10,backgroundColor:GlobalSize.colorNavBar}}></View>
                <View style={styles.lineBoxContainer}>
                    {this.renderItems(lineOneMenu.slice(0, 3))}
                </View>
                <View style={{flex:1}}>
                    <ListView
                        // ref={component => this._scrollView = component}
                        ref={(ref)=>this.flowCenterListRef = ref}

                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                        renderFooter={this.renderFooter}
                        enableEmptySections={true}
                        refreshControl={
                           <ListRefreshControl
                                refreshing={this.state.isRefreshing && pageIndex == 0 }
                                onRefresh={this.fetchDataSource}
                           />
                        }
                    />
                    {this.state.dataSource.getRowCount() > 0 || this.state.isLoading == false ?
                        null
                        : <LoadingView
                        style={{position:'absolute',top:0,bottom:0,right:0,left:0,justifyContent:'center'}}/>
                    }
                </View>
            </View>
        );
    }
}
//从reducer中取当前与组件绑定的的state
const flowCenterStore = (state)=> {
    return {
        flowState: state.flowCenterState
    }
};
export default FlowCenterPage = connect(flowCenterStore)(FlowCenterPage);

var styles = StyleSheet.create({
    lineBoxContainer: {
        height: 70,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: GlobalSize.colorNavBar,
        // opacity: 0.79,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: GlobalSize.cellPadding,
        marginBottom: 1,
    },
});
