import { StyleSheet, ActivityIndicator, SafeAreaView } from "react-native";

import React from "react";

import colors from "../../styles/colors";

import { scrn_height, scrn_width } from "../../styles/responsiveSize";

const Loader = () => {
  return (
    <SafeAreaView
      style={{
        position: "absolute",
        alignSelf: "center",
        height: scrn_height,
        width: scrn_width,
        backgroundColor: "#0000003c",
        zIndex: 100,
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size="large" color={colors.blue} />
    </SafeAreaView>
  );
};

export default Loader;

const styles = StyleSheet.create({});
