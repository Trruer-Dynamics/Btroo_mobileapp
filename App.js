import {
  StyleSheet,
  Text,
  View,
  Platform,
  LogBox,
  StatusBar,
  BackHandler,
  AppState,
} from "react-native";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";

import Navigation from "./src/navigation";
import SplashScreen from "react-native-splash-screen";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Fontisto from "react-native-vector-icons/Fontisto";
import Foundation from "react-native-vector-icons/Foundation";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Octicons from "react-native-vector-icons/Octicons";
import { useDispatch, useSelector } from "react-redux";
import { getHash } from "react-native-otp-verify";
import NetInfo from "@react-native-community/netinfo";
import _ from "lodash";
import { setNetworkConnect } from "./src/store/reducers/authentication/authentication";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { scrn_height } from "./src/styles/responsiveSize";

AntDesign.loadFont()
  .then()
  .catch((error) => {
    // console.info(error);
  });
Ionicons.loadFont()
  .then()
  .catch((error) => {
    // console.info(error);
  });
Feather.loadFont()
  .then()
  .catch((error) => {
    // console.info(error);
  });
Entypo.loadFont()
  .then()
  .catch((error) => {
    // console.info(error);
  });
EvilIcons.loadFont()
  .then()
  .catch((error) => {
    // console.info(error);
  });
// FontAwesome5.loadFont().then();
FontAwesome.loadFont()
  .then()
  .catch((error) => {
    // console.info(error);
  });
// FontAwesome5Pro.loadFont().then();
Fontisto.loadFont()
  .then()
  .catch((error) => {
    // console.info(error);
  });
Foundation.loadFont()
  .then()
  .catch((error) => {
    // console.info(error);
  });
MaterialCommunityIcons.loadFont()
  .then()
  .catch((error) => {
    // console.info(error);
  });
MaterialIcons.loadFont()
  .then()
  .catch((error) => {
    // console.info(error);
  });
Octicons.loadFont()
  .then()
  .catch((error) => {
    // console.info(error);
  });

const App = () => {
  const dispatch = useDispatch();

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

  const getAppHash = () => {
    getHash()
      .then((hash) => {
        // console.log("App Hash", hash[0]);
      })
      .catch((err) => {
        console.log("err while hash", err);
      });
  };

  const smsSetup = useCallback(() => {
    if (Platform.OS == "android") {
      getAppHash();
    }
  }, []);

  // get Hash Code for SMS
  useLayoutEffect(() => {
    smsSetup();
  }, []);

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

  const handleNetworkChange = (state) => {
    if (state.isConnected) {
      dispatch(setNetworkConnect(true));
    } else {
      dispatch(setNetworkConnect(false));
    }
  };

  const debounceHandleNet = _.debounce(handleNetworkChange, 500, {
    leading: false,
    trailing: true,
  });

  useEffect(() => {
    const netinfoSub = NetInfo.addEventListener(debounceHandleNet);
    return () => {
      netinfoSub && netinfoSub();
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
    // height:scrn_height + StatusBar.currentHeight,
  },
});
