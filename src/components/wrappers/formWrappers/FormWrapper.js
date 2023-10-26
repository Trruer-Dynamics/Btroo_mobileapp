import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Platform,
} from "react-native";
import React, { memo } from "react";
import colors from "../../../styles/colors";
import { rspH, rspW, scrn_height } from "../../../styles/responsiveSize";
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
          height: Platform.OS == 'android' ? scrn_height *0.992 : safe_height,
          ...containerStyle,
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
