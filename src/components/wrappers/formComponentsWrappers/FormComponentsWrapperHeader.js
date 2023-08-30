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
import { useNavigation } from "@react-navigation/native";

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
          // SalignSelf: 'center',
          flexDirection: "row",
          alignItems: "center",
          // backgroundColor:'red',
          height: rspH(3.8),
          justifyContent: left_icon ? "space-between" : "center",
        }}
      >
        <>
          {left_icon && (
            <TouchableOpacity
              style={{
                // backgroundColor:'red',
                justifyContent: "center",
                alignItems: "center",
                height: rspW(7.64),
                width: rspW(7.64),
                borderRadius: rspW(4),
              }}
              onPress={() => {
                setvisible(false);
              }}
            >
              <ADIcon size={20} name="left" color={colors.blue} />
            </TouchableOpacity>
          )}
          {/* <Text style={[styles.headerTitle]}></Text> */}

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
    // fontSize: rspF(3.2),
    // backgroundColor: colors.error,
    fontSize: rspF(2.7),
    color: colors.black,
    // lineHeight: rspF(3.21),
    lineHeight: rspF(2.8),

    // marginBottom: rspH(1.2),
    letterSpacing: 1,
  },
});
