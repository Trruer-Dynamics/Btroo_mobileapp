
package com.facebook.react;

import android.app.Application;
import android.content.Context;
import android.content.res.Resources;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.ArrayList;

// react-native-video
import com.brentvatne.react.ReactVideoPackage;
// @react-native-async-storage/async-storage
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
// @react-native-clipboard/clipboard
import com.reactnativecommunity.clipboard.ClipboardPackage;
// @react-native-community/geolocation
import com.reactnativecommunity.geolocation.GeolocationPackage;
// @react-native-community/image-editor
import com.reactnativecommunity.imageeditor.ImageEditorPackage;
// @react-native-firebase/analytics
import io.invertase.firebase.analytics.ReactNativeFirebaseAnalyticsPackage;
// @react-native-firebase/app
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
// @react-native-firebase/auth
import io.invertase.firebase.auth.ReactNativeFirebaseAuthPackage;
// @react-native-firebase/messaging
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;
// @react-native-masked-view/masked-view
import org.reactnative.maskedview.RNCMaskedViewPackage;
// @shopify/flash-list
import com.shopify.reactnative.flash_list.ReactNativeFlashListPackage;
// react-native-autogrow-textinput-ts
import com.wix.autogrowtextinput.AutoGrowTextInputPackage;
// react-native-compressor
import com.reactnativecompressor.CompressorPackage;
// react-native-date-picker
import com.henninghall.date_picker.DatePickerPackage;
// react-native-device-info
import com.learnium.RNDeviceInfo.RNDeviceInfo;
// react-native-email-link
import agency.flexible.react.modules.email.EmailPackage;
// react-native-fs
import com.rnfs.RNFSPackage;
// react-native-gesture-handler
import com.swmansion.gesturehandler.RNGestureHandlerPackage;
// react-native-image-crop-picker
import com.reactnative.ivpusic.imagepicker.PickerPackage;
// react-native-image-picker
import com.imagepicker.ImagePickerPackage;
// react-native-linear-gradient
import com.BV.LinearGradient.LinearGradientPackage;
// react-native-otp-verify
import com.faizal.OtpVerify.OtpVerifyPackage;
// react-native-push-notification
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
// react-native-reanimated
import com.swmansion.reanimated.ReanimatedPackage;
// react-native-safe-area-context
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
// react-native-screens
import com.swmansion.rnscreens.RNScreensPackage;
// react-native-screenshot-prevent
import com.killserver.screenshotprev.RNScreenshotPreventPackage;
// react-native-share
import cl.json.RNSharePackage;
// react-native-sms
import com.tkporter.sendsms.SendSMSPackage;
// react-native-sound
import com.zmxv.RNSound.RNSoundPackage;
// react-native-splash-screen
import org.devio.rn.splashscreen.SplashScreenReactPackage;
// react-native-vector-icons
import com.oblador.vectoricons.VectorIconsPackage;
// react-native-vision-camera
import com.mrousavy.camera.CameraPackage;

public class PackageList {
  private Application application;
  private ReactNativeHost reactNativeHost;
  private MainPackageConfig mConfig;

  public PackageList(ReactNativeHost reactNativeHost) {
    this(reactNativeHost, null);
  }

  public PackageList(Application application) {
    this(application, null);
  }

  public PackageList(ReactNativeHost reactNativeHost, MainPackageConfig config) {
    this.reactNativeHost = reactNativeHost;
    mConfig = config;
  }

  public PackageList(Application application, MainPackageConfig config) {
    this.reactNativeHost = null;
    this.application = application;
    mConfig = config;
  }

  private ReactNativeHost getReactNativeHost() {
    return this.reactNativeHost;
  }

  private Resources getResources() {
    return this.getApplication().getResources();
  }

  private Application getApplication() {
    if (this.reactNativeHost == null) return this.application;
    return this.reactNativeHost.getApplication();
  }

  private Context getApplicationContext() {
    return this.getApplication().getApplicationContext();
  }

  public ArrayList<ReactPackage> getPackages() {
    return new ArrayList<>(Arrays.<ReactPackage>asList(
      new MainReactPackage(mConfig),
      new ReactVideoPackage(),
      new AsyncStoragePackage(),
      new ClipboardPackage(),
      new GeolocationPackage(),
      new ImageEditorPackage(),
      new ReactNativeFirebaseAnalyticsPackage(),
      new ReactNativeFirebaseAppPackage(),
      new ReactNativeFirebaseAuthPackage(),
      new ReactNativeFirebaseMessagingPackage(),
      new RNCMaskedViewPackage(),
      new ReactNativeFlashListPackage(),
      new AutoGrowTextInputPackage(),
      new CompressorPackage(),
      new DatePickerPackage(),
      new RNDeviceInfo(),
      new EmailPackage(),
      new RNFSPackage(),
      new RNGestureHandlerPackage(),
      new PickerPackage(),
      new ImagePickerPackage(),
      new LinearGradientPackage(),
      new OtpVerifyPackage(),
      new ReactNativePushNotificationPackage(),
      new ReanimatedPackage(),
      new SafeAreaContextPackage(),
      new RNScreensPackage(),
      new RNScreenshotPreventPackage(),
      new RNSharePackage(),
      new SendSMSPackage(),
      new RNSoundPackage(),
      new SplashScreenReactPackage(),
      new VectorIconsPackage(),
      new CameraPackage()
    ));
  }
}
