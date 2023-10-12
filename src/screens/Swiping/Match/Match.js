import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Platform,
} from "react-native";
import React, {
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
  useCallback,
} from "react";
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
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { apiUrl } from "../../../constants";
import axios from "axios";
import {
  setProfiledata,
  setSessionExpired,
} from "../../../store/reducers/authentication/authentication";
import FormHeader from "../../../components/wrappers/formWrappers/FormHeader";
import Loader from "../../../components/loader/Loader";

import { initialWindowMetrics } from "react-native-safe-area-context";
import { UserContext } from "../../../context/user";
import {
  setMatches,
  setMatchesImgs,
} from "../../../store/reducers/chats/chats";
import { FemaleAvatar, MaleAvatar } from "../../../assets";
import { FlashList } from "@shopify/flash-list";
const insets = initialWindowMetrics.insets;

const Match = () => {
  const dispatch = useDispatch();

  const { newMsgRefresh, setnewMsgRefresh } = useContext(UserContext);

  const access_token = useSelector(
    (state) => state.authentication.access_token
  );
  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );

  const [match_list, setmatch_list] = useState([]);

  const [loading, setloading] = useState(false);

  const kp_mtch = profile_data?.userprofile?.keepmatchingnotification;
  const [keep_matching, setkeep_matching] = useState(kp_mtch);

  const [extendVisible, setextendVisible] = useState(false);

  const [extendTimeUser_ID, setextendTimeMatchID] = useState(0);

  const is_network_connected = useSelector(
    (state) => state.authentication.is_network_connected
  );

  const matches = useSelector((state) => state.chats.matches);
  const matches_imgs = useSelector((state) => state.chats.matches_imgs);

  const updateKeepMatching = async () => {
    // setloading(true);
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

      // setloading(false);

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

  const getMatches = async () => {
    const url = apiUrl + `activechatroomlist/`;
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    const data = {
      userprofileid: profile_data.userprofile.id,
    };

    try {
      const resp = await axios.post(url, data, { headers });
      // setloading(false);

      let code = resp.data.code;
      let resp_data = resp.data.data;
      
      if (code == 200) {
        let match_tmp = [];
        let matchs_imgs = [];
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
            let ym = resp_data[p].current_turn === lg_id ? false : true;

            mth.id = id;
            mth.lastMessage = lastMessage;
            mth.chat_id = chat_id;
            mth.no_of_extend = no_of_extend;
            mth.userprofile = mth_user.userprofile;

            let prf_img = mth_user.userprofile.image.find(
              (c) => c.position == 0
            );

            mth.matchType =
              lastMessage == "" ? "New Match" : ym ? "" : "Your move";
            mth.start_date = new Date(start_date);
            mth.expiry_date = new Date(expiry_date);
            mth.seen = seen_by.includes(lg_id);
            mth.user_id = mth_user.id;
            mth.for_user_id = profile_data.userprofile.id;
            mth.prof_img = prf_img?.cropedimage;
            mth.prof_rvl = resp_data[p].user1_profile_reveal;
            mth.publicprompts = mth_user.userprofile.publicprompts;
            mth.privateprompts = mth_user.userprofile.privateprompts;
            mth.tut = false;
            match_tmp.push(mth);
            mth.all_images = mth_user.userprofile.image;

            matchs_imgs.push([
              id,
              prf_img?.cropedimage,
              resp_data[p].user1_profile_reveal,
            ]);
          }
        }

        setmatch_list(match_tmp);
        dispatch(setMatches(match_tmp));
        dispatch(setMatchesImgs(matchs_imgs));
      } else if (resp_data.code == 401) {
        dispatch(setSessionExpired(true));
      }
    } catch (error) {
    }
  };

  const renderItem = useCallback(
    ({ item }) => {
      let prf_img = item.prof_rvl
        ? { uri: item.prof_img }
        : item.userprofile.gender == "Man"
        ? MaleAvatar
        : FemaleAvatar;

      return (
        <MatchItem
          item={item}
          visible={extendVisible}
          setVisible={setextendVisible}
          setextendTimeMatchID={setextendTimeMatchID}
          prf_img={prf_img}
        />
      );
    },
    [match_list]
  );

  const extendTime = async () => {
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

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    await axios
      .get(url, { headers })
      .then((resp) => {
        let code = resp.data.code;

        if (code == 200) {
          setextendTimeMatchID(0);
          getMatches();
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    setkeep_matching(kp_mtch);
  }, [kp_mtch]);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused

      if (is_network_connected) {
        getMatches();
      }

      if (matches.length > 0) {
        let c_user_matches = matches.filter(
          (v) => v.for_user_id == profile_data.userprofile.id
        );

        if (!is_network_connected && c_user_matches.length > 0) {
          setmatch_list(c_user_matches);
        }
      }
    }, [newMsgRefresh, is_network_connected])
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
              bouncesZoom={false}
              bounces={false}
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
    // backgroundColor:'red',
    height: scrn_height,
    width: scrn_width,
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
});
