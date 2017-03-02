import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  WebView,
  ActivityIndicator,
  Dimensions,
  Text,
  Image,
} from 'react-native';
import ViewPager from 'react-native-viewpager'

// 引入公用路径导航
import {
    commonPath,
    componentsPath,
    containersPath,
    resourcePath,
    //--- Business Path ---
    GlobalPath,
} from '../../PathIndex' // Page 目录的上个目录, 层级深度:2

/* import from .. 似乎不支持字符串表达式。。require()也是
import BaseContainer from containersPath(2) + '/BaseContainer'
import httpRequest from commonPath(2) + '/HTTPRequest'
import PublicToast from componentsPath(2) + '/PublicToast'
import GlobalSize from GlobalPath(2) + '/GlobalSize'
import ButtonUpDown from componentsPath(2) + '/ButtonUpDown'
*/
import BaseContainer from '../../../../containers/BaseContainer'
import httpRequest from '../../../../common/HTTPRequest'
import PublicToast from '../../../../components/PublicToast'
import GlobalSize from '../../Global/GlobalSize'
import ButtonUpDown from '../../../../components/ButtonUpDown'

let HTTPRequest = new httpRequest();

// 和另外一个页面的变量名重复了，在被同一个页面引入时就会出现覆盖的问题。。
let imageSources=[
    {
        image:require('../../resource/images/App/img_busItem1.jpg'),
    },{
        image:require('../../resource/images/App/img_busItem2.jpg'),
    }
];
let btnMenu=[
    {
        title:'活动',
        image:require('../../resource/images/App/ic_huodong.png'),
        key:"signIn",
    },{
        title:'热议',
        image:require('../../resource/images/App/ic_reyi.png'),
        key:"signIn",
    },{
        title:'会议',
        image:require('../../resource/images/App/ic_huiyi.png'),
        key:"signIn",
    }
]
export default class BusinessHomeContainer extends BaseContainer {

    constructor(props){
        super(props);
        let viewPagerDataSource = new ViewPager.DataSource({
            pageHasChanged: (p1, p2) => true,
        });
        this.state={
          url: '',
          loadEnd: false,
          viewPagerDataSource: viewPagerDataSource,
          imageSources: imageSources,
        }
    }

    defaultRenderNavigationBarLeftButton(){
        return <View></View>
    }

    //加载完成
    loadEnd=()=>{
      this.setState({ loadEnd: true });
    }

    resetViewPager = () => {
        this.viewPagerRef && this.viewPagerRef.goToPage(0, false);
    }

    _onViewpagerChangePage = (pageNumber: number | string)=> {
        // PublicToast.logMessage('Current page: ' + pageNumber);
        // PublicToast.logMessage('BusinessHome Current page: ' + pageNumber);
    }

    _renderPage=(item)=>{
        return(
            <View 
                style={{
                    flex: 1,
                    alignItems:'center',
                    justifyContent:'center',
                    backgroundColor:GlobalSize.colorBgGray
                }}
            >
                <Image 
                    style={{
                        width: Dimensions.get('window').width,
                        height: 200,
                    }}
                    source={item.image} 
                    resizeMode='stretch'
                >
                </Image>
            </View>
        )
    }

    render() {
        return(
            <View style={{flex:1,backgroundColor:GlobalSize.colorBgGray}}>
                {this.defaultRenderNavigationBar() }
                <View style={{height: 200, overflow: 'hidden'/*这句是关键，不然 ViewPager 就滚动屏幕外面去了*/}}>
                    <ViewPager
                        ref={(ref) => this.viewPagerRef = ref}
                        dataSource={this.state.viewPagerDataSource.cloneWithPages(this.state.imageSources)}
                        renderPage={this._renderPage}
                        onChangePage={this._onViewpagerChangePage}
                        autoPlay={true}
                        isLoop={true}
                        initialPage={0} //默认显示的page
                    />
                </View>
                <View style={{height:10,backgroundColor:'white'}}></View>
                <View style={{flexDirection:'row',backgroundColor:'white',height:60}}>
                    {
                        btnMenu.map((items,index)=>{
                            return(
                                <ButtonUpDown
                                    key={index}
                                    onPress={()=>{PublicToast.showMessage('该功能还未上线，敬请期待')}}
                                    image={items.image}
                                    text={items.title}
                                    styleBg={{backgroundColor:'white'}}
                                    styleText={{color:GlobalSize.colorBlackText}}
                                    style={{flex:1}}
                                />
                            )
                        })
                    }
                </View>
                <View style={{flex: 1}}>
                </View>
            </View>
        )
        /*
        return (
                <View style={[{flex:1, paddingBottom:50}, this.props.style]}>
                    {this.defaultRenderNavigationBar()}
                    <WebView style={[{flex:1}]}
                        automaticallyAdjustContentInsets={false}
                        source={this.state.url?{uri:this.state.url}:{}}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        decelerationRate="normal"
                        onLoadEnd={this.loadEnd}
                        scalesPageToFit={true}
                        />
                    <View pointerEvents='none' style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height,justifyContent: 'center',position:'absolute',top:0,left:0,zIndex:999}}>
                          <ActivityIndicator
                            animating={!this.state.loadEnd}
                            style={{flex:1}}
                            size="small"
                          />
                    </View>
                </View>
        );
        */
    }
}
