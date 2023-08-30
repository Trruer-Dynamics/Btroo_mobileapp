import { StyleSheet, Text, View } from "react-native";
import React from "react";
import fontFamily from "../../styles/fontFamily";
import colors from "../../styles/colors";
import { rspF, rspH } from "../../styles/responsiveSize";

const FormInputContainer = ({
  children,
  label = "",
  marginTop = 0,
  marginBottom = 2.75,
  labelContBottom = 1.8,
}) => {
  return (
    <View
      style={{
        marginBottom: rspH(marginBottom),
        marginTop: marginTop,
      }}
    >
      <View style={{ marginBottom: rspH(labelContBottom) }}>
        <Text style={styles.label}>{label}</Text>
      </View>
      {children}
    </View>
  );
};

export default FormInputContainer;

const styles = StyleSheet.create({
  label: {
    color: colors.black,
    lineHeight: rspF(2.135),
    fontSize: rspF(2.13),
    fontFamily: fontFamily.bold,
    letterSpacing: 1,
  },
});
