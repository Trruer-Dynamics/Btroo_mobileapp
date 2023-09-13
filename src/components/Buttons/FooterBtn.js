import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import React from "react";
import colors from "../../styles/colors";
import { rspF, rspH, rspW } from "../../styles/responsiveSize";
import fontFamily from "../../styles/fontFamily";

const FooterBtn = ({
  title = "",
  disabled,
  onPress,
  width = 70,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        {
          width: rspW(width),
          backgroundColor: disabled ? colors.grey : colors.blue,
          shadowColor: disabled ? colors.black : colors.blue,
          shadowOpacity: disabled ? 0.25 : 0.8,
        },
      ]}
      onPress={onPress}
    >
      <Text style={styles.btn_txt}>{title}</Text>
    </TouchableOpacity>
  );
};

export default FooterBtn;

const styles = StyleSheet.create({
  btn: {
    alignSelf: "center",
    backgroundColor: colors.blue,
    height: rspH(5.8),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: rspW(10),
    shadowOffset: {
      width: 0,
      height: rspH(1),
    },

    shadowRadius: 8,
    elevation: 8,
  },

  btn_txt: {
    color: "#fff",
    fontFamily: fontFamily.bold,
    fontSize: rspF(2),
    lineHeight: rspF(2.1),
    textAlign: "center",
    letterSpacing: 1,
  },
});
