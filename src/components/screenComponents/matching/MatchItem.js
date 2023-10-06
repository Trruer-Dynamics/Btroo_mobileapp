import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Animated,
} from "react-native";
import React, { memo, useState } from "react";
import colors from "../../../styles/colors";
import truncateStr from "../../functions/truncateStr";
import { rspH, rspW, rspF } from "../../../styles/responsiveSize";
import fontFamily from "../../../styles/fontFamily";
import FAIcon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import FastImage from "react-native-fast-image";

const MatchItem = ({ item, visible, setVisible, setextendTimeMatchID, prf_img }) => {
  const navigation = useNavigation();
  

  // To get left hours
  let hours = Math.round((item.expiry_date - new Date()) / 36e5);
  let leftHrs = hours;


  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        if (item.lastMessage == "") {
          navigation.navigate("MatchProfile", {
            profile: item,
          });
        } else {
          navigation.navigate("Chat", {
            profile: item,
          });
        }
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
       {
       Platform.OS == 'android'?
        
      <FastImage
      useLastImageAsDefaultSource={item.prof_rvl? true : false}
      source={
        prf_img
      }
      
      style={styles.profileImage}
      />
        :
        <Image
      
          source={
            prf_img
          }
          
          style={styles.profileImage}
        />}
        <View>
          <Text style={styles.profileName}>
            {item?.userprofile?.name.split(" ")[0].length < 9
              ? item?.userprofile?.name.split(" ")[0]
              : truncateStr(item?.userprofile?.name.split(" ")[0], 8)}
            {", "}
            {item?.userprofile?.age}
          </Text>

          <Text style={styles.profileProfession}>
            {item?.userprofile?.occupation}
          </Text>

          <Text style={styles.profileMessage}>
            {item.matchType == "New Match"
              ? ""
              : truncateStr(item.lastMessage, 16)}
          </Text>
        </View>
      </View>
      <View style={styles.rightCont}>
        {item.matchType != "" ? (
          <View
            style={{
              ...styles.matchTypeCont,
              justifyContent: "center",
            }}
          >
            <View style={{ marginRight: rspW(1) }}>
              <Text style={{ ...styles.matchTypeContTxt }}>
                {item.matchType}
              </Text>
            </View>
            {item.matchType != "New Match" && (
              <FAIcon
                name={item.seen ? "envelope-open" : "envelope"}
                size={10}
                color={colors.white}
              />
            )}
          </View>
        ) : (
          <View
            style={{
              width: rspW(20.9),
              height: rspH(1.9),
            }}
          />
        )}

        <View />
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: rspH(Platform.OS == "ios" ? 0.6 : 0.6),
            width: rspW(23),
          }}
          onPress={() => {
            if (leftHrs <= 24 && item.no_of_extend < 2) {
              setextendTimeMatchID(item.id);
              setVisible(true);
            }
          }}
        >
          <Text
            style={{
              ...styles.timeDoneTxt,
              color: leftHrs > 24 ? colors.black : colors.error,
            }}
          >
            {leftHrs} Hours Left
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default memo(MatchItem);

const styles = StyleSheet.create({
  item: {
    position: "relative",
    width: rspW(81.3),
    height: rspH(9.64),
    borderRadius: rspW(2.5),
    borderWidth: rspW(0.8),
    borderColor: colors.blue,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: rspW(2.5),
    backgroundColor: "#fff",
    marginBottom: rspH(2.9),

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  profileImage: {
    width: rspW(10),
    height: rspW(10),
    marginRight: rspW(2.5),
    borderRadius: rspW(5),
  },
  profileName: {
    fontSize: rspF(2.38),
    color: colors.black,
    fontFamily: fontFamily.bold,
    lineHeight: rspF(2.42),
    letterSpacing: Platform.OS == "ios" ? 0 : 1,
  },
  profileProfession: {
    fontSize: rspF(2.02),
    color: colors.black,
    fontFamily: fontFamily.regular,
    lineHeight: rspF(2.1),
  },
  profileMessage: {
    fontSize: rspF(1.1),
    color: colors.black,
    fontFamily: fontFamily.regular,
    lineHeight: rspF(Platform.OS == "ios" ? 2 : 1.6),
  },
  rightCont: {
    justifyContent: "space-around",
    alignItems: "center",
  },
  matchTypeCont: {
    width: rspW(20.9),
    height: rspH(1.9),
    borderRadius: rspW(1),
    backgroundColor: colors.blue,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rspW(2),
    paddingVertical: rspH(0.25),
  },
  matchTypeContTxt: {
    color: colors.white,
    fontSize: rspF(1.302),
    lineHeight: rspF(1.31),
    fontFamily: fontFamily.bold,
  },
  timeDoneTxt: {
    fontSize: rspF(Platform.OS == "ios" ? 1.302 : 1.1),
    lineHeight: rspF(1.31),
    fontFamily: fontFamily.light,
    textAlign: "center",
  },
});
