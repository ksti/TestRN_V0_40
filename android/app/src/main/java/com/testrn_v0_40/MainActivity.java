package com.testrn_v0_40;

// android
import android.app.Activity;
import android.os.Bundle; 
import android.content.Intent;
import android.content.res.Configuration;

// facebook
import com.facebook.react.ReactActivity;
import com.imagepicker.ImagePickerPackage;
import com.reactlibrary.RNUUIDGeneratorPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.imagepicker.ImagePickerPackage;
import com.rnfs.RNFSPackage;
//import com.facebook.react.LifecycleState;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.shell.MainReactPackage;

// other third-part
import com.baidu.mapapi.SDKInitializer;
import com.imagepicker.ImagePickerPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage; 
import com.reactlibrary.RNUUIDGeneratorPackage; 
import com.github.yamill.orientation.OrientationPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.rnfs.RNFSPackage;
import com.yuanxin.yuanxinwebview.WebViewPackage;
import com.github.yamill.orientation.OrientationPackage;
import org.pgsqlite.SQLitePluginPackage;

// testrn_v0_40
import com.testrn_v0_40.baidulocationkit.BaiduLocationReactPackage;
import com.testrn_v0_40.baidumapkit.BaiduMapReactPackage; 
import com.testrn_v0_40.commontools.RCTCommonToolsPackage;
import com.testrn_v0_40.rctwebview.ReactWebPackage;

// java
import java.util.Arrays;
import java.util.List;

// public class MainActivity extends ReactActivity {

//     /**
//      * Returns the name of the main component registered from JavaScript.
//      * This is used to schedule rendering of the component.
//      */
//     @Override
//     protected String getMainComponentName() {
//         return "TestRN_V0_40";
//     }
// }

public class MainActivity extends ReactActivity  implements DefaultHardwareBackBtnHandler {
    private ReactInstanceManager mReactInstanceManager;
    private ReactRootView mReactRootView;
 
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "TestRN_V0_40";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        //初始化百度地图
        SDKInitializer.initialize(getApplicationContext());

        mReactRootView = new ReactRootView(this);
        mReactInstanceManager = ReactInstanceManager.builder() 
                .setApplication(getApplication())
                .setBundleAssetName("index.android.bundle")
                .setJSMainModuleName("index.android")
                .addPackage(new MainReactPackage())
                .addPackage(new ImagePickerPackage())  
                .addPackage(new RCTCameraPackage())
                .addPackage(new OrientationPackage(this))
                .addPackage(new BaiduMapReactPackage(this)) // <-- Register package here
                .addPackage(new BaiduLocationReactPackage())
                .addPackage(new SQLitePluginPackage())
                .addPackage(new RNFSPackage())
                .addPackage(new RNUUIDGeneratorPackage())
                .addPackage(new ReactWebPackage())
                .addPackage(new WebViewPackage())
                .addPackage(new RCTCommonToolsPackage())
                .addPackage(new PickerPackage())
                .setUseDeveloperSupport(true)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();

        mReactRootView.startReactApplication(mReactInstanceManager, "TestRN_V0_40", null);
        setContentView(mReactRootView);
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        this.sendBroadcast(intent);
    }

    //传递一些Activity的生命周期事件到ReactInstanceManager，这是的JavaScript代码可以控制当前用户按下返回按钮的时候作何处理（譬如控制导航切换等等）。
    @Override
    protected void onPause() {
        super.onPause();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostPause(this);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostResume(this, this);
        }
    }

   @Override
    protected void onDestroy() {
        super.onDestroy();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostDestroy(this);
        }
    }

    // 如果JavaScript端不处理相应的事件，你的invokeDefaultOnBackPressed方法会被调用。默认情况，这会直接结束你的Activity。
    @Override
    public void invokeDefaultOnBackPressed() {
        super.onBackPressed();
    }

    @Override
    public void onBackPressed() {
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onBackPressed();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onActivityResult(this, requestCode, resultCode, data);
        }
    }
}

