import React,{
    Component
} from 'react'
import {
    View,
    Text,
    WebView,
    ActivityIndicator,
    Dimensions,
}from 'react-native'

import BaseContainer from './BaseContainer'
import httpRequest from '../common/HTTPRequest'
import PublicToast from '../components/PublicToast'

let HTTPRequest = new httpRequest();

export default class WebViewContainer extends BaseContainer{
    constructor(props){
        super(props);
        this.state={
          url: '',
          loadEnd:false,
        }
    }

    componentDidMount(){
    }

    //加载完成
    loadEnd=()=>{
      this.setState({ loadEnd: true });
    }
    render() {
        return (
                <View style={[{flex:1}, this.props.style]}>
                    {this.defaultRenderNavigationBar()}
                    <WebView style={[{flex:1}]}
                        automaticallyAdjustContentInsets={false}
                        source={this.state.url?{uri:this.state.url}:{}}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        decelerationRate="normal"
                        onLoadEnd={this.loadEnd}
                        scalesPageToFit={true}
                        />
                    <View pointerEvents='none' style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height,justifyContent: 'center',position:'absolute',top:0,left:0,zIndex:999}}>
                              <ActivityIndicator
                                animating={!this.state.loadEnd}
                                style={{flex:1}}
                                size="small"
                              />
                    </View>
                </View>
        );
    }
}
