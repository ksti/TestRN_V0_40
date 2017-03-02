package com.yuanxin.yuanxinwebview;

import android.annotation.TargetApi;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.text.TextUtils;
import android.webkit.CookieManager;
import android.webkit.CookieSyncManager;
import android.webkit.GeolocationPermissions;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.common.SystemClock;
import com.facebook.react.common.build.ReactBuildConfig;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.webview.WebViewConfig;
import com.facebook.react.views.webview.events.TopLoadingErrorEvent;
import com.facebook.react.views.webview.events.TopLoadingFinishEvent;
import com.facebook.react.views.webview.events.TopLoadingStartEvent;

import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by lemon on 16/8/9.
 */
public class YuanXinWebViewManager extends SimpleViewManager<WebView> {
    private static final String REACT_CLASS = "YuanXinWebView";

    private static final String HTML_ENCODING = "UTF-8";
    private static final String HTML_MIME_TYPE = "text/html; charset=utf-8";

    private static final String HTTP_METHOD_POST = "POST";

    public static final int COMMAND_GO_BACK = 1;
    public static final int COMMAND_GO_FORWARD = 2;
    public static final int COMMAND_RELOAD = 3;
    public static final int COMMAND_STOP_LOADING = 4;
    private static final int COMMAND_SEND_TO_BRIDGE = 5;
    private static final int COMMAND_SEND_DATA_BRIDGE = 6;
    private static final int COMMAND_EVALUATE_SCRIPT = 7;

    private WebView contentWebView;

    // Use `webView.loadUrl("about:blank")` to reliably reset the view
    // state and release page resources (including any running JavaScript).
    private static final String BLANK_URL = "about:blank";

    private WebViewConfig mWebViewConfig;

    private static class ReactWebViewClient extends WebViewClient {

        private boolean mLastLoadFailed = false;

        @Override
        public void onPageFinished(WebView webView, String url) {
            super.onPageFinished(webView, url);

            if (!mLastLoadFailed) {
                ReactWebView reactWebView = (ReactWebView) webView;
                reactWebView.callInjectedJavaScript();
                emitFinishEvent(webView, url);
            }
        }

        @Override
        public void onPageStarted(WebView webView, String url, Bitmap favicon) {
            super.onPageStarted(webView, url, favicon);
            mLastLoadFailed = false;

            dispatchEvent(
                    webView,
                    new TopLoadingStartEvent(
                            webView.getId(),
                            createWebViewEvent(webView, url)));
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            Intent intent = null;
            if (url.startsWith("tel:")) {
                intent = new Intent(Intent.ACTION_VIEW,
                        Uri.parse(url));
                view.getContext().startActivity(intent);
            } else if (url.startsWith("sms:")) {
                intent = new Intent(Intent.ACTION_SENDTO, Uri.parse(url));
                view.getContext().startActivity(intent);
            } else {
                view.loadUrl(url);
            }
            return true;
        }

        @Override
        public void onReceivedError(
                WebView webView,
                int errorCode,
                String description,
                String failingUrl) {
            super.onReceivedError(webView, errorCode, description, failingUrl);
            mLastLoadFailed = true;

            // In case of an error JS side expect to get a finish event first, and then get an error event
            // Android WebView does it in the opposite way, so we need to simulate that behavior
            emitFinishEvent(webView, failingUrl);

            WritableMap eventData = createWebViewEvent(webView, failingUrl);
            eventData.putDouble("code", errorCode);
            eventData.putString("description", description);

            dispatchEvent(
                    webView,
                    new TopLoadingErrorEvent(webView.getId(), eventData));
        }

        @Override
        public void doUpdateVisitedHistory(WebView webView, String url, boolean isReload) {
            super.doUpdateVisitedHistory(webView, url, isReload);

            dispatchEvent(
                    webView,
                    new TopLoadingStartEvent(
                            webView.getId(),
                            createWebViewEvent(webView, url)));
        }

        private void emitFinishEvent(WebView webView, String url) {
            dispatchEvent(
                    webView,
                    new TopLoadingFinishEvent(
                            webView.getId(),
                            createWebViewEvent(webView, url)));
        }

        private static void dispatchEvent(WebView webView, Event event) {
            ReactContext reactContext = (ReactContext) webView.getContext();
            EventDispatcher eventDispatcher =
                    reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
            eventDispatcher.dispatchEvent(event);
        }

        private WritableMap createWebViewEvent(WebView webView, String url) {
            WritableMap event = Arguments.createMap();
            event.putDouble("target", webView.getId());
            // Don't use webView.getUrl() here, the URL isn't updated to the new value yet in callbacks
            // like onPageFinished
            event.putString("url", url);
            event.putBoolean("loading", !mLastLoadFailed && webView.getProgress() != 100);
            event.putString("title", webView.getTitle());
            event.putBoolean("canGoBack", webView.canGoBack());
            event.putBoolean("canGoForward", webView.canGoForward());
            return event;
        }
    }

