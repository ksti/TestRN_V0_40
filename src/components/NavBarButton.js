/*
界面功能：导航按钮
相关界面：首页右上角按钮
props：图片源
*/
import React,{Component} from 'react'
import {Image,View,Text,TouchableOpacity} from 'react-native'


export default class NavBarButton extends Component{
    render(){
        if(this.props.image){
            let  titleView;
            if(this.props.text)
            {
                titleView = (
                    <View style={{height:40,justifyContent:'center',alignItems:'center'}}>
                        <Text style={[{color: 'white', fontSize: 16}, this.props.tvStyle]}>{this.props.text}</Text>
                    </View>
                )
            }   
            return(
                <TouchableOpacity onPress={this.props.handler} style={[this.props.style,{flexDirection:((this.props.text)?"row":"column")}]}>
                    <View style={{width:40,height:40,justifyContent:'center',alignItems:'center'}}>
                        <Image source={this.props.image} style={[{width:20,height:20},]}
                        />
                    </View>
                    {titleView}
                </TouchableOpacity>
            )
        }else{
            return(
                <TouchableOpacity onPress={this.props.handler} style={this.props.style}>
                    <View style={{height:40,justifyContent:'center',alignItems:'center'}}>
                        <Text style={[{color: 'white', fontSize: 16}, this.props.tvStyle]}>{this.props.text}</Text>
                    </View>
                </TouchableOpacity>
            )
        }

    }
}
