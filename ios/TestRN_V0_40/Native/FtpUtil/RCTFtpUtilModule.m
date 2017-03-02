//
//  RCTFtpUtilModule.m
//  TestRN_V0_40
//
//  Created by forp on 16/9/28.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RCTFtpUtilModule.h"

#if __has_include("RCTBridgeModule.h")
#import "RCTConvert.h"
#import "RCTBridge.h"
#import "RCTUtils.h"
#else
#import <React/RCTConvert.h>
#import <React/RCTBridge.h>
#import <React/RCTUtils.h>
#endif

#import "GRRequest.h"

@interface RCTFtpUtilModule () <GRRequestsManagerDelegate>
{
  NSMutableDictionary *_mDictRequestCallbacks;
}

@end

@implementation RCTFtpUtilModule

@synthesize bridge = _bridge;

- (void)dealloc
{
  _mDictRequestCallbacks = nil;
}

- (instancetype)init
{
  self = [super init];
  if (self) {
    //
    _mDictRequestCallbacks = [NSMutableDictionary new];
  }
  return self;
}

- (instancetype)initWithHostname:(NSString *)hostname user:(NSString *)username password:(NSString *)password
{
  self = [super init];
  if (self) {
    self.hostname = hostname;
    self.username = username;
    self.password = password;
  }
  return self;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[
           @"EventFTPProgressChanged",
          ];
}

RCT_EXPORT_MODULE(FtpUtil)

RCT_EXPORT_METHOD(setupSeverHostname:(NSString *)hostname
                  user:(NSString *)username
                  password:(NSString *)password)
{
  self.hostname = hostname;
  self.username = username;
  self.password = password;
}

RCT_EXPORT_METHOD(listingPath:(NSString *)directoryPath
                  withTag:(NSString *)tag
                  callback:(RCTResponseSenderBlock)callback)
{
  [self _setupManager];
  //    [self.requestsManager addRequestForListDirectoryAtPath:@"/"];
  id<GRRequestProtocol> request = [self.requestsManager addRequestForListDirectoryAtPath:directoryPath];
  if (tag == nil) {
    tag = request.uuid;
  }
  [_mDictRequestCallbacks setObject:@{@"tag": tag, @"callback": callback} forKey:request.uuid];
  [self.requestsManager startProcessingRequests];
}

RCT_EXPORT_METHOD(createDirectory:(NSString *)directoryPath
                  withTag:(NSString *)tag
                  callback:(RCTResponseSenderBlock)callback)
{
  [self _setupManager];
  //    [self.requestsManager addRequestForCreateDirectoryAtPath:@"dir/"];
  id<GRRequestProtocol> request = [self.requestsManager addRequestForCreateDirectoryAtPath:directoryPath];
  if (tag == nil) {
    tag = request.uuid;
  }
  [_mDictRequestCallbacks setObject:@{@"tag": tag, @"callback": callback} forKey:request.uuid];
  [self.requestsManager startProcessingRequests];
}

RCT_EXPORT_METHOD(deleteDirectory:(NSString *)directoryPath
                  withTag:(NSString *)tag
                  callback:(RCTResponseSenderBlock)callback)
{
  [self _setupManager];
  //    [self.requestsManager addRequestForDeleteDirectoryAtPath:@"dir/"];
  id<GRRequestProtocol> request = [self.requestsManager addRequestForDeleteDirectoryAtPath:directoryPath];
  if (tag == nil) {
    tag = request.uuid;
  }
  [_mDictRequestCallbacks setObject:@{@"tag": tag, @"callback": callback} forKey:request.uuid];
  [self.requestsManager startProcessingRequests];
}

RCT_EXPORT_METHOD(deleteFileAtPath:(NSString *)filePath
                  withTag:(NSString *)tag
                  callback:(RCTResponseSenderBlock)callback)
{
  [self _setupManager];
  //    [self.requestsManager addRequestForDeleteFileAtPath:@"dir/file.txt"];
  id<GRRequestProtocol> request = [self.requestsManager addRequestForDeleteFileAtPath:filePath];
  if (tag == nil) {
    tag = request.uuid;
  }
  [_mDictRequestCallbacks setObject:@{@"tag": tag, @"callback": callback} forKey:request.uuid];
  [self.requestsManager startProcessingRequests];
}

