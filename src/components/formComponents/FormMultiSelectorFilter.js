import React, { useState, useEffect, memo } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Platform,
} from "react-native";
import colors from "../../styles/colors";
import fontFamily from "../../styles/fontFamily";
import {
  rspF,
  rspH,
  rspW,
  scrn_height,
  scrn_width,
} from "../../styles/responsiveSize";
import FormComponentsWrapper from "../wrappers/formComponentsWrappers/FormComponentsWrapper";
import FormComponentsWrapperHeader from "../wrappers/formComponentsWrappers/FormComponentsWrapperHeader";
import SearchInput from "./SearchInput";
import ADIcon from "react-native-vector-icons/AntDesign";
import FormWrapperFooter from "../wrappers/formWrappers/FormWrapperFooter";
import FooterBtn from "../Buttons/FooterBtn";
import FastImage from "react-native-fast-image";

const Item = ({ item, onPress, selected_list, selected_lis2, multi }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      ...styles.item,
      width: rspW(75.9),
      backgroundColor:
        selected_lis2.indexOf(item[0]) > -1
          ? colors.lightBlue + "46" // for opacity
          : colors.lightGrey,
    }}
  >
    {multi && (
      <FastImage
        source={{
          uri: selected_lis2.indexOf(item[0]) > -1 ? item[2] : item[3],
        }}
        style={{
          width: rspW(5.1),
          height: rspW(5.1),
          marginRight: rspW(2.5),
        }}
        resizeMode="contain"
      />
    )}
    <Text style={[styles.title, { color: colors.black }]}>{item[1]}</Text>
  </TouchableOpacity>
);

const FormMultiSelectorFilter = ({
  search = true,
  title,
  headtitle = "",
  list,
  selected_list,
  multi = false,
  setchanges_made = null,
  setselected_list,
}) => {
  const [selected_lis2, setselected_lis2] = useState([]);
  const [filterdatalist, setfilterdatalist] = useState([]);
  const [search_value, setsearch_value] = useState("");
  const [code_press, setcode_press] = useState(false);

  useEffect(() => {
    setselected_lis2(selected_list);
  }, [code_press]);

  const renderItem = ({ item }) => {
    return (
      <Item
        multi={multi}
        item={item}
        selected_lis2={selected_lis2}
        selected_list={selected_list}
        setselected_list={setselected_list}
        onPress={() => {
          let indx = selected_lis2.indexOf(item[0]);
          if (indx > -1) {
            let tmp = [...selected_lis2];
            tmp.splice(indx, 1);
            setselected_lis2(tmp);
          } else {
            setselected_lis2([...selected_lis2, item[0]]);
          }
          if (setchanges_made != null) {
            setchanges_made(true);
          }
        }}
      />
    );
  };

  const [names, setnames] = useState("");

  useEffect(() => {
    if (selected_list.length > 0) {
      let slist = list
        .filter((g) => selected_list.includes(g[0]))
        .map((v) => v[1]);

      let names = "";
      if (slist.length > 0) {
        names = slist.slice(0, 3).reduce((a, b) => a + ", " + b);

        let appnd = slist.length > 3 ? "..." : "";

        let tnames = names + appnd;
        setnames(tnames);
      } else {
        setnames("");
      }
    }
  }, [selected_list]);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setcode_press(true);
          setselected_lis2([]);
        }}
        style={{
          ...styles.selectorCont,
        }}
      >
        <View>
          <View style={styles.headTitleCont}>
            <Text style={styles.headTitle}>{headtitle}</Text>
          </View>

          <View style={{ width: scrn_width / 1.5 }}>
            <Text style={styles.selectedOpt} numberOfLines={1}>
              {selected_list.length > 0 ? names : ""}
            </Text>
          </View>
        </View>

        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <ADIcon size={20} name="right" color={colors.blue} />
        </View>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={false} visible={code_press}>
        <SafeAreaView style={{ height: scrn_height }}>
          <FormComponentsWrapper>
            <FormComponentsWrapperHeader
              title={title}
              visible={code_press}
              setvisible={setcode_press}
            />

            <View
              style={{
                alignSelf: "center",
                height: rspH(Platform.OS == "ios" ? 69 : 74),
              }}
            >
              {search ? (
                <SearchInput
                  search={search_value}
                  setsearch={setsearch_value}
                  datalist={list}
                  setfilterdatalist={setfilterdatalist}
                />
              ) : (
                <View style={styles.emptysearchContainer} />
              )}
              <View
                style={{
                  height: rspH(Platform.OS == "ios" ? 58.6 : 63),
                }}
              >
                <FlatList
                  data={search_value ? filterdatalist : list}
                  renderItem={renderItem}
                  keyExtractor={(item) => item[0]}
                />
              </View>
            </View>
            <FormWrapperFooter>
              <FooterBtn
                title={"Confirm"}
                disabled={
                  selected_lis2.every((v) => selected_list.includes(v)) &&
                  selected_list.every((v) => selected_lis2.includes(v))
                }
                onPress={() => {
                  let checker = (arr, target) =>
                    target.every((v) => arr.includes(v));
                  let check1 = checker(selected_lis2, selected_list);
                  let check2 = checker(selected_list, selected_lis2);

                  if (!(check1 && check2)) {
                    setcode_press(false);
                    setselected_list(selected_lis2);
                    setselected_lis2([]);
                  }
                }}
              />
            </FormWrapperFooter>
          </FormComponentsWrapper>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    borderWidth: 1,
    backgroundColor: "#DCDCDC33", // 0.2 opacity added,
    paddingHorizontal: rspW(4),
    borderRadius: rspW(1.3),
  },
  selectedOpt: {
    fontSize: rspF(1.66),
    lineHeight: rspF(1.8),
    fontFamily: fontFamily.bold,
    color: `#999999`,
  },
  txtCont: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  txt: {
    color: colors.black,
    fontSize: rspF(1.924),
    lineHeight: rspF(1.96),
    textAlign: "center",
    fontFamily: fontFamily.regular,
    letterSpacing: 1,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rspW(5.1),
    justifyContent: "flex-start",
    height: rspH(5.6),
    marginBottom: rspH(1.4),
    borderRadius: rspW(1.3),
  },
  title: {
    fontSize: rspF(1.76),
    fontFamily: fontFamily.medium,
    lineHeight: rspF(1.93),
    color: colors.black,
  },

  emptysearchContainer: {
    height: rspH(4.7),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: rspW(4),
    borderRadius: rspW(2.5),
    marginBottom: rspH(3.9),
  },
  selectorCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: rspH(2),
  },
  headTitleCont: {
    marginBottom: rspW(1.3),
  },
  headTitle: {
    lineHeight: rspF(2.18),
    fontSize: rspF(2.138),
    fontFamily: fontFamily.bold,
    color: colors.black,
    letterSpacing: 1,
  },
});

export default memo(FormMultiSelectorFilter);
