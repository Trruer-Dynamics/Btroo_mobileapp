import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { rspF, rspH, rspW, scrn_width } from "../../styles/responsiveSize";
import colors from "../../styles/colors";
import fontFamily from "../../styles/fontFamily";

const ErrorContainer = ({ error_msg = "" }) => {
  return (
    <View style={styles.error_cont}>
      <Text style={styles.error_txt}>{error_msg}</Text>
    </View>
  );
};

export default ErrorContainer;

const styles = StyleSheet.create({
  error_cont: {
    height: rspH(3.35),
    width: scrn_width - rspW(13.8),
    paddingVertical: rspH(0.5),
  },
  error_txt: {
    textAlign: "center",
    color: colors.error,
    fontFamily: fontFamily.regular,
    fontSize: rspF(1.8),
    lineHeight: rspF(2),
  },
});
