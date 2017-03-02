//
//  WebViewBridgeCommand.m
//  YuanXinWebView
//
//  Created by 晏德智 on 16/8/1.
//  Copyright © 2016年 晏德智. All rights reserved.
//

#import "WebViewBridgeCommand.h"

@implementation WebViewBridgeCommand

//刷新
- (void)send:(NSString *)message
{
    if ([self.delegate respondsToSelector:@selector(triggerBridgeMessage:params:)]) {
        [self.delegate triggerBridgeMessage:@"messages" params:message];
    }
    NSLog(@"message %@",message);
}

@end
