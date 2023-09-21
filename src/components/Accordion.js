import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { memo, useState } from "react";
import ADIcon from "react-native-vector-icons/AntDesign";
import colors from "../styles/colors";
import { rspF, rspH, rspW } from "../styles/responsiveSize";

const Accordion = ({ key, heading = "heading", para = "para" }) => {
  const [open, setopen] = useState(false);

  return (
    <View key={key}>
      {/* Heading */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setopen(!open)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          alignSelf: "center",
          paddingTop: rspH(1.2),

          paddingHorizontal: 5,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              backgroundColor: colors.white,
              width: rspW(2.5),
              height: rspW(2.5),
              borderRadius: rspW(1.3),
              marginRight: rspW(4),
            }}
          />
          <Text style={{ fontWeight: "700", fontSize: 16, color: "#fff" }}>
            {heading}
          </Text>
        </View>
        <ADIcon size={20} name={open ? "up" : "down"} color={colors.white} />
      </TouchableOpacity>

      {/* Para */}
      {open && (
        <View
          style={{
            paddingLeft: rspW(7.64),
            minHeight: rspH(1.2),
            marginTop: rspH(2.16),
            width: "100%",
          }}
        >
          <Text
            style={{
              color: "#333131",
              color: "#fff",
            }}
          >
            {para}
          </Text>
        </View>
      )}
      <View
        style={{
          borderWidth: 1,
          borderColor: "#f4efef",
          height: 1,
          marginTop: rspH(2.35),
        }}
      />
    </View>
  );
};

export default memo(Accordion);

const styles = StyleSheet.create({});
