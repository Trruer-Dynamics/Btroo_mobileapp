import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import colors from "../../../styles/colors";
import {
  rspH,
  rspW,
  rspF,
  scrn_height,
  scrn_width,
} from "../../../styles/responsiveSize";

const FormComponentsWrapper = ({
  children,
  containerStyle = {
    paddingTop: rspH(2.35),
    paddingBottom: rspH(7.04),
  },
}) => {
  return (
    <View style={{ ...styles.container, ...containerStyle }}>
      <SafeAreaView>{children}</SafeAreaView>
    </View>
  );
};

export default FormComponentsWrapper;

const styles = StyleSheet.create({
  container: {
    // height:scrn_height,
    height: Platform.OS == "ios" ? scrn_height - 80 : scrn_height,

    alignSelf: "center",
    // backgroundColor:'yellow',
    // position: 'absolute',
    // top: 0,
    // bottom: 0,
    width: scrn_width,
    paddingHorizontal: rspW(10),
    // paddingVertical: rspH(7.04),
    // justifyContent: 'space-between',
  },
});
