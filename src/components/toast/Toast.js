import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { rspF, rspH, rspW } from "../../styles/responsiveSize";
import fontFamily from "../../styles/fontFamily";

const Toast = ({
  message = "hi",
  backgroungColor = "#00000082",
  borderRadius = 1,
  paddingHor = 2,
  paddingVer = 1.2,
  bottom = 0,
  visible,
  setvisible,
}) => {
  useEffect(() => {
    if (visible) {
      let toast_timeout = setTimeout(() => {
        setvisible(false);
      }, 1000);
    }
  }, [visible]);

  return (
    <>
      {visible && (
        <View
          style={{
            borderRadius: rspH(borderRadius),
            paddingVertical: rspH(paddingVer),
            paddingHorizontal: rspH(paddingHor),
            backgroundColor: backgroungColor,
            position: "absolute",
            bottom: rspH(bottom),
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontFamily: fontFamily.semi_bold,
              fontSize: rspF(2),
              textAlign: "center",
            }}
          >
            {message}
          </Text>
        </View>
      )}
    </>
  );
};

export default Toast;

const styles = StyleSheet.create({});
