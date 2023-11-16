import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import FormWrapper from "../../../components/wrappers/formWrappers/FormWrapper";
import MatchItem from "../../../components/screenComponents/matching/MatchItem";
import colors from "../../../styles/colors";
import {
  rspH,
  rspW,
  rspF,
  scrn_height,
  scrn_width,
  srn_height,
} from "../../../styles/responsiveSize";
import fontFamily from "../../../styles/fontFamily";
import { Switch } from "react-native-switch";
import CentralModal from "../../../components/modals/CentralModal";
import ExtendTime from "../../../components/screenComponents/matching/ExtendTime";
import { useDispatch, useSelector } from "react-redux";
import { setMatchTut } from "../../../store/reducers/tutorial/tutorial";
import { apiUrl } from "../../../constants";
import axios from "axios";
import {
  setProfiledata,
  setSessionExpired,
} from "../../../store/reducers/authentication/authentication";
import FormHeader from "../../../components/wrappers/formWrappers/FormHeader";
import Loader from "../../../components/loader/Loader";

import { useNavigation } from "@react-navigation/native";
import { FemaleAvatar } from "../../../assets";
import FastImage from "react-native-fast-image";
import FAIcon from "react-native-vector-icons/FontAwesome";
import { initialWindowMetrics } from "react-native-safe-area-context";
import OffflineAlert from "../../../components/functions/OfflineAlert";
const insets = initialWindowMetrics.insets;

const DATA = [
  {
    id: "1",
    userprofile: {
      name: "bTroo",
      age: "25",
      occupation: "Teacher",
      gender: "Female",
    },
    profession: "Teacher",
    age: 23,
    lastMessage: "Hello! How are you man?",
    matchType: "Your Turn",
    time: new Date("2023-4-14T10:24:00"),
    seen: false,
    tut: true,
  },
];

