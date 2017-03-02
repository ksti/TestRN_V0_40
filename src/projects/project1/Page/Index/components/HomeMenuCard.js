import React, {Component} from 'react'
import {
    Image,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    InteractionManager
} from 'react-native'
import {Actions} from 'react-native-router-flux';
import ViewPager from 'react-native-viewpager'

// 引入公用路径导航
import {
    commonPath,
    componentsPath,
    containersPath,
    resourcePath,
    //--- Business Path ---
    GlobalPath,
} from '../../../PathIndex' // Page 目录的上个目录, 层级深度:3

/* import from .. 似乎不支持字符串表达式。。require()也是
import GlobalSize from GlobalPath(3) + '/GlobalSize'
import ButtonUpDown from componentsPath(3) + '/ButtonUpDown'
import PublicToast from componentsPath(3) + '/PublicToast'
import HttpRequest from commonPath(3) + '/HTTPRequest'
import DBStorage from commonPath(3) + '/DBStorage'
import ModalLoading from componentsPath(3) + '/ModalLoading'
*/
import GlobalSize from '../../../Global/GlobalSize'
import ButtonUpDown from '../../../../../components/ButtonUpDown'
import PublicToast from '../../../../../components/PublicToast'
import HttpRequest from '../../../../../common/HTTPRequest'
import DBStorage from '../../../../../common/DBStorage'
import ModalLoading from '../../../../../components/ModalLoading'

let HTTPRequest = new HttpRequest(true);

