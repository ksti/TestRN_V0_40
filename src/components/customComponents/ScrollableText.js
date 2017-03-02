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
 * 
 */

/*
 * 瀑布流模块布局视图
 */
import React, {PropTypes, Component} from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    Navigator,
    TouchableHighlight,
    Platform,
    Dimensions,
    ScrollView,
    ListView,
    InteractionManager,
    NetInfo,
    TouchableOpacity,
} from "react-native";

import ScrollContainer from '../../containers/ScrollContainer'

export default class ScrollableText extends Component {
	static propTypes = {
        style: View.propTypes.style,
        /*
         * 容器样式
         */
        containerStyle: View.propTypes.style,
        /*
         * 文本样式
         */
        textStyle: View.propTypes.style,
    };

    static defaultProps = {
        textStyle: {
            maxWidth: Dimensions.get('window').width,
        }
    };

    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    }

    _renderScrollableText = () => {
        // return(
        //     <ScrollContainer pointerEvents={'auto'} style={[{flex: 1, backgroundColor: 'transparent'}, this.props.containerStyle]}>
        //         <Text style={[styles.text, this.props.textStyle]}>
        //             {this.props.text}
        //         </Text>
        //     </ScrollContainer>
        // );
        return(
            <ScrollView pointerEvents={'auto'} style={[{flex: 1, backgroundColor: 'transparent'}, this.props.containerStyle]}>
                <Text style={[styles.text, this.props.textStyle]}>
                    {this.props.text}
                </Text>
            </ScrollView>
        );
    }

    render(){
        return this._renderScrollableText();
    }
}

const styles = StyleSheet.create({
    container: {
        // flex: 1
    },
    text: {
        color: '#3b3b3b', //标题黑色
        fontSize: 14,
    },
});