RCT_EXPORT_METHOD(uploadFileAtLocalPath:(NSString *)localPath
                  toRemotePath:(NSString *)remotePath
                  withTag:(NSString *)tag
                  callback:(RCTResponseSenderBlock)callback)
{
  [self _setupManager];
  //    NSString *bundlePath = [[NSBundle mainBundle] pathForResource:@"TestFile" ofType:@"txt"];
  //    [self.requestsManager addRequestForUploadFileAtLocalPath:bundlePath toRemotePath:@"dir/file.txt"];
  id<GRRequestProtocol> request = [self.requestsManager addRequestForUploadFileAtLocalPath:localPath toRemotePath:remotePath];
  if (tag == nil) {
    tag = request.uuid;
  }
  [_mDictRequestCallbacks setObject:@{@"tag": tag, @"callback": callback} forKey:request.uuid];
  [self.requestsManager startProcessingRequests];
}

RCT_EXPORT_METHOD(downloadFileAtRemotePath:(NSString *)remotePath
                  toLocalPath:(NSString *)localPath
                  withTag:(NSString *)tag
                  callback:(RCTResponseSenderBlock)callback)
{
  [self _setupManager];
  //    NSString *documentsDirectoryPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) lastObject];
  //    NSString *localFilePath = [documentsDirectoryPath stringByAppendingPathComponent:@"DownloadedFile.txt"];
  
  //    [self.requestsManager addRequestForDownloadFileAtRemotePath:@"dir/file.txt" toLocalPath:localFilePath];
  id<GRRequestProtocol> request = [self.requestsManager addRequestForDownloadFileAtRemotePath:remotePath toLocalPath:localPath];
  if (tag == nil) {
    tag = request.uuid;
  }
  [_mDictRequestCallbacks setObject:@{@"tag": tag, @"callback": callback} forKey:request.uuid];
  [self.requestsManager startProcessingRequests];
}

#pragma mark - Private Methods

- (void)_setupManager
{
  self.requestsManager = [[GRRequestsManager alloc] initWithHostname:self.hostname
                                                                user:self.username
                                                            password:self.password];
  self.requestsManager.delegate = self;
}

#pragma mark - GRRequestsManagerDelegate

- (void)requestsManager:(id<GRRequestsManagerProtocol>)requestsManager didScheduleRequest:(id<GRRequestProtocol>)request
{
  NSLog(@"requestsManager:didScheduleRequest:");
  if (self.delegate && [self.delegate respondsToSelector:@selector(requestsManager:didScheduleRequest:)]) {
    [self.delegate requestsManager:requestsManager didScheduleRequest:request];
  }
}

- (void)requestsManager:(id<GRRequestsManagerProtocol>)requestsManager didCompleteListingRequest:(id<GRRequestProtocol>)request listing:(NSArray *)listing
{
  NSLog(@"requestsManager:didCompleteListingRequest:listing: \n%@", listing);
  if (self.delegate && [self.delegate respondsToSelector:@selector(requestsManager:didCompleteListingRequest:listing:)]) {
    [self.delegate requestsManager:requestsManager didCompleteListingRequest:request listing:listing];
  }
  // RCTResponseSenderBlock
  RCTResponseSenderBlock callback = [_mDictRequestCallbacks objectForKey:request.uuid][@"callback"];
  if (callback) {
    callback(@[[NSNull null], listing]);
  }
}

- (void)requestsManager:(id<GRRequestsManagerProtocol>)requestsManager didCompleteCreateDirectoryRequest:(id<GRRequestProtocol>)request
{
  NSLog(@"requestsManager:didCompleteCreateDirectoryRequest:");
  if (self.delegate && [self.delegate respondsToSelector:@selector(requestsManager:didCompleteCreateDirectoryRequest:)]) {
    [self.delegate requestsManager:requestsManager didCompleteCreateDirectoryRequest:request];
  }
  // RCTResponseSenderBlock
  RCTResponseSenderBlock callback = [_mDictRequestCallbacks objectForKey:request.uuid][@"callback"];
  if (callback) {
    callback(@[[NSNull null], @true]);
  }
}

- (void)requestsManager:(id<GRRequestsManagerProtocol>)requestsManager didCompleteDeleteRequest:(id<GRRequestProtocol>)request
{
  NSLog(@"requestsManager:didCompleteDeleteRequest:");
  if (self.delegate && [self.delegate respondsToSelector:@selector(requestsManager:didCompleteDeleteRequest:)]) {
    [self.delegate requestsManager:requestsManager didCompleteDeleteRequest:request];
  }
  // RCTResponseSenderBlock
  RCTResponseSenderBlock callback = [_mDictRequestCallbacks objectForKey:request.uuid][@"callback"];
  if (callback) {
    callback(@[[NSNull null], @true]);
  }
}

