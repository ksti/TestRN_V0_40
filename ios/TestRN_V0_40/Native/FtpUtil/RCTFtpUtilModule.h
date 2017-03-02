//
//  RCTFtpUtilModule.h
//  TestRN_V0_40
//
//  Created by forp on 16/9/28.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "GRRequestsManager.h"

#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#import "RCTEventEmitter.h"
#import "RCTEventDispatcher.h"
#else
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTEventDispatcher.h>
#endif

@interface RCTFtpUtilModule : NSObject <RCTBridgeModule>

@property (nonatomic, strong) GRRequestsManager *requestsManager;
/**
 Reference to the delegate object
 */
@property (nonatomic, weak) id<GRRequestsManagerDelegate> delegate;

@property (nonatomic, strong) NSString* hostname;
@property (nonatomic, strong) NSString* username;
@property (nonatomic, strong) NSString* password;

@end
