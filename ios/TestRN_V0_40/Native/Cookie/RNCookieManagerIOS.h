// RNCookieManagerIOS.h
#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#import "RCTConvert.h"
#else
#import <React/RCTBridgeModule.h>
#import <React/RCTConvert.h>
#endif


@interface RNCookieManagerIOS : NSObject <RCTBridgeModule>

@end
