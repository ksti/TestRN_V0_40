//
//  YuanXinWebView.m
//  YuanXinWebView
//
//  Created by 晏德智 on 16/7/27.
//  Copyright © 2016年 晏德智. All rights reserved.
//

#import "YuanXinWebView.h"

#if __has_include("RCTBridgeModule.h")
#import "RCTUtils.h"
#import "RCTConvert.h"
#else
#import <React/RCTConvert.h>
#import <React/RCTUtils.h>
#endif


@interface YuanXinWebView ()


@end

@implementation YuanXinWebView

@synthesize injectedJavaScript   =    _injectedJavaScript;

@synthesize onLoadingStart       =    _onLoadingStart;
@synthesize onLoadingFinish      =    _onLoadingFinish;
@synthesize onLoadingError       =    _onLoadingError;
@synthesize onShouldStartLoadWithRequest     = _onShouldStartLoadWithRequest;
@synthesize onProgress           =    _onProgress;

@synthesize automaticallyAdjustContentInsets = _automaticallyAdjustContentInsets;
@synthesize contentInset         =   _contentInset;
@synthesize sendCookies          =   _sendCookies;
@synthesize clearCookies         =   _clearCookies;
@synthesize source               =   _source;


RCT_NOT_IMPLEMENTED(- (instancetype)initWithCoder:(NSCoder *)aDecoder)

- (instancetype)initWithFrame:(CGRect)frame
{
    if ((self = [super initWithFrame:frame])) {
        super.backgroundColor = [UIColor clearColor];
        _automaticallyAdjustContentInsets = YES;
        _contentInset = UIEdgeInsetsZero;
    }
    return self;
}

- (void)loadRequest:(NSURLRequest *)request {
    if (request.URL) {
      if (self.sendCookies) {
        NSDictionary *cookies = [NSHTTPCookie requestHeaderFieldsWithCookies:[[NSHTTPCookieStorage sharedHTTPCookieStorage] cookiesForURL:request.URL]];
        if ([cookies objectForKey:@"Cookie"]) {
          NSMutableURLRequest *mutableRequest = request.mutableCopy;
          [mutableRequest addValue:cookies[@"Cookie"] forHTTPHeaderField:@"Cookie"];
          request = mutableRequest;
        }
      } else if (self.clearCookies) {
        NSHTTPCookieStorage *cookieStorage = [NSHTTPCookieStorage sharedHTTPCookieStorage];
        for (NSHTTPCookie *each in cookieStorage.cookies) {
          [cookieStorage deleteCookie:each];
        }
      }
    }
}

/**
 *  将消息推送到React
 *
 *  @param parames 参数
 *
 *  @return 是否推送成功
 */
- (BOOL)sendBridgeMessage:(NSString *)messageType body:(id)parames{
    
    BOOL result = NO;
    @try {
        if(self.onBridgeMessage){
            NSMutableDictionary<NSString *, id> *onBridgeMessageEvent = [[NSMutableDictionary alloc] initWithDictionary:@{
                                                                                                                          messageType:parames}];
            
            self.onBridgeMessage(onBridgeMessageEvent);
            result = YES;

        }
        
    } @catch (NSException *exception) {
        result = NO;
    } @finally {
        
    }
    return result;
}


/**
 *  React 将消息推送到webView
 *
 *  @param value 传入参数
 */
- (void)sendToBridge:(NSString *)value{

}

/**
 *  执行javascript 方法
 *
 *  @param script  javascript代码
 *  @param resolve <#resolve description#>
 *  @param reject  <#reject description#>
 */
- (void)evaluateScript:(NSString *)script resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject{

}

- (NSArray*)stringArrayJsonToArray:(NSString *)message
{
    return [NSJSONSerialization JSONObjectWithData:[message dataUsingEncoding:NSUTF8StringEncoding]
                                           options:NSJSONReadingAllowFragments
                                             error:nil];
}

@end

