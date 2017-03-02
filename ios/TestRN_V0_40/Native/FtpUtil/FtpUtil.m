//
//  FtpUtil.m
//  Test_Test
//
//  Created by forp on 16/9/27.
//  Copyright © 2016年 forp. All rights reserved.
//

#import "FtpUtil.h"

@interface FtpUtil () <GRRequestsManagerDelegate>

@end

@implementation FtpUtil

- (instancetype)init
{
    self = [super init];
    if (self) {
        //
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

- (void)setupSeverHostname:(NSString *)hostname user:(NSString *)username password:(NSString *)password
{
  self.hostname = hostname;
  self.username = username;
  self.password = password;
}

- (void)listingPath:(NSString *)directoryPath
{
    [self _setupManager];
//    [self.requestsManager addRequestForListDirectoryAtPath:@"/"];
    [self.requestsManager addRequestForListDirectoryAtPath:directoryPath];
    [self.requestsManager startProcessingRequests];
}

- (void)createDirectory:(NSString *)directoryPath
{
    [self _setupManager];
//    [self.requestsManager addRequestForCreateDirectoryAtPath:@"dir/"];
    [self.requestsManager addRequestForCreateDirectoryAtPath:directoryPath];
    [self.requestsManager startProcessingRequests];
}

- (void)deleteDirectory:(NSString *)directoryPath
{
    [self _setupManager];
//    [self.requestsManager addRequestForDeleteDirectoryAtPath:@"dir/"];
    [self.requestsManager addRequestForDeleteDirectoryAtPath:directoryPath];
    [self.requestsManager startProcessingRequests];
}

- (void)deleteFileAtPath:(NSString *)filePath
{
    [self _setupManager];
    //    [self.requestsManager addRequestForDeleteFileAtPath:@"dir/file.txt"];
    [self.requestsManager addRequestForDeleteFileAtPath:filePath];
    [self.requestsManager startProcessingRequests];
}

- (void)uploadFileAtLocalPath:(NSString *)localPath toRemotePath:(NSString *)remotePath
{
    [self _setupManager];
//    NSString *bundlePath = [[NSBundle mainBundle] pathForResource:@"TestFile" ofType:@"txt"];
//    [self.requestsManager addRequestForUploadFileAtLocalPath:bundlePath toRemotePath:@"dir/file.txt"];
    [self.requestsManager addRequestForUploadFileAtLocalPath:localPath toRemotePath:remotePath];
    [self.requestsManager startProcessingRequests];
}

- (void)downloadFileAtRemotePath:(NSString *)remotePath toLocalPath:(NSString *)localPath
{
    [self _setupManager];
//    NSString *documentsDirectoryPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) lastObject];
//    NSString *localFilePath = [documentsDirectoryPath stringByAppendingPathComponent:@"DownloadedFile.txt"];
    
//    [self.requestsManager addRequestForDownloadFileAtRemotePath:@"dir/file.txt" toLocalPath:localFilePath];
    [self.requestsManager addRequestForDownloadFileAtRemotePath:remotePath toLocalPath:localPath];
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
}

- (void)requestsManager:(id<GRRequestsManagerProtocol>)requestsManager didCompleteCreateDirectoryRequest:(id<GRRequestProtocol>)request
{
    NSLog(@"requestsManager:didCompleteCreateDirectoryRequest:");
    if (self.delegate && [self.delegate respondsToSelector:@selector(requestsManager:didCompleteCreateDirectoryRequest:)]) {
        [self.delegate requestsManager:requestsManager didCompleteCreateDirectoryRequest:request];
    }
}

- (void)requestsManager:(id<GRRequestsManagerProtocol>)requestsManager didCompleteDeleteRequest:(id<GRRequestProtocol>)request
{
    NSLog(@"requestsManager:didCompleteDeleteRequest:");
    if (self.delegate && [self.delegate respondsToSelector:@selector(requestsManager:didCompleteDeleteRequest:)]) {
        [self.delegate requestsManager:requestsManager didCompleteDeleteRequest:request];
    }
}

- (void)requestsManager:(id<GRRequestsManagerProtocol>)requestsManager didCompletePercent:(float)percent forRequest:(id<GRRequestProtocol>)request
{
    NSLog(@"requestsManager:didCompletePercent:forRequest: %f", percent);
    if (self.delegate && [self.delegate respondsToSelector:@selector(requestsManager:didCompletePercent:forRequest:)]) {
        [self.delegate requestsManager:requestsManager didCompletePercent:percent forRequest:request];
    }
}

- (void)requestsManager:(id<GRRequestsManagerProtocol>)requestsManager didCompleteUploadRequest:(id<GRDataExchangeRequestProtocol>)request
{
    NSLog(@"requestsManager:didCompleteUploadRequest:");
    if (self.delegate && [self.delegate respondsToSelector:@selector(requestsManager:didCompleteUploadRequest:)]) {
        [self.delegate requestsManager:requestsManager didCompleteUploadRequest:request];
    }
}

- (void)requestsManager:(id<GRRequestsManagerProtocol>)requestsManager didCompleteDownloadRequest:(id<GRDataExchangeRequestProtocol>)request
{
    NSLog(@"requestsManager:didCompleteDownloadRequest:");
    if (self.delegate && [self.delegate respondsToSelector:@selector(requestsManager:didCompleteDownloadRequest:)]) {
        [self.delegate requestsManager:requestsManager didCompleteDownloadRequest:request];
    }
}

- (void)requestsManager:(id<GRRequestsManagerProtocol>)requestsManager didFailWritingFileAtPath:(NSString *)path forRequest:(id<GRDataExchangeRequestProtocol>)request error:(NSError *)error
{
    NSLog(@"requestsManager:didFailWritingFileAtPath:forRequest:error: \n %@", error);
    if (self.delegate && [self.delegate respondsToSelector:@selector(requestsManager:didFailWritingFileAtPath:forRequest:error:)]) {
        [self.delegate requestsManager:requestsManager didFailWritingFileAtPath:path forRequest:request error:error];
    }
}

- (void)requestsManager:(id<GRRequestsManagerProtocol>)requestsManager didFailRequest:(id<GRRequestProtocol>)request withError:(NSError *)error
{
    NSLog(@"requestsManager:didFailRequest:withError: \n %@", error);
    if (self.delegate && [self.delegate respondsToSelector:@selector(requestsManager:didFailRequest:withError:)]) {
        [self.delegate requestsManager:requestsManager didFailRequest:request withError:error];
    }
}

@end
