/*
存放特定组件的style
1.导航
2.row的标题，内容以及副标题的类型
*/

import React from 'react';
import {
  StyleSheet
} from 'react-native';

import GlobalSize from './GlobalSize'
import { Actions } from 'react-native-router-flux';


module.exports = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
        justifyContent: 'center',
        alignItems: 'center',
    },
    navigationBar: {  //头部标题文字
        backgroundColor: '#333333'
    },
    navigationTintColor: {
        color: 'white',
    },
    navigationTitle: { //头部导航
        color: 'white',
        fontSize: GlobalSize.fontSizeNav,
        marginTop:10,
    },
    leftButton:{
        backgroundColor: "transparent",
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    rightButton:{
        backgroundColor: "transparent",
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginRight:10,
    },
    cellTitleText:{
        fontSize:14,
        color:GlobalSize.colorBlackText,
    },
    cellContextText:{
        fontSize:14,
        color:GlobalSize.colorTextDarkGray,
        fontWeight:'normal',
    },
    cellMinText:{
        fontSize:12,
        color:GlobalSize.colorTextDarkGray,
    },
});
