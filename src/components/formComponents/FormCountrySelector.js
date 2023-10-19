import React, { useLayoutEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import countries_with_ph_no from "../../data/countries_with_ph_no";
import colors from "../../styles/colors";
import fontFamily from "../../styles/fontFamily";
import { rspF, rspH, rspW } from "../../styles/responsiveSize";
import FormComponentsWrapper from "../wrappers/formComponentsWrappers/FormComponentsWrapper";
import FormComponentsWrapperHeader from "../wrappers/formComponentsWrappers/FormComponentsWrapperHeader";
import SearchCountryInput from "./SearchCountryInput";
import truncateStr from "../functions/truncateStr";

const Item = ({ item, onPress, textColor, selectedValue = "" }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item]}>
    {/* Country Name */}
    <Text style={[styles.itm_title, { color: textColor }]} numberOfLines={1}>
      {item.label.length > 20 ? truncateStr(item.label, 20) : item.label}
    </Text>
    {/* Phone Code */}
    <Text
      style={[styles.itm_title, { color: textColor }]}
    >{`+${item.phone}`}</Text>
  </TouchableOpacity>
);

const FormCountrySelector = ({
  width,
  selectedId,
  setSelectedId,
  selectedValue = "",
  blr_value = null,
  setblr_value = null,
}) => {
  const [datalist, setdatalist] = useState([]);
  const [filterdatalist, setfilterdatalist] = useState([]);
  const [search_country, setsearch_country] = useState("");
  const [code_press, setcode_press] = useState(false);

  useLayoutEffect(() => {
    setdatalist(countries_with_ph_no);
  }, []);

  const renderItem = ({ item }) => {
    const color = item.code === selectedId ? colors.blue : colors.black;

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.code);
          setcode_press(!code_press);
          setsearch_country("");
        }}
        textColor={color}
      />
    );
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.searchContainer,
          {
            justifyContent: selectedValue ? "space-between" : "center",
            height: rspH(5.8),
            width: width,
            backgroundColor: selectedId != "" ? "#fff" : "#DCDCDC33",
            position: "relative",
            // change border color if item selected
            borderColor: selectedId == "" ? colors.grey : colors.blue,
          },
        ]}
        onPress={() => {
          setcode_press(!code_press);
          setblr_value(true);
        }}
      >
        {/* Code Placehoder if number not selected */}
        <View style={{ position: "absolute", top: rspH(0.6), zIndex: 2 }}>
          {selectedValue && <Text style={{ ...styles.inp_title }}>Code</Text>}
        </View>

        <View
          style={{
            zIndex: 1,
            height: "100%",
            paddingTop: rspH(selectedValue ? 1.4 : 0),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Show Country Code here */}
          <Text
            style={{
              ...styles.txt,
              color: selectedValue ? colors.black : colors.blue,
            }}
          >
            {selectedValue ? "+" + selectedValue : "Code"}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Modal to open country list with code */}
      <Modal animationType="slide" transparent={false} visible={code_press}>
        <SafeAreaView style={{ flex: 1 }}>
          <FormComponentsWrapper
            statusBarColor="#fff"
            barStyle="light-content"
            containerStyle={{
              paddingTop: rspH(3.7),
            }}
          >
            <FormComponentsWrapperHeader
              left_icon={true}
              title={"Country Code"}
              visible={code_press}
              setvisible={() => {
                setcode_press(false);
                setsearch_country("");
              }}
            />
            <View style={{ alignSelf: "center" }}>
              {/* Search Input for countries attribute */}
              <SearchCountryInput
                search={search_country}
                setsearch={setsearch_country}
                datalist={datalist}
                setfilterdatalist={setfilterdatalist}
              />
              <View
                style={{
                  height: rspH(Platform.OS == "ios" ? 59.6 : 64),
                }}
              >
                {/* To render all countries */}
                <FlatList
                  data={search_country ? filterdatalist : datalist}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.code}
                  extraData={selectedId}
                />
              </View>
            </View>
          </FormComponentsWrapper>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: "#DCDCDC33", // 0.2 opacity added,
    borderRadius: rspW(1.3),
    paddingVertical: rspH(0.89),
  },
  txtCont: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  txt: {
    color: colors.black,
    fontSize: rspF(2.02),
    textAlign: "center",
    fontFamily: fontFamily.regular,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rspW(5.1),
    justifyContent: "space-between",
    height: rspH(5.6),
    marginBottom: rspH(1.4),
    backgroundColor: colors.lightGrey,
    borderRadius: rspW(1.3),
    width: rspW(75.9),
  },
  itm_title: {
    fontSize: rspF(1.9),
    fontFamily: fontFamily.medium,
    lineHeight: rspF(1.93),
    color: colors.black,
  },

  inp_title: {
    color: colors.blue,
    fontSize: 10,
    fontFamily: fontFamily.regular,
    lineHeight: 15,
  },
});

export default FormCountrySelector;
