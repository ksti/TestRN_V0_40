//
//  RCTBaiduModule.m
//  TestRN_V0_40
//
//  Created by GJ on 16/7/27.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RNBaiduModule.h"

#if __has_include("RCTBridgeModule.h")
#import "RCTConvert.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#else
#import <React/RCTConvert.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#endif


@implementation RNBaiduModule

@synthesize bridge=_bridge;

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(RNBaiduModuleInvalid:(BOOL)shouldInvalid){
  
  NSLog(@"收到界面即将隐藏的命令");
  dispatch_async(dispatch_get_main_queue(), ^{
    [[NSNotificationCenter defaultCenter] postNotificationName:@"mapViewWillDisappear" object:nil userInfo:@{@"shouldInvalid":@(shouldInvalid)}];
  });
}
//RCT_EXPORT_METHOD(RNWebViewOnCookieWithURL:(NSString *)url){
//  NSLog(@"加载webView url=%@",url);
//  dispatch_async(dispatch_get_main_queue(), ^{
//    [[NSNotificationCenter defaultCenter] postNotificationName:@"ChangeURLForWebViewOnCookie" object:nil userInfo:@{@"newURL":url}];
//  });
//}
@end
