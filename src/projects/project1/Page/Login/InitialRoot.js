import React,{
    Component
} from 'react'

import {
    View,
    TouchableOpacity,
    Modal,
    Text,
    DatePickerIOS,
    StyleSheet,
    Image,
    ActivityIndicator,
}from 'react-native'

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import httpRequest from '../../../../common/HTTPRequest'

let HTTPRequest = new httpRequest();

export default class ModalLoading extends Component{
    constructor(props){
        super(props);
        this.state={
            isLogin:false,
        }
    }
    componentDidMount(){
        global.storageUtil.getValue('accessToken').then((accessToken)=>{
            PublicToast.showMessage(accessToken);
            Actions.tabbar();
        })
        .catch(()=>{
            // alert('没取到');
            console.log('Object.keys(Actions): ' + Object.keys(Actions));
            Actions.loginIn();
        })
    }
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <ActivityIndicator
                        animation={true}
                        size='large'
                    />
                    <Text style={{textAlign:'center'}}>
                        ...
                    </Text>
                </View>
            </View>
        );
    }
}

var styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0,1,0,0.2)',
    },
    contentContainer:{
        height:60,
    },
})
