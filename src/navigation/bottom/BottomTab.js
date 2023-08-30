import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  ScrollView,
  SafeAreaView,
  FlatList,
  Platform,
  Alert,
} from "react-native";
import Profile from "../../screens/Swiping/Profile";
import SettingsScreen from "../../screens/Swiping/SettingsScreen";
import Swiper from "../../screens/Swiping/Swiper";
import colors from "../../styles/colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import FAIcon from "react-native-vector-icons/FontAwesome";
import { rspF, rspH, rspW } from "../../styles/responsiveSize";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";

import Match from "../../screens/Swiping/Match/Match";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import MatchStack from "../../screens/Swiping/Match/MatchStack";

const BTab = createBottomTabNavigator();

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
    image: require("../../assets/images/Tutorial/Tut1.png"),
    image2: require("../../assets/images/Tutorial/Tut2.png"),
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
    image:
      // '../../assets/images/Tutorial/Tut1.png',
      require("../../assets/images/Tutorial/Tut1.png"),
    image2: require("../../assets/images/Tutorial/Tut2.png"),
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
    image: require("../../assets/images/Tutorial/Tut1.png"),
    image2: require("../../assets/images/Tutorial/Tut2.png"),
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d73",
    title: "Fourth Item",
    image: require("../../assets/images/Tutorial/Tut1.png"),
    image2: require("../../assets/images/Tutorial/Tut2.png"),
  },
];

const Item = ({ item, setmodalVisible }) => {
  return (
    <View style={styles.item}>
      <TouchableWithoutFeedback
      // onPress={() => {
      //   setmodalVisible(true);
      // }}
      >
        <Image
          source={item.image}
          style={{ width: "100%", height: "100%", borderRadius: 20 }}
          resizeMode="cover"
        />
      </TouchableWithoutFeedback>
    </View>
  );
};

const BottomTab = () => {
  // Tutorial Control
  const swipe_tut = useSelector((state) => state.tutorial.swipe_tut);

  return (
    <BTab.Navigator
      initialRouteName="Swiper"
      screenOptions={{
        headerShown: false,

        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          // alignItems:'center',
          // width: scrn_width,
          // display: 'none',
          marginLeft: -2,
          borderTopWidth: 0,
          backgroundColor: colors.blue,
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
                <Image
                  // source={require('../../assets/images/BottomTab/setting_active.png')}
                  source={require("../../assets/images/BottomTab/Settings.jpg")}
                  tintColor={"#fff"}
                  style={{ width: 33, height: 33 }}
                />
              );
            } else {
              return (
                <Image
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
                <Image
                  source={require("../../assets/images/BottomTab/swiper_active.png")}
                  style={{ width: 43, height: 33 }}
                  resizeMode="stretch"
                />
              );
            } else {
              return (
                <Image
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
                <Image
                  tintColor={"#fff"}
                  source={require("../../assets/images/BottomTab/Chat.jpg")}
                  style={{ width: 34, height: 33 }}
                  resizeMode="stretch"
                />
              );
            } else {
              return (
                <Image
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
                <Image
                  tintColor={"#fff"}
                  source={require("../../assets/images/BottomTab/Profile.jpg")}
                  style={{ width: 33, height: 33 }}
                  resizeMode="stretch"
                />
              );
            } else {
              return (
                <Image
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
  );
};

export default BottomTab;

const styles = StyleSheet.create({});
