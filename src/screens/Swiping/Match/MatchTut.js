import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
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
import { initialWindowMetrics } from "react-native-safe-area-context";
const insets = initialWindowMetrics.insets;

const DATA = [
  {
    id: "1",
    userprofile: { name: "bTroo", age: "44", occupation: "Teacher" },
    profession: "Teacher",
    age: 23,
    lastMessage: "Hello! How are you man?",
    matchType: "Your Turn",
    time: new Date("2023-4-14T10:24:00"),
    seen: false,
    tut: true,
  },
];

const MatchTut = () => {
  const dispatch = useDispatch();

  const access_token = useSelector(
    (state) => state.authentication.access_token
  );
  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );

  const [loading, setloading] = useState(false);

  const [keep_matching, setkeep_matching] = useState(true);

  const [extendVisible, setextendVisible] = useState(false);

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
      } else {
        console.log("Error", "Some Error Occur" + resp.data.data)
        
      }
    } catch (error) {
      console.log("went wrong error", error);
      dispatch(setSessionExpired(true));
   
    }
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
      console.log("matchTutDone error", error);
      dispatch(setSessionExpired(true));
      return false;
    }
  };

  const renderItem = ({ item }) => {
    return (
      <MatchItem
        item={item}
        visible={extendVisible}
        setVisible={setextendVisible}
      />
    );
  };

  return (
    <>
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

          <View
            style={{
              ...styles.bottomCont,
              position: "absolute",
              top: rspH(Platform.OS == "ios" ? 76 : 80) + insets.top,
              alignSelf: "center",
            }}
          >
            <View style={{ marginRight: rspW(2.5) }}>
              <Text style={styles.bottomContTxt}>Keep matching</Text>
            </View>

            <Switch
              value={keep_matching}
              // onValueChange={() => setkeep_matching(!keep_matching)}
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
          </View>
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
            <View style={styles.centralModalContMatch}>
              <View style={styles.centralModalTextCont}>
                <Text style={styles.centralModalText}>
                  Any conversation lasts 72{"\n"}hours. However, you can{"\n"}
                  always extend it by{"\n"}clicking here if you feel{"\n"}that
                  you and your match{"\n"}need some more time.
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
                    matchTutDone();
                  }}
                  style={{
                    ...styles.centralModalTextNextCont,
                    marginVertical: 12,
                  }}
                >
                  <Text style={styles.centralModalTextNext}>{"OK"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

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
        </>
      </SafeAreaView>
    </>
  );
};

export default MatchTut;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: '100%',
    // height: scrn_height/2,
    justifyContent: "space-between",
    alignItems: "center",
  },

  bottomCont: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // bottom: rspH(12),
    // backgroundColor:'red',
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
    // flex:1,
    // alignSelf:'center',
  },

  centralModalTextCont: {
    marginTop: rspH(3),
  },
  centralModalText: {
    fontSize: rspF(Platform.OS == "ios" ? 2.485 : 2.5),
    lineHeight: rspF(Platform.OS == "ios" ? 3.56 : 3),
    fontFamily: fontFamily.bold,
    color: colors.black,
  },

  centralModalTextNextCont: {
    justifyContent: "center",
    marginHorizontal: rspW(3.1),
    paddingHorizontal: 13.2,
    marginVertical: rspH(1.4),
    height: rspH(4.6),
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
    height: rspH(35),
    width: rspW(87),
    borderRadius: rspW(4),
    backgroundColor: colors.white,
    top: rspH(45),
    top: scrn_height / 2.4,
    alignSelf: "center",
    paddingHorizontal: rspW(7.4),
    justifyContent: "space-between",
  },

  // Match Chat
  highCont: {
    position: "absolute",
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  timeHighCont: {
    // top: rspH(19.4),
    // top: Platform.OS == 'android' ?srn_height/6.92: srn_height/5.1,
    // top: Platform.OS == 'android' ?rspH(10.76) + insets.top: srn_height/5.1,
    top: Platform.OS == "android" ? rspH(10.2) + insets.top : srn_height / 5.1,

    right: rspW(12),
    width: rspW(22.2),
    height: rspH(2.75),
    borderRadius: rspH(1.5),
  },
  timeDoneTxt: {
    fontSize: rspF(Platform.OS == "ios" ? 1.3 : 1.15),
    lineHeight: rspF(1.31),
    fontFamily: fontFamily.light,
  },

  profilePhoto: {
    width: rspW(12.56),
    height: rspW(12.56),
  },
});
