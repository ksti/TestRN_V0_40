
/**
 * 流程详情
 */

import React,{
    Component
} from 'react'
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    WebView,
    requireNativeComponent,
    NativeModules,
    InteractionManager,
}from 'react-native'

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
import * as allActions from reduxDataFlowPath(2) + '/actions';
import { loadFlowHasRead } from './reduxDataFlow/actions';
import YuanxinWebview from componentsPath(2) + '/WebView/YuanxinWebView'
import BaseContainer from containersPath(2) + '/BaseContainer'
import httpRequest from commonPath(2) + '/HTTPRequest'
import PublicToast from componentsPath(2) + '/PublicToast'
import GlobalSize from GlobalPath(2) + '/GlobalSize'
import LoadingView from componentsPath(2) + '/LoadingView'
import RefreshToken from BusinessUtilPath(2) + '/RefreshToken'
*/
import * as allActions from '../../../../reduxDataFlow/actions';
import { loadFlowHasRead } from './reduxDataFlow/actions';
import YuanxinWebview from '../../../../components/WebView/YuanxinWebView'
import BaseContainer from '../../../../containers/BaseContainer'
import httpRequest from '../../../../common/HTTPRequest'
import PublicToast from '../../../../components/PublicToast'
import GlobalSize from '../../Global/GlobalSize'
import LoadingView from '../../../../components/LoadingView'
import RefreshToken from '../../BusinessUtil/RefreshToken'

let HTTPRequest = new httpRequest();

var WebViewOnCookieManager = NativeModules.WebViewOnCookieManager;
var WebViewOnCookie = requireNativeComponent('WebViewOnCookie',null);

var RCTMap = requireNativeComponent('RCTBaiduMap',null);
var RNBaiduModule = NativeModules.RNBaiduModule;

class FlowDetailPage extends BaseContainer{
    constructor(props){
        super(props);
        this.state={
            url: '',
            isLoading: true,
            renderPlaceholderOnly: true,
        }
        // this.actions = bindActionCreators(allActions, dispatch);
    }
    componentDidMount(){
        PublicToast.logMessage('详情请求地址:'+this.props.url);
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                renderPlaceholderOnly: false
            });
        });
        this.setState({
            isLoading:true,
        })
        this._getDetail();
    }
    componentDidUnMount(){
        this.setState({
            isLoading:false,
        })
    }
    
    _renderPlaceholderView() {
        return (
            <View style={{flex:1,backgroundColor:GlobalSize.colorBgGray}}>
                {this.defaultRenderNavigationBar()}
                    <LoadingView />
            </View>
        );
    }

    _getDetail = () => {
        if (this.props.url) {
            //网络请求流程详情
            var thisOb = this;
            HTTPRequest.requestGetWithUrl(GlobalSize.BaseURL+"passport/Shim/GetPreviousVersionTicket",'',
                function(error,responseData,response){
                    if (error) {
                        PublicToast.showMessage('请求数据失败');
                        if (response &&response.status == 401) {
                            RefreshToken.refreshToken();
                            return;
                        }
                        thisOb.setState({
                            isLoading:false,
                            renderPlaceholderOnly: false,
                        })
                    }else {
                        if (responseData) {
                            let finalURL = thisOb.props.url+'&t='+encodeURIComponent(responseData);
                            thisOb.setState({
                                url: finalURL,
                            });
                            // WebViewOnCookieManager.loadWebWithURL(finalURL,(error,responseStr)=>{
                            //     if (error) {
                            //         // PublicToast.showMessage('加载出错');
                            //         PublicToast.showMessage('加载出错，没有找到相关流程');
                            //         // Actions.pop();
                            //     }else{
                            //         // PublicToast.showMessage('加载成功');
                            //     };
                            //     thisOb.setState({
                            //         isLoading:false,
                            //     })
                            // })
                            thisOb._requestReader();
                        }else {
                            PublicToast.showMessage('请求数据失败');
                            thisOb.setState({
                                isLoading: false,
                                renderPlaceholderOnly: false,
                            })
                        }
                    }
            });
        }else{
            PublicToast.showMessage('没有找到相关流程');
            thisOb.refs.loading.dismiss();
            thisOb.setState({
                isLoading:false,
                renderPlaceholderOnly: false,
            })
        }
    }


    _requestReader= () => {
        let parameter =
        {
            rowIndex: this.props.rowID,
            flowType: this.props.flowType,
            taskID: this.props.taskID,
        }
        this.props.dispatch(loadFlowHasRead(parameter));
        // this.props.dispatch((dispatch) => dispatch(loadFlowHasRead(parameter)));
    }
    defaultNavigationTitle(){
        return{
            title:this.props.title ||'流程详情',
            tintColor:this.defaultTintColor()
        };
    }

    _renderWebViewOnCookie = () => {
        return(
            <View style={{flex:1,backgroundColor:GlobalSize.colorBgGray}}>
                {this.defaultRenderNavigationBar()}
                <View style={{flex:1}}>
                    <WebViewOnCookie style={{flex:1}} />
                    {
                        this.state.isLoading==true?
                        <LoadingView style={{
                            position:'absolute',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0}}/>
                        :null                  
                    }
                </View>
            </View>
        );
    }

    _onLoad = () => {
        PublicToast.logMessage('webView onLoad');
    }

    _onLoadStart = () => {
        PublicToast.logMessage('webView onLoadStart');
    }
    
    _onLoadEnd = () => {
        this.setState({
            isLoading: false,
            renderPlaceholderOnly: false,
        });
    }
    
    _onError = () => {
        this.setState({
            isLoading: false,
            renderPlaceholderOnly: false,
        });
    }
    
    _onProgress = (progress) => {
        PublicToast.logMessage('webView onProgress: ' + progress);
    }
    

    _renderYuanxinWebView = () => {
        const {
          url,
        } = this.state;

        if (url) {
            return(
                <View style={{flex:1,backgroundColor:GlobalSize.colorBgGray}}>
                    {this.defaultRenderNavigationBar()}
                    <View style={{flex:1}}>
                        <YuanxinWebview 
                            style={{flex:1}} 
                            url={url}
                            clearCookies={true}
                            onLoadStart={this._onLoadStart}
                            onLoad={this._onLoad}
                            onLoadEnd={this._onLoadEnd}
                            onError={this._onError}
                            onProgress={this._onProgress}
                        />
                        {
                            this.state.isLoading==true?
                            <LoadingView style={{
                                position:'absolute',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0}}/>
                            :null                  
                        }
                    </View>
                </View>
            );
        } else {
            return (
                <View style={{flex:1,backgroundColor:GlobalSize.colorBgGray}}>
                    {this.defaultRenderNavigationBar()}
                </View>
            );
        }
    }

    render(){
        if (this.state.renderPlaceholderOnly) {
            return this._renderPlaceholderView();
        };
        // return this._renderWebViewOnCookie();
        return this._renderYuanxinWebView();
    }
    onShouldStartLoadWithRequest=()=> {
        // Implement any custom loading logic here, don't forget to return!
        return true;
    };

}
const flowCenterState=(state)=>{
    return{
        
    }
};
export default connect(flowCenterState)(FlowDetailPage)

const styles = StyleSheet.create({
    container: {
        flex:1
    },
    webViewStyle: {
        flex: 1
    }
});
