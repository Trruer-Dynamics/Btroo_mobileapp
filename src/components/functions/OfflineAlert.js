import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { rspF, rspH, rspW } from "../../styles/responsiveSize";
import fontFamily from "../../styles/fontFamily";
import colors from "../../styles/colors";

const OffflineAlert = () => {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.messageBox}>
        {/* Heading */}
        <View style={styles.messageBoxHeaderCont}>
          <Text style={styles.messageBoxHeader}>You are offline</Text>
        </View>

        {/* Para */}
        <View>
          <Text style={styles.messageBoxPara}>
            Please check your internet {"\n"}connection and try again.
          </Text>
        </View>
      </View>
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
    backgroundColor: "#00000087",
    justifyContent: "center",
    alignItems: "center",
  },
  messageBox: {
    width: rspW(76.5),
    height: rspH(31.16),
    backgroundColor: colors.white,
    borderRadius: rspW(5.1),
    paddingHorizontal: rspW(4),
    alignItems: "center",
    justifyContent: "center",
    // marginTop: rspH(17),
  },
  messageBoxHeaderCont: {
    marginBottom: rspH(3),
  },
  messageBoxHeader: {
    fontFamily: fontFamily.bold,
    fontSize: rspF(3),
    color: colors.blue,
    lineHeight: rspH(3.1),
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
