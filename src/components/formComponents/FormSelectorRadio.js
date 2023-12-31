import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
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
import ADIcon from "react-native-vector-icons/AntDesign";
import FormWrapperFooter from "../wrappers/formWrappers/FormWrapperFooter";
import ErrorContainer from "./ErrorContainer";
import FooterBtn from "../Buttons/FooterBtn";
import { useSelector } from "react-redux";
import truncateStr from "../functions/truncateStr";

const FormSelectorRadio = ({
  headtitle = "",
  list,
  setlist = null,
  refresh,
  setrefresh,
  setchanges_made = null,
}) => {
  const [code_press, setcode_press] = useState(false);

  const selected_habits = useSelector((state) => state.filter.selected_habits);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setcode_press(true);
        }}
        style={{
          ...styles.selectorCont,
        }}
      >
        <View>
          <View style={styles.headTitleCont}>
            <Text style={styles.headTitle}>{headtitle}</Text>
          </View>

          <View>
            <Text style={styles.selectedOpt} numberOfLines={1}>
              {truncateStr(
                list
                  .filter((g) => !(!g[1] && !g[2]))
                  .map((v, idx) => {
                    let v_t = String(v[1] ? v[0] : "");
                    let v_f = String(v[2] ? "Not " + v[0] : "");
                    let dec2 =
                      v_t + String(v_t != "" && v_f != "" ? ", " : "") + v_f;

                    return dec2;
                  })
                  .join(", "),
                34
              )}
            </Text>
          </View>
        </View>

        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <ADIcon size={20} name="right" color={colors.blue} />
        </View>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={false} visible={code_press}>
        <View style={{ height: scrn_height }}>
          <SafeAreaView>
            <FormComponentsWrapper
              containerStyle={{
                paddingTop: rspH(2.35),
              }}
            >
              <FormComponentsWrapperHeader
                title={"Habits"}
                visible={code_press}
                setvisible={() => {
                  setcode_press(!code_press);

                  setlist([
                    ["Smoking", selected_habits[0][0], selected_habits[0][1]],
                    ["Drinking", selected_habits[1][0], selected_habits[1][1]],
                    ["Marijuana", selected_habits[2][0], selected_habits[2][1]],
                  ]);
                }}
                marginBottom={0}
              />

              <View style={styles.centeredView}>
                <View style={{ width: scrn_width / 1.5 }}>
                  {/* Radio Btn Label */}
                  <View style={styles.radioCont}>
                    {/* Habits */}
                    <View>
                      <Text style={styles.radioTxt}>{""}</Text>
                    </View>

                    {/* Chioce */}
                    <View style={styles.radioBtnCont}>
                      <TouchableOpacity>
                        <Text
                          style={{
                            ...styles.radioBtnLabel,
                          }}
                        >
                          {" "}
                          Yes
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Text
                          style={{
                            ...styles.radioBtnLabel,
                            marginRight: rspW(1),
                          }}
                        >
                          No
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {list.map((itm, idx) => {
                    return (
                      <View key={idx} style={styles.radioCont}>
                        {/* Habits */}
                        <View>
                          <Text style={styles.radioTxt}>{itm[0]}</Text>
                        </View>

                        {/* Chioce */}
                        <View style={styles.radioBtnCont}>
                          <TouchableOpacity
                            onPress={() => {
                              list[idx][1] =
                                list[idx][1] != null
                                  ? list[idx][1]
                                    ? false
                                    : true
                                  : true;

                              setrefresh(!refresh);
                            }}
                            style={{
                              backgroundColor:
                                list[idx][1] != null
                                  ? list[idx][1]
                                    ? colors.blue
                                    : colors.grey
                                  : colors.grey,
                              ...styles.radioBtn,
                            }}
                          ></TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              list[idx][2] =
                                list[idx][2] != null
                                  ? list[idx][2]
                                    ? false
                                    : true
                                  : true;

                              setrefresh(!refresh);
                            }}
                            style={{
                              backgroundColor:
                                list[idx][2] != null
                                  ? list[idx][2]
                                    ? colors.blue
                                    : colors.grey
                                  : colors.grey,
                              ...styles.radioBtn,
                            }}
                          ></TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>

                {/* Confirm Btn */}
              </View>
              <FormWrapperFooter>
                {/* Error Show Here */}

                <ErrorContainer error_msg="" />

                {/* Next Btn To Navigate to Next Form Components */}
                <FooterBtn
                  title={"Confirm"}
                  disabled={
                    !(
                      String(list[0].slice(1, 3)) !=
                        String(selected_habits[0]) ||
                      String(list[1].slice(1, 3)) !=
                        String(selected_habits[1]) ||
                      String(list[2].slice(1, 3)) != String(selected_habits[2])
                    )
                  }
                  onPress={() => {
                    let smok_c =
                      String(list[0].slice(1, 3)) != String(selected_habits[0]);
                    let drik_c =
                      String(list[1].slice(1, 3)) != String(selected_habits[1]);
                    let marij_c =
                      String(list[2].slice(1, 3)) != String(selected_habits[2]);

                    if (smok_c || drik_c || marij_c) {
                      setchanges_made(true);
                      setcode_press(false);
                    }
                  }}
                />
              </FormWrapperFooter>
            </FormComponentsWrapper>
          </SafeAreaView>
        </View>
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
    backgroundColor: colors.grey,
    borderRadius: rspW(1.3),
  },
  title: {
    fontSize: rspF(1.76),
  },

  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: rspH(3),
    height: rspH(Platform.OS == "ios" ? 70 : 76),
  },

  selectorCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: rspH(2),
  },
  headTitleCont: {
    marginBottom: rspH(0.6),
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
  },
  listCont: {
    height: scrn_height / 1.65,
    marginBottom: rspH(1.2),
  },

  // radio Btn Styling
  radioCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: rspW(5.1),
    marginBottom: rspH(0.6),
  },
  radioTxt: {
    fontFamily: fontFamily.medium,
    color: colors.black,
    fontSize: rspF(2.02),
    lineHeight: rspF(2.1),
  },
  radioBtnCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: rspW(23.6),
  },
  radioBtn: {
    width: rspW(6.34),
    height: rspH(3),
    borderRadius: rspW(1.3),
  },
  radioBtnLabel: {
    fontSize: rspF(1.302),
    fontFamily: fontFamily.bold,
    lineHeight: rspF(1.31),
    color: colors.black,
    textAlign: "center",
    letterSpacing: 1,
  },

  headerTitle: {
    fontFamily: fontFamily.bold,
    fontSize: rspF(3.2),
    color: colors.black,
    lineHeight: rspF(3.21),
    letterSpacing: 1,
  },
});

export default FormSelectorRadio;