let cardMenu = [
    [
        {
            title: '签到',
            image: require('../../../resource/images/App/qiandao.png'),
            key: "signIn",
        }, {
            title: '我要拟单',
            image: require('../../../resource/images/App/nidan.png'),
            key: "makeFlow",
        }, {
            title: '订会议室',
            image: require('../../../resource/images/App/huiyishiyuding.png'),
            key: "meeting",
        }, {
            title: '邮箱',
            image: require('../../../resource/images/App/youxiang.png'),
            key: "email",
        }, {
            title: '新闻中心',
            image: require('../../../resource/images/App/xinwenzhongxin.png'),
            key: "newsCenter",
        }, {
            title: '通知纪要',
            image: require('../../../resource/images/App/tongzhijiyao.png'),
            key: "notice",
        }, {
            title: '远洋学院',
            image: require('../../../resource/images/App/yuanyangxueyuan.png'),
            key: "learn",
        }, {
            title: '通讯录',
            image: require('../../../resource/images/App/tongxunlu.png'),
            key: "addressBook",
        },
    ],
    [
        {
            title: '热销图',
            image: require('../../../resource/images/App/rexiaotu.png'),
            key: "hotSale"
        }, {
            title: '销控图',
            image: require('../../../resource/images/App/renchourequtu.png'),
            key: "saleControl"
        }, {
            title: '销售统计',
            image: require('../../../resource/images/App/xiaoshoutongji.png'),
            key: "saleStatistic"
        }, 
    ],
    /*
    [
        {
            title: '阙凯',
            image: require('../../../resource/images/App/fangwuyuyanshou.png'),
            key: "quekai"
        },{
            title: '王瑞华',
            image: require('../../../resource/images/App/fangwuyuyanshou.png'),
            key: "wangruihua"
        }, {
            title: '赵利峰',
            image: require('../../../resource/images/App/fangwuyuyanshou.png'),
            key: "zhaolifeng"
        }, {
            title: '王高',
            image: require('../../../resource/images/App/fangwuyuyanshou.png'),
            key: "wanggao"
        }, {
            title: '折英英',
            image: require('../../../resource/images/App/fangwuyuyanshou.png'),
            key: "sheyingying"
        }, {
            title: '黄坤',
            image: require('../../../resource/images/App/fangwuyuyanshou.png'),
            key: "huangkun"
        }, {
            title: '郭军帅',
            image: require('../../../resource/images/App/fangwuyuyanshou.png'),
            key: "guojunshuai"
        }, {
            title: '高洁',
            image: require('../../../resource/images/App/fangwuyuyanshou.png'),
            key: "gaojie"
        }
    ],
    */
];
export default class HomeMenuCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading:false,
            cardMenu: this.props.cardMenu || cardMenu,
        }
    }
    pushToNextPage(item) {
        let moduleStates = this.props.moduleStates
        switch (item.key) {
            case "signIn":
                PublicToast.showMessage('该功能还未上线,敬请期待');
                break;
            case "makeFlow":
                PublicToast.showMessage('该功能还未上线,敬请期待');
                break;
            case "meeting":
                PublicToast.showMessage('该功能还未上线,敬请期待');
                break;
            case "email":
                PublicToast.showMessage('该功能还未上线,敬请期待');
                break;
            case "newsCenter":
                PublicToast.showMessage('该功能还未上线,敬请期待');
                break;
            case "notice":
                PublicToast.showMessage('该功能还未上线,敬请期待');
                break;
            case "learn":
                PublicToast.showMessage('该功能还未上线,敬请期待');
                break;
            case "addressBook":
                PublicToast.showMessage('该功能还未上线,敬请期待');
                break;
            /* 第二页 */ 
            case "hotSale":{ // 热销图
                PublicToast.showMessage('该功能还未上线,敬请期待');
                break;
            }
            case "saleControl":{ // 销控图
                PublicToast.showMessage('该功能还未上线,敬请期待');
                break;
            }
            case "saleStatistic":{ // 销售统计
                PublicToast.showMessage('该功能还未上线,敬请期待');
                break;
            }
            /* 第三页(测试页) */ 
            case "sheyingying":
                break;
            case "wanggao":
                break;
            case "gaojie":
                break;
            case "wangruihua":
                break;
            case "guojunshuai"://暂作为测试的入口
                Actions.test();
                break;

            default:
                PublicToast.showMessage('该功能还未上线,敬请期待');
                break;
        }
    }
    renderItems = (dataArr)=> {
        return dataArr.map((items, i)=> {
            return (
                <ButtonUpDown
                    key={i}
                    onPress={()=> {
                        this.pushToNextPage(items)
                    }}
                    image={items.image}
                    text={items.title}
                    // styleBg={{backgroundColor: 'green'}}
                    styleText={styles.btnTitleText}
                />
            )
        });
    };
    _renderPage = (items: Object, pageID: number | string)=> {
        if (items.length == 8) {
            return (
                <View style={{width: GlobalSize.DeviceWidth,backgroundColor:'white'}}>
                    <View style={[styles.lineBoxContainer,{marginTop:10}]}>
                        {this.renderItems(items.slice(0, 4))}
                    </View>
                    <View style={{flexDirection: 'row',justifyContent: 'center',height:55,marginTop:10}}>
                        {this.renderItems(items.slice(4, 8))}
                    </View>
                </View>
            );
        } else {
            var itemViewes = new Array();
            var rowMax = 4;
            var rows = Math.ceil(items.length / rowMax);
            for (var i = 0; i < rows; i++) {
                var rowViewes = new Array();
                var rowStart = i * rowMax;
                for (var j = rowStart; j < (rowStart + rowMax); j++) {
                    var itemView;
                    if (j >= items.length) {
                        // break;
                        itemView = (
                            <View key={j} style={{flex: 1, backgroundColor: 'white'}}>
                            </View>
                        );
                    } else {
                        const itemData = items[j];
                        itemView = (
                            <ButtonUpDown
                                key={j}
                                onPress={() => {
                                    this.pushToNextPage(itemData)
                                }}
                                image={itemData.image}
                                text={itemData.title}
                                styleBg={{backgroundColor: 'white'}}
                                styleText={styles.btnTitleText}
                            />
                        );
                    }
                    rowViewes.push(itemView);
                }
                ;
                itemViewes.push(
                    <View key={i} style={styles.lineBoxContainer}>
                        {rowViewes}
                    </View>
                );
            };
            return (
                <View style={{backgroundColor: 'white', flex: 1}}>
                    <View style={{marginTop:10,backgroundColor:'white'}}></View>
                    {itemViewes}
                </View>
            )
        }
    }
    onChangePage = (page: number | string)=> {
        // PublicToast.logMessage('Current page: ' + page);
    }

    render() {

        return (
            <View style={{height: 140}}>
                <ViewPager
                    dataSource={new ViewPager.DataSource({
                        pageHasChanged: (p1, p2) => p1 !== p2
                    }).cloneWithPages(this.state.cardMenu)}
                    renderPage={this._renderPage}
                    onChangePage={()=>this.onChangePage()}
                    autoPlay={false}
                    isLoop={false}
                    initialPage={0}
                    style={{backgroundColor:'white'}}
                />
                <ModalLoading
                    visible={this.state.loading}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    lineBoxContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: GlobalSize.colorBgMain,
        height: 55,
    },
    btnTitleText:{
        color: GlobalSize.colorBlackText,
        fontSize:GlobalSize.fontSizeTitle,
    }
})
