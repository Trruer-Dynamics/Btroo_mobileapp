import {
  StyleSheet,
  Text,
  View,
  Platform,
  LogBox,
  StatusBar,
  BackHandler,
  AppState,
  Dimensions,
  PermissionsAndroid,
  Alert,
  SafeAreaView,
  DeviceEventEmitter,
  NativeModules,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import Navigation from "./src/navigation";
import SplashScreen from "react-native-splash-screen";

import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome5Pro from "react-native-vector-icons/FontAwesome5Pro";
import Fontisto from "react-native-vector-icons/Fontisto";
import Foundation from "react-native-vector-icons/Foundation";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Octicons from "react-native-vector-icons/Octicons";
import { useDispatch, useSelector } from "react-redux";
import PushNotification from "react-native-push-notification";
import { scrn_height } from "./src/styles/responsiveSize";
import { setSafeHeight } from "./src/store/reducers/screen/screen";
import messaging from "@react-native-firebase/messaging";
import Test from "./Test";
import axios from "axios";
import { apiUrl } from "./src/constants";

AntDesign.loadFont()
  .then()
  .catch((error) => {
    console.info(error);
  });
Ionicons.loadFont()
  .then()
  .catch((error) => {
    console.info(error);
  });
Feather.loadFont()
  .then()
  .catch((error) => {
    console.info(error);
  });
Entypo.loadFont()
  .then()
  .catch((error) => {
    console.info(error);
  });
EvilIcons.loadFont()
  .then()
  .catch((error) => {
    console.info(error);
  });
// FontAwesome5.loadFont().then();
FontAwesome.loadFont()
  .then()
  .catch((error) => {
    console.info(error);
  });
// FontAwesome5Pro.loadFont().then();
Fontisto.loadFont()
  .then()
  .catch((error) => {
    console.info(error);
  });
Foundation.loadFont()
  .then()
  .catch((error) => {
    console.info(error);
  });
MaterialCommunityIcons.loadFont()
  .then()
  .catch((error) => {
    console.info(error);
  });
MaterialIcons.loadFont()
  .then()
  .catch((error) => {
    console.info(error);
  });
Octicons.loadFont()
  .then()
  .catch((error) => {
    console.info(error);
  });

const App = () => {
  // const { ScreenshotOverlay } = NativeModules;

  const status_bg = useSelector(
    (state) => state.authentication.statusBarArg.backgroundColor
  );
  const barStyle = useSelector(
    (state) => state.authentication.statusBarArg.barStyle
  );

  const statusBarArg = useSelector(
    (state) => state.authentication.statusBarArg
  );

  LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
  LogBox.ignoreAllLogs(); //Ignore all log notifications
  StatusBar.setBarStyle(barStyle, true);

  useLayoutEffect(() => {
    SplashScreen.hide();

    if (Platform.OS == "android") {
      StatusBar.setBackgroundColor(status_bg ? status_bg : "#fff");
    }
  }, [status_bg, statusBarArg]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        AppState.currentState = "background";

        // BackHandler.exitApp();
        return true;
      }
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <View style={[styles.container]}>
      <Navigation />
      {/* <Test/> */}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
