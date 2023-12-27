import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo } from "react";
import fontFamily from "../../../styles/fontFamily";
import colors from "../../../styles/colors";
import { rspF, rspH, rspW } from "../../../styles/responsiveSize";
import ADIcon from "react-native-vector-icons/AntDesign";

const FormHeader = ({
  title = "",
  para = "",
  fontSize = 2.7,
  paraTp = 1.4,
  left_icon = false,
  iconColor = colors.blue,
  rightComp = null,
  onPress = null,
  extraHeadingStyle = {},
  onRightPress = null,
}) => {
  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          flexDirection: "row",
          position: "relative",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {left_icon && (
          <TouchableOpacity
            style={{
              position: "absolute",
              left: 0,
              top: -rspW(1),
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              height: rspW(9.6),
              width: rspW(9.6),
              borderRadius: rspW(5.3),
            }}
            onPress={() => {
              onPress();
            }}
          >
            <ADIcon size={20} name="left" color={iconColor} />
          </TouchableOpacity>
        )}
        {title != "" && (
          <Text
            style={{
              ...styles.headerTitle,
              fontSize: rspF(fontSize),
              ...extraHeadingStyle,
            }}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
          >
            {title}
          </Text>
        )}

        {rightComp != null && rightComp()}
      </View>
      <View
        style={{
          paddingTop: rspH(paraTp),
        }}
      >
        <Text
          style={{
            ...styles.headerPara,
          }}
        >
          {para}
        </Text>
      </View>
    </View>
  );
};

export default memo(FormHeader);

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: fontFamily.bold,
    color: colors.black,
    lineHeight: rspF(Platform.OS == "ios" ? 4 : 3.6),
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
