//
//  UIWebView+JSContext.m
//  YuanXinWebView
//
//  Created by 晏德智 on 16/7/28.
//  Copyright © 2016年 晏德智. All rights reserved.
//

#import "UIWebView+JSContext.h"

@implementation UIWebView (JSContext)

- (JSContext *)JSContext {
    return [self valueForKeyPath:@"documentView.webView.mainFrame.javaScriptContext"];
}

@end
