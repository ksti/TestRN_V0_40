//
//  YuanXinUIWebView.m
//  yuanxinwebview
//
//  Created by 晏德智 on 16/7/28.
//  Copyright © 2016年 晏德智. All rights reserved.
//

#import "YuanXinUIWebView.h"

#import <UIKit/UIKit.h>

#if __has_include("RCTBridgeModule.h")
#import "RCTAutoInsetsProtocol.h"
#import "RCTConvert.h"
#import "RCTEventDispatcher.h"
#import "RCTLog.h"
#import "RCTUtils.h"
#import "RCTView.h"
#import "UIView+React.h"
#else
#import <React/RCTAutoInsetsProtocol.h>
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTLog.h>
#import <React/RCTUtils.h>
#import <React/RCTView.h>
#import <React/UIView+React.h>
#endif

#import "UIWebView+JSContext.h"
#import "WebViewBridgeCommand.h"


//NSString *const RCTJSNavigationScheme = @"react-js-navigation";

@interface YuanXinUIWebView () <UIWebViewDelegate, RCTAutoInsetsProtocol,BridgeMessageDelegate>

@property (nonatomic,strong,readonly) WebViewBridgeCommand *bridgeCommand;

@end

@implementation YuanXinUIWebView
{
    UIWebView *_webView;
}

@synthesize injectedJavaScript   =    _injectedJavaScript;

@synthesize onLoadingStart       =    _onLoadingStart;
@synthesize onLoadingFinish      =    _onLoadingFinish;
@synthesize onLoadingError       =    _onLoadingError;
@synthesize onShouldStartLoadWithRequest     = _onShouldStartLoadWithRequest;
@synthesize onProgress           =    _onProgress;

@synthesize automaticallyAdjustContentInsets = _automaticallyAdjustContentInsets;
@synthesize contentInset         =   _contentInset;
@synthesize sendCookies          =   _sendCookies;
@synthesize clearCookies         =   _clearCookies;
@synthesize source               =   _source;

/**
 *  执行桥
 */
@synthesize bridgeCommand        =   _bridgeCommand;

- (void)dealloc
{
    _webView.delegate = nil;
    _bridgeCommand = nil;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if ((self = [super initWithFrame:frame])) {
        _webView = [[UIWebView alloc] initWithFrame:self.bounds];
        _webView.delegate = self;
        [self addSubview:_webView];
    }
    return self;
}

RCT_NOT_IMPLEMENTED(- (instancetype)initWithCoder:(NSCoder *)aDecoder)

- (void)goForward
{
    [_webView goForward];
}

- (void)goBack
{
    [_webView goBack];
}

- (void)reload
{
    NSURLRequest *request = [RCTConvert NSURLRequest:self.source];
    if (request.URL && !_webView.request.URL.absoluteString.length) {
        [self loadRequest:request];
    }
    else {
        [_webView reload];
    }
}

- (void)stopLoading
{
    [_webView stopLoading];
}

- (void)setSource:(NSDictionary *)source
{
    if (![_source isEqualToDictionary:source]) {
        _source = [source copy];
        
        // Check for a static html source first
        NSString *html = [RCTConvert NSString:source[@"html"]];
        if (html) {
            NSURL *baseURL = [RCTConvert NSURL:source[@"baseUrl"]];
            if (!baseURL) {
                baseURL = [NSURL URLWithString:@"about:blank"];
            }
            [_webView loadHTMLString:html baseURL:baseURL];
            return;
        }
        
        NSURLRequest *request = [RCTConvert NSURLRequest:source];
        // Because of the way React works, as pages redirect, we actually end up
        // passing the redirect urls back here, so we ignore them if trying to load
        // the same url. We'll expose a call to 'reload' to allow a user to load
        // the existing page.
        if ([request.URL isEqual:_webView.request.URL]) {
            return;
        }
        if (!request.URL) {
            // Clear the webview
            [_webView loadHTMLString:@"" baseURL:nil];
            return;
        }
        [self loadRequest:request];
        //[_webView loadRequest:request];
    }
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    _webView.frame = self.bounds;
}

- (void)setContentInset:(UIEdgeInsets)contentInset
{
    _contentInset = contentInset;
    [RCTView autoAdjustInsetsForView:self
                      withScrollView:_webView.scrollView
                        updateOffset:NO];
}

- (void)setScalesPageToFit:(BOOL)scalesPageToFit
{
    if (_webView.scalesPageToFit != scalesPageToFit) {
        _webView.scalesPageToFit = scalesPageToFit;
        [_webView reload];
    }
}

- (BOOL)scalesPageToFit
{
    return _webView.scalesPageToFit;
}

- (void)setBackgroundColor:(UIColor *)backgroundColor
{
    CGFloat alpha = CGColorGetAlpha(backgroundColor.CGColor);
    self.opaque = _webView.opaque = (alpha == 1.0);
    _webView.backgroundColor = backgroundColor;
}

