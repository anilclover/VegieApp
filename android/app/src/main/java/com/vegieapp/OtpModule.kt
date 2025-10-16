package com.vegieapp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.provider.Telephony
import android.telephony.SmsMessage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.util.regex.Pattern

class OtpModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    private val smsReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (intent?.action == Telephony.Sms.Intents.SMS_RECEIVED_ACTION) {
                val bundle = intent.extras
                if (bundle != null) {
                    val pdus = bundle.get("pdus") as Array<*>?
                    val format = bundle.getString("format")
                    pdus?.forEach { pdu ->
                        val smsMessage = if (format != null) {
                            SmsMessage.createFromPdu(pdu as ByteArray, format)
                        } else {
                            SmsMessage.createFromPdu(pdu as ByteArray)
                        }
                        val messageBody = smsMessage.messageBody
                        val otp = extractOtp(messageBody)
                        if (otp != null) {
                            sendEvent("OtpReceived", otp)
                        }
                    }
                }
            }
        }
    }
    
    override fun getName(): String {
        return "OtpModule"
    }
    
    @ReactMethod
    fun startListening() {
        val filter = IntentFilter(Telephony.Sms.Intents.SMS_RECEIVED_ACTION)
        filter.priority = 1000
        reactApplicationContext.registerReceiver(smsReceiver, filter)
    }
    
    @ReactMethod
    fun testOtp() {
        sendEvent("OtpReceived", "9853")
    }
    
    private fun extractOtp(message: String): String? {
        val pattern = Pattern.compile("\\b\\d{4}\\b")
        val matcher = pattern.matcher(message)
        return if (matcher.find()) matcher.group() else null
    }
    
    private fun sendEvent(eventName: String, data: String) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, data)
    }
}