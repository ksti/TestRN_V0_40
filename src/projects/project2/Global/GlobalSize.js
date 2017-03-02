
/**
存放公用的属性值：字体，颜色，间距等
*/

import {
    Dimensions,
    PixelRatio,
    Platform,
} from 'react-native'

module.exports = {
    
    //refreshToken有效时长
    RefreshTokenValidTime:14*24*3600,
    
    //底层框架
    BaseURL :'http://wxtest.sinooceanland.net:10086/',
    ProductURL:'https://moa.sinooceanland.com:10086/',
    //会议室相关模块接口
    MeetingURL:'http://wxuat.sinooceanland.net:10086/',
    //网页接口-远洋学院，休假申请
    BaseWebURL:'http://wxtest.sinooceanland.net/',

    //案场报表
    CaseReportURL:'http://wxtest.sinooceanland.net:10086/',
    CaseReportURL_Pro:'https://moa.sinooceanland.com:10086/',

    //高管周报
    WeeklyURL:'http://wxtest.sinooceanland.net:10086/',
    
    //预验收接口
    PreCheckURL:'http://mtest.sinooceanland.net/HouseAcceptance/PreCheckApp/',//初收和复验
    ReinspectionURL:'http://mtest.sinooceanland.net/HouseAcceptance/Reinspection/',//整改
    PreCheckFileURL:'http://mtest.sinooceanland.net/HouseAcceptance/File/',//图片上传下载
    //预验收身份认证接口
    VerifyPreValideURL:'http://mtest.sinooceanland.net/HouseAcceptance/Authentication/',
    
    //工程验收
    ProjectAcceptanceURL: 'http://wxtest.sinooceanland.net:10086/THRWebApi/ImplementWebApi/AcceptanceApi/',
    ProjAcceptDownloadStrURL: 'http://wxtest.sinooceanland.net:9555/Seagull2Files/prodefine/',

    //销控图
    ControlChartPerMissionURL:'http://wxtest.sinooceanland.net/MobileWebApp/FieldSale/SaleHouseChartApi/HadSaleControlChartPerMission',
    //设备宽高
    DeviceWidth: Dimensions.get("window").width,
    DeviceHeight: Dimensions.get("window").height,

    //项目主要UI设计标准
    heightBtnMain:40,//一级按钮的高度
    borderRadioBtnMain:5,
    heightLitBtn:26,//二级按钮高度
    heightSubBtn:22,//小按钮
    heightScroll:160,//轮播图高度
    heightPortrait:78,//头像
    lineHeight: 20,
    //文本属性
    fontLoadingText:20,
    fontSizeNav:17,
    // fontSizeTitle:((Dimensions.get("window").width)<375?17:((Dimensions.get("window").width)<540?14:17)),//标题
    fontSizeTitle:14,
    fontSizeSubTitle:12,
    fontAddressName:13,
    fontSizeTabBar:13,
    fontSizeNewsTitle:15,
    // fontSizeSubTitle:(Dimensions.get("window").width)<375?15:((Dimensions.get("window").width)<540?12:15),//副标题
    // fontAddressName:(Dimensions.get("window").width)<375?16:((Dimensions.get("window").width)<540?13:16),//通讯录姓名
    colorBlackText:'#3b3b3b',//标题黑色
    colorGrayText:'#a7a7a7', //副标题黑灰色
    colorTextDarkGray:'#3b3b3b',

    //间距属性
    cellPadding:10, //左右留白
    cellTextSeparater:5,//上下文间距
    colorBorderGray:'#eaeaea',//边框分割线

    //其它色值
    colorBgGray:'#efeff4',//主背景色
    colorRedMain:'#ff5001',//页面主题色
    colorOrangeMain:'#e89311',//页面主题色
    colorNavBar:'#333333',//顶部导航
    colorRedButton:'#ff5001',//按钮

    colorLightRed:'#f96268',//红色
    colorBlueIcon:'#35b5e9',//淡蓝
    colorYellowIcon:'#edc917',//鹅黄色
    colorOrangeIcon:'#ffb359',//橘色
    colorGreenIcon:'#36bc99',//绿色
    colorGrayIcon:'#a7a7a7',//灰色
    colorGrayHint:'#797979',//placeholderTextColor

    // 会议室预定状态色值
    meetingStatusTimeout: '#CCCCCC', // 过期
    meetingStatusAvailable: '#ffffff', // 可选
    meetingStatusOrdered: '#ff5001', // 已选
    meetingStatusUnavailable: '#ffb459', // 已预订
    meetingStatusMyOrder: '#35b5e9', // 我的预订

    // modalList组件类型
    ModalListTypeCompany:'ListTypeCompany',    //会议申请-公司
    ModalListTypeCostCenter:'ListTypeCostCenter', //成本中心
    ModalListTypeDepartment:'ListTypeDepartment', //会议列表－部门
    ModalListTypeDate:'ListTypeDate', //统计
    ModalListTypeUserList:'ListTypeUserList',//会议校对人员列表

    //项目本地缓存数据的key
    Global_shouldShowSetGesPwdPage:'isFirstLaunch',//是否应该显示设置手势密码界面
    Global_IsHomeNow:'isEnterHomePage',//是否在业务页面，而不是在登录页或手势认证页；如果不是则退出时不会再纪录应用进入后台的时间
    Global_RefreshToken:'refreshToken', // refreshToken
    Global_AccessToken:'accessToken',//登录以后也可通过global.access_token读取
    Global_ExpiresIn: 'expiresIn', //
    Global_ExpiresTime: 'expiresTime', //
    Global_TokenType: 'tokenType', // 
    Global_TokenInfo: 'tokenInfo',
    Global_LoginTime: 'loginTime',
    Global_UserName:'userName', //登录后也可通过global.userName读取
    Global_AccountInfo:'accountInfo',//账号信息＝用户名＋密码
    Global_UserInfo:'userInfo', //用户详细信息，见下方注释
    Global_GesPwdInfo:'gestureVerifyOpen',//是否开启，密码，间隔时间
    Global_NewsCenterPageData:'NewsCenterPageData',//新闻中心轮播图数据

    Global_isFirstOpenCaseReport:'isFirstOpenCaseReport',//是否第一次打开案场报表功能
    Global_CaseReportDate:'CaseReportDate',//记录部门数据的下载日期

    Global_AddressBookData:'addressBookData',//通讯录初始化数据
    Global_SearchNoticeType:'searchNoticeType',//通知纪要类型缓存
    Global_SearchNewsType:'searchNewsType',//新闻中心类型缓存
    
    Global_ProjAccept: 'projAccept', // 工程验收key
    Global_ProjAcceptSelectTenderInfo: 'projAcceptSelectTenderInfo', // 工程验收记住选中的标段信息

};