- (UIColor *)backgroundColor
{
    return _webView.backgroundColor;
}

- (NSMutableDictionary<NSString *, id> *)baseEvent
{
    NSMutableDictionary<NSString *, id> *event = [[NSMutableDictionary alloc] initWithDictionary:@{
                                                                                                   @"url": _webView.request.URL.absoluteString ?: @"",
                                                                                                   @"loading" : @(_webView.loading),
                                                                                                   @"title": [_webView stringByEvaluatingJavaScriptFromString:@"document.title"],
                                                                                                   @"canGoBack": @(_webView.canGoBack),
                                                                                                   @"canGoForward" : @(_webView.canGoForward),
                                                                                                   }];
    
    return event;
}

- (WebViewBridgeCommand *)bridgeCommand{
    if(!_bridgeCommand){
        _bridgeCommand = [[WebViewBridgeCommand alloc] init];
        _bridgeCommand.delegate = self;
    }
    return _bridgeCommand;
}

- (void)refreshContentInset
{
    [RCTView autoAdjustInsetsForView:self
                      withScrollView:_webView.scrollView
                        updateOffset:YES];
}

/**
 *  React 将消息推送到webView
 *
 *  @param value 传入参数
 */
- (void)sendToBridge:(NSString *)value{
    
    JSContext *context = [_webView JSContext];
    /*
    NSString *format = NSStringMultiline((function(){
        if (WebViewBridge && WebViewBridge.pushMessage) {
            WebViewBridge.pushMessage('%@');
        }
    }());
                                         );
    NSString *command = [NSString stringWithFormat: format, value];
    
    [context evaluateScript:command];
    
    [_webView stringByEvaluatingJavaScriptFromString:command];
     */
    
    
    JSValue *jsFunction = context[@"WebViewBridge"][@"pushMessage"];
    JSValue *resultValue = [jsFunction callWithArguments:@[value]];
}

- (void)loadRequest:(NSURLRequest *)request {
    [super loadRequest:request];
    
    [_webView loadRequest:request];
}

/**
 *  执行javascript 方法
 *
 *  @param script  javascript代码
 *  @param resolve <#resolve description#>
 *  @param reject  <#reject description#>
 */
- (void)evaluateScript:(NSString *)script resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject{
    
    JSContext *context = [_webView JSContext];
    
    NSDictionary *callbacks = [self generateCallbacksInContext:context resolver:resolve rejecter:reject UUIDSuffix:true];
    
    NSString *jsWrapper = [NSString stringWithFormat:@"\
                           setTimeout(function(){ \
                           var resolve = %@, reject = %@; \
                           try { \
                           %@ \
                           } catch (e) { \
                           reject(e); \
                           } \
                           }, 0)", callbacks[@"resolveName"], callbacks[@"rejectName"], script];
    
    //dispatch_async(dispatch_get_main_queue(), ^{
    [context evaluateScript:jsWrapper];
    //});
}


- (NSDictionary *)generateCallbacksInContext:(JSContext *)context resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject UUIDSuffix:(BOOL)withSuffix {
    NSString *resolveName = @"resolve";
    NSString *rejectName = @"reject";
    
    if (withSuffix) {
        NSString *uniquePrefix = [[NSUUID UUID].UUIDString substringToIndex:7];
        resolveName = [NSString stringWithFormat:@"resolve_%@", uniquePrefix];
        rejectName = [NSString stringWithFormat:@"reject_%@", uniquePrefix];
    }
    
    context[resolveName] = ^(JSValue *val) {
        resolve([val toString]);
    };
    
    context[rejectName] = ^(JSValue *val) {
        NSString *description = [val toString];
        NSDictionary *userInfo = @{ NSLocalizedDescriptionKey: description };
        NSError *error = [NSError errorWithDomain:@"JSWebViewManagerErrorDomain"
                                             code:-57
                                         userInfo:userInfo];
        
        reject(@"-57", description, error);
    };
    
    return @{@"resolveName": resolveName, @"rejectName": rejectName};
}

- (NSString *)bridgeScript{
    return NSStringMultiline((function (exports) {
        
        function callFunc(func, message) {
            if ('function' === typeof func) {
                func(message);
            }
        }
        
        exports.WebViewBridge = {
        pushMessage: function (message) {
            setTimeout(function () {
                callFunc(WebViewBridge.onMessage, message);
            }, 0);
        },
        send: function (message) {
            if ('string' !== typeof message) {
                
            } else {
                if (YuanXin) {
                    YuanXin.send(message);
                }
            }
        }
        };
        
        WebViewBridge.prototype.onMessage = null;
        WebViewBridge.prototype.onError = null;
        
    })(window);
                             );
}

#pragma mark - UIWebViewDelegate methods

