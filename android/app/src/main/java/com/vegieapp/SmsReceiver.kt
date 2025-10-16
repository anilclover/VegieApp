package com.vegieapp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony
import android.telephony.SmsMessage
import com.facebook.react.ReactApplication
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.util.regex.Pattern

class SmsReceiver : BroadcastReceiver() {
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
                        sendEvent(context, "OtpReceived", otp)
                    }
                }
            }
        }
    }
    
    private fun extractOtp(message: String): String? {
        val pattern = Pattern.compile("\\b\\d{6}\\b")
        val matcher = pattern.matcher(message)
        return if (matcher.find()) matcher.group() else null
    }
    
    private fun sendEvent(context: Context?, eventName: String, data: String) {
        try {
            val reactApplication = context?.applicationContext as? ReactApplication
            val reactContext = reactApplication?.reactNativeHost?.reactInstanceManager?.currentReactContext
            reactContext?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                ?.emit(eventName, data)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}