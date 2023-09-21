import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import colors from "../../../styles/colors";
import fontFamily from "../../../styles/fontFamily";
import FooterBtn from "../../Buttons/FooterBtn";
import { rspH, rspW, rspF } from "../../../styles/responsiveSize";
import FastImage from "react-native-fast-image";

const ExtendTime = ({ setModalVisible, extendTime }) => {
  return (
    <View style={styles.container}>
      <View style={styles.extendImageCont}>
        <FastImage
          source={require("../../../assets/images/Matching/TimeExtend/ConversationTimer.png")}
          style={styles.extendImage}
        />
      </View>
      <View style={styles.titleCont}>
        <Text style={styles.title}>
          Extend this conversation {"\n"}by 48 Hours?
        </Text>
      </View>
      <View style={styles.paraCont}>
        <Text style={styles.para}>
          Add some more time with your{`\n`}match to get to know each other{" "}
          {`\n`}on a deeper level
        </Text>
      </View>

      <FooterBtn
        title={"Extend"}
        disabled={false}
        onPress={() => {
          extendTime();
          setModalVisible(false);
        }}
      />

      <TouchableOpacity
        onPress={() => {
          setModalVisible(false);
        }}
        style={styles.bottomBtn}
      >
        <Text style={styles.bottomBtnTxt}>Not Now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ExtendTime;

const styles = StyleSheet.create({
  container: {
    width: rspW(76.5),
    height: rspH(58.7),
    backgroundColor: colors.white,
    borderRadius: rspW(5.1),
    justifyContent: "center",
    alignItems: "center",
  },
  extendImageCont: {
    width: rspW(17.4),
    height: rspH(8.24),
    backgroundColor: "#0518226f",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: rspW(8.695),
    borderWidth: 2,
    borderColor: colors.blue,
    marginTop: rspH(2.35),
    marginBottom: rspH(2.7),
  },
  extendImage: {
    width: rspW(12.5),
    height: rspW(12.5),
    resizeMode: "contain",
  },
  titleCont: {
    marginBottom: rspH(3.7),
  },
  title: {
    textAlign: "center",
    lineHeight: rspH(3.35),
    fontSize: rspF(2.488),
    fontFamily: fontFamily.bold,
    color: colors.black,
  },
  paraCont: {
    marginBottom: rspH(7.04),
  },
  para: {
    textAlign: "center",
    lineHeight: rspH(2.5),
    fontSize: rspF(1.9),
    fontFamily: fontFamily.regular,
    color: colors.blue,
  },
  bottomBtn: {
    marginTop: rspH(2.5),
    width: rspW(67),
    height: rspH(3.7),
  },
  bottomBtnTxt: {
    textAlign: "center",
    lineHeight: rspF(2.1),
    fontSize: rspF(2.02),
    fontFamily: fontFamily.bold,
    color: colors.blue,
    letterSpacing: 1,
  },
});
