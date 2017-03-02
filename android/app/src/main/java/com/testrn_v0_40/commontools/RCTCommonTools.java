package com.testrn_v0_40.commontools;

/**
 * Created by Administrator on 2016/10/14.
 */
import android.content.Intent;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RCTCommonTools extends ReactContextBaseJavaModule {

    public RCTCommonTools(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RCTCommonTools";
    }

    /**
     * 此方法是为了解决返回键退出程序后,ToastAndroid不会消失的bug
     */
    @ReactMethod
    public void onBackPressed() {
//        Intent setIntent = new Intent(Intent.ACTION_MAIN);
//        setIntent.addCategory(Intent.CATEGORY_HOME);
//        setIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//        getCurrentActivity().startActivity(setIntent);
        getCurrentActivity().finish();
    }
}





