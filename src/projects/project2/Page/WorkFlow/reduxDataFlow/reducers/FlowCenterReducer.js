/**
 * Created by yingying on 16/7/25.
 */

//流程中心

import React, {
    ListView
} from 'react-native';
// 引入公用路径导航
import {
    commonPath,
    componentsPath,
    containersPath,
    resourcePath,
    //--- Business Path ---
    GlobalPath,
} from '../../../../PathIndex' // Page 目录的上个目录, 层级深度:4

import ActionConstants from '../constants';
/* import from .. 似乎不支持字符串表达式。。require()也是
import PublicToast from componentsPath(4) + '/PublicToast'
*/
import PublicToast from '../../../../../../components/PublicToast'

var  flowCenterState = (state, action) => {

    state = state || {
            isLoading:false,
            flowData:{},
            flowHomeData:{},
            type:'',
            error:false, 
            taskID:'',
            rowIndex:0,
            flowType:0,
        };

    switch(action.type) {
        case ActionConstants.FLOWCENTER_LOADING: {
            return Object.assign({},state,{   //object.assign  用于对象的合并, 第一个参数是目标对象，后面的参数都是源对象
                ...state,
                type:ActionConstants.FLOWCENTER_LOADING,
                flowData:action.responseData,
                isLoadingFlowCenter:action.isLoading
            });
        }
            break;
        case ActionConstants.FLOWCENTER_FINISH:{
            PublicToast.logMessage('flowCenter列表：'+action.responseData);
            return Object.assign({},state,{
                ...state,
                type:ActionConstants.FLOWCENTER_FINISH,
                flowData:action.responseData,
                isLoadingFlowCenter:action.isLoading
            });
            break;
        }
        case ActionConstants.FLOWCENTER_ERROE:{
            return Object.assign({},state,{
                ...state,
                type:ActionConstants.FLOWCENTER_ERROE,
                flowData:action.responseData,
                error:true,
                isLoadingFlowCenter:action.isLoading
            });
            break;
        }
        case ActionConstants.FLOWCENTERHOME_LOADING: {
            return Object.assign({},state,{   //object.assign  用于对象的合并, 第一个参数是目标对象，后面的参数都是源对象
                ...state,
                type:ActionConstants.FLOWCENTERHOME_LOADING,
                flowHomeData:action.responseData,
                isLoadingFlowCenter:action.isLoading
            });
        }
            break;
        case ActionConstants.FLOWCENTERHOME_FINISH:{
            PublicToast.logMessage('flowCenter列表：'+action.responseData);
            return Object.assign({},state,{
                ...state,
                type:ActionConstants.FLOWCENTERHOME_FINISH,
                flowHomeData:action.responseData,
                isLoadingFlowCenter:action.isLoading
            });
            break;
        }
        case ActionConstants.FLOWCENTERHOME_ERROE:{
            return Object.assign({},state,{
                ...state,
                type:ActionConstants.FLOWCENTERHOME_ERROE,
                flowHomeData:action.responseData,
                isLoadingFlowCenter:action.isLoading
            });
            break;
        }
        case ActionConstants.FLOWHASREAD_SUCCESS:{
            return Object.assign({},state,{
                type:ActionConstants.FLOWHASREAD_SUCCESS,
                taskID:action.taskID,
                rowIndex:action.rowIndex,
                flowType:action.flowType,
            })
            break;
        }
        case ActionConstants.FLOWHASREAD_FAIL:{
            return Object.assign({},state,{
                type:ActionConstants.FLOWHASREAD_FAIL,
                taskID:action.taskID,
                rowIndex:action.rowIndex,
                flowType:action.flowType,
            })
            break;
        }

            break;
        default: return {
            ...state
        }
    }
};

var flowHasRead =()=>{

}

module.exports = {flowCenterState};
