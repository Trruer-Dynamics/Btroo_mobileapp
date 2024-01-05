import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { rspF, rspH, rspW } from "../../styles/responsiveSize";
import colors from "../../styles/colors";
import FastImage from "react-native-fast-image";
import fontFamily from "../../styles/fontFamily";
import { ScrollView } from "react-native-gesture-handler";

const HScrollerMulti = ({ title = "", lis = [], lisref = null }) => {
  return (
    <View
      style={[
        styles.container,
        // styles.boxShadowCont
      ]}
    >
      <ScrollView
        bounces
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={lisref}
      >
        {lis.map((itm, idx) => {
          let mid = lis.length > 1 && idx != lis.length - 1;

          return (
            <View key={idx} style={styles.item}>
              <View style={styles.titleCont}>
                <Text style={styles.titleTxt}>{itm.title}</Text>
              </View>
              <View style={styles.itemmain}>
                {itm.values.map((val, ind) => {
                  return (
                    <FastImage
                      source={val}
                      style={styles.iconImg}
                      resizeMode="contain"
                    />
                  );
                })}
                {mid && <View style={styles.separator} />}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default HScrollerMulti;

const styles = StyleSheet.create({
  container: {
    // flexDirection:'row',
    //    alignItems:'center',
    // width: rspW(82),
    width: rspW(88),

    // marginTop: rspH(3),
    borderRadius: rspW(1.6),
    // height: rspH(9.6),
    // height: rspH(7),
    // paddingHorizontal: rspW(3.2),
    paddingVertical: rspH(1.5),
    // paddingTop: rspH(1.17),
    marginBottom: rspH(1.67),
    // backgroundColor:'green',
    backgroundColor: colors.dimWhite,
  },
  item: {
    // backgroundColor:'red',
    height: rspH(6),
    // marginLeft: rspW(2.3),
  },

  itemmain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginLeft: rspW(2.3),
  },

  iconImg: {
    width: rspW(7),
    height: rspH(3.5),
    marginHorizontal: rspW(2.5),
  },
  separator: {
    // marginHorizontal: rspW(2.5),
    width: rspW(0.5),
    backgroundColor: colors.grey,
    height: "100%",
  },

  profileDetailContNText: {
    color: colors.blue,
    fontFamily: fontFamily.semi_bold,
    // fontSize: rspF(2.14),
    fontSize: rspF(2.08),

    // lineHeight: rspF(4),
    // backgroundColor:'green',
  },

  titleCont: {
    marginBottom: rspH(0.7),
    marginLeft: rspW(2.5),
  },
  titleTxt: {
    fontFamily: fontFamily.bold,
    // fontSize: rspF(1.9),
    fontSize: rspF(1.6),
    color: colors.black,
    lineHeight: rspF(1.65),
    letterSpacing: 1,
  },

  boxShadowCont: {
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 2.5,
    elevation: 4,
  },
});
