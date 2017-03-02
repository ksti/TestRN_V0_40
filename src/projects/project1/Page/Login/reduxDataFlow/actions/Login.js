
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

HTTPRequest = new httpRequest();

export function loginIn(parameter){
    return(dispatch)=>{
        dispatch({'type':ActionConstants.LOGIN_DOING});
        let urlStr = GlobalSize.BaseURL+'passport/oauth/token';
        HTTPRequest.contentType = 'form';
        HTTPRequest.handleResponse = false;
        HTTPRequest.setRequestHeader({
            'Content-Type': 'application/x-www-form-urlencoded',
        });
        HTTPRequest.requestPostWithUrl(urlStr,parameter,function(error,responseData, response){
            if (error) {
                PublicToast.showMessage('登录失败,请重试');
                dispatch({
                    'type':ActionConstants.LOGIN_ERROR,
                })
            }else {
                if (responseData) {
                    if (responseData.message && responseData.message.length>0) {
                        PublicToast.showMessage('登录失败,请重试');
                        dispatch({
                            'type':ActionConstants.LOGIN_ERROR,
                        })
                    }else {
                        dispatch({
                            'type':ActionConstants.LOGIN_IN,
                            userInfo:responseData,
                        })
                    }
                }else {
                    PublicToast.showMessage('登录失败');
                    PublicToast.logMessage('response' + response.status);
                    dispatch({
                        'type':ActionConstants.LOGIN_ERROR,
                    })
                }
            }
        })
    }
}

module.exports = {
    loginIn,
};
