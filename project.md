根目录

```

/
.
├── App.js 									app入口
├── AppRoot.js 								app根入口
├── Readme 									部分组件说明文件
├── android 								安卓工程文件夹
├── images									图片
├── index.android.js 						安卓程序入口
├── index.ios.js 							iOS程序入口
├── ios 									iOS工程文件夹
├── node_modules 							依赖库
├── package.json 							依赖库配置文件
├── project.md 								项目目录说明文件
├── resource								本地测试json数据
├── src 									项目源码目录
└── tsconfig.json 							编译选项配置文件

```

/src 项目源码目录

```

.
├── Page 									页面目录
│   ├── AddressBook							通讯录
│   ├── CaseReport 							案场报表
│   ├── CommonScenes.js 					公共页面Scenes
│   ├── GesturePwd 							手势密码
│   ├── Index 								首页
│   ├── Login 								登陆页
│   ├── MeetingRoom 						会议室
│   ├── NewsCenter 							新闻中心
│   ├── Notice 								通知纪要
│   ├── PreValidate 						预验收
│   ├── ProjectAcceptance 					工程验收
│   ├── Scenes.js 							从ScenesIndex导出所有页面Scenes
│   ├── ScenesIndex.js 						导出所有页面Scenes
│   ├── SeniorWeekly 						高管周报
│   ├── Setting 							个人设置
│   ├── SignIn 								签到
│   └── WorkFlow 							工作流程
├── __test 									测试目录
│   ├── SQLiteDemo.js 						测试SQL
│   ├── scenesForTest.js 					导出测试页面Scenes
│   ├── serialize.js 						测试序列化
│   ├── testFile.js 						测试文件操作
│   ├── testImagePicker.js 					测试照片选取库
│   ├── testPopupPage.js 					测试封装的弹出框组件
│   ├── testPopupSelecter.js 				测试封装的弹出选项框
│   ├── testYY.js 							测试UUID
│   ├── testsList.js 						测试页入口
│   └── testsListView.js 					测试页首页 ListView
├── common 									通用工具类
│   ├── DBStorage.js 						数据库封装的本地存储
│   ├── FileUtil.js 						文件操作类
│   ├── GlobalSize.js 						全局的常量等配置
│   ├── GlobalStorageUtil.js 				本地缓存工具类将storage封装成回调模式
│   ├── GlobalStyle.js 						全局样式
│   ├── HTTPRequest.js 						封装的HTTP请求工具类
│   ├── NativeCommonTools.js 				封装的原生工具类
│   ├── SQLTransaction.js 					SQL操作工具类
│   ├── TimerUtils.js 						时间工具类
│   └── storage.js 							本地缓存类（由RN中文网封装维护的react-native-storage模块）
├── components 								通用组件（由于历史原因，现在这里面有些不是很纯粹的通用）
│   ├── AddressBookTree.js 					通讯录树状图
│   ├── AndroidWebView.js 					封装的原生AndroidWebView
│   ├── ButtonUpDown.js 					封装的Button TouchUpDown
│   ├── ButtonWithAccessory.js 				封装的Button Accessory
│   ├── CheckDownLineGroup.js 				“通知纪要”界面头部菜单切换
│   ├── DateSource.js 						日期数据源（年月）
│   ├── DateTimeSource.js 					日期数据源（年月日）
│   ├── FlowLayoutImageView.js 				封装的类似微信发朋友圈的上传图片布局
│   ├── FormView.js 						封装的 Form View
│   ├── FormWithBtnRight.js 				自定义的 Form View
│   ├── HomePermissionManage.js 			权限验证工具类
│   ├── HorizonImageScrollView.js 			封装的横向滚动展示图片的布局
│   ├── HorizontalMenu.js 					横向切换的选项栏
│   ├── ListFooter.js 						ListView Footer视图
│   ├── ListRefreshControl.js 				ListView 下拉刷新视图
│   ├── LoadingDialog.js 					加载框
│   ├── LoadingView.js 						加载框
│   ├── LoadingYuanXin.js 					远薪字样的加载框
│   ├── ModalDate.js 						模态选择时间控件
│   ├── ModalList.js 						模态ListView控件
│   ├── ModalLoading.js 					模态加载框
│   ├── MyDialog.js 						弹出对话框
│   ├── NavBarButton.js 					导航栏自定义Button
│   ├── PermissionManage.js 				权限验证工具类
│   ├── PickerAndroidItem.js 				android 日期选择器的item（会议室预定专用）
│   ├── PickerAny.js 						android 日期选择器的（会议室预定专用）配合PickerAndroidItem使用
│   ├── PopupView 							弹出控件目录，里面包括PopupSelecter弹出选项框控件
│   ├── PublicToast.js 						提示框控件
│   ├── RefreshToken.js 					刷新Token工具类
│   ├── SQLiteDemo.js 						SQLiteDemo
│   ├── SearchBar.js 						搜索条
│   ├── SearchSelectView.js 				新闻中心 筛选新闻类型控件
│   ├── SeePhotoBrowser.js 					浏览照片控件
│   ├── StepView.js 						工程验收 流程指示器控件
│   ├── TabIcon.js 							Tab 按钮Icon
│   ├── TimeSource.js 						日期数据源（时分）
│   ├── ViewPageIndicator.js 				新闻中心viewpage 指示器
│   ├── ViewPager.js 						新闻中心viewpage
│   ├── ViewPagerDataSource.js 				新闻中心viewpage 数据源
│   ├── WebView 							封装的WebView目录，子目录包含YuanxinWebView
│   ├── WebViewPage 						封装的WebViewPage目录（通用的网页浏览页面）
│   ├── businessComp 						业务相关的组件
│   └── customPopupPage 					自定义弹出控件目录，PopupPage继承自该目录下的BasePopupPage
├── containers 								容器目录
│   ├── BaseContainer.js 					基本容器页
│   ├── ErrorContainer.js 					错误页
│   ├── FormContainer.js 					Form容器，等同于react-native-form（已合并pull request）
│   ├── InitialRoot.js 						app启动初始化页面
│   ├── LoginNameUpdateClear.js 			切换账号清除信息
│   ├── PageContainer.js 					页面容器（FaceBook封装的）
│   ├── ScrollContainer.js 					滚动容器，基于PageContainer
│   └── WebViewContainer.js 				网页容器
└── reduxDataFlow 							Redux 数据流
    ├── actions 							分发 actions 
    ├── constants 							actions 常量
    └── reducers 							处理 actions



```

