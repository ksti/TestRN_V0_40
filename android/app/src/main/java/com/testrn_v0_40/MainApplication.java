package com.testrn_v0_40;

// android
import android.app.Application;
import android.util.Log;

import android.app.Service;
import android.os.Vibrator;

// facebook
import com.facebook.react.ReactApplication;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

// other third-part
import com.baidu.mapapi.SDKInitializer;
import com.baidu.mapapi.map.MapView;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.reactlibrary.RNUUIDGeneratorPackage;
import com.rnfs.RNFSPackage;
import com.yuanxin.yuanxinwebview.WebViewPackage;
import org.pgsqlite.SQLitePluginPackage; 
import com.imagepicker.ImagePickerPackage;

// testrn_v0_40
import com.testrn_v0_40.baidulocationkit.LocationService;
import com.testrn_v0_40.commontools.RCTCommonToolsPackage;
import com.testrn_v0_40.rctwebview.ReactWebPackage;

// java
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  public static LocationService locationService;
  public Vibrator mVibrator;
  public static MapView mapview;

  // ReactNativeHost
  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new RCTCameraPackage(),
          new SQLitePluginPackage(),
          new RNFSPackage(),
          new ImagePickerPackage(),
          new RNUUIDGeneratorPackage(),
          new ReactWebPackage(),
          new RCTCommonToolsPackage(),
          new PickerPackage(),
          new WebViewPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);

    /***
     * 初始化定位sdk，建议在Application中创建
     */
    locationService = new LocationService(getApplicationContext());
    mVibrator =(Vibrator)getApplicationContext().getSystemService(Service.VIBRATOR_SERVICE);
    SDKInitializer.initialize(getApplicationContext());
  }
}
