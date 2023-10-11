import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";
import React, { useRef, useLayoutEffect, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNav from "./stack/StackNav";
import UserProvider from "../context/user";
import NotificationController from "../config/notification";
import { initialWindowMetrics } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { scrn_height } from "../styles/responsiveSize";
import { setSafeHeight } from "../store/reducers/screen/screen";
import OffflineAlert from "../components/functions/OfflineAlert";
import {
  setProfileRefresh,
  setStatusBarArgs,
} from "../store/reducers/authentication/authentication";

const insets = initialWindowMetrics.insets;

const Navigation = () => {
  const dispatch = useDispatch();
  const navigationRef = useRef();
  useLayoutEffect(() => {
    // CallNot()
    const safe_height =
      scrn_height - (Platform.OS == "android" ? 0 : insets.bottom + insets.top);

    dispatch(setSafeHeight(safe_height));
  }, []);

  const [offAlert, setoffAlert] = useState(false);

  const current_screen = useSelector((state) => state.screen.current_screen);

  const is_network_connected = useSelector(
    (state) => state.authentication.is_network_connected
  );

  const profile_refresh = useSelector(
    (state) => state.authentication.profile_refresh
  );

  useLayoutEffect(() => {


    // dispatch(setProfileRefresh(!profile_refresh));

    if (!is_network_connected) {
      if (
        current_screen != "Match" &&
        current_screen != "Chat" &&
        current_screen != "Intro" &&
        current_screen != "Swiper" &&
        current_screen != "SettingsScreen" &&
        current_screen != "Profile" &&
        current_screen != "ProfileRevealed" &&
        current_screen != "MatchProfile" &&
        current_screen != ""
      ) {
        setoffAlert(true);
      }
    } else {
      setoffAlert(false);
    }

    if (current_screen == 'Swiper') {
      dispatch(setProfileRefresh(!profile_refresh));
    }

    if (current_screen == "Intro" || current_screen == "PhotoVerifyCamera") {
      if (Platform.OS == "android") {
        dispatch(
          setStatusBarArgs({
            barStyle: "light-content",
            backgroundColor: "#000",
          })
        );
      }
    } else {
      dispatch(
        setStatusBarArgs({
          barStyle: "dark-content",
          backgroundColor: "#ffff",
        })
      );
    }
  }, [is_network_connected, current_screen]);

  return (
    <NavigationContainer ref={navigationRef}>
      <UserProvider navigationRef={navigationRef}>
        {offAlert && <OffflineAlert />}
        <NotificationController />
        <StackNav />
      </UserProvider>
    </NavigationContainer>
  );
};

export default Navigation;

const styles = StyleSheet.create({});
