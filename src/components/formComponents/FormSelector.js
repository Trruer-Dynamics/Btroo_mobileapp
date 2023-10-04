import React, { useState, useEffect, memo } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import colors from "../../styles/colors";
import fontFamily from "../../styles/fontFamily";
import { rspH, rspW, rspF } from "../../styles/responsiveSize";
import FormComponentsWrapper from "../wrappers/formComponentsWrappers/FormComponentsWrapper";
import FormComponentsWrapperHeader from "../wrappers/formComponentsWrappers/FormComponentsWrapperHeader";
import SearchInput from "./SearchInput";
import SearchInputBackend from "./SearchInputBackend";
import _ from "lodash";


const Item = ({ item, onPress, selectedValue, multiline }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.item,
      {
        paddingVertical: rspH(2),
        backgroundColor:
          item[1] == selectedValue
            ? colors.lightBlue + "46" // foor opacity
            : colors.lightGrey,
      },
    ]}
  >
    <Text
      style={[styles.title, { color: colors.black }]}
      numberOfLines={multiline ? 10 : 1}
    >
      {item[1]}
    </Text>
  </TouchableOpacity>
);

const FormSelector = ({
  search = true,
  title,
  setSelectedEntry,
  width,
  blr_value = null,
  setblr_value = null,
  placeholder,
  list,
  selectedId,
  setSelectedId,
  selectedValue,
  pull_refresh = false,
  onRefresh = null,
  refreshing = false,
  setrefreshing = null,
  setchanges_made = null,
  backend_search = false,
  backend_search_txt = "",
  setbackend_search_txt = null,
  onBackendSearch = null,
  page = 1,
  setpage = null,
  removable = false,
  rmv_list = [],
  setrmv_list = null,
  error = true,
  multiline = false,
}) => {
  const [filterdatalist, setfilterdatalist] = useState([]);
  const [search_value, setsearch_value] = useState("");
  const [code_press, setcode_press] = useState(false);

  const [end_reach, setend_reach] = useState(true);

  useEffect(() => {
    if (selectedId != 0) {
      let selected_itm = list.find((v) => v[0] == selectedId);
      setSelectedEntry(selected_itm);
    }
  }, [selectedId]);

  const renderItem = ({ item, indx }) => {
    if (!removable) {
      return (
        <Item
          item={item}
          multiline={multiline}
          selectedValue={selectedValue}
          onPress={() => {
            if (setchanges_made != null) {
              setchanges_made(true);
            }
            setSelectedId(item[0]);
            setcode_press(!code_press);
          }}
        />
      );
    } else {
      if (!rmv_list.includes(item[0]) || selectedId == item[0]) {
        return (
          <Item
            item={item}
            multiline={multiline}
            selectedValue={selectedValue}
            onPress={() => {
              if (setchanges_made != null) {
                setchanges_made(true);
              }
              if (rmv_list.includes(selectedId)) {
                rmv_list.splice(rmv_list.indexOf(selectedId), 1);
              }
              setSelectedId(item[0]);
              setrmv_list([...rmv_list, item[0]]);
              setcode_press(!code_press);
            }}
          />
        );
      }
    }
  }

  // Debounce the showAlert function with a delay of 300 milliseconds
  const delayBack = _.debounce((bool)=>{
    onBackendSearch(bool)
  }, 500, {
    leading: false,
    trailing: true,
  });

  useEffect(() => {

    const delay = setTimeout(() => {
      
      if (backend_search) {
        onBackendSearch(backend_search)
        // delayBack(backend_search)
      }
    }, 380);
    return () => clearTimeout(delay);
  }, [backend_search_txt]);

  return (
    <>
      <TouchableOpacity
        style={[
          styles.searchContainer,
          {
            height: rspH(5.8),
            width: width,
            borderColor:
              blr_value && selectedValue == undefined
                ? colors.error
                : selectedValue != undefined
                ? colors.blue
                : "#DCDCDC",
            backgroundColor: selectedValue != undefined ? "#fff" : "#DCDCDC33",
          },
        ]}
        onPress={() => {
          setcode_press(!code_press);
          setblr_value(true);
        }}
      >
        <View style={styles.inp_title_cont}>
          <Text style={{ ...styles.txt }} numberOfLines={1}>
            {selectedValue ? selectedValue : placeholder}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={false} visible={code_press}>
        <SafeAreaView style={{ flex: 1 }}>
          <FormComponentsWrapper>
            <FormComponentsWrapperHeader
              title={title}
              visible={code_press}
              setvisible={setcode_press}
            />
            <View style={{ alignSelf: "center" }}>
              {search ? (
                <>
                  {backend_search ? (
                    <SearchInputBackend
                      search={backend_search_txt}
                      setsearch={setbackend_search_txt}
                      refreshing={refreshing}
                    />
                  ) : (
                    <SearchInput
                      search={search_value}
                      setsearch={setsearch_value}
                      datalist={list}
                      setfilterdatalist={setfilterdatalist}
                    />
                  )}
                </>
              ) : (
                <View style={styles.emptysearchContainer} />
              )}
              <View
                style={{
                  height: rspH(Platform.OS == "ios" ? 59.6 : 64),
                }}
              >
                <FlatList
                  data={search_value ? filterdatalist : list}
                  renderItem={renderItem}
                  keyExtractor={(item) => item[0]}
                  onEndReached={() => {
                    if (pull_refresh) {
                      if (!end_reach) {
                        onRefresh(page + 1);

                        setend_reach(true);
                        setpage(page + 1);
                      }
                    }
                  }}
                  onMomentumScrollBegin={() => setend_reach(false)}
                  ListFooterComponent={
                    pull_refresh &&
                    refreshing && (
                      <ActivityIndicator size="large" color={colors.blue} />
                    )
                  } // Show the loader at the bottom when loadingMore is true
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
    width: rspW(75.9),
    alignItems: "center",
    paddingHorizontal: rspW(5.1),
    justifyContent: "flex-start",

    marginBottom: rspH(1.4),
    backgroundColor: colors.lightGrey,
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

export default memo(FormSelector);
