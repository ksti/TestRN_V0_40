//
//  YuanXinWebView+WkWebView.m
//  YuanXinWebView
//
//  Created by 晏德智 on 16/7/28.
//  Copyright © 2016年 晏德智. All rights reserved.
//

#import "YuanXinWKWebView.h"
#import <WebKit/WebKit.h>
#import <UIKit/UIKit.h>

#if __has_include("RCTBridgeModule.h")
#import "RCTConvert.h"
#import "RCTEventDispatcher.h"
#import "RCTLog.h"
#import "RCTUtils.h"
#import "RCTView.h"
#import "UIView+React.h"
#else
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTLog.h>
#import <React/RCTUtils.h>
#import <React/RCTView.h>
#import <React/UIView+React.h>
#endif


@interface YuanXinWKWebView()<WKNavigationDelegate,WKUIDelegate,WKScriptMessageHandler>

@end

@implementation YuanXinWKWebView
{
    WKWebView *_wkWebView;
}

@synthesize injectedJavaScript   =    _injectedJavaScript;

@synthesize onLoadingStart       =    _onLoadingStart;
@synthesize onLoadingFinish      =    _onLoadingFinish;
@synthesize onLoadingError       =    _onLoadingError;
@synthesize onShouldStartLoadWithRequest     = _onShouldStartLoadWithRequest;
@synthesize onProgress           =    _onProgress;
@synthesize onBridgeMessage      =    _onBridgeMessage;

@synthesize automaticallyAdjustContentInsets = _automaticallyAdjustContentInsets;
@synthesize contentInset         =   _contentInset;
@synthesize sendCookies          =   _sendCookies;
@synthesize clearCookies         =   _clearCookies;
@synthesize source               =   _source;


- (instancetype)initWithFrame:(CGRect)frame
{
    if ((self = [super initWithFrame:frame])) {
        
        WKWebViewConfiguration* configuration = [[WKWebViewConfiguration alloc] init];
        configuration.userContentController = [self userContentController];
        
        // Webview的偏好设置
        WKPreferences *wkpreferences = [WKPreferences new];
        [wkpreferences setJavaScriptEnabled:true];
        [wkpreferences setMinimumFontSize:10];
        // 默认是不能通过JS自动打开窗口的，必须通过用户交互才能打开
        [wkpreferences setJavaScriptCanOpenWindowsAutomatically:YES];
        configuration.preferences =wkpreferences;
        
        _wkWebView = [[WKWebView alloc] initWithFrame:self.bounds  configuration:configuration];
        _wkWebView.navigationDelegate = self;
        _wkWebView.UIDelegate   = self;
        [_wkWebView addObserver:self forKeyPath:@"estimatedProgress" options:NSKeyValueObservingOptionNew context:nil];
        [self addSubview:_wkWebView];
    }
    return self;
}

- (void)dealloc
{
    @try {
        [_wkWebView removeObserver:self forKeyPath:@"estimatedProgress"];
    }
    @catch (NSException * __unused exception) {}
}

- (WKUserContentController *)userContentController{
    WKUserContentController *contentController = [[WKUserContentController alloc] init];
    [contentController addScriptMessageHandler:self name:@"YuanXin"];
    NSString *yuanXinBridge = self.bridgeScript;
    WKUserScript * bridgeScript = [[WKUserScript alloc]
                             initWithSource:yuanXinBridge injectionTime:WKUserScriptInjectionTimeAtDocumentStart forMainFrameOnly:true];
    [contentController addUserScript:bridgeScript];
    /*
    WKUserScript * cookieScript = [[WKUserScript alloc]
                                   initWithSource: @"document.cookie = 'TeskCookieKey1=TeskCookieValue1';document.cookie = 'TeskCookieKey2=TeskCookieValue2';"
                                   injectionTime:WKUserScriptInjectionTimeAtDocumentStart forMainFrameOnly:NO];

    [contentController addUserScript:cookieScript];
     */

    return contentController;
}

- (void)loadRequest:(NSURLRequest *)request {
    [super loadRequest:request];
    
    [_wkWebView loadRequest:request];
}

