/*
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoConstants
 */

var keyMirror = require('keymirror');
var assign = require('object-assign');

import * as ActionConstants from './ActionConstantsIndex'

/* 参考写法
module.exports = keyMirror({
    // 工作通 actions
    INITIAL_TODOS: null,
    LOAD_DEFAULT_TODOS: null,
    TODO_REFRESH: null, // 刷新
    TODO_CREATE: null,
    TODO_APPEND_TODO: null, // 在末尾增加一条数据
    TODO_APPEND_TODOS: null, // 在末尾增加一组数据
    TODO_COMPLETE: null,
    TODO_DESTROY: null,
    TODO_DESTROY_COMPLETED: null,
    TODO_TOGGLE_COMPLETE_ALL: null,
    TODO_UNDO_COMPLETE: null,
    TODO_UPDATE_TEXT: null,
    TODO_LOADING: null, // 是否加载todos中

    //
    SET_VISIBILITY_FILTER: null,

    //Login
    LOGIN_DOING: null,//loading
    LOGIN_IN: null,//logined in
    LOGIN_ERROR: null,//login error
    LOGIN_OUT: null,//exit out

    //signIn
    SIGNIN_LOADING: null,
    SIGNIN_SUCCESS: null,
    SIGNIN_ERROR: null,

    //signStatics
    SIGNIN_STATICS_LOADING: null,
    SIGNIN_STATICS_SUCCESS: null,
    SIGNIN_STATICS_ERROR: null,

    //signStaticsDetail
    SIGNIN_DETAIL_LOADING: null,
    SIGNIN_DETAIL_SUCCESS: null,
    SIGNIN_DETAIL_ERROR: null,

    //会议预定－会议室列表
    MEETING_LOADING: null,
    MEETING_SUCCESS: null,
    MEETING_ERROR: null,
    //会议预定-部门列表
    MEETING_DEPRTMENTLIST_LOADING: null,
    MEETING_DEPRTMENTLIST_SUCCESS: null,
    MEETING_DEPRTMENTLIST_ERROR: null,

    //会议申请－公司列表,成本中心列表
    MEETING_ORDERLIST_LOADING: null,
    MEETING_COMPANYLIST_SUCCESS: null,
    MEETING_COMPANYLIST_ERROR: null,
    MEETING_COSTLIST_SUCCESS: null,
    MEETING_COSTLIST_ERROR: null,
    MEETING_CHECKLIST_SUCCESS: null,
    MEETING_CHECKLIST_ERROR: null,
    MEETING_SUBMITBOOK_SUCCESS:null,
    MEETING_SUBMITBOOK_ERROR:null,

    //帮助
    INITIAL_HELP: null,
    HELP_FEEDBACK: null,//帮助——反馈
    HELP_FEEDBACK_LOADING: null,
    HELP_SERVICE: null,//帮助——服务
    HELP_SERVICE_LOADING: null,

    //流程中心
    FLOWCENTER_LOADING: null,
    FLOWCENTER_FINISH: null,//请求完成
    FLOWCENTER_ERROE: null,

    FLOWCENTERHOME_LOADING: null,
    FLOWCENTERHOME_FINISH: null,//请求完成
    FLOWCENTERHOME_ERROE: null,

    //通知纪要 列表
    NOTICE_LOADING: null,
    NOTICE_FINISH: null,
    NOTICE_ERROR: null,

    //通知纪要 详情
    NOTICE_DETAIL_LOADING: null,
    NOTICE_DETAIL_FINISH: null,
    NOTICE_DETAIL_ERROR: null,

    //案场报表 列表（首页/搜索/关注）
    CASE_REPORT_LOADING: null,
    CASE_REPORT_FINISH: null,
    CASE_REPORT_ERROR: null,

    //案场报表——关注列表
    CASE_REPORTAttention_LOADING: null,
    CASE_REPORTAttention_FINISH: null,
    CASE_REPORTAttention_ERROR: null,

    //关注统计
    CASE_Statistics_LOADING: null,
    CASE_Statistics_FINISH: null,
    CASE_Statistics_ERROR: null,


    //案场报表 详情
    CASE_REPORT_DETAIL_LOADING: null,
    CASE_REPORT_DETAIL_FINISH: null,
    CASE_REPORT_DETAIL_ERROR: null,

    //案场报表关注编辑——清空
    CASE_REPORT_CLEAR_LOADING: null,
    CASE_REPORT_CLEAR_FINISH: null,
    CASE_REPORT_CLEAR_ERROR: null,

    //案场报表关注编辑——删除
    CASE_REPORT_DELETE_LOADING: null,
    CASE_REPORT_DELETE_FINISH: null,
    CASE_REPORT_DELETE_ERROR: null,

    //案场报表——添加关注
    CASE_REPORT_ADDATTENTION_LOADING:null,
    CASE_REPORT_ADDATTENTION_FINISH:null,
    CASE_REPORT_ADDATTENTION_ERROR:null,

    //高管周报事项列表
    SENIORWEEKLY_ITEMLIST_LOADING: null,
    SENIORWEEKLY_ITEMLIST_FINISH: null,
    SENIORWEEKLY_ITEMLIST_ERROR: null,

    //高管周报高管列表
    SENIORWEEKLY_MANAGERLIST_LOADING: null,
    SENIORWEEKLY_MANAGERLIST_FINISH: null,
    SENIORWEEKLY_MANAGERLIST_ERROR: null,

    //高管周报获取事业部列表
    SENIORWEEKLY_GET_BU_LOADING: null,
    SENIORWEEKLY_GET_BU_FINISH: null,
    SENIORWEEKLY_GET_BU_ERROR: null,

    //高管周报获取事业部高管信息
    SENIORWEEKLY_REQUEST_BUMANAGER_LOADING: null,
    SENIORWEEKLY_REQUEST_BUMANAGER_FINISH: null,
    SENIORWEEKLY_REQUEST_BUMANAGER_ERROR: null,
});
*/


module.exports = assign({},
    ActionConstants,
);
