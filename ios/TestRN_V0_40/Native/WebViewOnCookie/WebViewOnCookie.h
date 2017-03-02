//
//  WebViewOnCookie.h
//  TestRN_V0_40
//
//  Created by GJ on 16/10/8.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

#if __has_include("RCTBridgeModule.h")
#import "RCTComponent.h"
#else
#import <React/RCTComponent.h>
#endif

@class WebViewOnCookie;
@protocol WebViewOnCookieDelegate <NSObject>

-(void)webViewOnCookieDidFinishLoad:(WebViewOnCookie *)webView;
-(void)webViewOnCookie:(WebViewOnCookie *)webView didFailLoadWithError:(NSError *)error;
@end
@interface WebViewOnCookie : UIView<UIWebViewDelegate>

@property (nonatomic,weak) id<WebViewOnCookieDelegate> delegateCus;

@property (nonatomic,copy) NSString *webURL;

@property (nonatomic,copy) RCTBubblingEventBlock finishLoad;
@property (nonatomic,copy) RCTBubblingEventBlock failLoad;


@end
