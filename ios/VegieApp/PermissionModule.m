#import "PermissionModule.h"
#import <CoreLocation/CoreLocation.h>
#import <Contacts/Contacts.h>
#import <UserNotifications/UserNotifications.h>

@interface PermissionModule () <CLLocationManagerDelegate>
@property (nonatomic, strong) CLLocationManager *locationManager;
@end

@implementation PermissionModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(requestAllPermissions:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [self requestLocationPermission];
    [self requestContactsPermission];
    [self requestNotificationPermission];
    resolve(@"Permissions requested");
  });
}

- (void)requestLocationPermission
{
  self.locationManager = [[CLLocationManager alloc] init];
  self.locationManager.delegate = self;
  [self.locationManager requestWhenInUseAuthorization];
}

- (void)requestContactsPermission
{
  CNContactStore *store = [[CNContactStore alloc] init];
  [store requestAccessForEntityType:CNEntityTypeContacts completionHandler:^(BOOL granted, NSError * _Nullable error) {
    if (granted) {
      NSLog(@"Contacts permission granted");
    } else {
      NSLog(@"Contacts permission denied");
    }
  }];
}

- (void)requestNotificationPermission
{
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert + UNAuthorizationOptionSound + UNAuthorizationOptionBadge)
                        completionHandler:^(BOOL granted, NSError * _Nullable error) {
    if (granted) {
      NSLog(@"Notification permission granted");
    } else {
      NSLog(@"Notification permission denied");
    }
  }];
}

@end