//
//  FtpUtil.h
//  Test_Test
//
//  Created by forp on 16/9/27.
//  Copyright © 2016年 forp. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "GRRequestsManager.h"

@interface FtpUtil : NSObject

@property (nonatomic, strong) GRRequestsManager *requestsManager;
/**
 Reference to the delegate object
 */
@property (nonatomic, weak) id<GRRequestsManagerDelegate> delegate;

@property (nonatomic, strong) NSString* hostname;
@property (nonatomic, strong) NSString* username;
@property (nonatomic, strong) NSString* password;

#pragma public methods
/**
 Setting up sever
 */
- (void)setupSeverHostname:(NSString *)hostname user:(NSString *)username password:(NSString *)password;
/**
 Ftp operation
 */
- (void)listingPath:(NSString *)directoryPath;
- (void)createDirectory:(NSString *)directoryPath;
- (void)deleteDirectory:(NSString *)directoryPath;
- (void)deleteFileAtPath:(NSString *)filePath;
- (void)uploadFileAtLocalPath:(NSString *)localPath toRemotePath:(NSString *)remotePath;
- (void)downloadFileAtRemotePath:(NSString *)remotePath toLocalPath:(NSString *)localPath;

@end
