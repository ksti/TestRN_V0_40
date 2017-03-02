/**
 * Created by yingying on 16/7/25.
 */

// 引入公用路径导航
import {
    commonPath,
    componentsPath,
    containersPath,
    resourcePath,
    //--- Business Path ---
    GlobalPath,
    BusinessUtilPath,
    BusinessComponentPath,
} from '../../../../PathIndex' // Page 目录的上个目录, 层级深度:4

/* import from .. 似乎不支持字符串表达式。。require()也是
import ActionConstants from '../constants';
import httpRequest from commonPath(4) + '/HTTPRequest'
import GlobalSize from GlobalPath(4) + '/GlobalSize'
import PublicToast from componentsPath(4) + '/PublicToast'
import RefreshToken from BusinessUtilPath(4) + '/RefreshToken'
*/
import ActionConstants from '../constants';
import httpRequest from '../../../../../../common/HTTPRequest'
import GlobalSize from '../../../../Global/GlobalSize'
import PublicToast from '../../../../../../components/PublicToast'
import RefreshToken from '../../../../BusinessUtil/RefreshToken'

let HTTPRequest = new httpRequest();

/*
 * http request   流程中心
 */
var myFlowDS = [];// 流转
let waitFlowDS = []; // 待办
var doneFlowDS =[]; // 办结
var myFlowIndex=0;  //流转页码
var waitFlowIndex=0;    //待办页码
var doneFlowIndex=0;    //办结页码

/**
 *
 * 待办  yuanxinApi/UserTask/LoadUserTask?page=0&pagesize=5
 * 流转中和已办结  yuanxinApi/UserTask/LoadUserTasksProcessStatus?page=0&pagesize=10&processStatus=Running
 * processStatus:请求的是已办结还是流转中，Running流转中，Completed已办结
 */


//待办列表
export function loadFlowCenterWaitDataFromServer(parameter){
    PublicToast.logMessage('待办参数:'+parameter);
    return (dispatch,getState) => {
        dispatch({
            type: ActionConstants.FLOWCENTER_LOADING,
            isLoading: true
        });
        PublicToast.logMessage('触发fetchFlow方法：flowCenter_loadings');
        let urlStr = GlobalSize.BaseURL+'yuanxinApi/UserTask/LoadUserTask';
        // let urlStr = GlobalSize.ProductURL+'yuanxinApi/UserTask/LoadUserTask';

        HTTPRequest.requestGetWithUrl(urlStr, parameter,
            function (error, responseData,response) {
                if (error) {
                    //测试数据
                    PublicToast.showMessage("请求数据失败");
                    
                    if (response &&response.status == 401) {
                        RefreshToken.refreshToken();
                    }
                    dispatch({
                        type: ActionConstants.FLOWCENTER_ERROE,
                        responseData:waitFlowDS,
                        isLoading: false
                    });
                } else {
                    if (responseData && responseData.message && responseData.message.length>0) {
                        PublicToast.showMessage("请求数据失败");
                        dispatch({
                            type: ActionConstants.FLOWCENTER_ERROE,
                            responseData:waitFlowDS,
                            isLoading: false,
                        });
                    }else if (responseData) {
                        if(parameter.page == 0){
                            waitFlowDS = []
                        }
                        
                        let responseList = responseData;
                        PublicToast.logMessage('response:'+responseList);
                        if (responseList.length==0) {
                            PublicToast.showMessage('没有数据了');
                        };
                        let count = waitFlowDS.length;
                         for (var x = 0; x < responseList.length; x++) {
                             waitFlowDS[x + count] = responseList[x];
                         }
                         waitFlowIndex = parameter.page;
                         dispatch({
                             type: ActionConstants.FLOWCENTER_FINISH,
                             responseData: waitFlowDS,
                             isLoading: false
                         });
                    }else {
                        PublicToast.showMessage('请求数据失败');
                        dispatch({
                            type: ActionConstants.FLOWCENTER_ERROE,
                            responseData:waitFlowDS,
                            isLoading: false
                        });
                    }
                }
            }.bind(this));
    };
}


