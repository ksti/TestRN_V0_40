import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    WebView,
    BackAndroid,
    ToastAndroid,
    Platform,
} from 'react-native';

/**
 * Navigation Bar
 */
import NavigationBar from 'react-native-navbar';
import NavBarButton from '../components/NavBarButton';
/**
 * router
 */
import { Actions } from 'react-native-router-flux';

//
// import Orientation from 'react-native-orientation';


// BackAndroid.addEventListener('hardwareBackPress',function(){
//     ToastAndroid.show('收到点击返回键信息...',ToastAndroid.SHORT);
//     if (_this.props.navigator && _this.props.navigator.getCurrentRoutes().length > 1) {
//         _this.props.navigator.pop();
//         ToastAndroid.show('收到点击返回键信息...2',ToastAndroid.SHORT);
//         return true;
//     }
//     return false;
// });
//
// var _this;


export default class BaseContainer extends Component {

    constructor(props)
    {
        super(props);
        // _this = this;
        // Orientation.lockToPortrait();
    }


    // componentWillMount() {
    //     if (Platform.OS === 'android') {
    //         BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
    //     }
    // }
    // componentWillUnmount() {
    //     if (Platform.OS === 'android') {
    //         BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
    //     }
    // }
    //
    // onBackAndroid = () => {
    //     ToastAndroid.show('点击返回键',ToastAndroid.SHORT);
    //     Actions.pop();
    //     return true;
    // }



    //默认导航上的Title
    defaultNavigationTitle()
    {
        return {
            title:this.props.title,
            tintColor:this.defaultTintColor(),
        };
    }

    //默认状态
    defaultAppStatusBar()
    {
        return {
            style: 'light-content',
            tintColor: '#333333'
        }
    }
    defaultTintColor()
    {
        return 'white';
    }

    defaultRenderNavigationBar()
    {
        return  <NavigationBar style={[styles.navigationBar]}
                    title={this.defaultNavigationTitle()}
                    tintColor = {this.defaultTintColor()}
                    statusBar = {this.defaultAppStatusBar()}
                    leftButton = {this.defaultRenderNavigationBarLeftButton()}
                    rightButton = {this.defaultRenderNavigationBarRightButton()} />;
    }

   defaultRenderNavigationBarRightButton()
   {
       return <View />;
   }
   
   defaultRenderNavigationBarLeftButton()
   {
        // return {
        //    title: '返回',
        //    tintColor: this.defaultTintColor(),
        //    handler: () => Actions.pop(),
        //    style: styles.leftButton
        // }
        return(
            <NavBarButton
              style={styles.leftButton}
              image={require('../../resource/images/App/ic_nav_back.png') }
              handler={ () => Actions.pop() }
            />
        )
   }
}

const styles = StyleSheet.create({
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
        fontSize: 17,
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
});