/src/Page 页面目录

```

.
├── AddressBook 							【通讯录功能模块】
│   ├── AddressBookDetailPage.js
│   ├── AddressBookPage.js
│   ├── AddressBookSearchPage.js
│   ├── AddressBookSelectPage.js
│   ├── Scenes.js 							导出“通讯录”功能模块Scenes
│   ├── components 							模块专用组件
│   └── reduxDataFlow 						Redux 数据流
├── CaseReport 								【案场报表功能模块】
│   ├── AttentionPage.js
│   ├── CaseReportLeft.js
│   ├── CaseReportPage.js
│   ├── CaseReportSearchPage.js
│   ├── Scenes.js 							导出“案场报表”功能模块Scenes
│   ├── components 							模块专用组件
│   └── reduxDataFlow 						Redux 数据流
├── CommonScenes.js
├── GesturePwd 								【手势密码功能模块】
│   ├── GestureLogin.js
│   ├── GestureReset.js
│   ├── Scenes.js 							导出“手势密码”功能模块Scenes
│   ├── SetGesturePwd.js
│   ├── ValideInterval.js
│   ├── components 							模块专用组件
│   └── reduxDataFlow 						Redux 数据流
├── Index 									【首页功能模块】
│   ├── BusinessHome.js 					“企业圈” --- 第二页
│   ├── ProfilePage.js 						“我”		--- 第三页
│   ├── WorkHome.js 						“工作通”	--- 第一页
│   ├── components 							模块专用组件
│   └── reduxDataFlow 						Redux 数据流
├── Login 									【登录功能模块】
│   ├── Login.js
│   ├── Scenes.js 							导出“登录”功能模块Scenes
│   ├── components 							模块专用组件
│   └── reduxDataFlow 						Redux 数据流
├── MeetingRoom 							【会议室功能模块】
│   ├── MeetingBookPage.js
│   ├── MeetingDetailPage.js
│   ├── MeetingOrderPage.js
│   ├── MeetingPage.js
│   ├── Scenes.js 							导出“会议室”功能模块Scenes
│   ├── components 							模块专用组件
│   └── reduxDataFlow 						Redux 数据流
├── NewsCenter 								【新闻中心功能模块】
│   ├── NewsCenterPage.js
│   ├── NewsDetailsPage.js
│   ├── Scenes.js 							导出“新闻中心”功能模块Scenes
│   ├── components 							模块专用组件
│   └── reduxDataFlow 						Redux 数据流
├── Notice 									【通知纪要功能模块】
│   ├── NoticeDetailPage.js
│   ├── NoticePage.js
│   ├── Scenes.js 							导出“通知纪要”功能模块Scenes
│   ├── components 							模块专用组件
│   └── reduxDataFlow 						Redux 数据流
├── PreValidate 							【预验收功能模块】
│   ├── AcceptanceListPage.js
│   ├── AcceptancePhoto.js
│   ├── AddQuestionPage.js
│   ├── AloneAcceptanceListPage.js
│   ├── CheckUploadPage.js
│   ├── DownloadPage.js
│   ├── FlowRepeatVadidate.js
│   ├── HousingDetailsPage.js
│   ├── MyTaskPage.js
│   ├── ProjReadyHome.js
│   ├── ProjectReadyTask.js
│   ├── Scenes.js 							导出“预验收”功能模块Scenes
│   ├── UploadPage.js
│   ├── components 							模块专用组件
│   └── reduxDataFlow 						Redux 数据流
├── ProjectAcceptance 						【工程验收功能模块】
│   ├── KeyprocessItemsForAcceptancePage.js
│   ├── MajorHazardsItemsForAcceptancePage.js
│   ├── OfflineDownloadpage.js
│   ├── ProjectAcceptanceCcPage.js
│   ├── ProjectAcceptanceFloorSelect.js
│   ├── ProjectAcceptanceMainPage.js
│   ├── ProjectAcceptanceMajorHazardsPage.js
│   ├── ProjectAcceptanceMeasuredDetailsPage.js
│   ├── ProjectAcceptanceMeasuredPage.js
│   ├── ProjectAcceptanceMeasuredQuasiSimplePage.js
│   ├── ProjectAcceptanceProgressFeedbackPage.js
│   ├── ProjectAcceptanceSupplierPage.js
│   ├── ProjectAcceptanceUnitSelect.js
│   ├── ProjectAcceptancekeyprocessPage.js
│   ├── Scenes.js 							导出“工程验收”功能模块Scenes
│   ├── SeeThePhotos.js
│   ├── components 							模块专用组件
│   └── reduxDataFlow 						Redux 数据流
├── Scenes.js
├── ScenesIndex.js
├── SeniorWeekly 							【高管周报功能模块】
│   ├── Scenes.js 							导出“高管周报”功能模块Scenes
│   ├── SeniorManagerListPage.js
│   ├── SeniorWeeklyPage.js
│   ├── WeeklyDetailPage.js
│   ├── WeeklyEditPage.js
│   ├── components 							模块专用组件
│   └── reduxDataFlow 						Redux 数据流
├── Setting 								【个人设置功能模块】
│   ├── AboutAppPage.js
│   ├── Feedback.js
│   ├── HelpHome.js
│   ├── ProfileSetPage.js
│   ├── Scenes.js 							导出“设置”功能模块Scenes
│   ├── ServicePage.js
│   ├── components 							模块专用组件
│   └── reduxDataFlow 						Redux 数据流
├── SignIn 									【签到功能模块】
│   ├── Scenes.js 							导出“签到”功能模块Scenes
│   ├── SignInPage.android.js
│   ├── SignInPage.ios.js
│   ├── SignStatisticPage.js
│   ├── components 							模块专用组件
│   └── reduxDataFlow 						Redux 数据流
└── WorkFlow 								【工作流程功能模块】
    ├── FlowCenterPage.js
    ├── FlowDetailPage.android.js
    ├── FlowDetailPage.ios.js
    ├── MakeFlowPage.js
    ├── Scenes.js 							导出“工作流程”功能模块Scenes
    ├── components 							模块专用组件
    └── reduxDataFlow 						Redux 数据流


```
