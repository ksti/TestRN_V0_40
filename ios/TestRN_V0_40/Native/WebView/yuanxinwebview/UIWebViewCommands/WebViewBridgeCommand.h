//
//  WebViewBridgeCommand.h
//  YuanXinWebView
//
//  Created by 晏德智 on 16/8/1.
//  Copyright © 2016年 晏德智. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <JavaScriptCore/JavaScriptCore.h>

#import "BridgeMessageDelegate.h"

@protocol JSObjcDelegate <JSExport>

/**
 *  发送消息
 *
 *  @param message 消息类型
 */
- (void)send:(NSString *)message;

@end

@interface WebViewBridgeCommand : NSObject<JSObjcDelegate>

@property (nonatomic,weak) id<BridgeMessageDelegate> delegate;

@end
