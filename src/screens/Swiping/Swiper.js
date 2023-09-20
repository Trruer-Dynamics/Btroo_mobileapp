import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import SwiperOr from "./SwiperOr";
import { useSelector } from "react-redux";
import SwiperTut from "./SwiperTut";
import { createStackNavigator } from "@react-navigation/stack";

const Swiper = ({ route }) => {


  let repeat_tut = route.params?.repeat_tut ? route.params?.repeat_tut : false

  

  const swipe_tut = useSelector((state) => state.tutorial.swipe_tut);

  return <>{swipe_tut ? <SwiperTut 
    repeat_tut={repeat_tut}
  /> : <SwiperOr />}</>;
};

export default Swiper;

const styles = StyleSheet.create({});
