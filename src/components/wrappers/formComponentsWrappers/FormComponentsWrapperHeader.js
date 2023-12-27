import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import { rspW, rspF, rspH } from "../../../styles/responsiveSize";
import fontFamily from "../../../styles/fontFamily";
import colors from "../../../styles/colors";
import ADIcon from "react-native-vector-icons/AntDesign";

const FormComponentsWrapperHeader = ({
  title = "",
  left_icon = true,
  nav_path = "",
  visible,
  setvisible,
  marginBottom = 33,
}) => {
  return (
    <View style={{ marginBottom: marginBottom }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: rspH(3.8),
          justifyContent: left_icon ? "space-between" : "center",
        }}
      >
        <>
          {left_icon && (
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                top: -rspW(0.2),
                height: rspW(9.6),
                width: rspW(9.6),
                borderRadius: rspW(5.3),
              }}
              onPress={() => {
                setvisible(false);
              }}
            >
              <ADIcon size={20} name="left" color={colors.blue} />
            </TouchableOpacity>
          )}
          <Text style={[styles.headerTitle]}>{title}</Text>
          <Text style={[styles.headerTitle]}>{"   "}</Text>
        </>
      </View>
    </View>
  );
};

export default FormComponentsWrapperHeader;

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: fontFamily.bold,
    fontSize: rspF(2.7),
    color: colors.black,
    lineHeight: rspF(2.8),
    letterSpacing: 1,
  },
});
