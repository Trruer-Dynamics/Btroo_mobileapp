import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";
import Profile from "../../screens/Swiping/Profile";
import SettingsScreen from "../../screens/Swiping/SettingsScreen";
import Swiper from "../../screens/Swiping/Swiper";
import colors from "../../styles/colors";
import React, { useEffect, useState } from "react";
import MatchStack from "../../screens/Swiping/Match/MatchStack";
import FastImage from "react-native-fast-image";
import { rspF, rspH, rspW } from "../../styles/responsiveSize";
import { useSelector } from "react-redux";

const BTab = createBottomTabNavigator();

const BottomTab = () => {
  const swipe_tut = useSelector((state) => state.tutorial.swipe_tut);
  const repeat_tut = useSelector((state) => state.tutorial.repeat_tut);
  const match_tut = useSelector((state) => state.tutorial.match_tut);

  const [btn_disable, setbtn_disable] = useState(false);

  const current_screen = useSelector((state) => state.screen.current_screen);

  useEffect(() => {
    if (swipe_tut || repeat_tut || match_tut) {
      let dsb = false;
      if (repeat_tut) {
        dsb = true;
      } else if (current_screen == "Swiper" && swipe_tut) {
        dsb = true;
      } else if (current_screen == "MatchScreen" && match_tut) {
        dsb = true;
      }

      setbtn_disable(dsb);
    } else {
      setbtn_disable(false);
    }
  }, [swipe_tut, repeat_tut, match_tut, current_screen]);

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
            height: Platform.OS == "android" ? rspH(9) : rspF(8),
            borderTopLeftRadius: Platform.OS == "ios" ? 0 : rspW(3.6),
            borderTopRightRadius: Platform.OS == "ios" ? 0 : rspW(3.6),
          },
          tabBarShowLabel: false,
        }}
      >
        <BTab.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          listeners={{
            tabPress: (e) => {
              if (btn_disable) {
                e.preventDefault();
              }
            },
          }}
          options={{
            tabBarActiveTintColor: colors.white,
            tabBarInactiveTintColor: colors.grey,
            tabBarIcon: (tabInfo) => {
              if (tabInfo.focused) {
                return (
                  <FastImage
                    source={require("../../assets/images/BottomTab/Settings.jpg")}
                    tintColor={"#fff"}
                    style={{ width: rspH(3.5), height: rspH(3.5) }}
                  />
                );
              } else {
                return (
                  <FastImage
                    source={require("../../assets/images/BottomTab/Settings.jpg")}
                    style={{ width: rspH(3.5), height: rspH(3.5) }}
                  />
                );
              }
            },
          }}
        />
        <BTab.Screen
          name="Swiper"
          component={Swiper}
          listeners={{
            tabPress: (e) => {
              if (btn_disable) {
                e.preventDefault();
              }
            },
          }}
          options={{
            tabBarActiveTintColor: colors.white,
            tabBarInactiveTintColor: colors.grey,
            tabBarIcon: (tabInfo) => {
              if (tabInfo.focused) {
                return (
                  <FastImage
                    source={require("../../assets/images/BottomTab/swiper_active.png")}
                    style={{ width: rspH(4.5), height: rspH(3.5) }}
                    resizeMode="stretch"
                  />
                );
              } else {
                return (
                  <FastImage
                    source={require("../../assets/images/BottomTab/swiper.png")}
                    style={{ width: rspH(4.5), height: rspH(3.5) }}
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
          listeners={{
            tabPress: (e) => {
              if (btn_disable) {
                e.preventDefault();
              }
            },
          }}
          options={{
            tabBarActiveTintColor: colors.white,
            tabBarInactiveTintColor: colors.grey,

            tabBarIcon: (tabInfo) => {
              if (tabInfo.focused) {
                return (
                  <FastImage
                    tintColor={"#fff"}
                    source={require("../../assets/images/BottomTab/Chat.jpg")}
                    style={{ width: rspH(3.6), height: rspH(3.5) }}
                    resizeMode="stretch"
                  />
                );
              } else {
                return (
                  <FastImage
                    source={require("../../assets/images/BottomTab/Chat.jpg")}
                    style={{ width: rspH(3.6), height: rspH(3.5) }}
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
          listeners={{
            tabPress: (e) => {
              if (btn_disable) {
                e.preventDefault();
              }
            },
          }}
          options={{
            tabBarActiveTintColor: colors.white,
            tabBarInactiveTintColor: colors.grey,
            tabBarIcon: (tabInfo) => {
              if (tabInfo.focused) {
                return (
                  <FastImage
                    tintColor={"#fff"}
                    source={require("../../assets/images/BottomTab/Profile.jpg")}
                    style={{ width: rspH(3.4), height: rspH(3.4) }}
                    resizeMode="stretch"
                  />
                );
              } else {
                return (
                  <FastImage
                    source={require("../../assets/images/BottomTab/Profile.jpg")}
                    style={{ width: rspH(3.4), height: rspH(3.4) }}
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
