import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { memo } from "react";
import fontFamily from "../../../styles/fontFamily";
import colors from "../../../styles/colors";
import { rspF, rspH, rspW, srn_height } from "../../../styles/responsiveSize";
import ADIcon from "react-native-vector-icons/AntDesign";
import FastImage from "react-native-fast-image";

const FormHeaderChat = ({
  title = "",
  fontSize = 2.7,
  image,
  onPress = null,
  onImgPress = null,
  onHeaderPress = null,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        position: "relative",
        justifyContent: "space-between",
        alignItems: "center",
        height: srn_height * 0.06,
        marginBottom: rspH(1.4),
        width: "100%",
      }}
    >
      <TouchableOpacity
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: rspW(7.6),
          width: rspW(7.6),
          borderRadius: rspW(3.8),
        }}
        onPress={() => {
          onPress();
        }}
      >
        <ADIcon size={20} name="left" color={colors.blue} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onImgPress}
        style={{
          marginRight: rspW(6),
          alignItems: "center",
        }}
      >
        <FastImage
          source={{ uri: image }}
          style={{ width: rspW(10), height: rspW(10), borderRadius: rspW(5) }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onHeaderPress}
        style={{ marginLeft: rspW(-4), marginTop: rspH(1) }}
      >
        <Text
          style={{
            ...styles.headerTitle,
            fontSize: rspF(fontSize),
          }}
        >
          {title}
        </Text>
      </TouchableOpacity>

      <View>
        <Text>{""}</Text>
      </View>
      <View>
        <Text>{""}</Text>
      </View>
      <View>
        <Text>{""}</Text>
      </View>
      <View>
        <Text>{""}</Text>
      </View>
      <View>
        <Text>{""}</Text>
      </View>
    </View>
  );
};

export default memo(FormHeaderChat);

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: fontFamily.bold,
    color: colors.black,
    lineHeight: rspF(4),
    marginBottom: rspH(1.8),
    alignSelf: "center",
  },
  headerPara: {
    width: "100%",
    fontFamily: fontFamily.regular,
    fontSize: rspF(1.94),
    textAlign: "center",
    color: colors.blue,
    lineHeight: rspF(2.2),
  },
});
