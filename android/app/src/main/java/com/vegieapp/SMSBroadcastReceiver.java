package com.vegieapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.google.android.gms.auth.api.phone.SmsRetriever;
import com.google.android.gms.common.api.Status;

public class SMSBroadcastReceiver extends BroadcastReceiver {

    public interface SmsReceiveListener {
        void onSmsReceived(String message);
        void onTimeout();
    }

    private final SmsReceiveListener listener;

    public SMSBroadcastReceiver(SmsReceiveListener listener) {
        this.listener = listener;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d("SMSBroadcastReceiver", "onReceive called with action: " + intent.getAction());
        
        if (SmsRetriever.SMS_RETRIEVED_ACTION.equals(intent.getAction())) {
            Bundle extras = intent.getExtras();
            Log.d("SMSBroadcastReceiver", "Extras: " + (extras != null ? "present" : "null"));
            
            if (extras != null) {
                Status status = (Status) extras.get(SmsRetriever.EXTRA_STATUS);
                Log.d("SMSBroadcastReceiver", "Status: " + (status != null ? status.getStatusCode() : "null"));

                if (status != null) {
                    switch (status.getStatusCode()) {
                        case com.google.android.gms.common.api.CommonStatusCodes.SUCCESS:
                            String message = (String) extras.get(SmsRetriever.EXTRA_SMS_MESSAGE);
                            Log.d("SMSBroadcastReceiver", "SUCCESS - Received SMS: " + message);
                            if (listener != null) {
                                listener.onSmsReceived(message);
                            } else {
                                Log.e("SMSBroadcastReceiver", "Listener is null!");
                            }
                            break;

                        case com.google.android.gms.common.api.CommonStatusCodes.TIMEOUT:
                            Log.d("SMSBroadcastReceiver", "TIMEOUT - SMS retrieval timed out");
                            if (listener != null) listener.onTimeout();
                            break;
                            
                        default:
                            Log.d("SMSBroadcastReceiver", "Unknown status code: " + status.getStatusCode());
                            break;
                    }
                }
            }
        } else {
            Log.d("SMSBroadcastReceiver", "Received different action: " + intent.getAction());
        }
    }
}
