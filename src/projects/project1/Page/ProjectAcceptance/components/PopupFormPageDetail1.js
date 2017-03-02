
/**
 * @author GJS <1353990812@qq.com>
 *
 * GJS reserves all rights not expressly granted.
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 GJS
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * 
 */

/*
 * 控件功能：验收详情页弹出框，基于 PopupPage 的示例，弹出一个 表单页，支持常用动画包括没有动画
 * 相关界面：验收详情页
*/

'use strict';

import React,{
    Component
} from 'react'
import {
    View,
    Modal,
    StyleSheet,
    Animated,
    Dimensions,
    ListView,
    Text,
    Easing,
    TouchableWithoutFeedback,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    ScrollView,
    ActivityIndicator,
} from 'react-native'

import {
  Platform
} from 'react-native'

import Form from 'react-native-form'
import PhotoBrowser from 'react-native-photo-browser';
import ActionSheet from 'react-native-actionsheet';
import UUIDGenerator from 'react-native-uuid-generator';

// redux connect
import { connect } from 'react-redux';

class PopupFormPageDetail1 extends Component{
    constructor(props){
        super(props);
        
    }

    componentDidMount(){
      //
      
    }

    componentWillReceiveProps(nextProps) {
      
    }

    

    render(){
        return (
          <View />
        );
    }

}

const selectMaterialsState = (state) => {
    return {
        status: state.ProjectAcceptanceMaterialsState.status,
        materialsStr: state.ProjectAcceptanceMaterialsState.materialsStr,
        materialsIdentifier: state.ProjectAcceptanceMaterialsState.materialsIdentifier,
    }
}
const _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
const defaultMapStateToProps = function defaultMapStateToProps(state) {
  return {};
}; // eslint-disable-line no-unused-vars
const defaultMapDispatchToProps = function defaultMapDispatchToProps(dispatch) {
  return { dispatch: dispatch };
};
const defaultMergeProps = function defaultMergeProps(stateProps, dispatchProps, parentProps) {
  return _extends({}, parentProps, stateProps, dispatchProps);
};

export default PopupFormPageDetail1 = connect(
  selectMaterialsState,
  defaultMapDispatchToProps,
  defaultMergeProps,
  {
    pure: true,
    withRef: true,
  }
)(PopupFormPageDetail1);



const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'column',
  },
  
});


