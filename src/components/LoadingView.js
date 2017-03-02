'use strict';

import React, {
    Component
} from 'react'
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    Image,
    Dimensions,
}from 'react-native'

let SCREEN_WIDTH = Dimensions.get("window").width;
let SCREEN_HEIGHT = Dimensions.get("window").height;
export default class LoadingView extends Component {
    render() {
        return (
            <View 
                style={[
                    {
                        flex:1,
                        backgroundColor:'#efeff4',
                        justifyContent:'center',
                        alignItems:'center'
                    }, 
                    this.props.style,
                ]}
            >
                <View style={[{flex:1,backgroundColor:'#efeff4',justifyContent:'center',flexDirection:'row',alignItems:'center'}]}>
                    <View style={{flex:1}}></View>
                    <View style={{justifyContent: 'center',flexDirection:'row',alignItems:'center',width:78,height:40}}>
                        <ActivityIndicator
                            animating={true}
                            style={[{width:30}]}
                            size="small"
                        />
                        <View style={{flex:1,justifyContent:'center'}}>
                            <Text 
                                allowFontScaling={false} 
                                style={[
                                    {
                                        fontSize: 20,
                                        textAlign: 'left',
                                        color: '#a7a7a7', // 副标题黑灰色
                                    },
                                    this.props.textStyle,
                                ]}
                            >
                                {this.props.text || '远薪'}
                            </Text>
                        </View>
                    </View>
                    <View style={{flex:1}}></View>
                </View>
            </View>
        );
    }
}