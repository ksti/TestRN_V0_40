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
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

import React, {Component} from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    Navigator,
    PanResponder,
    TouchableHighlight,
    // TouchableNativeFeedback,
    Platform,
    Alert,
    AlertIOS,
    Dimensions,
    ListView,
    InteractionManager,
} from "react-native";

import {Actions} from "react-native-router-flux";
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar, } from 'react-native-scrollable-tab-view';

import TabIcon from '../../../../components/TabIcon'
import TabbarPageContainer from '../../../../containers/TabbarPageContainer'
import BaseContainer from '../../../../containers/BaseContainer'
import GlobalStyle from "../../Global/GlobalStyle";

import WorkHome from './WorkHome'
import BusinessHome from './BusinessHome'
import ProfilePage from './ProfilePage'

let workHomeImage = require('../../resource/images/TabBar/workhome.png');
let workHomeSelectImage = require('../../resource/images/TabBar/workhomeselected.png');
let businessHomeImage = require('../../resource/images/TabBar/businesshome.png');
let businessHomeSelectImage = require('../../resource/images/TabBar/businesshomeselected.png');
let profileImage = require('../../resource/images/TabBar/profile.png');
let profileSelectImage = require('../../resource/images/TabBar/profileselected.png');

let iconImages = [
	workHomeImage,
	businessHomeImage,
	profileImage,
];
let iconSelectImages = [
	workHomeSelectImage,
	businessHomeSelectImage,
	profileSelectImage,
];

/**
 * Tabbar 主页面
 */
export default  class TabbarPage extends BaseContainer {
    constructor(props) {
        super(props);
        // state
        this.state = {
            lockScrollableTab: true,
            renderPlaceholderOnly: true,
            currentType: 0,
        }
    }

    //标题
    defaultNavigationTitle() {
        return {
            title: this.props.title || "离线中心",
            tintColor: this.defaultTintColor()
        };
    }
    /**
     * 导航栏 右边的筛选按钮
     * @returns {XML}
     */
    defaultRenderNavigationBarRightButton() {
        if (this.state.online) {
            return (
                <NavBarButton style={[GlobalStyle.rightButton,]}
                    text=''
                    handler={(actionFinish)=>{this.rightBtnAction(actionFinish)}}
                />
            );
        } else {
            return (<View />);
        }

    }

    /**
     * 导航栏 右边的按钮 点击触发的事件
     */
    rightBtnAction = (actionFinish) => {
    	//
    }

    componentWillReceiveProps(nextProps) {
        this._handleNextProps(nextProps);
    }

    componentWillMount() {
        // 
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: false});
        });
        // 初始化数据
    }

    _handleNextProps = (nextProps) => {
        //
    }

    _renderPlaceholderView = () => {
        return (
            <View style={{flex:1,backgroundColor:'white'}}>
            </View>
        );
    }

    render() {
        if (this.state.renderPlaceholderOnly) {
            return this._renderPlaceholderView();
        }

        return (
            <View 
                style={{flex:1, backgroundColor:'white'}}
            >
                {this._renderScrollableTabView()}
            </View>
        );
    }

    _renderScrollableTabView = () => {
        // let locked = Platform.OS === 'android' ? true : false; // Android下禁掉ScrollView滚动
        let locked = this.state.lockScrollableTab;
        let androidButton;
        if (Platform.OS === 'android') {
            androidButton={
                buttonProps: {
                    // background: TouchableNativeFeedback.Ripple('transparent', false), // eslint-disable-line new-cap
                }
            }
        };
        return <TabbarPageContainer
            style={styles.scrollableTabViewContainer}
			// tabBarStyle={{
			// 	activeTextColor: {'#ff5001'},
			// 	inactiveTextColor: {'#a7a7a7'},
			// 	underlineStyle: {{
			// 		backgroundColor: '#ff5001',
			// 	}},
			// 	backgroundColor: 'white',
			// }}
			renderTabChildren={this._renderTabChildren}
            onChangeTab = {(tabInfo) => {
                this._onChangeTab(tabInfo);
            }}
        >
            <View // 加View尝试解决安卓 ScrollView 和 ListView 手势冲突的问题 未果！只能禁掉ScrollView滚动
                // ------------------ 0：tabbar page 1
                tabLabel='主页'
                style={{
                    flex: 1,
                }}
            >
                <WorkHome />
            </View>
            <View 
                // ------------------ 1：tabbar page 2
                tabLabel='页面2'
                style={{
                    flex: 1,
                }}
            >
                <BusinessHome 
                    ref={(ref) => this.businessHomeRef = ref}
                />
            </View>            
            <View 
                // ------------------ 2：tabbar page 3
                tabLabel='页面3'
                style={{
                    flex: 1,
                }}
            >
                <ProfilePage />
            </View>            
            <View 
                // ------------------ 3：tabbar page 4
                tabLabel='页面4'
                style={{
                    flex: 1,
                }}
            >
                
            </View>
            <View 
                // ------------------ 4：tabbar page 5                
                tabLabel='页面5'
                style={{
                    flex: 1,
                }}
            >
                
            </View>
            <View 
                // ------------------ 5：tabbar page 6              
                tabLabel='页面666666666666666666'
                style={{
                    flex: 1,
                }}
            >
                
            </View>
        </TabbarPageContainer>;
    }

    _renderTabChildren = (name, page, isTabActive) => {
    	return (
    		<TabIcon 
	    		title={name} 
	    		selected={isTabActive}
	    		defaultImage={iconImages[page]}
	    		selectImage={iconSelectImages[page]}
    		/>
		);
    }

    //菜单切换
    _onChangeTab = (currentPage, currentTab, prevPage) => {
        /*
         * 不用这样麻烦，而且 ViewPager 在自动播放模式下还是会滚出屏幕，
         * 在 ViewPager 的父视图的 style 里面加上下面这句就搞定了！！。。
         * overflow: 'hidden' 
         */
        /*
        if (currentPage !== 1) {
            this.businessHomeRef && this.businessHomeRef.resetViewPager();
        };
        */
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollableTabViewContainer: {
        // marginTop: 10,
    },

});
