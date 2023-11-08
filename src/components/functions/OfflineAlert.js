import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { rspF, rspH, rspW, scrn_width } from "../../styles/responsiveSize";
import fontFamily from "../../styles/fontFamily";
import colors from "../../styles/colors";
import Animated, {  FadeInUp } from "react-native-reanimated";
 
const OffflineAlert = () => {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Animated.View style={styles.messageBox}
      entering={FadeInUp}
      >
       <Text style={styles.messageBoxHeader}>No connection</Text>
       
      </Animated.View>
    </SafeAreaView>
  );
};
 
export default OffflineAlert;
 
const styles = StyleSheet.create({
  mainContainer: {
    height: "100%",
    width: "100%",
    zIndex: 1000,
    position: "absolute",
    backgroundColor: "#00000000",
    // justifyContent: "center",
    // alignItems: "center",
  },
  messageBox: {
    // width: rspW(76.5),
    width: scrn_width,
    // height: rspH(31.16),
    height: rspH(4),
    backgroundColor: 'red',
    // borderRadius: rspW(5.1),
    // paddingHorizontal: rspW(4),
    alignItems: "center",
    justifyContent: "center",
    // marginTop: rspH(17),
  },
  messageBoxHeaderCont: {
    marginBottom: rspH(3),
  },
  messageBoxHeader: {
    fontFamily: fontFamily.bold,
    // fontSize: rspF(3),
    fontSize: rspF(2),
    color: colors.white,
    // lineHeight: rspH(3.1),
    lineHeight: rspH(2.1),
    textAlign: "center",
  },
  messageBoxPara: {
    fontFamily: fontFamily.regular,
    fontSize: rspF(2.2),
    color: colors.blue,
    lineHeight: rspH(2.5),
    textAlign: "center",
  },
});