- (void)requestsManager:(id<GRRequestsManagerProtocol>)requestsManager didCompletePercent:(float)percent forRequest:(id<GRRequestProtocol>)request
{
  NSLog(@"requestsManager:didCompletePercent:forRequest: %f", percent);
  if (self.delegate && [self.delegate respondsToSelector:@selector(requestsManager:didCompletePercent:forRequest:)]) {
    [self.delegate requestsManager:requestsManager didCompletePercent:percent forRequest:request];
  }
  // RCTResponseSenderBlock
  NSDictionary *dictCallback = [_mDictRequestCallbacks objectForKey:request.uuid];
  RCTResponseSenderBlock callback = dictCallback[@"callback"];
  if (callback) {
//    callback(@[[NSNull null], [NSNumber numberWithFloat:percent]]);
  }
  
//  [self sendEventWithName:@"EventFTPProgressChanged" body:@{@"percent": [NSNumber numberWithFloat:percent]}];
  [self.bridge.eventDispatcher sendAppEventWithName:@"EventFTPProgressChanged"
      body:@{
             @"tag": dictCallback[@"tag"],
             @"requestUUID": request.uuid,
             @"percent": [NSNumber numberWithFloat:percent],
             }];
}

- (void)requestsManager:(id<GRRequestsManagerProtocol>)requestsManager didCompleteUploadRequest:(id<GRDataExchangeRequestProtocol>)request
{
  NSLog(@"requestsManager:didCompleteUploadRequest:");
  if (self.delegate && [self.delegate respondsToSelector:@selector(requestsManager:didCompleteUploadRequest:)]) {
    [self.delegate requestsManager:requestsManager didCompleteUploadRequest:request];
  }
  // RCTResponseSenderBlock
  RCTResponseSenderBlock callback = [_mDictRequestCallbacks objectForKey:request.uuid][@"callback"];
  if (callback) {
    callback(@[[NSNull null], @true]);
  }
}

- (void)requestsManager:(id<GRRequestsManagerProtocol>)requestsManager didCompleteDownloadRequest:(id<GRDataExchangeRequestProtocol>)request
{
  NSLog(@"requestsManager:didCompleteDownloadRequest:");
  if (self.delegate && [self.delegate respondsToSelector:@selector(requestsManager:didCompleteDownloadRequest:)]) {
    [self.delegate requestsManager:requestsManager didCompleteDownloadRequest:request];
  }
  // RCTResponseSenderBlock
  RCTResponseSenderBlock callback = [_mDictRequestCallbacks objectForKey:request.uuid][@"callback"];
  if (callback) {
    callback(@[[NSNull null], @true]);
  }
}

- (void)requestsManager:(id<GRRequestsManagerProtocol>)requestsManager didFailWritingFileAtPath:(NSString *)path forRequest:(id<GRDataExchangeRequestProtocol>)request error:(NSError *)error
{
  NSLog(@"requestsManager:didFailWritingFileAtPath:forRequest:error: \n %@", error);
  if (self.delegate && [self.delegate respondsToSelector:@selector(requestsManager:didFailWritingFileAtPath:forRequest:error:)]) {
    [self.delegate requestsManager:requestsManager didFailWritingFileAtPath:path forRequest:request error:error];
  }
  // RCTResponseSenderBlock
  RCTResponseSenderBlock callback = [_mDictRequestCallbacks objectForKey:request.uuid][@"callback"];
  if (callback) {
    callback(@[RCTJSErrorFromNSError(error)]);
  }
}

- (void)requestsManager:(id<GRRequestsManagerProtocol>)requestsManager didFailRequest:(id<GRRequestProtocol>)request withError:(NSError *)error
{
  NSLog(@"requestsManager:didFailRequest:withError: \n %@", error);
  if (self.delegate && [self.delegate respondsToSelector:@selector(requestsManager:didFailRequest:withError:)]) {
    [self.delegate requestsManager:requestsManager didFailRequest:request withError:error];
  }
  // RCTResponseSenderBlock
  RCTResponseSenderBlock callback = [_mDictRequestCallbacks objectForKey:request.uuid][@"callback"];
  if (callback) {
    callback(@[RCTJSErrorFromNSError(error)]);
  }
}

@end