/* 用户详细信息中主要有以下内容
{
  "id": "c5cfac69-994f-4f53-a857-f15d79f98fd4",
  "logonName": "xuyunj",
  "displayName": "徐云金",
  "fullPath": "机构人员\\远洋地产\\职能中心\\战略流程中心\\徐云金",
  "property": {
    "objectclass": "USERS",
    "persoN_ID": null,
    "postural": null,
    "ranK_NAME": "",
    "status": 1,
    "alL_PATH_NAME": "机构人员\\远洋地产\\职能中心\\战略流程中心\\徐云金",
    "globaL_SORT": "000001000001000003000004000071",
    "originaL_SORT": "000001000001000003000004000071",
    "displaY_NAME": "徐云金",
    "obJ_NAME": "徐云金",
    "logoN_NAME": "xuyunj",
    "parenT_GUID": "cbd051cb-82ab-af5e-41fe-7a1d3f593086",
    "guid": "c5cfac69-994f-4f53-a857-f15d79f98fd4",
    "inneR_SORT": "71",
    "description": null,
    "ranK_CODE": "Unspecified",
    "orG_CLASS": null,
    "customS_CODE": null,
    "orG_TYPE": null,
    "e_mail": "xuyunj@sinooceangroup.com",
    "attributes": null,
    "sideline": 0,
    "codE_NAME": "xuyunj",
    "versioN_START_TIME": "2016-07-01T12:39:54.83",
    "starT_TIME": null,
    "enD_TIME": null,
    "modifY_TIME": null,
    "creatE_TIME": null,
    "ousysdistincT1": null,
    "ousysdistincT2": null,
    "ousyscontenT1": null,
    "ousyscontenT2": null,
    "ousyscontenT3": null,
    "firsT_NAME": "云金",
    "lasT_NAME": "徐",
    "iC_CARD": null,
    "pwD_TYPE_GUID": null,
    "useR_PWD": null,
    "creatE_TIME1": null,
    "modifY_TIME1": null,
    "aD_COUNT": null,
    "sysdistincT1": null,
    "sysdistincT2": null,
    "syscontenT1": null,
    "syscontenT2": null,
    "syscontenT3": null,
    "pinyin": null,
    "sorT_ID": null,
    "name": null,
    "visible": null,
    "ranK_CLASS": null,
    "accountDisabled": false,
    "passwordNotRequired": false,
    "dontExpirePassword": false,
    "accountInspires": "0001-01-01T00:00:00",
    "accountExpires": "0001-01-01T00:00:00",
    ...
*/
