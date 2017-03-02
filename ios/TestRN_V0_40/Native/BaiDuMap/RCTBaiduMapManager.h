//
//  RCTBaiduMapManager.h
//  JulyFirstDemo
//
//  Created by GJ on 16/7/11.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <BaiduMapAPI_Map/BMKMapComponent.h>
#import "RCTBaiduMap.h"

#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#import "RCTViewManager.h"
#else
#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>
#endif

@interface RCTBaiduMapManager : RCTViewManager<BMKMapViewDelegate,RCTBaiduMapAddressDelegate>
{
  RCTBaiduMap *baidumap;
}

@end
