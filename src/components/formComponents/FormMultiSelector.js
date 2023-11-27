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
import { rspF, rspH, rspW, scrn_height } from "../../styles/responsiveSize";
import FormComponentsWrapper from "../wrappers/formComponentsWrappers/FormComponentsWrapper";
import FormComponentsWrapperHeader from "../wrappers/formComponentsWrappers/FormComponentsWrapperHeader";
import SearchInput from "./SearchInput";
import FormWrapperFooter from "../wrappers/formWrappers/FormWrapperFooter";
import FooterBtn from "../Buttons/FooterBtn";
import FastImage from "react-native-fast-image";
import * as icn from "../../assets";

const Item = ({ item, onPress, selected_lis2, multi }) => {

  let img1 = item[1]
  if (item[1].split(' ').length > 1) {
    console.log("item",item[1].split(' '))
    let itmlis = item[1].split(' ')
     img1 = itmlis.join('')
  }

return(
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
    {/* If Item have image and text */}
    {multi && (
      <FastImage
        source={selected_lis2.indexOf(item[0]) > -1 ?  icn[`${img1}Blue`] : icn[`${img1}Gray`]}
      //   {
      //     {
      //     // uri: selected_lis2.indexOf(item[0]) > -1 ? item[2] : item[3],       
      //   }
      // }
        style={{
          width: rspW(5.1),
          height: rspW(5.1),
          marginRight: rspW(2.5),
        }}
        resizeMode="contain"
      />
    )}
    {/* truncate long sentence in one line */}
    <Text numberOfLines={1} style={[styles.title, { color: colors.black }]}>
      {item[1]}
    </Text>
  </TouchableOpacity>
  )
};

const FormMultiSelector = ({
  search = true,
  title,
  width,
  blr_value = null,
  setblr_value = null,
  placeholder,
  list,
  selected_list,
  multi = false,
  setselected_list,
  setchanges_made = null,
  error = true,
}) => {
  const [selected_lis2, setselected_lis2] = useState([]);
  const [filterdatalist, setfilterdatalist] = useState([]);
  const [search_value, setsearch_value] = useState("");
  const [code_press, setcode_press] = useState(false);

  const [names, setnames] = useState("");

  // trucated selected items if more than three items
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
          // Handle tempory list until Comfirm btn press
          let indx = selected_lis2.indexOf(item[0]);
          // remove item from selected list
          if (indx > -1) {
            let tmp = [...selected_lis2];
            tmp.splice(indx, 1);
            setselected_lis2(tmp);
          }
          // add item in selected list if selected list have less than 10 item
          else if (selected_lis2.length < 10) {
            setselected_lis2([...selected_lis2, item[0]]);
          }
          if (setchanges_made != null) {
            setchanges_made(true);
          }
        }}
      />
    );
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.searchContainer,
          {
            height: rspH(5.8),
            width: width,
            borderColor:
              blr_value && selected_list.length == 0 && error
                ? colors.error
                : selected_list.length != 0
                ? colors.blue
                : "#DCDCDC",
            backgroundColor: selected_list.length != 0 ? "#fff" : "#DCDCDC33",
          },
        ]}
        onPress={() => {
          setcode_press(true);
          setselected_lis2([]);
          setblr_value(true);
        }}
      >
        <View style={styles.inp_title_cont}>
          {/* select item trucated sentence */}
          <Text style={{ ...styles.txt }} numberOfLines={1}>
            {selected_list.length > 0 ? names : placeholder}
          </Text>
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
              <View
                style={{
                  marginVertical: rspH(1),
                  alignSelf: "center",
                }}
              >
                {/* show message to inform user to item selection rule */}
                <Text
                  style={{
                    fontSize: rspF(1.3),
                    fontFamily: fontFamily.regular,
                    color: "#000",
                    textAlign: "center",
                  }}
                >{`Please select up to 10 ${title.toLowerCase()} from the list above`}</Text>
              </View>
              {/* Confirm Button to confirm selected item  */}
              <FooterBtn
                title={"Confirm"}
                disabled={selected_lis2.length == 0}
                onPress={() => {
                  if (selected_lis2.length > 0) {
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
    fontSize: rspF(1.9),
    fontFamily: fontFamily.medium,
    lineHeight: rspF(1.93),
    color: colors.black,
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  inp_title_cont: {
    flexDirection: "column",
    justifyContent: "flex-start",
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
});

export default memo(FormMultiSelector);