- (BOOL)webView:(__unused UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request
 navigationType:(UIWebViewNavigationType)navigationType
{
    BOOL isJSNavigation = [request.URL.scheme isEqualToString:RCTJSNavigationScheme];
    
    static NSDictionary<NSNumber *, NSString *> *navigationTypes;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        navigationTypes = @{
                            @(UIWebViewNavigationTypeLinkClicked): @"click",
                            @(UIWebViewNavigationTypeFormSubmitted): @"formsubmit",
                            @(UIWebViewNavigationTypeBackForward): @"backforward",
                            @(UIWebViewNavigationTypeReload): @"reload",
                            @(UIWebViewNavigationTypeFormResubmitted): @"formresubmit",
                            @(UIWebViewNavigationTypeOther): @"other",
                            };
    });
    
    // skip this for the JS Navigation handler
    if (!isJSNavigation && _onShouldStartLoadWithRequest) {
        NSMutableDictionary<NSString *, id> *event = [self baseEvent];
        [event addEntriesFromDictionary: @{
                                           @"url": (request.URL).absoluteString,
                                           @"navigationType": navigationTypes[@(navigationType)]
                                           }];
        if (![self.delegate webView:self
          shouldStartLoadForRequest:event
                       withCallback:_onShouldStartLoadWithRequest]) {
            return NO;
        }
    }
    
    if (_onLoadingStart) {
        // We have this check to filter out iframe requests and whatnot
        BOOL isTopFrame = [request.URL isEqual:request.mainDocumentURL];
        if (isTopFrame) {
            NSMutableDictionary<NSString *, id> *event = [self baseEvent];
            [event addEntriesFromDictionary: @{
                                               @"url": (request.URL).absoluteString,
                                               @"navigationType": navigationTypes[@(navigationType)]
                                               }];
            _onLoadingStart(event);
        }
    }
    
    // JS Navigation handler
    return !isJSNavigation;
}

- (void)webView:(__unused UIWebView *)webView didFailLoadWithError:(NSError *)error
{
    if (_onLoadingError) {
        if ([error.domain isEqualToString:NSURLErrorDomain] && error.code == NSURLErrorCancelled) {
            // NSURLErrorCancelled is reported when a page has a redirect OR if you load
            // a new URL in the WebView before the previous one came back. We can just
            // ignore these since they aren't real errors.
            // http://stackoverflow.com/questions/1024748/how-do-i-fix-nsurlerrordomain-error-999-in-iphone-3-0-os
            return;
        }
        
        NSMutableDictionary<NSString *, id> *event = [self baseEvent];
        [event addEntriesFromDictionary:@{
                                          @"domain": error.domain,
                                          @"code": @(error.code),
                                          @"description": error.localizedDescription,
                                          }];
        _onLoadingError(event);
    }
}

- (void)webViewDidFinishLoad:(UIWebView *)webView
{
    NSString *webViewBridgeScriptContent = [self bridgeScript];
    JSContext *context=[webView JSContext];
    JSValue *jsfuncan  =[context evaluateScript:webViewBridgeScriptContent];
    /*
    NSArray *frames = [webView valueForKeyPath:@"documentView.webView.mainFrame.childFrames"];
    [frames enumerateObjectsUsingBlock:^(id frame, NSUInteger idx, BOOL *stop) {
        JSContext *context = [frame valueForKeyPath:@"javaScriptContext"];
        context[@"Window"][@"prototype"][@"alert"] = ^(NSString *message) {
            NSLog(@"%@", message);
        };
    }];
     */
    //JSValue *jsfuncan  [context evaluateScript:webViewBridgeScriptContent];
    // NSString *result =  [webView stringByEvaluatingJavaScriptFromString:webViewBridgeScriptContent];
    // NSLog(@"result scriptContent %@",webViewBridgeScriptContent);
    //[webView stringByEvaluatingJavaScriptFromString:_injectedJavaScript];
    
    if (_injectedJavaScript != nil) {
        NSString *jsEvaluationValue = [webView stringByEvaluatingJavaScriptFromString:_injectedJavaScript];
        
        NSMutableDictionary<NSString *, id> *event = [self baseEvent];
        event[@"jsEvaluationValue"] = jsEvaluationValue;
        
        _onLoadingFinish(event);
    }
    // we only need the final 'finishLoad' call so only fire the event when we're actually done loading.
    else if (_onLoadingFinish && !webView.loading && ![webView.request.URL.absoluteString isEqualToString:@"about:blank"]) {
        _onLoadingFinish([self baseEvent]);
    }
    
    
    //此处为了兼容商家端
    context[@"YuanXin"] = self.bridgeCommand;
}

#pragma mark -- BridgeMessageDelegate

- (void)triggerBridgeMessage:(NSString *)messageType params:(id)parames{
    NSLog(@"triggerBridgeMessage body%@",parames);
    [self sendBridgeMessage:messageType body:parames];
}

@end