const MatchTut = ({ repeat_tut }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const access_token = useSelector(
    (state) => state.authentication.access_token
  );
  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );

  const is_network_connected = useSelector(
    (state) => state.authentication.is_network_connected
  );

  

  const [loading, setloading] = useState(false);

  const [keep_matching, setkeep_matching] = useState(true);

  const [extendVisible, setextendVisible] = useState(false);

  const [show_alert, setshow_alert] = useState(false)
  
  const [match_tut_para, setmatch_tut_para] = useState([
    `Matches are created each \nmorning if someone you \nfancy has also fancied you \nback. You can talk to up to \nthree matches at any \ngiven time. Don’t worry, \nyou won’t lose any of the \nother matches.`,
    `Any conversation lasts 72 \nhours. However, you can \nalways extend it by \nclicking here if you feel \nthat you and your match \nneed some more time.`,
  ]);
  const [match_tut_step, setmatch_tut_step] = useState(0);

  const updateKeepMatching = async () => {
    const url =
      apiUrl + `keep_matching_notification_update/${profile_data.user.id}`;

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    try {
      const resp = await axios.put(
        url,
        {
          keep_matching_notification: !keep_matching,
        },
        {
          headers,
        }
      );

      let status = resp.data.status;

      if (resp.data.code == 200) {
        setkeep_matching(!keep_matching);

        let update_prof = {
          ...profile_data,
          userprofile: {
            ...profile_data.userprofile,
            keepmatchingnotification: !keep_matching,
          },
        };

        dispatch(setProfiledata(update_prof));
      } else if (resp.data.code == 401) {
        dispatch(setSessionExpired(true));
      }
    } catch (error) {}
  };

  const matchTutDone = async () => {
    setloading(true);
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    const data = {
      user_id: profile_data.user.id,
    };

    try {
      const response = await axios.post(
        apiUrl + "matching_tutorial_view/",
        data,
        {
          headers,
        }
      );
      setloading(false);

      let resp_data = response.data;

      if (resp_data.code == 200) {
        dispatch(setMatchTut(false));
      } else if (resp_data.code == 401) {
        dispatch(setSessionExpired(true));
      }
    } catch (error) {
      setloading(false);
      return false;
    }
  };

  const renderItem = ({ item }) => {
    let prf_img = FemaleAvatar;
    return (
      <MatchItem
        item={item}
        visible={extendVisible}
        setVisible={setextendVisible}
        prf_img={prf_img}
      />
    );
  };

  useEffect(() => {
    if (is_network_connected) {
      setshow_alert(false)
    }
  }, [is_network_connected])
  
  

  return (
    <>
   <OffflineAlert offAlert={show_alert} />
      {loading && <Loader />}
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#fff" }}
        bounces={false}
      >
        <FormWrapper
          statusBarColor={colors.white}
          barStyle={"dark-content"}
          containerStyle={{
            paddingHorizontal: 0,
            paddingTop: rspH(2.35),
          }}
        >
          <FormHeader title="Matches" para={``} />

          <SafeAreaView style={styles.container}>
            <FlatList
              data={DATA}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          </SafeAreaView>

          <SafeAreaView
            style={{
              ...styles.bottomCont,
              position: "absolute",
              top:Platform.OS == "ios"? rspH(86) - insets.top: rspH(80) + insets.top,
              alignSelf: "center",
            }}
          >
            <View style={{ marginRight: rspW(2.5) }}>
              <Text style={styles.bottomContTxt}>Keep matching</Text>
            </View>

            <Switch
              value={keep_matching}
              onValueChange={() => {
                updateKeepMatching();
              }}
              disabled={false}
              circleSize={18}
              barHeight={24}
              circleBorderWidth={0}
              backgroundActive={colors.blue}
              backgroundInactive={colors.grey}
              circleActiveColor={"#fff"}
              circleInActiveColor={"#fff"}
              changeValueImmediately={true}
              innerCircleStyle={{
                alignItems: "center",
                justifyContent: "center",
              }}
              outerCircleStyle={{}}
              renderActiveText={false}
              renderInActiveText={false}
              switchLeftPx={2}
              switchRightPx={2}
              switchWidthMultiplier={2.5}
              switchBorderRadius={12}
            />
          </SafeAreaView>
        </FormWrapper>
        {/* Extend Time Modal */}
        <CentralModal
          modalVisible={extendVisible}
          setModalVisible={setextendVisible}
        >
          <ExtendTime setModalVisible={setextendVisible} />
        </CentralModal>

        {/* Match Chat Tutorial */}

          <>
          <View style={styles.mainTutCont}>
            <View
              style={{
                ...styles.centralModalContMatch,
                height:
                  match_tut_step == 0
                    ? Platform.OS == "ios"  ? rspH(41) : rspH(40) + insets.bottom
                    : Platform.OS == 'ios' ? rspH(36) : rspH(36) + insets.bottom,
              }}
            >
              <View style={{ ...styles.centralModalTextCont }}>
                <Text style={styles.centralModalText}>
                  {match_tut_para[match_tut_step]}
                </Text>
              </View>

              <View>
                <View
                  style={{
                    borderBottomColor: colors.grey,
                    borderBottomWidth: rspH(0.24),
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    if (match_tut_step == 0) {
                      setmatch_tut_step(1);
                    } else {
                      if (repeat_tut) {
                        navigation.navigate("Chat", {
                          repeat_tut: true,
                          reveal: false,
                          profile: {
                            userprofile: { name: "bTroo" },
                          },
                        });
                      } else {
                        if (is_network_connected) {
                          matchTutDone();  
                        }
                       else{
                        setshow_alert(true)
                       }
                        
                      }
                    }
                  }}
                  style={{
                    ...styles.centralModalTextNextCont,
                    marginVertical: 12,
                  }}
                >
                  <Text style={styles.centralModalTextNext}>
                    {match_tut_step == 0 ? "Next" : "Ok"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {match_tut_step == 0 ? (
            <View style={[styles.highCont, styles.matchitem_cont]}>
              <View style={[styles.item]}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <FastImage
                    source={FemaleAvatar}
                    style={styles.profileImage}
                  />
                  <View>
                    <Text style={styles.profileName}>
                      bTroo
                      {", "}
                      25
                    </Text>

                    <Text style={styles.profileProfession}>Teacher</Text>

                    <Text style={styles.profileMessage}>Hello How are y..</Text>
                  </View>
                </View>

                <View style={styles.rightCont}>
                  <View
                    style={{
                      ...styles.matchTypeCont,
                      justifyContent: "center",
                    }}
                  >
                    <View style={{ marginRight: rspW(1) }}>
                      <Text style={{ ...styles.matchTypeContTxt }}>
                        Your Turn
                      </Text>
                    </View>

                    <FAIcon name={"envelope"} size={10} color={colors.white} />
                  </View>

                  <View />
                  <View
                    style={{
                      position: "absolute",
                      bottom: rspH(Platform.OS == "ios" ? 0.6 : 0.6),
                      width: rspW(23),
                    }}
                  >
                    <Text
                      style={{
                        ...styles.timeDoneTxt,
                        color: colors.black,
                      }}
                    >
                      72 Hours Left
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View style={{ ...styles.highCont, ...styles.timeHighCont }}>
              <Text
                style={{
                  ...styles.timeDoneTxt,
                  color: colors.black,
                }}
              >
                72 Hours Left
              </Text>
            </View>
          )}
        </>
      </SafeAreaView>
    </>
  );
};