- (void)goForward
{
    if([_wkWebView canGoForward]){
        [_wkWebView goForward];
    }
}

- (void)goBack
{
    [_wkWebView goBack];
}

- (void)reload
{
    NSURLRequest *request = [RCTConvert NSURLRequest:self.source];
    if (request.URL && !_wkWebView.URL.absoluteString.length) {
        [self loadRequest:request];
    }
    else {
        [_wkWebView reload];
    }
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
            [_wkWebView loadHTMLString:html baseURL:baseURL];
            return;
        }
        
        NSURLRequest *request = [RCTConvert NSURLRequest:source];
        // Because of the way React works, as pages redirect, we actually end up
        // passing the redirect urls back here, so we ignore them if trying to load
        // the same url. We'll expose a call to 'reload' to allow a user to load
        // the existing page.
        if ([request.URL isEqual:_wkWebView.URL]) {
            return;
        }
        if (!request.URL) {
            // Clear the webview
            [_wkWebView loadHTMLString:@"" baseURL:nil];
            return;
        }
        [self loadRequest:request];
    }
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    _wkWebView.frame = self.bounds;
}

- (void)setContentInset:(UIEdgeInsets)contentInset
{
    _contentInset = contentInset;
    [RCTView autoAdjustInsetsForView:self
                      withScrollView:_wkWebView.scrollView
                        updateOffset:NO];
}

- (void)setBackgroundColor:(UIColor *)backgroundColor
{
    CGFloat alpha = CGColorGetAlpha(backgroundColor.CGColor);
    self.opaque = _wkWebView.opaque = (alpha == 1.0);
    _wkWebView.backgroundColor = backgroundColor;
}

- (UIColor *)backgroundColor
{
    return _wkWebView.backgroundColor;
}

- (NSMutableDictionary<NSString *, id> *)baseEvent
{
    NSMutableDictionary<NSString *, id> *event = [[NSMutableDictionary alloc] initWithDictionary:@{
                                                                                                   @"url": _wkWebView.URL.absoluteString ?: @"",
                                                                                                   @"loading" : @(_wkWebView.loading),
                                                                                                   @"title": _wkWebView.title,
                                                                                                   @"canGoBack": @(_wkWebView.canGoBack),
                                                                                                   @"canGoForward" : @(_wkWebView.canGoForward),
                                                                                                   }];
    
    return event;
}

- (void)refreshContentInset
{
    [RCTView autoAdjustInsetsForView:self
                      withScrollView:_wkWebView.scrollView
                        updateOffset:YES];
}

- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary *)change
                       context:(void *)context
{
    if ([keyPath isEqualToString:@"estimatedProgress"]) {
        if (!_onProgress) {
            return;
        }
        _onProgress(@{@"progress": [change objectForKey:NSKeyValueChangeNewKey]});
    }
}

- (void)evaluateScript:(NSString *)script resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject{
    
    NSString *jsWrapper = [NSString stringWithFormat:@"\
                           setTimeout(function(){ \
                           %@ }, 0)", script];
    __block BOOL finished = NO;
    __block RCTPromiseResolveBlock _resolve = resolve;
    __block RCTPromiseRejectBlock _reject = reject;
    [_wkWebView evaluateJavaScript:jsWrapper completionHandler:^(id result, NSError *error) {
        if (error == nil) {
            
            _resolve(result);
            /*
             if (result != nil) {
             //resultString = [NSString stringWithFormat:@"%@", result];
             }
             */
        } else {
            NSLog(@"evaluateJavaScript error : %@", error.localizedDescription);
            
            NSString *description = error.localizedDescription;
            NSDictionary *userInfo = @{ NSLocalizedDescriptionKey: description };
            NSError *error = [NSError errorWithDomain:@"WKWebViewManagerErrorDomain"
                                                 code:-57
                                             userInfo:userInfo];
            _reject(@"-57", description, error);

        }
        finished =YES;
    }];
}

