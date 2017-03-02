import React , { PropTypes }  from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';

const tabIconStyles = StyleSheet.create({
    tabIconItem:{
        flex: 1,
        height: 56,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor:'transparent',
    },
    tabIconImage:{
        width:24,
        height:24
    },
    titleText:{
        marginTop:5,
        textAlign: 'center',
        fontSize:13
    },
    titleTextDefaultColor: {
        color:'black'
    },
    titleTextSelectColor: {
        color:'#e89311'
    },
    tabItemRow:{
        flexDirection:'row'
    },
});
 

export default class TabIcon extends React.Component {
    static defaultProps = {
        titleTextDefaultStyle: {
            color:'#a7a7a7'
        },
        titleTextSelectStyle: {
            color:'#e89311'
        },
    };

    render() {
        let mergeTextStyle = this.props.selected ? Object.assign({}, this.props.titleTextSelectStyle) : Object.assign({}, this.props.titleTextDefaultStyle); 
        return (
            <View style={tabIconStyles.tabIconItem}>
                <Image style={tabIconStyles.tabIconImage} source={this.props.selected ? this.props.selectImage : this.props.defaultImage}/>
                <View style={tabIconStyles.tabItemRow}>
                    <Text allowFontScaling={false}
                        style={[tabIconStyles.titleText, mergeTextStyle]}>
                        {this.props.title}
                    </Text>
                </View>
            </View>
        );
    }
}
