import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { rspF, rspH, rspW } from "../../styles/responsiveSize";
import colors from "../../styles/colors";
import FastImage from "react-native-fast-image";
import fontFamily from "../../styles/fontFamily";
import { ScrollView } from "react-native-gesture-handler";

const HScrollerWS = ({ title = "", lis = [], lisref = null }) => {
  return (
    <View
      style={[
        styles.container,
        // styles.boxShadowCont
      ]}
    >
      {title != "" && (
        <View style={styles.titleCont}>
          <Text style={styles.titleTxt}>{title}</Text>
        </View>
      )}
      <ScrollView
        bounces
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={lisref}
      >
        {lis.map((itm, idx) => {
    
          return (
            <View key={idx} style={styles.item}>
              <View style={styles.itemmain}>
                <FastImage
                  source={itm[0]}
                  style={styles.iconImg}
                  resizeMode="contain"
                />
                <Text style={styles.profileDetailContNText}>{itm[1]}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default HScrollerWS;

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
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems:'center',
    // backgroundColor:'red',
    // height: rspH(4),

    marginLeft: rspW(2.3),
  },
  itemmain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: rspW(2.3),
    backgroundColor: colors.blue,
    paddingHorizontal: rspW(1.5),
    borderRadius: rspW(1.8),
    paddingVertical: rspH(0.3),
  },

  iconImg: {
    // width: rspW(6.75),
    // height: rspH(3),
    width: rspW(5.8),
    height: rspH(3),

    marginRight: rspW(1),
  },

  profileDetailContNText: {
    color: colors.white,
    fontFamily: fontFamily.semi_bold,
    // fontSize: rspF(2.14),
    fontSize: rspF(1.9),

    // lineHeight: rspF(4),
    // backgroundColor:'green',
  },

  titleCont: {
    marginBottom: rspH(0.9),
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
