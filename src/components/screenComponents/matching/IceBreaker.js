import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import FormComponentsWrapper from "../../wrappers/formComponentsWrappers/FormComponentsWrapper";
import FormComponentsWrapperHeader from "../../wrappers/formComponentsWrappers/FormComponentsWrapperHeader";
import fontFamily from "../../../styles/fontFamily";
import { scrn_height, rspF, rspH, rspW } from "../../../styles/responsiveSize";
import colors from "../../../styles/colors";
import FormHeader from "../../wrappers/formWrappers/FormHeader";

const Item = ({ item, onPress, icebreaker }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.item,
      {
        backgroundColor:
          item == icebreaker
            ? colors.lightBlue + "46" // foor opacity
            : colors.lightGrey,
      },
    ]}
  >
    <Text
      style={[
        styles.title,

        // {color: item == icebreaker ? colors.blue : colors.black},
      ]}
    >
      {item}
    </Text>
  </TouchableOpacity>
);

const IceBreaker = ({
  icebreaker = "",
  seticebreaker = null,
  modalVisible,
  setModalVisible,
  setmsg,
  icebreaker_list,
}) => {
  const renderItem = ({ item }) => {
    return (
      <Item
        icebreaker={icebreaker}
        item={item}
        onPress={() => {
          seticebreaker(item);
          setModalVisible(!modalVisible);
          // setmsg((messg) => messg + item);
          setmsg(item);

        }}
      />
    );
  };

  return (
    <FormComponentsWrapper>
      <FormComponentsWrapperHeader
        title={"Icebreakers"}
        visible={modalVisible}
        setvisible={() => setModalVisible(false)}
        marginBottom={rspH(1.2)}
      />

      <View>
        <Text style={styles.para}></Text>
      </View>

      <View style={styles.emptysearchContainer} />

      <FlatList
        data={icebreaker_list}
        renderItem={renderItem}
        keyExtractor={(_, index) => index}
        style={{ height: scrn_height / 1.5 }}
      />
    </FormComponentsWrapper>
  );
};

export default IceBreaker;

const styles = StyleSheet.create({
  para: {
    fontFamily: fontFamily.regular,
    fontSize: rspF(2.02),
    color: colors.blue,
    lineHeight: 13.8,
    textAlign: "center",
    marginBottom: rspH(3.7),
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rspW(5.1),
    justifyContent: "flex-start",
    // height: rspH(5.6),
    paddingVertical: rspH(1.35),
    marginBottom: rspH(1.4),
    borderRadius: rspW(1.3),
  },
  title: {
    fontSize: rspF(1.9),
    fontFamily: fontFamily.medium,
    // lineHeight: rspF(1.93),
    lineHeight: rspF(2.3),
    color: colors.black,
  },
  emptysearchContainer: {
    // height: rspH(4.7),
    height: rspH(2.8),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // borderWidth: 1,
    // backgroundColor: '#DCDCDC33', // 0.2 opacity added,
    // borderColor: '#DCDCDC',
    paddingHorizontal: rspW(4),
    borderRadius: rspW(2.5),
    marginBottom: rspH(3.9),
  },
});
