//
//  WebViewOnCookie.m
//  TestRN_V0_40
//
//  Created by GJ on 16/10/8.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "WebViewOnCookie.h"

@implementation WebViewOnCookie
{
  UIWebView *_webView;
  NSTimer *timer;
}
-(instancetype)init{
  if (self=[super init]) {
    
    _webView =[[UIWebView alloc]init];
    _webView.delegate = self;
    [self addSubview:_webView];
    
//    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(webViewURLChangeEvent:) name:@"ChangeURLForWebViewOnCookie" object:nil];
  }
  return self;
}
-(void)layoutSubviews{
  [super layoutSubviews ];
  if (!CGRectEqualToRect(self.frame, _webView.frame)) {
    _webView.frame=self.frame;
  }
}
-(void)setWebURL:(NSString *)webURL{
  NSLog(@"setWebURL:%@",webURL);
  NSHTTPCookieStorage *cookieStorage = [NSHTTPCookieStorage sharedHTTPCookieStorage];
  for (NSHTTPCookie *each in cookieStorage.cookies) {
    [cookieStorage deleteCookie:each];
  }
//  if (webURL) {//清除所有cookie
//    NSArray *cookies = [cookieStorage cookiesForURL:[NSURL URLWithString:webURL]];
//    for (int i = 0; i < [cookies count]; i++) {
//      NSHTTPCookie *cookie = (NSHTTPCookie *)[cookies objectAtIndex:i];
//      [[NSHTTPCookieStorage sharedHTTPCookieStorage] deleteCookie:cookie];
//    }
//  }
  [_webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:webURL]]];
  if (!timer) {
    NSLog(@"设置计时器，20秒为超时");
    timer= [NSTimer scheduledTimerWithTimeInterval:20 target:self selector:@selector(stopLoading) userInfo:nil repeats:NO];
  }
}
-(void)stopLoading{
  NSLog(@"force stop loading ");
  if ([_delegateCus respondsToSelector:@selector(webViewOnCookie:didFailLoadWithError:)]) {
    NSError *error = [[NSError alloc]init];
    [_delegateCus webViewOnCookie:self didFailLoadWithError:error];
  }
}
//-(void)webViewURLChangeEvent:(NSNotification *)notification{
//  NSDictionary *userInfo = notification.userInfo;
//  NSString *newUrl = userInfo[@"newURL"] ;
//  
//  [_webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:newUrl]]];
//}

#pragma mark - webView delegate
-(void)webViewDidStartLoad:(UIWebView *)webView{
  NSLog(@"webViewDidStartLoad");
}
-(void)webViewDidFinishLoad:(UIWebView *)webView{
  NSLog(@"webViewDidFinishLoad");
  if ([_delegateCus respondsToSelector:@selector(webViewOnCookieDidFinishLoad:)]) {
    [_delegateCus webViewOnCookieDidFinishLoad:self];
  }
}
-(void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error{
  NSLog(@"webview didFailLoadWithError:%@ %@",error.localizedDescription,error);
  if ([_delegateCus respondsToSelector:@selector(webViewOnCookie:didFailLoadWithError:)]) {
    [_delegateCus webViewOnCookie:self didFailLoadWithError:error];
  }
}
/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/


@end
