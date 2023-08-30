import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useRef, useLayoutEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNav from "./stack/StackNav";
import UserProvider from "../context/user";
import NotificationController from "../config/notification";
import { initialWindowMetrics } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { scrn_height } from "../styles/responsiveSize";
import { setSafeHeight } from "../store/reducers/screen/screen";
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

  return (
    <NavigationContainer ref={navigationRef}>
      <UserProvider navigationRef={navigationRef}>
        <NotificationController />
        <StackNav />
      </UserProvider>
    </NavigationContainer>
  );
};

export default Navigation;

const styles = StyleSheet.create({});