    /**
     * Subclass of {@link WebView} that implements {@link LifecycleEventListener} interface in order
     * to call {@link WebView#destroy} on activty destroy event and also to clear the client
     */
    private static class ReactWebView extends WebView implements LifecycleEventListener {
        private
        @Nullable
        String injectedJS;

        /**
         * WebView must be created with an context of the current activity
         * <p/>
         * Activity Context is required for creation of dialogs internally by WebView
         * Reactive Native needed for access to ReactNative internal system functionality
         */
        public ReactWebView(ThemedReactContext reactContext) {
            super(reactContext);
        }

        @Override
        public void onHostResume() {
            // do nothing
        }

        @Override
        public void onHostPause() {
            // do nothing
        }

        @Override
        public void onHostDestroy() {
            cleanupCallbacksAndDestroy();
        }

        public void setInjectedJavaScript(@Nullable String js) {
            injectedJS = js;
        }

        public void callInjectedJavaScript() {
            if (getSettings().getJavaScriptEnabled() &&
                    injectedJS != null &&
                    !TextUtils.isEmpty(injectedJS)) {
                loadUrl("javascript:(function() {\n" + injectedJS + ";\n})();");
            }
        }

        private void cleanupCallbacksAndDestroy() {
            setWebViewClient(null);
            destroy();
        }
    }

    public YuanXinWebViewManager() {
        mWebViewConfig = new WebViewConfig() {
            public void configWebView(WebView webView) {
            }
        };
    }

