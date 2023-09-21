import { Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import { rspH, scrn_height, srn_height } from "../../../styles/responsiveSize";

const FormWrapperFooter = ({ children, containerStyle = {} }) => {
  return (
    <View
      style={{
        height: rspH(13.2),
        position: "relative",
        ...containerStyle,
      }}
    >
      <View style={styles.bottom_container}>{children}</View>
    </View>
  );
};

export default FormWrapperFooter;

const styles = StyleSheet.create({
  bottom_container: {
    alignSelf: "center",
    position: "absolute",
    bottom: Platform.OS == "ios" ? srn_height * 0.05 : srn_height * 0.06,
  },
});
