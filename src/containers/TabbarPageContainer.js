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
    TouchableOpacity,
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
import CustomScrollableTabBar from '../components/customComponents/CustomTabBar/CustomScrollableTabBar';

/**
 * Tabbar Container tabbar容器
 */
export default  class TabbarPageContainer extends Component {
    constructor(props) {
        super(props);
        // state
        this.state = {
            lockScrollableTab: true,
            renderPlaceholderOnly: true,
            currentType: 0,
        }
    }

    static defaultProps = {
        tabBarStyle: {
            activeTextColor: '#ff5001',
            inactiveTextColor: '#a7a7a7',
            underlineStyle: {
                // backgroundColor: '#ff5001',
                backgroundColor: 'transparent',
            },
            backgroundColor: 'white',
        },
    };

    componentWillReceiveProps(nextProps) {
        this._handleNextProps(nextProps);
    }

    componentWillMount() {
        // this._createPanResponder();
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: false});
        });
        // 初始化数据
    }

    _createPanResponder = () => {
        this._panResponder = PanResponder.create({
          // 要求成为响应者：
          onStartShouldSetPanResponder: (evt, gestureState) => true,
          onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
          onMoveShouldSetPanResponder: (evt, gestureState) => true,
          onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

          onPanResponderGrant: (evt, gestureState) => {
            // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！

            // gestureState.{x,y}0 现在会被设置为0
          },
          onPanResponderMove: (evt, gestureState) => {
            // 最近一次的移动距离为gestureState.move{X,Y}

            // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
          },
          onPanResponderTerminationRequest: (evt, gestureState) => true,
          onPanResponderRelease: (evt, gestureState) => {
            // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
            // 一般来说这意味着一个手势操作已经成功完成。
          },
          onPanResponderTerminate: (evt, gestureState) => {
            // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
          },
          onShouldBlockNativeResponder: (evt, gestureState) => {
            // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
            // 默认返回true。目前暂时只支持android。
            return true;
          },
        });
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

    _renderTab = (name, page, isTabActive, onPressHandler, onLayoutHandler) => {
        return <TouchableOpacity key={`${name}_${page}`}
            accessible={true}
            accessibilityLabel={name}
            accessibilityTraits='button'
            onPress={() => onPressHandler(page)}
            onLayout={onLayoutHandler}
        >
            {this.props.renderTabChildren(name, page, isTabActive)}
        </TouchableOpacity>
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

        const renderTab = typeof this.props.renderTabChildren === 'function' ? this._renderTab : undefined;

        return <ScrollableTabView
            style={[styles.scrollableTabViewContainer, this.props.style]}
            /*
            renderTabBar={ () => <CustomScrollableTabBar 
                activeTextColor={GlobalSize.colorRedMain}
                inactiveTextColor={GlobalSize.colorBlackText}
                underlineStyle={{
                    backgroundColor: GlobalSize.colorRedMain,
                }}
                {...androidButton}
                backgroundColor='white' />
            }
            */
            renderTabBar={ () => <CustomScrollableTabBar 
                {...this.props.tabBarStyle}
                renderTab={renderTab}
                />
            }
            // tabBarPosition='overlayTop'
            tabBarPosition={this.props.tabBarPosition || 'overlayBottom'}
            initialPage={0}
            locked={locked}
            onScroll={(offsetXPercent) => {
                //
            }}
            onChangeTab = {(tabInfo) => {
                this._onChangeTab(tabInfo);
            }}
        >
            {this.props.children}
        </ScrollableTabView>;
    }

    _ifNeedRefreshing = (forceRefresh) => {
        let needRefreshing = true;
        switch (this.state.currentType) {
            case 0: // tabbar page 1
                //

                break;
            case 1: // tabbar page 2
                //
                
                break;
            case 2: // tabbar page 3
                //
                
                break;
            case 3: // tabbar page 4
                //
                
                break;
            case 4: // tabbar page 5
                //
                
                break;

            default:
                break;
        };

        if (needRefreshing || forceRefresh) {
            this._toggleRefreshing();
        };
    }

    _toggleRefreshing = () => {
        //
        this._refreshData(this.state.currentType); // 刷新数据
    }

    /**
     * 获取对应模块的数据
     * @private
     * @param {Number} type
     */
    _refreshData = (type) => {
        //
        switch (type) {
            case 0: // tabbar page 1
                //

                break;
            case 1: // tabbar page 2
                //
                
                break;
            case 2: // tabbar page 3
                //
                
                break;
            case 3: // tabbar page 4
                //
                
                break;
            case 4: // tabbar page 5
                //
                
                break;

            default:
                break;
        };
    }

    //菜单切换
    _onChangeTab = (tabInfo) => {
        // {
        //     i: currentPage,
        //     ref: this._children()[currentPage],
        //     from: prevPage,
        // }
        let currentPage = tabInfo.i;
        let currentTab = tabInfo.ref;
        let prevPage = tabInfo.from;
        if (prevPage !== currentPage) {
            this.setState({
                currentType: currentPage
            }, () => {
                this._ifNeedRefreshing();
            });

            this.props.onChangeTab && this.props.onChangeTab(currentPage, currentTab, prevPage);
        };
    }

    _finishRefreshing = (type) => {
        switch (type) {
            case 0: // tabbar page 1
                //

                break;
            case 1: // tabbar page 2
                //
                
                break;
            case 2: // tabbar page 3
                //
                
                break;
            case 3: // tabbar page 4
                //
                
                break;
            case 4: // tabbar page 5
                //
                
                break;

            default:
                break;
        };

        // 更新state
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