    public YuanXinWebViewManager(WebViewConfig webViewConfig) {
        mWebViewConfig = webViewConfig;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected WebView createViewInstance(ThemedReactContext reactContext) {
        ReactWebView webView = new ReactWebView(reactContext);
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }
        });
        reactContext.addLifecycleEventListener(webView);
        mWebViewConfig.configWebView(webView);
        webView.addJavascriptInterface(this, "WebViewBridge");
        webView.getSettings().setBuiltInZoomControls(true);
        webView.getSettings().setDisplayZoomControls(false);

        if (ReactBuildConfig.DEBUG && Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            WebView.setWebContentsDebuggingEnabled(true);
        }
        contentWebView=webView;
        return webView;
    }
    @ReactProp(name="clearCookies")
    public void setClearCookies(WebView view, boolean enabled)
    {
        if(enabled)removeCookie(view.getContext());
    }
    /**清除cookies*/
    private void removeCookie(Context context)
    {
        CookieSyncManager.createInstance(context);
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.removeAllCookie();
        if (Build.VERSION.SDK_INT < 21) {
            CookieSyncManager.getInstance().sync();
        } else {
            CookieManager.getInstance().flush();
        }
    }

    @ReactProp(name = "javaScriptEnabled")
    public void setJavaScriptEnabled(WebView view, boolean enabled) {
        view.getSettings().setJavaScriptEnabled(enabled);
    }

    @ReactProp(name = "scalesPageToFit")
    public void setScalesPageToFit(WebView view, boolean enabled) {
        view.getSettings().setUseWideViewPort(!enabled);
    }

    @ReactProp(name = "domStorageEnabled")
    public void setDomStorageEnabled(WebView view, boolean enabled) {
        view.getSettings().setDomStorageEnabled(enabled);
    }


    @ReactProp(name = "userAgent")
    public void setUserAgent(WebView view, @Nullable String userAgent) {
        if (userAgent != null) {
            // TODO(8496850): Fix incorrect behavior when property is unset (uA == null)
            view.getSettings().setUserAgentString(userAgent);
        }
    }

    @TargetApi(Build.VERSION_CODES.JELLY_BEAN_MR1)
    @ReactProp(name = "mediaPlaybackRequiresUserAction")
    public void setMediaPlaybackRequiresUserAction(WebView view, boolean requires) {
        view.getSettings().setMediaPlaybackRequiresUserGesture(requires);
    }

    @ReactProp(name = "injectedJavaScript")
    public void setInjectedJavaScript(WebView view, @Nullable String injectedJavaScript) {
        ((ReactWebView) view).setInjectedJavaScript(injectedJavaScript);
    }

    @ReactProp(name = "source")
    public void setSource(WebView view, @Nullable ReadableMap source) {
        if (source != null) {
            if (source.hasKey("html")) {
                String html = source.getString("html");
                if (source.hasKey("baseUrl")) {
                    view.loadDataWithBaseURL(
                            source.getString("baseUrl"), html, HTML_MIME_TYPE, HTML_ENCODING, null);
                } else {
                    view.loadData(html, HTML_MIME_TYPE, HTML_ENCODING);
                }
                return;
            }
            if (source.hasKey("uri")) {
                String url = source.getString("uri");
                if (source.hasKey("method")) {
                    String method = source.getString("method");
                    if (method.equals(HTTP_METHOD_POST)) {
                        byte[] postData = null;
                        if (source.hasKey("body")) {
                            String body = source.getString("body");
                            try {
                                postData = body.getBytes("UTF-8");
                            } catch (UnsupportedEncodingException e) {
                                postData = body.getBytes();
                            }
                        }
                        if (postData == null) {
                            postData = new byte[0];
                        }
                        view.postUrl(url, postData);
                        return;
                    }
                }
                HashMap<String, String> headerMap = new HashMap<>();
                if (source.hasKey("headers")) {
                    ReadableMap headers = source.getMap("headers");
                    ReadableMapKeySetIterator iter = headers.keySetIterator();
                    while (iter.hasNextKey()) {
                        String key = iter.nextKey();
                        headerMap.put(key, headers.getString(key));
                    }
                }
                view.loadUrl(url, headerMap);
                return;
            }
        }
        view.loadUrl(BLANK_URL);
    }


    private static class YuanXinWebViewChromeClient extends WebChromeClient {
        ReactContext reactContext;
        public YuanXinWebViewChromeClient(ReactContext reactContext) {
            this.reactContext = reactContext;
        }
        /**
         * Tell the client to show a file chooser.
         * <p/>
         * This is called to handle HTML forms with 'file' input type, in response to the
         * user pressing the "Select File" button.
         * To cancel the request, call <code>filePathCallback.onReceiveValue(null)</code> and
         * return true.
         *
         * @param webView           The WebView instance that is initiating the request.
         * @param filePathCallback  Invoke this callback to supply the list of paths to files to upload,
         *                          or NULL to cancel. Must only be called if the
         *                          <code>showFileChooser</code> implementations returns true.
         * @param fileChooserParams Describes the mode of file chooser to be opened, and options to be
         *                          used with it.
         * @return true if filePathCallback will be invoked, false to use default handling.
         * @see FileChooserParams
         */
        @Override
        public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {

            try {
                YuanXinWebViewCommon.filePathCallback=filePathCallback;
                Intent intent=new Intent();
                intent.setClass(this.reactContext,YuanXinWebViewImageActivity.class);
                this.reactContext.startActivity(intent);
            } catch (ActivityNotFoundException e) {
                return false;
            }
            return true;
        }

        @SuppressWarnings("unused")
        public void openFileChooser(ValueCallback<Uri> uploadMsg) {
            System.out.println("sd");

        }

        // For Android 3.0+
        @SuppressWarnings("unused")
        public void openFileChooser(ValueCallback uploadMsg, String acceptType) {
            System.out.println("sd");
        }

        // For Android 4.1+
        @SuppressWarnings("unused")
        public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType, String capture) {
            try {
                YuanXinWebViewCommon.uploadMsg=uploadMsg;
                Intent intent=new Intent();
                intent.setClass(this.reactContext,YuanXinWebViewImageActivity.class);
                this.reactContext.startActivity(intent);
            } catch (Exception ex) {
                System.out.println(ex.getMessage());
            }
        }
    }

    @Override
    protected void addEventEmitters(ThemedReactContext reactContext, WebView view) {
        // Do not register default touch emitter and let WebView implementation handle touches
        view.setWebChromeClient(new YuanXinWebViewChromeClient(reactContext));
        view.setWebViewClient(new ReactWebViewClient());
    }

    @Override
    public
    @Nullable
    Map<String, Integer> getCommandsMap() {
        return MapBuilder.of(
                "goBack", COMMAND_GO_BACK,
                "goForward", COMMAND_GO_FORWARD,
                "reload", COMMAND_RELOAD,
                "stopLoading", COMMAND_STOP_LOADING,
                "sendToBridge", COMMAND_SEND_TO_BRIDGE,
                "sendDataToBridge", COMMAND_SEND_DATA_BRIDGE,
                "evaluateScript", COMMAND_EVALUATE_SCRIPT
        );
    }
    @Override
    public @Nullable Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(
                "toMessage",
                MapBuilder.of("registrationName", "onBridgeMessage")
        );
    }
    @JavascriptInterface
    public void send(String message) {
        WritableMap event = Arguments.createMap();
        event.putString("message", message);
        ReactContext reactContext = (ReactContext)contentWebView.getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                contentWebView.getId(),
                "toMessage",
                event);
    }

    @Override
    public void receiveCommand(WebView root, int commandId, @Nullable ReadableArray args) {
        switch (commandId) {
            case COMMAND_GO_BACK:
                root.goBack();
                break;
            case COMMAND_GO_FORWARD:
                root.goForward();
                break;
            case COMMAND_RELOAD:
                root.reload();
                break;
            case COMMAND_STOP_LOADING:
                root.stopLoading();
                break;
            case COMMAND_SEND_TO_BRIDGE:
                root.loadUrl("javascript:WebViewBridge.onMessage('" + args.getString(0) + "')");
                break;
            case COMMAND_SEND_DATA_BRIDGE:
                break;
            case COMMAND_EVALUATE_SCRIPT:
                root.loadUrl("javascript:WebViewBridge.onMessage('" + args.getString(0) + "')");
                break;
        }
    }

    @Override
    public void onDropViewInstance(WebView webView) {
        super.onDropViewInstance(webView);
        ((ThemedReactContext) webView.getContext()).removeLifecycleEventListener((ReactWebView) webView);
        ((ReactWebView) webView).cleanupCallbacksAndDestroy();
    }
}
