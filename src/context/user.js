import { AppState, NativeEventEmitter, StyleSheet } from "react-native";
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { apiUrl } from "../constants";
import messaging from "@react-native-firebase/messaging";
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
  const [newMsgRefresh, setnewMsgRefresh] = useState(false);
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

  const notificationListener = () => {
    messaging().onNotificationOpenedApp((remoteMessage) => {});

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
      });
  };

  const resetNav = async () => {
    try {
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{ name: "Intro" }],
      });
      navigation.dispatch(resetAction);
    } catch (error) {}
  };

  const emptyAll = async () => {
    dispatch(setUserLoggined(false));
    dispatch(setAccessToken(""));
    dispatch(setSessionExpired(false));
    // dispatch(setProfiledata({}));
    // dispatch(setProfileImgs([]));
  };

  const clearData = async () => {
    if (is_session_expired == true && user_loggined) {
      await resetNav();
      await removeToken();
      await emptyAll();
    }
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
      let user_data = resp.data.data;
      dispatch(setDeviceToken(""));
    } catch (error) {}
  };

  // Disable Screenshot
  useLayoutEffect(() => {
    // RNScreenshotPrevent.enabled(false);
    // RNScreenshotPrevent.enableSecureView();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    clearData();
  }, [is_session_expired]);

  useLayoutEffect(() => {
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
