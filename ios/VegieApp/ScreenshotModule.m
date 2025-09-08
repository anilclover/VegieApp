#import "ScreenshotModule.h"
#import <React/RCTLog.h>

@implementation ScreenshotModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(preventScreenshot)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    UIView *field = [[UIView alloc] init];
    field.backgroundColor = [UIColor blackColor];
    field.frame = [UIScreen mainScreen].bounds;
    field.tag = 999;
    
    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    [window addSubview:field];
    [window makeKeyAndVisible];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(screenCaptureChanged)
                                                 name:UIScreenCapturedDidChangeNotification
                                               object:nil];
  });
}

RCT_EXPORT_METHOD(allowScreenshot)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    UIView *field = [window viewWithTag:999];
    if (field) {
      [field removeFromSuperview];
    }
    
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIScreenCapturedDidChangeNotification
                                                  object:nil];
  });
}

- (void)screenCaptureChanged
{
  if ([UIScreen mainScreen].isCaptured) {
    dispatch_async(dispatch_get_main_queue(), ^{
      UIView *field = [[UIView alloc] init];
      field.backgroundColor = [UIColor blackColor];
      field.frame = [UIScreen mainScreen].bounds;
      field.tag = 999;
      
      UIWindow *window = [UIApplication sharedApplication].keyWindow;
      [window addSubview:field];
    });
  } else {
    dispatch_async(dispatch_get_main_queue(), ^{
      UIWindow *window = [UIApplication sharedApplication].keyWindow;
      UIView *field = [window viewWithTag:999];
      if (field) {
        [field removeFromSuperview];
      }
    });
  }
}

@end