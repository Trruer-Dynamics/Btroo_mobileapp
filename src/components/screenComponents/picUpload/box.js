import React, { memo, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { rspF, rspH, rspW } from "../../../styles/responsiveSize";
import colors from "../../../styles/colors";
import Ionicon from "react-native-vector-icons/Ionicons";
import ADIcon from "react-native-vector-icons/AntDesign";
import fontFamily from "../../../styles/fontFamily";
import FastImage from "react-native-fast-image";
import { runOnJS, useAnimatedReaction, useDerivedValue } from "react-native-reanimated";
import { refresh } from "@react-native-community/netinfo";

const Box = ({
  item,
  index,
  activeIndx,
  loading,
  modalVisible,
  setmodalVisible,
  setactiveIndx,
  positions,
  deleteProfileImage,
  up_img_len = 9,
  pos2,
}) => {


  // useEffect(()=>{
  //   setactiveIndx(index)
  // },[refresh])
  

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        if (item[2]) {
          setmodalVisible(true);
          setactiveIndx(index);
        }
      }}
      style={[styles.uploadSec]}
    >
      {item[0] != "" ? (
        <View style={{ position: "relative" }}>
          {loading && activeIndx == index && (
            //   true
            <View
              style={{
                width: rspW(23),
                height: rspW(23),
                position: "absolute",
                alignSelf: "center",
                borderRadius: rspW(2.5),
                backgroundColor: "#0000003c",
                zIndex: 100,
                justifyContent: "center",
              }}
            >
              <ActivityIndicator
                size="large"
                color={colors.blue}
                style={{ alignSelf: "center" }}
              />
            </View>
          )}

          <FastImage
            source={{ uri: `${item[1]}` }}
            resizeMode="cover"
            style={{
              width: rspW(23),
              height: rspW(23),
              borderRadius: rspW(2.5),
            }}
          />
          {up_img_len > 3 && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                deleteProfileImage(index);
              }}
              style={{
                position: "absolute",
                right: rspW(-2.5),
                top: rspW(-2.5),
                backgroundColor: "#fff",
                borderRadius: rspW(6),
              }}
            >
              <ADIcon name="minuscircle" size={20} color={colors.error} />
            </TouchableOpacity>
          )}
          <View
            style={{
              ...styles.positionCont,
            }}
          >
            <Text
              style={{
                ...styles.positionTxt,
              }}
            >
              {pos2[index] + 1}
            </Text>
          </View>
        </View>
      ) : (
        <Ionicon
          style={{
            zIndex: 2,
          }}
          name="md-add-circle-sharp"
          size={30}
          color={item[2] ? colors.blue : "#cccccc"}
        />
      )}
    </TouchableOpacity>
  );
};

export default memo(Box);

const styles = StyleSheet.create({
  uploadSec: {
    borderRadius: rspW(2.5),
    width: rspW(23),
    height: rspW(23),
    backgroundColor: colors.grey + "37",
    alignItems: "center",
    justifyContent: "center",
    margin: rspW(1),
    zIndex: 2,
  },
  positionCont: {
    position: "absolute",
    left: rspW(1),
    top: rspH(8),
    backgroundColor: "#00000089",
    paddingTop: rspH(0.5),
    borderRadius: rspW(6),
    width: rspW(5),
    height: rspW(5),
    alignItems: "center",
    justifyContent: "center",
  },
  positionTxt: {
    textAlign: "center",
    fontSize: rspF(1.5),
    fontFamily: fontFamily.semi_bold,
    color: "#fff",
    lineHeight: rspF(1.5),
  },
});
