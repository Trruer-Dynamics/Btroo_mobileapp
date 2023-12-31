import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";
import { scrn_width } from "../styles/responsiveSize";
import FastImage from "react-native-fast-image";
import { StackActions } from "@react-navigation/native";

const Splash = ({ navigation }) => {
  useLayoutEffect(() => {
    // Time until splash screen visible
    setTimeout(() => {
      // navigation.navigate("Intro");
      navigation.dispatch(StackActions.replace("Intro"));
    }, 1200);
  }, []);

  return (
    <View style={styles.container}>
      <FastImage
        source={require("../assets/images/MainLogo/LogoDarkBlue.png")}
        style={{ height: scrn_width / 3.6, width: scrn_width / 3.6 }}
        resizeMode="contain"
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
