package com.testrn_v0_40.rctwebview;
import android.content.Context;
import android.graphics.Bitmap;
import android.support.annotation.Nullable;
import android.util.Log;
import android.webkit.CookieManager;
import android.webkit.CookieSyncManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import com.testrn_v0_40.rctwebview.AndroidWebView;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import android.widget.Toast;
import com.facebook.react.uimanager.annotations.ReactProp;

public class ReactWebViewManager extends SimpleViewManager<WebView> {
  public static final String REACT_CLASS = "AndroidWebView";
  private ReactApplicationContext mReactApplicationContext;
  @Override
  public String getName() {
    return REACT_CLASS;
  } 
  public ReactWebViewManager(ReactApplicationContext reactContext)
  {
    mReactApplicationContext=reactContext;
  }
  @Override
  protected WebView createViewInstance(final ThemedReactContext reactContext) {
    WebView webView= new AndroidWebView(reactContext);
    webView.getSettings().setJavaScriptEnabled(true);
    webView.getSettings().setPluginState(WebSettings.PluginState.ON);
    webView.getSettings().setDomStorageEnabled(true);
    removeCookie(reactContext);
    webView.setWebViewClient(new WebViewClient(){
      @Override
      public boolean shouldOverrideUrlLoading(WebView view, String url) {
        view.loadUrl(url);
        return true;
      }
      @Override
      public void onPageStarted(WebView view, String url, Bitmap favicon) {
        super.onPageStarted(view, url, favicon);
      }
      @Override
      public void onPageFinished(WebView view, String url) {
        super.onPageFinished(view, url);
        sendEvent(true);
      }
    });
    return webView;
  }
 
  private void sendEvent(boolean isSuccess)
  {  
      if (mReactApplicationContext!=null)
      {
        mReactApplicationContext.
          getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                  .emit("webViewEvent", isSuccess);   
      }    
  }  

  private void removeCookie(Context context) 
  {
		CookieSyncManager.createInstance(context);
		CookieManager cookieManager = CookieManager.getInstance();
		cookieManager.removeAllCookie();
		CookieSyncManager.getInstance().sync();  
	}

  @ReactProp(name = "url")
  public void setUrl(WebView view,@Nullable String url) {
    Log.e("TAG", "setUrl");
    view.loadUrl(url);
  }
  @ReactProp(name = "html")
   public void setHtml(WebView view,@Nullable String html) {
    Log.e("TAG", "setHtml");
    view.loadDataWithBaseURL (null, html, "text/html", "utf-8",null);
  }
}
