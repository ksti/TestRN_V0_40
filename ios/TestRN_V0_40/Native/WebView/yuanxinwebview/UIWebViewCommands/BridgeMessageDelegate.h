//
//  Header.h
//  YuanXinWebView
//
//  Created by 晏德智 on 16/8/1.
//  Copyright © 2016年 晏德智. All rights reserved.
//
#import <Foundation/Foundation.h>

@protocol BridgeMessageDelegate<NSObject>

/**
 *  触发 onBridgeMessage 消息
 *
 *  @param message 消息体
 */
- (void)triggerBridgeMessage:(NSString *)messageType params:(id)parames;

@end