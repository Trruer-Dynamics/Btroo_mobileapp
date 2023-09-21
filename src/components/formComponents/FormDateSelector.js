import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../../styles/colors";
import fontFamily from "../../styles/fontFamily";
import { rspF, rspH, rspW } from "../../styles/responsiveSize";

const FormDateSelector = ({
  width,
  title = "Select",
  onPress = null,
  date = "",
  dob_blr,
}) => {
  return (
    <>
      <TouchableOpacity
        style={[
          styles.searchContainer,
          {
            height: rspH(5.6),
            width: width,
            borderColor:
              dob_blr && date == ""
                ? colors.error
                : date != ""
                ? colors.blue
                : "#DCDCDC",
            backgroundColor: date != "" ? colors.white : "#DCDCDC33",
          },
        ]}
        onPress={onPress}
      >
        {/* To Show date in specific format */}
        <Text style={{ ...styles.txt }}>
          {String(date) != ""
            ? `${date?.toLocaleString("default", {
                month: "short",
              })}-${date?.getDate()}-${date?.getFullYear()}`
            : "Select"}
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: rspW(4),
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: "#DCDCDC33", // 0.2 opacity added,
    borderColor: "#DCDCDC",
    borderRadius: rspW(1.3),
  },

  txt: {
    color: colors.black,
    fontSize: rspF(2.02),
    lineHeight: rspF(2.1),
    textAlign: "left",
    fontFamily: fontFamily.regular,
  },

  title: {
    fontSize: rspW(3.1),
  },
});

export default FormDateSelector;
