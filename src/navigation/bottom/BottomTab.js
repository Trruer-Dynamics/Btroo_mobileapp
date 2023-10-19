import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";
import Profile from "../../screens/Swiping/Profile";
import SettingsScreen from "../../screens/Swiping/SettingsScreen";
import Swiper from "../../screens/Swiping/Swiper";
import colors from "../../styles/colors";
import React from "react";
import MatchStack from "../../screens/Swiping/Match/MatchStack";
import FastImage from "react-native-fast-image";
import { rspF, rspH, rspW } from "../../styles/responsiveSize";

const BTab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <>
      <BTab.Navigator
        initialRouteName="Swiper"
        screenOptions={{
          headerShown: false,

          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            marginLeft: -2,
            borderTopWidth: 0,
            backgroundColor: colors.blue,
            // Border And Height of Bottom Tab is manage according to Platform android / ios
            marginTop: Platform.OS == "android" ? rspH(-1) : 0,
            paddingBottom: Platform.OS == "android" ? rspH(1) : rspH(2),
            height: Platform.OS == "android" ? rspH(8) : rspF(9.26),
            borderTopLeftRadius: Platform.OS == "ios" ? 0 : rspW(3.6),
            borderTopRightRadius: Platform.OS == "ios" ? 0 : rspW(3.6),
          },
          tabBarShowLabel: false,
        }}
      >
        <BTab.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{
            tabBarActiveTintColor: colors.white,
            tabBarInactiveTintColor: colors.grey,
            tabBarIcon: (tabInfo) => {
              if (tabInfo.focused) {
                return (
                  <FastImage
                    source={require("../../assets/images/BottomTab/Settings.jpg")}
                    tintColor={"#fff"}
                    style={{ width: 33, height: 33 }}
                  />
                );
              } else {
                return (
                  <FastImage
                    source={require("../../assets/images/BottomTab/Settings.jpg")}
                    style={{ width: 33, height: 33 }}
                  />
                );
              }
            },
          }}
        />
        <BTab.Screen
          name="Swiper"
          component={Swiper}
          options={{
            tabBarActiveTintColor: colors.white,
            tabBarInactiveTintColor: colors.grey,
            tabBarIcon: (tabInfo) => {
              if (tabInfo.focused) {
                return (
                  <FastImage
                    source={require("../../assets/images/BottomTab/swiper_active.png")}
                    style={{ width: 43, height: 33 }}
                    resizeMode="stretch"
                  />
                );
              } else {
                return (
                  <FastImage
                    source={require("../../assets/images/BottomTab/swiper.png")}
                    style={{ width: 43, height: 33 }}
                    resizeMode="stretch"
                  />
                );
              }
            },
          }}
        />
        <BTab.Screen
          name="Match"
          component={MatchStack}
          options={{
            tabBarActiveTintColor: colors.white,
            tabBarInactiveTintColor: colors.grey,

            tabBarIcon: (tabInfo) => {
              if (tabInfo.focused) {
                return (
                  <FastImage
                    tintColor={"#fff"}
                    source={require("../../assets/images/BottomTab/Chat.jpg")}
                    style={{ width: 34, height: 33 }}
                    resizeMode="stretch"
                  />
                );
              } else {
                return (
                  <FastImage
                    source={require("../../assets/images/BottomTab/Chat.jpg")}
                    style={{ width: 34, height: 33 }}
                    resizeMode="stretch"
                  />
                );
              }
            },
          }}
        />
        <BTab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarActiveTintColor: colors.white,
            tabBarInactiveTintColor: colors.grey,
            tabBarIcon: (tabInfo) => {
              if (tabInfo.focused) {
                return (
                  <FastImage
                    tintColor={"#fff"}
                    source={require("../../assets/images/BottomTab/Profile.jpg")}
                    style={{ width: 33, height: 33 }}
                    resizeMode="stretch"
                  />
                );
              } else {
                return (
                  <FastImage
                    source={require("../../assets/images/BottomTab/Profile.jpg")}
                    style={{ width: 33, height: 33 }}
                    resizeMode="stretch"
                  />
                );
              }
            },
          }}
        />
      </BTab.Navigator>
    </>
  );
};

export default BottomTab;
