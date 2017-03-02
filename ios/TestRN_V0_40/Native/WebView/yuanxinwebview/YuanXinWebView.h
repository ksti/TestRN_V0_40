//
//  YuanXinWebView.h
//  YuanXinWebView
//
//  Created by 晏德智 on 16/7/27.
//  Copyright © 2016年 晏德智. All rights reserved.
//


#if __has_include("RCTBridgeModule.h")
#import "RCTView.h"
#import "RCTBridge.h"
#else
#import <React/RCTView.h>
#import <React/RCTBridge.h>
#endif

#define NSStringMultiline(...) [[NSString alloc] initWithCString:#__VA_ARGS__ encoding:NSUTF8StringEncoding]

@class YuanXinWebView;

/**
 * Special scheme used to pass messages to the injectedJavaScript
 * code without triggering a page load. Usage:
 *
 *   window.location.href = RCTJSNavigationScheme + '://hello'
 */
extern NSString *const RCTJSNavigationScheme;

//NSString *const YuanXinClientID = @"YuanXin";
//extern NSString *const YuanXinWebViewContext = @"YuanXin";

@protocol YuanXinWebViewDelegate <NSObject>

- (BOOL)webView:(YuanXinWebView *)webView
shouldStartLoadForRequest:(NSMutableDictionary<NSString *, id> *)request
   withCallback:(RCTDirectEventBlock)callback;

@end

@interface YuanXinWebView : RCTView<RCTAutoInsetsProtocol>

@property (nonatomic, weak) id<YuanXinWebViewDelegate> delegate;

@property (nonatomic, copy) NSDictionary *source;
@property (nonatomic, assign) UIEdgeInsets contentInset;
@property (nonatomic, assign) BOOL automaticallyAdjustContentInsets;
@property (nonatomic, assign) BOOL sendCookies;
@property (nonatomic, assign) BOOL clearCookies;
@property (nonatomic, copy) NSString *injectedJavaScript;

@property (nonatomic, copy) RCTDirectEventBlock onLoadingStart;
@property (nonatomic, copy) RCTDirectEventBlock onLoadingFinish;
@property (nonatomic, copy) RCTDirectEventBlock onLoadingError;
@property (nonatomic, copy) RCTDirectEventBlock onShouldStartLoadWithRequest;
@property (nonatomic, copy) RCTDirectEventBlock onProgress;
@property (nonatomic, copy) RCTDirectEventBlock onBridgeMessage;

- (NSMutableDictionary<NSString *, id> *)baseEvent;

- (void)goForward;
- (void)goBack;
- (void)reload;

#pragma mark private
- (void)loadRequest:(NSURLRequest *)request;

/**
 *  将消息推送到React
 *
 *  @param messageType 消息类型
 *  @param parames     消息结构体
 *
 *  @return 是否成功
 */
- (BOOL)sendBridgeMessage:(NSString *)messageType body:(id)parames;

/**
 *  React 将消息推送到webView
 *
 *  @param value 传入参数
 */
- (void)sendToBridge:(NSString *)value;

/**
 *  执行javascript 方法
 *
 *  @param script  javascript代码
 *  @param resolve <#resolve description#>
 *  @param reject  <#reject description#>
 */
- (void)evaluateScript:(NSString *)script resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;

@end