export default MatchTut;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },

  bottomCont: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContTxt: {
    color: colors.black,
    fontFamily: fontFamily.bold,
    fontSize: rspF(2.68),
    lineHeight: rspF(2.72),
    letterSpacing: 1,
  },
  // Tutorial Main Container
  mainTutCont: {
    position: "absolute",
    backgroundColor: "#0000006f",
    top: 0,
    height: scrn_height,
    width: scrn_width,
  },

  centralModalTextCont: {
    marginTop: rspH(3),
  },
  centralModalText: {
    fontSize: rspF(Platform.OS == "ios" ? 2.485 : 2.5),
    lineHeight: rspF(Platform.OS == "ios" ? 3.56 : 3.5),
    fontFamily: fontFamily.bold,
    color: colors.black,
  },

  centralModalTextNextCont: {
    justifyContent: "center",
    marginHorizontal: rspW(3.1),
    paddingHorizontal: 13.2,
    marginVertical: rspH(1.4),
    height:  rspH(4.6),
    width: rspW(69.6),
    letterSpacing: 1,
  },

  centralModalTextNext: {
    fontSize: rspF(2.02),
    lineHeight: rspF(2.1),
    fontFamily: fontFamily.bold,
    color: colors.blue,
    letterSpacing: 1,
  },

  // Match Chat Tut
  centralModalContMatch: {
    position: "absolute",
    width: rspW(87),
    borderRadius: rspW(4),
    backgroundColor: colors.white,
    top: Platform.OS == "ios" ? rspH(36) + insets.top : rspH(40) - insets.bottom,
    alignSelf: "center",
    paddingHorizontal: rspW(7.4),
    justifyContent: "space-between",
  },

  // Match Chat
  highCont: {
    position: "absolute",
    backgroundColor: colors.white 
    + 'ff',
    alignItems: "center",
    justifyContent: "center",
  },
  matchitem_cont: {
    top: Platform.OS == "android" ? rspH(8.3) + insets.bottom/3  : rspH(8.2) + insets.top,
    width: rspW(86),
    height: rspH(11.6),
    alignSelf: "center",
    borderRadius: rspW(2.5),
  },
  timeHighCont: {
    // top: Platform.OS == "android" ? rspH(11) + insets.top : srn_height / 5.1,
    top: Platform.OS == "android" ?
     rspH(14.7) + insets.bottom /3 
     : rspH(14.6) + insets.top,
    right: rspW(12),
    width: rspW(22.2),
    height: rspH(2.75),
    borderRadius: rspH(1.5),
  },
  timeDoneTxt: {
    fontSize: rspF(Platform.OS == "ios" ? 1.3 : 1.15),
    lineHeight: rspF(1.31),
    fontFamily: fontFamily.light,
    textAlign: "center",
  },

  profilePhoto: {
    width: rspW(12.56),
    height: rspW(12.56),
  },

  item: {
    position: "relative",
    // width: rspW(81.3),
    width: rspW(81.3),
    height: rspH(9.64),
    borderRadius: rspW(2.5),
    borderWidth: rspW(0.8),
    borderColor: colors.blue,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: rspW(2.5),
    backgroundColor: "#fff",
    // marginBottom: rspH(2.9),

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  profileImage: {
    width: rspW(10),
    height: rspW(10),
    marginRight: rspW(2.5),
    borderRadius: rspW(5),
  },
  profileName: {
    fontSize: rspF(2.38),
    color: colors.black,
    fontFamily: fontFamily.bold,
    lineHeight: rspF(2.42),
    letterSpacing: Platform.OS == "ios" ? 0 : 1,
  },
  profileProfession: {
    fontSize: rspF(2.02),
    color: colors.black,
    fontFamily: fontFamily.regular,
    lineHeight: rspF(2.1),
  },
  profileMessage: {
    fontSize: rspF(1.1),
    color: colors.black,
    fontFamily: fontFamily.regular,
    lineHeight: rspF(Platform.OS == "ios" ? 2 : 1.6),
  },
  rightCont: {
    justifyContent: "space-around",
    alignItems: "center",
  },
  matchTypeCont: {
    width: rspW(20.9),
    height: rspH(1.9),
    borderRadius: rspW(1),
    backgroundColor: colors.blue,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rspW(2),
    paddingVertical: rspH(0.25),
  },
  matchTypeContTxt: {
    color: colors.white,
    fontSize: rspF(1.302),
    lineHeight: rspF(1.31),
    fontFamily: fontFamily.bold,
  },
});