/*
 - (NSString *)stringByEvaluatingJavaScriptFromString:(NSString *)script {
 __block NSString *resultString = nil;
 __block BOOL finished = NO;
 
 [self evaluateJavaScript:script completionHandler:^(id result, NSError *error) {
 if (error == nil) {
 if (result != nil) {
 resultString = [NSString stringWithFormat:@"%@", result];
 }
 } else {
 NSLog(@"evaluateJavaScript error : %@", error.localizedDescription);
 }
 finished = YES;
 }];
 
 while (!finished)
 {
 [[NSRunLoop currentRunLoop] runMode:NSDefaultRunLoopMode beforeDate:[NSDate distantFuture]];
 }
 
 return resultString;
 }
 */

- (NSString *)bridgeScript{
    return NSStringMultiline((function (exports) {
        
        
        exports.WebViewBridge = {
        pushMessage: function (message) {
            setTimeout(function () {
                callFunc(WebViewBridge.onMessage, message);
            }, 0); //this magic number is just a random small value. I don't like 0.
        },
        send: function (message) {
            if ('string' !== typeof message) {
                
            } else {
                postMessage('YuanXin', {
                    'messages': message
                }, null, null)
            }
        }
        };
        
        WebViewBridge.prototype.onMessage = null;
        WebViewBridge.prototype.onError = null;
        
        exports._WKWebViewWebBridges = {
        callbacks: {},
        base64ToData: base64ToData
        }
        
        var callbacks = exports._WKWebViewWebBridges.callbacks
        
        function postMessage(name, params, onsuccess, onerror) {
            params.onsuccess = registerCallback(function (obj) {
                deregisterCallback(params.onsuccess)
                deregisterCallback(params.onerror)
                onsuccess(obj)
            })
            
            params.onerror = registerCallback(function (err) {
                deregisterCallback(params.onsuccess)
                deregisterCallback(params.onerror)
                onerror(err)
            })
            
            window.webkit.messageHandlers[name].postMessage(params)
        }
        
        function registerCallback(cb) {
            var id = genUniqueId(callbacks)
            callbacks[id] = cb
            return id
        }
        
        function deregisterCallback(id) {
            delete callbacks[id]
        }
        
        function genUniqueId(lookup) {
            var id = genId()
            
            while (lookup[id]) {
                id = genId()
            }
            
            return id
        }
        
        function genId() {
            return Math.random().toString().slice(2)
        }
        
        function base64ToData(string) {
            var binaryString = window.atob(string)
            var len = binaryString.length
            var bytes = new Uint8Array(len)
            
            for (var i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i)
            }
            
            return bytes.buffer
        }
        
        function callFunc(func, message) {
            if ('function' === typeof func) {
                func(message);
            }
        }
        
        function dataToBase64(data) {
            var binary = false
            
            if (data instanceof ArrayBuffer) {
                data = String.fromCharCode.apply(null, new Uint8Array(data))
                binary = true
            } else if (isTypedArray(data)) {
                data = String.fromCharCode.apply(null, data)
                binary = true
            }
            
            return {
            data: window.btoa(data),
            binary: binary
            }
        }
        
        function isTypedArray(obj) {
            return obj && obj.buffer
        }
    })(window);
                             );
}



#pragma mark -- WKNavigationDelegate methods

