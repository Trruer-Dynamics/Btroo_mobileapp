import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
} from "react-native";
import React, { memo } from "react";
import colors from "../../../styles/colors";
import { rspH, rspW } from "../../../styles/responsiveSize";
import { useSelector } from "react-redux";

const FormWrapper = ({ children, containerStyle = {} }) => {
  const safe_height = useSelector((state) => state.screen.safe_height);
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View
        style={{
          ...styles.container,
          ...containerStyle,
          height: safe_height,
        }}
      >
        <>{children}</>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default memo(FormWrapper);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,

    paddingHorizontal: rspW(10),
    paddingTop: rspH(3),
    justifyContent: "space-between",
    position: "relative",
  },
});
