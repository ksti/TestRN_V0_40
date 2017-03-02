package com.yuanxin.yuanxinwebview;

import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.webkit.WebChromeClient;

/**
 * Created by lemon on 16/8/11.
 */
public class YuanXinWebViewImageActivity extends Activity {
    private static final int FILECHOOSER_RESULTCODE=1006;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Intent i = new Intent(Intent.ACTION_GET_CONTENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType("image/*");
        startActivityForResult(
                Intent.createChooser(i, "选择图片"),
                FILECHOOSER_RESULTCODE);
    }
    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILECHOOSER_RESULTCODE) {
            if (YuanXinWebViewCommon.filePathCallback != null) {
                YuanXinWebViewCommon.filePathCallback.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, data));
                YuanXinWebViewCommon.filePathCallback=null;
            } else if (YuanXinWebViewCommon.uploadMsg != null) {
                Uri result = data == null || resultCode != RESULT_OK ? null
                        : data.getData();
                YuanXinWebViewCommon.uploadMsg.onReceiveValue(result);
                YuanXinWebViewCommon.uploadMsg=null;
            }
        }
        this.finish();
    }
}