//待办列表首页
export function loadFlowCenterWaitDataHomeFromServer(parameter) {
    PublicToast.logMessage('待办参数:' + parameter);
    return (dispatch, getState) => {
        dispatch({
            type: ActionConstants.FLOWCENTERHOME_LOADING,
            isLoading: true
        });
        PublicToast.logMessage('触发fetchFlow方法：flowCenter_loadings');
        let urlStr = GlobalSize.BaseURL + 'yuanxinApi/UserTask/LoadUserTask';

        HTTPRequest.requestGetWithUrl(urlStr, parameter,
            function (error, responseData,response) {
                if (error) {
                    PublicToast.showMessage("请求数据失败");
                    if (response &&response.status == 401) {
                        RefreshToken.refreshToken();
                    }
                    dispatch({
                        type: ActionConstants.FLOWCENTERHOME_ERROE,
                        responseData: waitFlowDS,
                        isLoading: false
                    });
                } else {
                    if (responseData && responseData.message && responseData.message.length > 0) {
                        PublicToast.showMessage("请求数据失败");
                        dispatch({
                            type: ActionConstants.FLOWCENTERHOME_ERROE,
                            responseData: parameter.page==0?[]:waitFlowDS,
                            isLoading: false,
                        });
                    } else if (responseData) {
                        if (parameter.page == 0) {
                            waitFlowDS = []
                        }
                        let responseList = responseData;
                        if (responseList.length==0) {
                            PublicToast.showMessage('没有数据了');
                        };
                        let count = waitFlowDS.length;
                        for (var x = 0; x < responseList.length; x++) {
                            waitFlowDS[x + count] = responseList[x];
                            }
                        waitFlowIndex = parameter.page;
                        dispatch({
                            type: ActionConstants.FLOWCENTERHOME_FINISH,
                            responseData: waitFlowDS,
                            isLoading: false
                        });
                    } else {
                        PublicToast.logMessage('请求数据失败')
                        dispatch({
                            type: ActionConstants.FLOWCENTERHOME_ERROE,
                            responseData: waitFlowDS,
                            isLoading: false
                        });
                    }
                }
            }.bind(this));
    };
}
//http request 流转中／已办结
export function loadOtherFlowFromServer(parameter){
    PublicToast.logMessage('流转中／已办结参数:'+parameter);
    var newRows=[];
    if (parameter.processStatus=='Running') {
        //流转中
        newRows=myFlowDS;
    }else {
        //已办结
        newRows=doneFlowDS;
    }
    return (dispatch,getState) => {
        dispatch({
            type: ActionConstants.FLOWCENTER_LOADING,
            isLoading: true
        });
        PublicToast.logMessage('触发fetchFlow方法：flowCenter_loadings');
        let urlStr = GlobalSize.BaseURL+'yuanxinApi/UserTask/LoadUserTasksProcessStatus';
        HTTPRequest.requestGetWithUrl(urlStr, parameter,
            function (error, responseData,response) {
                if (error) {
                    PublicToast.showMessage("请求数据失败");
                    if (response &&response.status == 401) {
                        RefreshToken.refreshToken();
                    }
                    dispatch({
                        type: ActionConstants.FLOWCENTER_ERROE,
                        responseData:parameter.page==0?[]:newRows,
                        isLoading: false
                    });
                } else {
                    if (responseData && responseData.message && responseData.message.length>0) {
                        // newRows=[];
                        PublicToast.showMessage('请求数据失败')
                        dispatch({
                            type: ActionConstants.FLOWCENTER_ERROE,
                            responseData:parameter.page==0?[]:newRows,
                            isLoading: false
                        });
                    }else if (responseData) {
                        if(parameter.page == 0){newRows = []}

                        let responseList = responseData;
                        if (responseList.length==0) {
                            PublicToast.showMessage('没有数据了');
                        };
                        let count = newRows.length
                        for (var x = 0; x < responseList.length; x++) {
                             newRows[x + count] = responseList[x];
                         }
                         if (parameter.processStatus == 'Running') {
                             myFlowDS=newRows;
                             myFlowIndex=parameter.page;
                         }else {
                             doneFlowDS=newRows;
                             doneFlowIndex=parameter.page;
                         }

                         dispatch({
                             type: ActionConstants.FLOWCENTER_FINISH,
                             responseData: newRows,
                             isLoading: false
                         });
                    }else {
                        // newRows = [];
                        PublicToast.showMessage('请求数据失败');
                        dispatch({
                            type: ActionConstants.FLOWCENTER_ERROE,
                            responseData:parameter.page==0?[]:newRows,
                            isLoading: false
                        });
                    }
                }
            }.bind(this));
    };
}
//待办设置为已读
export function loadFlowHasRead(parameter){
    return(dispatch,getState)=>{
        let urlStr = GlobalSize.BaseURL+'yuanxinApi/UserTask/SetTaskReadFlag?taskID='+parameter.taskID;
        if (parameter.flowType!==0) {
            urlStr = GlobalSize.BaseURL+'yuanxinApi/UserTask/SetAccomplihd?taskID='+parameter.taskID;
        }; 
        HTTPRequest.requestGetWithUrl(urlStr,'',function (error, responseData,response) {
             if (error ||(responseData && responseData.message && responseData.message.length>0)) {
                     
                    dispatch({
                        type: ActionConstants.FLOWHASREAD_FAIL,
                        taskID:parameter.taskID,
                        rowIndex:parameter.rowIndex,
                        flowType:parameter.flowType,
                    });
            }else{
                 if(responseData==='Yes')
                 {
                     dispatch({
                         type: ActionConstants.FLOWHASREAD_SUCCESS,
                         taskID:parameter.taskID,
                         rowIndex:parameter.rowIndex,
                         flowType:parameter.flowType,
                     });
                 }else{
                     dispatch({
                         type: ActionConstants.FLOWHASREAD_FAIL,
                         taskID:parameter.taskID,
                         rowIndex:parameter.rowIndex,
                         flowType:parameter.flowType,
                     });
                 }
            }
        });
    }
}

module.exports = {
    loadFlowCenterWaitDataFromServer,
    loadOtherFlowFromServer,
    loadFlowCenterWaitDataHomeFromServer,
    loadFlowHasRead
};
