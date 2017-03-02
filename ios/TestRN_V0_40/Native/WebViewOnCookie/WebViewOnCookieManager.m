//
//  WebViewOnCookie.m
//  TestRN_V0_40
//
//  Created by GJ on 16/10/8.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "WebViewOnCookieManager.h"

#if __has_include("RCTBridgeModule.h")
#import "RCTBridge.h"
#import "RCTUtils.h"
#else
#import <React/RCTBridge.h>
#import <React/RCTUtils.h>
#endif


@implementation WebViewOnCookieManager
{
  RCTBridge *_bridge;
  RCTResponseSenderBlock senderCallBack;
}

RCT_EXPORT_MODULE()
RCT_EXPORT_METHOD(loadWebWithURL:(NSString *)webURL withLoadResult:(RCTResponseSenderBlock)callback){
  [webViewOnCookie setWebURL:webURL];
  senderCallBack = callback;
}

RCT_EXPORT_VIEW_PROPERTY(finishLoad, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(failLoad, RCTBubblingEventBlock)

- (instancetype)init
{
  self = [super init];
  if (self) {
  }
  return self;
}
-(UIView *)view{
  WebViewOnCookie *webView = [[WebViewOnCookie alloc] init];
  webView.backgroundColor =[UIColor blueColor];
  webView.delegateCus = self;
  webViewOnCookie = webView;
  return webViewOnCookie;
}

-(void)webViewOnCookieDidFinishLoad:(WebViewOnCookie *)webView{
//  if(!webView.finishLoad){
//    NSLog(@"no webViewDidFinishLoad function");
//    return;
//  }
//  webView.finishLoad(@{@"key":@""});
  NSLog(@"webViewOnCookieDidFinishLoad");
  
  if (senderCallBack) {
    senderCallBack(@[[NSNull null],@"加载成功"]);
  }
//  NSString *eventName = @"webViewOnCookieDidFinishLoad";
//  _bridge.eventDispatcher sendAppEventWithName:<#(NSString *)#> body:<#(id)#>

}
-(void)webViewOnCookie:(WebViewOnCookie *)webView didFailLoadWithError:(NSError *)error{
//  if (!webView.failLoad) {
//    return;
//  }
//  webView.failLoad(@{error:error.localizedDescription});
  NSLog(@"加载失败");
  if (senderCallBack) {
    senderCallBack(@[RCTJSErrorFromNSError(error),@"加载失败"]);
  }
}
@end
