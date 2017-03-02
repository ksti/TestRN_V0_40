import React,{Component,PropTypes} from 'react';
import {   
    StyleSheet,
    View,
    requireNativeComponent,
} from 'react-native';

class AndroidWebView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
        this._onChange = this._onChange.bind(this);
    } 
    static propTypes = {
        ...View.propTypes,
        url: PropTypes.string,
        html: PropTypes.string,
        onScrollChange: PropTypes.func
    }; 
    _onChange(event: Event) {
        if (!this.props.onScrollChange) {
            return;
        }
        this.props.onScrollChange({ ScrollX: event.nativeEvent.ScrollX, ScrollY: event.nativeEvent.ScrollY });
    }
    render() { 
        return <AndroidWebView {...this.props} onChange={this._onChange}/>;
    };
} 
module.exports = requireNativeComponent('AndroidWebView', AndroidWebView, {
    nativeOnly: { onChange: true }
});