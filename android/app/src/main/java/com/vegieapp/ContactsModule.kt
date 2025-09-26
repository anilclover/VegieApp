
package com.vegieapp;
  

import android.content.ContentResolver
import android.database.Cursor
import android.provider.ContactsContract
import com.facebook.react.bridge.*

class ContactsModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "ContactsModule"

    @ReactMethod
    fun getContacts(promise: Promise) {
        try {
            val contacts = Arguments.createArray()
            val contentResolver: ContentResolver = reactApplicationContext.contentResolver

            val cursor: Cursor? = contentResolver.query(
                ContactsContract.Contacts.CONTENT_URI,
                null,
                null,
                null,
                ContactsContract.Contacts.DISPLAY_NAME_PRIMARY + " ASC"
            )

            cursor?.use {
                val idIndex = it.getColumnIndex(ContactsContract.Contacts._ID)
                val nameIndex = it.getColumnIndex(ContactsContract.Contacts.DISPLAY_NAME_PRIMARY)
                val photoIndex = it.getColumnIndex(ContactsContract.Contacts.PHOTO_URI)

                while (it.moveToNext()) {
                    val contactId = it.getString(idIndex)
                    val name = it.getString(nameIndex) ?: "Unknown"
                    val photo = it.getString(photoIndex)

                    val contactMap = Arguments.createMap()
                    contactMap.putString("id", contactId)
                    contactMap.putString("name", name)
                    contactMap.putString("photo", photo)

                    // Phones
                    val phones = Arguments.createArray()
                    val phoneCursor = contentResolver.query(
                        ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
                        null,
                        "${ContactsContract.CommonDataKinds.Phone.CONTACT_ID} = ?",
                        arrayOf(contactId),
                        null
                    )
                    phoneCursor?.use { pc ->
                        val numberIdx = pc.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER)
                        val typeIdx = pc.getColumnIndex(ContactsContract.CommonDataKinds.Phone.TYPE)
                        while (pc.moveToNext()) {
                            val phoneMap = Arguments.createMap()
                            phoneMap.putString("number", pc.getString(numberIdx))
                            phoneMap.putString("type", pc.getInt(typeIdx).toString())
                            phones.pushMap(phoneMap)
                        }
                    }
                    contactMap.putArray("phones", phones)

                    // Emails
                    val emails = Arguments.createArray()
                    val emailCursor = contentResolver.query(
                        ContactsContract.CommonDataKinds.Email.CONTENT_URI,
                        null,
                        "${ContactsContract.CommonDataKinds.Email.CONTACT_ID} = ?",
                        arrayOf(contactId),
                        null
                    )
                    emailCursor?.use { ec ->
                        val emailIdx = ec.getColumnIndex(ContactsContract.CommonDataKinds.Email.ADDRESS)
                        val typeIdx = ec.getColumnIndex(ContactsContract.CommonDataKinds.Email.TYPE)
                        while (ec.moveToNext()) {
                            val emailMap = Arguments.createMap()
                            emailMap.putString("email", ec.getString(emailIdx))
                            emailMap.putString("type", ec.getInt(typeIdx).toString())
                            emails.pushMap(emailMap)
                        }
                    }
                    contactMap.putArray("emails", emails)

                    // Organization (Company & Job Title)
                    val orgCursor = contentResolver.query(
                        ContactsContract.Data.CONTENT_URI,
                        null,
                        "${ContactsContract.Data.CONTACT_ID} = ? AND ${ContactsContract.Data.MIMETYPE} = ?",
                        arrayOf(contactId, ContactsContract.CommonDataKinds.Organization.CONTENT_ITEM_TYPE),
                        null
                    )
                    orgCursor?.use { oc ->
                        if (oc.moveToFirst()) {
                            val companyIdx = oc.getColumnIndex(ContactsContract.CommonDataKinds.Organization.COMPANY)
                            val titleIdx = oc.getColumnIndex(ContactsContract.CommonDataKinds.Organization.TITLE)
                            contactMap.putString("company", oc.getString(companyIdx))
                            contactMap.putString("jobTitle", oc.getString(titleIdx))
                        }
                    }

                    // Addresses
                    val addresses = Arguments.createArray()
                    val addrCursor = contentResolver.query(
                        ContactsContract.CommonDataKinds.StructuredPostal.CONTENT_URI,
                        null,
                        "${ContactsContract.CommonDataKinds.StructuredPostal.CONTACT_ID} = ?",
                        arrayOf(contactId),
                        null
                    )
                    addrCursor?.use { ac ->
                        val streetIdx = ac.getColumnIndex(ContactsContract.CommonDataKinds.StructuredPostal.STREET)
                        val cityIdx = ac.getColumnIndex(ContactsContract.CommonDataKinds.StructuredPostal.CITY)
                        val countryIdx = ac.getColumnIndex(ContactsContract.CommonDataKinds.StructuredPostal.COUNTRY)
                        while (ac.moveToNext()) {
                            val addrMap = Arguments.createMap()
                            addrMap.putString("street", ac.getString(streetIdx))
                            addrMap.putString("city", ac.getString(cityIdx))
                            addrMap.putString("country", ac.getString(countryIdx))
                            addresses.pushMap(addrMap)
                        }
                    }
                    contactMap.putArray("addresses", addresses)

                    // Notes
                    val noteCursor = contentResolver.query(
                        ContactsContract.Data.CONTENT_URI,
                        null,
                        "${ContactsContract.Data.CONTACT_ID} = ? AND ${ContactsContract.Data.MIMETYPE} = ?",
                        arrayOf(contactId, ContactsContract.CommonDataKinds.Note.CONTENT_ITEM_TYPE),
                        null
                    )
                    noteCursor?.use { nc ->
                        if (nc.moveToFirst()) {
                            val noteIdx = nc.getColumnIndex(ContactsContract.CommonDataKinds.Note.NOTE)
                            contactMap.putString("note", nc.getString(noteIdx))
                        }
                    }

                    contacts.pushMap(contactMap)
                }
            }

            promise.resolve(contacts)
        } catch (e: Exception) {
            promise.reject("CONTACTS_ERROR", e.message)
        }
    }
}
 