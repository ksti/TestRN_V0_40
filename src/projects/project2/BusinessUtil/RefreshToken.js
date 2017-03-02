import React,{

}from 'react';
import{
    Platform,
    ToastAndroid,
}from 'react-native';

import Toast from 'react-native-root-toast';

import httpRequest from '../../../common/HTTPRequest'
import GlobalSize from '../Global/GlobalSize'
import PublicToast from '../../../components/PublicToast'
import globalStorageUtil from '../../../common/GlobalStorageUtil'


import { Actions } from 'react-native-router-flux';
let HTTPRequest = new httpRequest();

var RefreshToken={

    refreshToken(noToast,callback:Function){
        //显示提示文本
        PublicToast.logMessage('refresh_token:',global.refreshToken);
        if (!global.refreshToken || global.refreshToken.length==0) {
            // Actions.loginIn();
            if (noToast !==true ) {
                PublicToast.showMessage('网络异常，获取用户票据失败');
            };
            return;
        }
        let parameter = {
            grant_type:'refresh_token',
            refresh_token:global.refreshToken,
        }
        let urlStr = GlobalSize.BaseURL+'thrwebapi/passport/oauth/token';
        HTTPRequest.normal = true;
        HTTPRequest.contentType='form';
        HTTPRequest.requestPostWithUrl(urlStr,parameter,function(error,responseData, response){
            if (error) {
                PublicToast.logMessage('登录失败');
                if (noToast !==true ) {
                    PublicToast.showMessage('网络异常，获取用户票据失败');
                };
                if (callback) {
                    callback(false);
                }
                // Actions.loginIn();
            }else {
                if (responseData.message && responseData.message.length>0) {
                    PublicToast.logMessage('token刷新失败'+responseData.message);
                    if (noToast !==true ) {
                        PublicToast.showMessage('网络异常，获取用户票据失败');
                    };
                    if (callback) {
                        callback(false);
                    }
                    // Actions.loginIn();
                }else {

                    // 保存信息 tokenInfo
                    let tokenInfo = {};
                    // {
                    //     GlobalSize.Global_RefreshToken: userInfo.refresh_token,
                    //     GlobalSize.Global_AccessToken: userInfo.access_token,
                    //     GlobalSize.Global_ExpiresIn: userInfo.expires_in,
                    //     GlobalSize.Global_ExpiresTime: userInfo.expires_time,
                    //     GlobalSize.Global_TokenType: userInfo.token_type,
                    //     GlobalSize.Global_LoginTime: new Date(),
                    // }
                    tokenInfo[GlobalSize.Global_RefreshToken] = responseData.refresh_token;
                    tokenInfo[GlobalSize.Global_AccessToken] = responseData.access_token;
                    tokenInfo[GlobalSize.Global_ExpiresIn] = responseData.expires_in;
                    tokenInfo[GlobalSize.Global_ExpiresTime] = responseData.expires_time;
                    tokenInfo[GlobalSize.Global_TokenType] = responseData.token_type;
                    tokenInfo[GlobalSize.Global_LoginTime] = new Date().getTime();

                    global.accessToken = responseData.access_token; // 保存 accessToken 信息
                    global.refreshToken = responseData.refresh_token; // 保存 refreshToken 信息
                    global.expiresIn = responseData.expires_in; // 保存 expiresIn 信息
                    global.expiresTime = responseData.expires_time; // 保存 expiresTime 信息
                    global.tokenType = responseData.token_type; // 保存 tokenType 信息
                    
                    globalStorageUtil.setKeyValue(GlobalSize.Global_TokenInfo, tokenInfo, (error, result) => {
                        if (error) {
                            PublicToast.logMessage('save error: ' + error.message);
                        } else {
                            if (result) {
                                PublicToast.logMessage('save success: ' + result);
                            }else {
                                //
                            }
                        }
                    });

                    global.storageUtil.setKeyValue(GlobalSize.Global_RefreshToken,responseData.refresh_token)
                    .then(()=>{
                        global.refreshToken = responseData.refresh_token;
                    })
                    global.storageUtil.setKeyValue(GlobalSize.Global_AccessToken,responseData.access_token)
                    .then(()=>{
                        global.accessToken = responseData.access_token;
                        if (callback) {
                            callback(true);
                        }
                        // Actions.tabbar();
                    }).catch(()=>{
                        if (noToast !==true ) {
                            PublicToast.showMessage('网络异常，获取用户票据失败');
                        };
                        if (callback) {
                            callback(false);
                        }
                        // Actions.loginIn();
                    })
                }
            }
        })
    },
    onFetchUserInfo(callback:Function){
        PublicToast.logMessage('请求用户信息');
        HTTPRequest.normal = false;
        HTTPRequest.requestGetWithUrl(GlobalSize.ProductURL+"yuanxinApi/Organization/getuserinfo", [],
            function (error, responseData,response) {
                if (error) {
                    PublicToast.logMessage('error' + error.message);
                    PublicToast.showMessage('获取用户信息失败');
                    if (response &&response.status == 401) {
                       this.refreshToken();
                    }else{
                        if (callback) {
                            callback(false,'获取用户信息失败');
                        }
                    }
                } else {
                    if (responseData) {
                        if (responseData && responseData.message) {
                            if (callback) {
                                callback(false,'获取用户信息失败');
                            }
                        }else {
                            global.userInfo = responseData;
                            global.storageUtil.setKeyValue(GlobalSize.Global_UserInfo,responseData)
                            .then((userInfo)=>{
                                if (callback) {
                                    callback(true,userInfo);
                                }
                            })
                            .catch(()=>{
                                if (callback) {
                                    callback(true,responseData);
                                }
                            })
                        }
                    } else {
                        if (callback) {
                            callback(false,'获取用户信息失败');
                        }
                    }
                }
            });
    }
}

module.exports = RefreshToken;
