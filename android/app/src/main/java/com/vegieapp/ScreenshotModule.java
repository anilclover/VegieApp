package com.vegieapp;

import android.view.WindowManager;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;

public class ScreenshotModule extends ReactContextBaseJavaModule {

    public ScreenshotModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ScreenshotModule";
    }

    @ReactMethod
    public void preventScreenshot() {
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                getCurrentActivity().getWindow().setFlags(
                    WindowManager.LayoutParams.FLAG_SECURE,
                    WindowManager.LayoutParams.FLAG_SECURE
                );
            }
        });
    }

    @ReactMethod
    public void allowScreenshot() {
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                getCurrentActivity().getWindow().clearFlags(
                    WindowManager.LayoutParams.FLAG_SECURE
                );
            }
        });
    }
}