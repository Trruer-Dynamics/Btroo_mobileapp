import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
import React, { useState, useLayoutEffect, useEffect } from "react";
import FormWrapper from "../../../components/wrappers/formWrappers/FormWrapper";

import MatchItem from "../../../components/screenComponents/matching/MatchItem";
import colors from "../../../styles/colors";
import {
  rspH,
  rspW,
  rspF,
  scrn_height,
  scrn_width,
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
    name: "Abhiroop",
    profession: "Teacher",
    age: 23,
    lastMessage: "Hello! How are you man?",
    matchType: "New Match",
    time: new Date("2023-4-14T10:24:00"),
    seen: false,
  },
  {
    id: "2",
    name: "David",
    profession: "Guardian",
    age: 25,
    lastMessage: "Hello! Do you know how to play guitar?",
    matchType: "Your Move",
    time: new Date("2023-4-13T16:14:00"),
    seen: true,
  },
  {
    id: "3",
    name: "Ronald",
    profession: "Footballer",
    age: 22,
    lastMessage: "Hello!",
    matchType: "Your Move",
    time: new Date("2023-4-13T12:52:00"),
    seen: false,
  },
];

const Match = () => {
  const dispatch = useDispatch();

  const access_token = useSelector(
    (state) => state.authentication.access_token
  );
  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );

  const [match_list, setmatch_list] = useState([]);

  const [loading, setloading] = useState(true);

  const [matching, setmatching] = useState([]);

  const kp_mtch = profile_data?.userprofile?.keepmatchingnotification;
  const [keep_matching, setkeep_matching] = useState(kp_mtch);

  const [extendVisible, setextendVisible] = useState(false);

  const [extendTimeUser_ID, setextendTimeMatchID] = useState(0);

  const updateKeepMatching = async () => {
    setloading(true);
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

      setloading(false);

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
        setloading(false);
        Alert.alert(
          "Error",
          "updateKeepMatching Some Error Occur" + resp.data.data
        );
      }
    } catch (error) {
      console.log("went wrong error", error);
      dispatch(setSessionExpired(true));
      Alert.alert("Error", "Something Went Wrong");
    }
  };

  const getMatches = async () => {
    setloading(true);
    const url = apiUrl + `activechatroomlist/`;

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    const data = {
      userprofileid: profile_data.userprofile.id,
    };

    try {
      const resp = await axios.post(url, data);
      setloading(false);

      let code = resp.data.code;
      let resp_data = resp.data.data;

      console.log("resp_data.length", resp_data.length);

      if (code == 200) {
        let match_tmp = [];

        if (resp_data.length > 0) {
          for (let p = 0; p < resp_data.length; p++) {
            let mth = {};

            let id = resp_data[p].id;
            let lastMessage = resp_data[p].last_message?.content
              ? resp_data[p].last_message.content
              : "";
            let chat_id = resp_data[p].chat_id;
            let user_1 = resp_data[p].user1;
            let user_2 = resp_data[p].user2;
            let start_date = resp_data[p].created_on;
            let expiry_date = resp_data[p].expiry_datetime;
            let no_of_extend = resp_data[p].number_of_extend;

            let mth_user =
              user_1.userprofile.id == profile_data.userprofile.id
                ? user_2
                : user_1;

            let seen_by =
              resp_data[p].last_message != null
                ? resp_data[p].last_message.seen_by
                : [];
            let lg_id = profile_data.user.id;

            let ym = resp_data[p].current_turn !== lg_id ? false : true;

            mth.id = id;
            mth.lastMessage = lastMessage;
            mth.chat_id = chat_id;
            mth.no_of_extend = no_of_extend;
            mth.userprofile = mth_user.userprofile;

            mth.matchType =
              lastMessage == "" ? "New Match" : ym ? "" : "Your move";
            mth.start_date = new Date(start_date);
            mth.expiry_date = new Date(expiry_date);
            mth.seen = seen_by.includes(lg_id);
            mth.user_id = mth_user.id;
            mth.prof_img = mth_user.userprofile.image[0].cropedimage;
            mth.prof_rvl = resp_data[p].user1_profile_reveal;
            mth.publicprompts = mth_user.userprofile.publicprompts;
            mth.privateprompts = mth_user.userprofile.privateprompts;
            (mth.tut = false), match_tmp.push(mth);
            mth.all_images = mth_user.userprofile.image;
          }
        }

        setmatch_list(match_tmp);
      } else if (resp_data.code == 401) {
        dispatch(setSessionExpired(true));
      } else {
        Alert.alert("Error", "Some Error Occur" + resp.data.data);
      }
    } catch (error) {
      setloading(false);
      dispatch(setSessionExpired(true));
      console.log("went wrong error", error);

      Alert.alert("Error", "Something Went Wrong");
    }
  };

  const renderItem = ({ item }) => {
    return (
      <MatchItem
        item={item}
        visible={extendVisible}
        setVisible={setextendVisible}
        setextendTimeMatchID={setextendTimeMatchID}
      />
    );
  };

  const extendTime = async () => {
    // let tmstmp =  new Date().toLocaleString().slice(0,-2).trim().split(',')
    let tmstmp = new Date().toISOString().slice(0, -5).split("T");

    let date = tmstmp[0];
    let time = tmstmp[1];

    let fn_date = date + " " + time;

    let url =
      apiUrl +
      "chatroomextendapi/" +
      extendTimeUser_ID +
      "?user_id=" +
      profile_data.user.id +
      "&timestamp=" +
      fn_date;

    await axios
      .get(url)
      .then((resp) => {
        let code = resp.data.code;

        if (code == 200) {
          setextendTimeMatchID(0);
          getMatches();
        }
      })
      .catch((err) => {
        dispatch(setSessionExpired(true));
        console.log("extendTime err", err);
      });
  };

  useEffect(() => {
    setkeep_matching(kp_mtch);
  }, [kp_mtch]);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      getMatches();
    }, [])
  );

  return (
    <>
      {loading && <Loader />}
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
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
              data={match_list}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />

            <View
              style={{
                ...styles.bottomCont,
                position: "absolute",
                top: rspH(Platform.OS == "ios" ? 66 : 69) + insets.top,
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
          </SafeAreaView>
        </FormWrapper>
        {/* Extend Time Modal */}
        <CentralModal
          modalVisible={extendVisible}
          setModalVisible={setextendVisible}
        >
          <ExtendTime
            setModalVisible={setextendVisible}
            extendTime={extendTime}
          />
        </CentralModal>
      </SafeAreaView>
    </>
  );
};

export default Match;

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
    // backgroundColor:'red',

    // marginBottom: rspH(Platform.OS == 'ios' ? 7 : 11),
  },
  bottomContTxt: {
    color: colors.black,
    fontFamily: fontFamily.bold,
    fontSize: rspF(2.68),
    lineHeight: rspF(2.72),
    letterSpacing: 1,
  },
});
