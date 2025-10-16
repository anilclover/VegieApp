package com.vegieapp;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.auth.api.phone.SmsRetriever;
import com.google.android.gms.common.api.CommonStatusCodes;
import com.google.android.gms.common.api.Status;

public class SMSRetrivedModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private SMSBroadcastReceiver smsBroadcastReceiver;

    public SMSRetrivedModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "SMSRetrived";
    }

    @ReactMethod
    public void startSmsListener() {
        Activity activity = getCurrentActivity();
        if (activity == null) return;

        smsBroadcastReceiver = new SMSBroadcastReceiver(new SMSBroadcastReceiver.SmsReceiveListener() {
            @Override
            public void onSmsReceived(String message) {
                sendEvent("onOtpReceived", message);
            }

            @Override
            public void onTimeout() {
                sendEvent("onOtpTimeout", null);
            }
        });

        IntentFilter intentFilter = new IntentFilter(SmsRetriever.SMS_RETRIEVED_ACTION);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            activity.registerReceiver(smsBroadcastReceiver, intentFilter, Context.RECEIVER_EXPORTED);
        } else {
            activity.registerReceiver(smsBroadcastReceiver, intentFilter);
        }

        SmsRetriever.getClient(activity).startSmsRetriever()
                .addOnSuccessListener(aVoid -> Log.d("SMSRetrived", "SMS Retriever started"))
                .addOnFailureListener(e -> Log.e("SMSRetrived", "SMS Retriever failed: " + e.getMessage()));
    }

    private void sendEvent(String eventName, String message) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, message);
    }

    @ReactMethod
    public void addListener(String eventName) {
        // Required for NativeEventEmitter
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Required for NativeEventEmitter
    }
}