- (void)webView:(__unused WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler
{
    NSURLRequest *request = navigationAction.request;
    NSURL* url = request.URL;
    NSString* scheme = url.scheme;
    
    BOOL isJSNavigation = [scheme isEqualToString:RCTJSNavigationScheme];
    
    // skip this for the JS Navigation handler
    if (!isJSNavigation && _onShouldStartLoadWithRequest) {
        NSMutableDictionary<NSString *, id> *event = [self baseEvent];
        [event addEntriesFromDictionary: @{
                                           @"url": (request.URL).absoluteString,
                                           @"navigationType": @(navigationAction.navigationType)
                                           }];
        if (![self.delegate webView:self
          shouldStartLoadForRequest:event
                       withCallback:_onShouldStartLoadWithRequest]) {
            return decisionHandler(WKNavigationActionPolicyCancel);
        }
    }
    
    if (_onLoadingStart) {
        // We have this check to filter out iframe requests and whatnot
        BOOL isTopFrame = [url isEqual:request.mainDocumentURL];
        if (isTopFrame) {
            NSMutableDictionary<NSString *, id> *event = [self baseEvent];
            [event addEntriesFromDictionary: @{
                                               @"url": url.absoluteString,
                                               @"navigationType": @(navigationAction.navigationType)
                                               }];
            _onLoadingStart(event);
        }
    }
    
    if (isJSNavigation) {
        decisionHandler(WKNavigationActionPolicyCancel);
    }
    else if (navigationAction.targetFrame && ([scheme isEqualToString:@"http"] || [scheme isEqualToString:@"https"])) {
        decisionHandler(WKNavigationActionPolicyAllow);
    }
    else {
        if (![scheme isEqualToString:@"about"]) {
            [[UIApplication sharedApplication] openURL:url];
        }
        decisionHandler(WKNavigationActionPolicyAllow);
    }
}

- (void)webView:(__unused WKWebView *)webView didFailProvisionalNavigation:(__unused WKNavigation *)navigation withError:(NSError *)error
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

- (void)webView:(WKWebView *)webView didFinishNavigation:(__unused WKNavigation *)navigation
{
    if (_injectedJavaScript != nil) {
        [webView evaluateJavaScript:_injectedJavaScript completionHandler:^(id result, NSError *error) {
            NSMutableDictionary<NSString *, id> *event = [self baseEvent];
            event[@"jsEvaluationValue"] = [NSString stringWithFormat:@"%@", result];
            _onLoadingFinish(event);
        }];
    }
    // we only need the final 'finishLoad' call so only fire the event when we're actually done loading.
    else if (_onLoadingFinish && !webView.loading && ![webView.URL.absoluteString isEqualToString:@"about:blank"]) {
        _onLoadingFinish([self baseEvent]);
    }
}

#pragma mark -- WKUIDelegate methods

- (void)webView:(WKWebView *)webView runJavaScriptAlertPanelWithMessage:(NSString *)message initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(void))completionHandler {
    
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"提醒" message:message preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction *okAction = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        completionHandler();
    }];
    [alertController addAction:okAction];
    
    UIViewController *keyRootController =  [RCTKeyWindow() rootViewController];
    [keyRootController presentViewController:alertController animated:YES completion:^(){}];
}

- (void)webView:(WKWebView *)webView runJavaScriptConfirmPanelWithMessage:(nonnull NSString *)message initiatedByFrame:(nonnull WKFrameInfo *)frame completionHandler:(nonnull void (^)(BOOL))completionHandler{
    
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"提醒" message:message preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction *okAction = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        completionHandler(YES);
    }];
    [alertController addAction:okAction];
    
    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        completionHandler(NO);
    }];
    [alertController addAction:cancelAction];
    
    UIViewController *keyRootController =  [RCTKeyWindow() rootViewController];
    [keyRootController presentViewController:alertController animated:YES completion:^(){}];
}

- (void)webView:(WKWebView *)webView runJavaScriptTextInputPanelWithPrompt:(NSString *)prompt defaultText:(nullable NSString *)defaultText initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(NSString * __nullable result))completionHandler{
    
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"提醒" message:defaultText preferredStyle:UIAlertControllerStyleAlert];
    [alertController addTextFieldWithConfigurationHandler:^(UITextField *textField){
        // [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(alertTextFieldDidChange:) name:UITextFieldTextDidChangeNotification object:textField];
    }];
    UIAlertAction *okAction = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        NSString  *text = alertController.textFields[0].text;
        
        completionHandler(text);
    }];
    [alertController addAction:okAction];
    
    UIViewController *keyRootController =  [RCTKeyWindow() rootViewController];
    [keyRootController presentViewController:alertController animated:YES completion:^(){}];
}

- (void)webViewDidClose:(WKWebView *)webView{
    
}

#pragma mark -- WKScriptMessageHandler methods
- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message{
    
    if ([message.name isEqualToString:@"YuanXin"]){
        NSDictionary *parames = message.body;
        [self sendBridgeMessage:@"messages" body:parames];
    }
    
    NSLog(@"ReceiveScriptMessage %@",message.name);
}


@end
