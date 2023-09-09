import { Alert, AppState, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { apiUrl, webSocketUrl } from "../constants";
import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { CommonActions, useNavigation } from "@react-navigation/native";
import {
  setAccessToken,
  setSessionExpired,
  setUserLoggined,
} from "../store/reducers/authentication/authentication";
import { setProfiledata } from "../store/reducers/authentication/authentication";
import { setProfileImgs } from "../store/reducers/authentication/authentication";

import RNScreenshotPrevent, {
  addListener,
} from "react-native-screenshot-prevent";

export const UserContext = React.createContext();
const UserProvider = ({ children, navigationRef }) => {
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const [DeviceToken, setDeviceToken] = useState("");
  const [newMsgRefresh, setnewMsgRefresh] = useState(false)
  const [ToNavigate, setToNavigate] = useState(null);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const sckop = useRef(false);

  const access_token = useSelector(
    (state) => state.authentication.access_token
  );
  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );
  const is_session_expired = useSelector(
    (state) => state.authentication.is_session_expired
  );
  const user_loggined = useSelector(
    (state) => state.authentication.user_loggined
  );

  const getDeviceToken = async () => {
   
    const registered = await messaging().registerDeviceForRemoteMessages();

    if (Platform.OS == "ios") {
      const apn_tok = await messaging().getAPNSToken();
      console.log("apn_tok", apn_tok);
      Alert.alert("apn_tok",apn_tok)
    }

    const token = await messaging().getToken();
    setDeviceToken(token);
    console.log(Platform.OS, "token", token);
    Alert.alert("token",token)

  };

  const notificationListener = () => {
    console.log("notificationListener", Platform.OS);

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage.notification
      );
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
        //   setLoading(false);
      });
  };

  const removeToken = async () => {
    const url = apiUrl + "token_remove/";

    const headers = {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    };

    const data = {
      profile_id: profile_data.userprofile.id,
      token: DeviceToken,
    };

    try {
      const resp = await axios.post(url, data, { headers });
      // setloading(false);

      let code = resp.data.code;
      let user_data = resp.data.data;

      console.log("removeToken resp.data", user_data);
    } catch (error) {
      // setloading(false);

      console.log("removeToken error", error);

    }
  };

  useLayoutEffect(() => {
    RNScreenshotPrevent.enabled(false);
    RNScreenshotPrevent.enableSecureView()
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");
      }

      appState.current = nextAppState;

      setAppStateVisible(appState.current);
      console.log("/nAppState", appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    
    console.log("is_session_expired", is_session_expired);

    if (is_session_expired == true && DeviceToken != "") {

      removeToken();
      dispatch(setUserLoggined(false));
      dispatch(setAccessToken(""));
      dispatch(setProfiledata({}));
      dispatch(setProfileImgs([]));
      dispatch(setSessionExpired(false));
      // navigation.navigate("Intro");

      const resetAction = CommonActions.reset({
        index: 1,
        routes: [{ name: "Intro" }],
      });

      navigation.dispatch(resetAction);
      
    }
  }, [is_session_expired]);

  useLayoutEffect(() => {
    // getDeviceToken();
    notificationListener();
  }, [user_loggined]);

  return (
    <UserContext.Provider
      value={{
        DeviceToken,
        setDeviceToken,
        newMsgRefresh,
        setnewMsgRefresh,
        ToNavigate,
        setToNavigate,
        appStateVisible,
        sckop,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

const styles = StyleSheet.create({});
