import React, { useLayoutEffect, useState, useEffect } from "react";
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
import FormInput from "./FormInput";
import SearchInput from "./SearchInput";
import ADIcon from "react-native-vector-icons/AntDesign";
import FAIcon from "react-native-vector-icons/FontAwesome";
import FormWrapperFooter from "../wrappers/formWrappers/FormWrapperFooter";
import ErrorContainer from "./ErrorContainer";
import FooterBtn from "../Buttons/FooterBtn";

const Item = ({ item, onPress, selected_list, selected_lis2, multi }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...styles.item,
        backgroundColor:
          selected_lis2.indexOf(item[0]) > -1
            ? colors.lightBlue + "46" // foor opacity
            : colors.lightGrey,
      }}
    >
      {multi && (
        <FAIcon
          size={20}
          name="book"
          style={{ marginRight: 10 }}
          color={colors.lightBlue}
        />
      )}
      <Text style={[styles.title, { color: colors.black }]}>{item[1]}</Text>
    </TouchableOpacity>
  );
};

const FormSelectorFilter = ({
  search = true,
  headtitle = "",
  mainTitle = "",
  setSelectedEntry,
  width,
  blr_value = null,
  setblr_value = null,
  list,
  selected_list,
  setselected_list,
  selectedId,
  setSelectedId,
  marginTop = 0,
  multi = false,
  setchanges_made = null,
}) => {
  const [filterdatalist, setfilterdatalist] = useState([]);
  const [search_value, setsearch_value] = useState("");
  const [code_press, setcode_press] = useState(false);
  const [selected_lis2, setselected_lis2] = useState([]);
  const [names, setnames] = useState("");

  useEffect(() => {
    setselected_lis2(selected_list);
  }, [code_press]);

  useEffect(() => {
    if (selectedId != 0) {
      let selected_itm = list.find((v) => v[0] == selectedId);
      setSelectedEntry(selected_itm);
    }
  }, [selectedId]);

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

  const renderItem = ({ item }) => {
    return (
      <Item
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
          }
          // if (selected_lis2.length < 10)
          else {
            setselected_lis2([...selected_lis2, item[0]]);
          }
          if (setchanges_made != null) {
            setchanges_made(true);
          }
        }}
        multi={multi}
      />
    );
  };

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
              {selected_list.length > 0
                ? // selected_list.map((v, idx) => {
                  //     let name = list.filter(g => g[0] == v)[0];
                  //     let val = name?  (idx == 0 ? name[1] : ', ' + name[1]) : '';

                  //     return val;
                  //     // return 'val';
                  //   })
                  names
                : ""}

              {/* Check */}
            </Text>
          </View>
        </View>

        <View
          style={{ alignItems: "center", justifyContent: "center" }}
          onPress={() => {
            // setvisible(false);
          }}
        >
          <ADIcon size={20} name="right" color={colors.blue} />
        </View>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={false} visible={code_press}>
        <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
          <FormComponentsWrapper>
            <FormComponentsWrapperHeader
              title={mainTitle}
              visible={code_press}
              setvisible={setcode_press}
            />
            {search ? (
              <View style={{ alignItems: "center" }}>
                <SearchInput
                  search={search_value}
                  setsearch={setsearch_value}
                  datalist={list}
                  setfilterdatalist={setfilterdatalist}
                />
              </View>
            ) : (
              <View style={styles.emptysearchContainer} />
            )}
            <View
              style={{
                ...styles.listCont,
                alignItems: "center",
                height: rspH(Platform.OS == "ios" ? 58.6 : 63),
              }}
            >
              <FlatList
                data={search_value ? filterdatalist : list}
                renderItem={renderItem}
                keyExtractor={(item) => item[0]}
                // extraData={selectedId}
                // style={{height: scrn_height / 1.77}}
              />
            </View>
            {/* Confirm Btn */}

            <FormWrapperFooter>
              {/* Error Show Here */}

              {/* <View style={{marginVertical: rspH(1),
              alignSelf:'center',
              }}>
              <Text style={{
                fontSize: rspF(1.3),
                fontFamily: fontFamily.regular,
                color: '#000',
                textAlign:'center',
              }}>{`Please select up to 10 ${mainTitle.toLowerCase()} from the list above`}</Text>
              </View> */}

              {/* Next Btn To Navigate to Next Form Components */}
              <FooterBtn
                title={"Confirm"}
                disabled={ selected_lis2.every(v => selected_list.includes(v)) && selected_list.every(v => selected_lis2.includes(v))}
                onPress={() => {

                  let checker = (arr, target) => target.every(v => arr.includes(v))
                  let check1 = checker(selected_lis2,selected_list)
                  let check2 = checker(selected_list,selected_lis2)
                  
                  // console.log("selected_list",selected_list)
                  // console.log("selected_lis2",selected_lis2)
                  // console.log("check1",check1 && check2)
              
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
  txtCont: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  txt: {
    color: colors.black,
    fontSize: rspF(2.02),
    lineHeight: rspF(2.1),
    textAlign: "center",
    fontFamily: fontFamily.regular,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rspW(5.1),
    justifyContent: "flex-start",
    height: rspH(5.6),
    marginBottom: rspH(1.4),
    backgroundColor: colors.lightGrey,
    borderRadius: rspW(1.3),
    width: rspW(75.9),
  },
  title: {
    fontSize: rspF(1.76),
    fontFamily: fontFamily.medium,
    lineHeight: rspF(1.93),
    color: colors.black,
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
  selectedOpt: {
    fontSize: rspF(1.66),
    lineHeight: rspF(1.8),

    fontFamily: fontFamily.bold,
    color: `#999999`,
    // letterSpacing:1,
  },
  listCont: {
    // height: scrn_height / 1.65,
    marginBottom: rspH(1.2),
    // alignSelf:'center',
  },

  emptysearchContainer: {
    height: rspH(4.7),
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

export default FormSelectorFilter;
