/*
    列表表尾：加载更多
    属性:
        1.allLoaded-是否加载完毕
        2.onPress 点击方法
        3.isLoading 是否是正在加载
*/

import React,{Component} from 'react'
import {
    Image,
    View,
    Text,
    TouchableHighlight,
    ActivityIndicator,
    StyleSheet,
} from 'react-native'

import GlobalSize from '../Global/GlobalSize'

export default class ListFooter extends Component{
    constructor(props){
        super(props);
    }
    render(){
        // console.log('footer-加载完毕:',this.props.isAllLoaded);
        if (this.props.isAllLoaded) {
            return(
                <View style={{justifyContent:'center',height:50,backgroundColor:GlobalSize.colorBgGray}}>
                    <View style={[{height:5},this.props.separatorStyle]}/>
                    <View style={{flex:1,backgroundColor:'white',justifyContent:'center'}}>
                    <Text style={styles.textStyle}>
                        没有数据了
                    </Text>
                    </View>
                    <View style={{height:5}}/>
                </View>
            );
        }else if(this.props.isLoading){
            return(
                <TouchableHighlight underlayColor={GlobalSize.colorBgGray} style={{backgroundColor:GlobalSize
                .colorBgGray}}>
                    <View style={{flex:1,height:50}}>
                        <View style={[{height:5,backgroundColor:GlobalSize.colorBgGray},this.props.separatorStyle]}/>
                        <View style={{flex:1, justifyContent:'center',backgroundColor:'white'}}>
                            <ActivityIndicator
                                animating={true}
                                size='small'
                                color={GlobalSize.colorGrayText}
                            />
                        </View>
                        <View style={{height:5,backgroundColor:GlobalSize.colorBgGray}}/>
                    </View>
                </TouchableHighlight>
            );
        }else {
            return(
                <TouchableHighlight underlayColor={GlobalSize.colorBgGray} onPress={()=>this.props.onPress()} style={{backgroundColor:GlobalSize.colorBgGray}}>
                    <View style={{flex:1,height:50}}>
                        <View style={[{height:5},this.props.separatorStyle]}/>
                        <View style={{flex:1, justifyContent:'center',backgroundColor:'white'}}>
                            <Text style={styles.textStyle}>点击加载更多</Text>
                        </View>
                        <View style={{height:5}}/>
                    </View>
                </TouchableHighlight>
            );
        }
    }
}

const styles=StyleSheet.create({
    textStyle:{
        textAlign:'center',
        height:20,
        color:GlobalSize.colorBlackText,
        fontSize:GlobalSize.fontSizeTitle
    }
})
