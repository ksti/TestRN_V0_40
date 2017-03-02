//
//  WebViewOnCookie.h
//  TestRN_V0_40
//
//  Created by GJ on 16/10/8.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#import "RCTViewManager.h"
#else
#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>
#endif

#import "WebViewOnCookie.h"

@interface WebViewOnCookieManager : RCTViewManager<WebViewOnCookieDelegate>
{
  WebViewOnCookie *webViewOnCookie;
}

@end
