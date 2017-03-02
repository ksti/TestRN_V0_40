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

export default class ModalLoading extends Component{
    render(){
        return(
            <Modal
                animationType='none'
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => {}}
                >
                    <View style={[{flex:1,justifyContent:'center',flexDirection:'row',alignItems:'center'}]}>
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
            </Modal>
        );
    }
}

var styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        // backgroundColor:'rgba(0,1,0,0.2)',
    },
    contentContainer:{
        height:60,
        flexDirection:'row',
    },
})
