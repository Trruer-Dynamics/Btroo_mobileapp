import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Animated,
  FlatList,
  Image,
} from "react-native";
import ADIcon from "react-native-vector-icons/AntDesign";
import React, { useState, useLayoutEffect, useRef, useContext } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import colors from "../../../styles/colors";
import {
  rspF,
  rspH,
  rspW,
  scrn_height,
  scrn_width,
} from "../../../styles/responsiveSize";
import fontFamily from "../../../styles/fontFamily";
import {
  Backward,
  DrinkingNo,
  DrinkingYes,
  FemaleAvatar,
  MarijuanaNo,
  MarijuanaYes,
  SmokingNo,
  SmokingYes,
} from "../../../assets";
import { apiUrl } from "../../../constants";
import FormHeader from "../../../components/wrappers/formWrappers/FormHeader";
import FullModal from "../../../components/modals/FullModal";
import ReportUnmatch from "../../../components/screenComponents/swiping/Report/ReportUnmatch";
import FooterBtn from "../../../components/Buttons/FooterBtn";
import Report from "../../../components/screenComponents/swiping/Report/Report";
import FormWrapperFooter from "../../../components/wrappers/formWrappers/FormWrapperFooter";
import Loader from "../../../components/loader/Loader";
import truncateStr from "../../../components/functions/truncateStr";
import CentralModal from "../../../components/modals/CentralModal";
import ExtendTime from "../../../components/screenComponents/matching/ExtendTime";
import { setSessionExpired } from "../../../store/reducers/authentication/authentication";
import Paginator from "../../../components/screenComponents/swiping/Paginator";
import FastImage from "react-native-fast-image";
import { setCurrentScreen } from "../../../store/reducers/screen/screen";
import { UserContext } from "../../../context/user";
import OffflineAlert from "../../../components/functions/OfflineAlert";
import * as icn from "../../../assets";
import HScroller from "../../../components/formComponents/HScroller";
import HScrollerWS from "../../../components/formComponents/HScrollerWS";
import HScrollerMulti from "../../../components/formComponents/HScrollerMulti";

const Item2 = ({ item }) => {
  let imageUri = String(item.image);

  return (
    <View style={styles.item2}>
      <FastImage
        source={{ uri: imageUri }}
        style={{ width: "100%", height: "98%" }}
        resizeMode="contain"
      />
    </View>
  );
};

const MatchProfile = ({ route }) => {
  const navigation = useNavigation();
  const { profile } = route.params;
  const [loading, setloading] = useState(false);

  const [lis1, setlis1] = useState([]);
  const [lis2, setlis2] = useState([]);
  const [lis3, setlis3] = useState([]);
  const [lis4, setlis4] = useState([]);

  const is_network_connected = useSelector(
    (state) => state.authentication.is_network_connected
  );

  // Report Control
  const [openReport, setopenReport] = useState(false);
  const [reportConfirm, setreportConfirm] = useState(false);
  const [report, setreport] = useState("");
  const [action, setaction] = useState("");
  const [actionNo, setactionNo] = useState(1);

  const [languages, setlanguages] = useState([
    "English",
    "Hindi",
    "Hebrew",
    "Hazaragi",
    "Polish",
    "Dutch",
    "Arab",
    "Urdu",
  ]);

  const access_token = useSelector(
    (state) => state.authentication.access_token
  );
  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );

  const [modalVisible, setmodalVisible] = useState(false);
  const [currentIndex2, setcurrentIndex2] = useState(0);
  const scrollX2 = useRef(new Animated.Value(0)).current;
  const slidesRef2 = useRef(null);
  const viewableItemsChanged2 = useRef(({ viewableItems }) => {
    setcurrentIndex2(viewableItems[0]?.index);
  }).current;
  const viewConfig2 = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const [pets_list, setpets_list] = useState([]);
  const [interest_list, setinterest_list] = useState([]);
  const [leftHrs, setleftHrs] = useState("");

  const [prv_prmt, setprv_prmt] = useState([]);
  const [pup_prmt, setpup_prmt] = useState([]);

  const [extendVisible, setextendVisible] = useState(false);

  const dispatch = useDispatch();

  const extendTime = async () => {
    let tmstmp = new Date().toISOString().slice(0, -5).split("T");

    let date = tmstmp[0];
    let time = tmstmp[1];

    let fn_date = date + " " + time;

    let url =
      apiUrl +
      "chatroomextendapi/" +
      profile.id +
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
          setleftHrs(leftHrs + 48);
        }
      })
      .catch((err) => {});
  };

  const { sckop, c_scrn } = useContext(UserContext);

  const unmatchProfile = async () => {
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    const data = {
      chat_id: profile.chat_id,
    };

    try {
      const response = await axios.post(apiUrl + "unmatch_chatroom/", data, {
        headers,
      });

      let resp_data = response.data;
      if (resp_data.code == 200) {
        navigation.navigate("Match");
      } else if (resp_data.code == 401) {
        dispatch(setSessionExpired(true));
      }
    } catch (error) {
      return false;
    }
  };

  const reportProfile = async () => {
    const data = {
      user_id: profile_data.user.id,
      user_profile_id: profile.userprofile.id,
      report_type: report,
    };

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    try {
      const response = await axios.post(apiUrl + "user_report_view/", data, {
        headers,
      });
      let resp_data = response.data;
      setreport("");
      if (resp_data.code == 200) {
        setreportConfirm(true);
      } else if (resp_data.code == 401) {
        dispatch(setSessionExpired(true));
      }
    } catch (error) {
      setreport("");
      return false;
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      let tmp_lis1 = [
        [icn.Cake, profile_data?.userprofile?.age],
        [icn.City, profile_data?.userprofile?.city.split(",")[0]],
        [icn.Education, profile_data?.userprofile?.education],
        [icn.Occupation, profile_data?.userprofile?.occupation],
        [icn.PHeight, profile_data?.userprofile?.height],
        [icn.Politics, profile_data?.userprofile?.politicalinclination],
      ];

      setlis1(tmp_lis1);

      let usr_pets = profile_data?.userpets.map((v) => [
        v.petmaster.id,
        v.petmaster.iconblue,
        v.petmaster.pets,
      ]);

      setpets_list(usr_pets);

      let usr_pets2 = [];

      if (profile.prof_rvl) {
        for (const pet of usr_pets) {
          let img1 = pet[2];
          if (pet[2].split(" ").length > 1) {
            let itmlis = pet[2].split(" ");
            img1 = itmlis.join("");
          }

          let imgt = icn[`${img1}Blue`];

          usr_pets2.push(imgt);
        }
      }

      let tmp_lis2 = [];
      if (usr_pets2.length > 0) {
        let petitm = { title: "Pets", values: usr_pets2 };
        tmp_lis2.push(petitm);
      }

      let usr_interest = profile_data?.userinterest.map((v) => [
        v.interestmaster.id,
        v.interestmaster.iconblue,
        v.interestmaster.interest,
      ]);

      setinterest_list(usr_interest);

      let usr_ints2 = [];

      for (const intr of usr_interest) {
        let img2 = intr[2];
        if (intr[2].split(" ").length > 1) {
          let itmlis = intr[2].split(" ");
          img2 = itmlis.join("");
        }

        let imgt2 = icn[`${img2}Blue`];

        usr_ints2.push(imgt2);
      }

      let interestitm = { title: "Interests", values: usr_ints2 };

      tmp_lis2.push(interestitm);

      setlis2(tmp_lis2);

      let tmp_lis3 = [
        [
          profile_data?.userprofile?.drinking ? DrinkingYes : DrinkingNo,
          profile_data?.userprofile?.drinking ? "Drinking" : "Not Drinking",
        ],
        [
          profile_data?.userprofile?.smoking ? SmokingYes : SmokingNo,
          profile_data?.userprofile?.smoking ? "Smoking" : "Not Smoking",
        ],
        [
          profile_data?.userprofile?.marijuana ? MarijuanaYes : MarijuanaNo,
          profile_data?.userprofile?.marijuana ? "Drugs" : "No Drugs",
        ],
      ];

      setlis3(tmp_lis3);

      let lang_tmp = profile_data?.userlanguages.map(
        (v) => v?.languagemaster?.language
      );

      setlanguages(lang_tmp);

      let tmp_lis4 = [];
      for (const lng of lang_tmp) {
        let lngitm = [icn.LangIcon, lng];
        tmp_lis4.push(lngitm);
      }

      setlis4(tmp_lis4);

      let pub_prompt = profile?.userprofile?.publicprompts;
      setpup_prmt(pub_prompt);

      let priv_prompt = profile?.userprofile?.privateprompts;
      setprv_prmt(priv_prompt);

      let hours = Math.round((profile?.expiry_date - new Date()) / 36e5);

      setleftHrs(hours);

      return () => {
        // Do something when the screen is unfocused
      };
    }, [profile_data])
  );

  useLayoutEffect(() => {
    if (report != "") {
      reportProfile();
    }
  }, [report]);

  // Full Screen Carosel Item Render Function
  const renderItem2 = ({ item, index }) => {
    return (
      <Item2
        item={item}
        index={index}
        currentIndex2={currentIndex2}
        setmodalVisible={setmodalVisible}
      />
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      c_scrn.current = "MatchProfile";
      dispatch(setCurrentScreen(route.name));
      return () => {};
    }, [])
  );

  return (
    <>
      {loading && <Loader />}
      <OffflineAlert offAlert={!is_network_connected} />
      <View style={{ height: scrn_height, backgroundColor: "#fff" }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View
            style={{
              paddingTop: rspH(3),
              paddingHorizontal: rspW(5),
            }}
          >
            <FormHeader
              title={
                (profile?.userprofile?.name.split(" ")[0].length < 12
                  ? profile?.userprofile?.name.split(" ")[0]
                  : truncateStr(profile?.userprofile?.name.split(" ")[0], 11))
                
              }
              para=""
            paraTp={0}

              left_icon={true}
              onPress={() => {
                if (!profile.prof_rvl) {
                  navigation.goBack();
                } else {
                  navigation.navigate("Chat", {
                    profile: profile,
                  });
                }
              }}
              rightComp={() => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setopenReport(true);
                    }}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: rspH(0),
                      alignSelf: "flex-start",
                      justifyContent: "center",
                      alignItems: "center",
                      height: rspW(7.6),
                      width: rspW(7.6),
                      borderRadius: rspW(3.8),
                      ...styles.dotsCont,
                    }}
                  >
                    <View style={styles.dots} />
                    <View style={styles.dots} />
                    <View style={styles.dots} />
                  </TouchableOpacity>
                );
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              backgroundColor: colors.white,
            }}
          >
            <View
              style={{
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <View>
                <View
                  style={{
                    alignSelf: "center",
                    width: scrn_width,
                    alignItems: "center",
                  }}
                >
                  {profile.prof_rvl ? (
                    <TouchableOpacity
                      onPress={() => {
                        if (profile?.all_images.length > 0) {
                          setmodalVisible(true);
                        }
                      }}
                    >
                      <FastImage
                        style={styles.profileImage}
                        source={{ uri: profile?.prof_img }}
                      />
                    </TouchableOpacity>
                  ) : (
                    <FastImage
                      style={styles.profileImage}
                      source={
                        profile?.userprofile?.gender == "Woman"
                          ? require("../../../assets/images/Matching/Avatars/FemaleAvatar.png")
                          : require("../../../assets/images/Matching/Avatars/MaleAvatar.png")
                      }
                    />
                  )}
                  <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => {
                      if (leftHrs < 24) {
                        setextendVisible(true);
                      }
                    }}
                  >
                    <ADIcon
                      style={{ marginRight: rspW(1.4) }}
                      size={rspF(1.8)}
                      name={"clockcircle"}
                      color={colors.blue}
                    />

                    <Text
                      style={{
                        ...styles.leftTime,
                        color: leftHrs > 24 ? colors.black : colors.error,
                      }}
                    >
                      Expires in {leftHrs} Hrs
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <ScrollView
              decelerationRate={0.9}
              showsVerticalScrollIndicator={false}
              bounces={true}
              style={{
                marginTop: rspH(1.6),
              }}
            >
              <View
                style={{
                  paddingTop: rspH(1.2),
                  paddingBottom: profile.prof_rvl ? rspH(5) : rspH(0.5),

                  // width: scrn_width / 1.2,
                  width: rspW(88),
                }}
              >
                <HScroller lis={lis1} />

                {!profile.prof_rvl && (
                  <HScrollerWS title={"Languages"} lis={lis4} />
                )}

                {/* Private 1 */}
                {!profile.prof_rvl && prv_prmt?.length > 0 && (
                  <View style={styles.promptContainer}>
                    <View style={styles.promptQuestionContainer}>
                      <Text style={styles.promptQuestion}>
                        {prv_prmt[0].question}
                      </Text>
                    </View>
                    <Text style={styles.promptAnswer}>
                      {prv_prmt[0].answer}
                    </Text>
                  </View>
                )}

{/* Public 1 */}
                {profile.prof_rvl && pup_prmt?.length > 0 && (
                  <View style={styles.promptContainer}>
                    <View style={styles.promptQuestionContainer}>
                      <Text style={styles.promptQuestion}>
                        {pup_prmt[0].question}
                      </Text>
                    </View>
                    <Text style={styles.promptAnswer}>
                      {pup_prmt[0].answer}
                    </Text>
                  </View>
                )}

                <View style={{ marginTop: rspH(0.6) }}>
                  <HScrollerMulti lis={lis2} />
                </View>

{/* Private 2 */}
                {!profile.prof_rvl && prv_prmt?.length > 0 && (
                  <View style={styles.promptContainer}>
                    <View style={styles.promptQuestionContainer}>
                      <Text style={styles.promptQuestion}>
                        {prv_prmt[1].question}
                      </Text>
                    </View>
                    <Text style={styles.promptAnswer}>
                      {prv_prmt[1].answer}
                    </Text>
                  </View>
                )}

{/* Public 2 */}
{profile.prof_rvl && pup_prmt?.length > 0 && (
                  <View style={styles.promptContainer}>
                    <View style={styles.promptQuestionContainer}>
                      <Text style={styles.promptQuestion}>
                        {pup_prmt[1].question}
                      </Text>
                    </View>
                    <Text style={styles.promptAnswer}>
                      {pup_prmt[1].answer}
                    </Text>
                  </View>
                )}

                <View style={{ marginBottom: rspH(0.6) }}>
                  <HScroller title={"Habits"} lis={lis3} />
                </View>

                {/* Private 1 */}
                {profile.prof_rvl && prv_prmt?.length > 0 && (
                  <View style={styles.promptContainer}>
                    <View style={styles.promptQuestionContainer}>
                      <Text style={styles.promptQuestion}>
                        {prv_prmt[0].question}
                      </Text>
                    </View>
                    <Text style={styles.promptAnswer}>
                      {prv_prmt[0].answer}
                    </Text>
                  </View>
                )}

{profile.prof_rvl && (
                  <HScrollerWS title={"Languages"} lis={lis4} />
                )}

                
                {/* Private 2 */}
                {profile.prof_rvl && prv_prmt?.length > 0 && (
                  <View style={styles.promptContainer}>
                    <View style={styles.promptQuestionContainer}>
                      <Text style={styles.promptQuestion}>
                        {prv_prmt[1].question}
                      </Text>
                    </View>
                    <Text style={styles.promptAnswer}>
                      {prv_prmt[1].answer}
                    </Text>
                  </View>
                )}

                
                {!route.params?.fromchat && (
                  <FormWrapperFooter
                    containerStyle={{
                      marginTop: rspH(2.5),
                    }}
                  >
                    <FooterBtn
                      title={"Say Hi!"}
                      disabled={false}
                      onPress={() => {
                        navigation.navigate("Chat", {
                          profile,
                        });
                      }}
                    />
                  </FormWrapperFooter>
                )}
              </View>
            </ScrollView>
          </View>

          <FullModal modalVisible={openReport} setModalVisible={setopenReport}>
            {actionNo == 1 ? (
              <ReportUnmatch
                action={action}
                setaction={setaction}
                actionNo={actionNo}
                setactionNo={setactionNo}
                report={report}
                setreport={setreport}
                modalVisible={openReport}
                setModalVisible={setopenReport}
                reportConfirm={reportConfirm}
                setreportConfirm={setreportConfirm}
                unmatchProfile={unmatchProfile}
              />
            ) : (
              <Report
                action={action}
                actionNo={actionNo}
                setactionNo={setactionNo}
                actionType={true}
                report={report}
                setreport={setreport}
                modalVisible={openReport}
                setModalVisible={setopenReport}
                reportConfirm={reportConfirm}
                setreportConfirm={setreportConfirm}
              />
            )}
          </FullModal>

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
      </View>

      <FullModal
        backgroundColor={"#000"}
        modalVisible={modalVisible}
        setModalVisible={setmodalVisible}
      >
        <View style={styles.imageCont2}>
          {/* Back Btn Modal Closed */}

          <TouchableOpacity
            style={{
              position: "absolute",
              zIndex: 2,
              top: rspH(3),
              left: rspW(8),
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",

              height: rspW(7.6),
              width: rspW(7.6),
              borderRadius: rspW(3.8),
            }}
            onPress={() => {
              setmodalVisible(false);
            }}
          >
            <Image
              source={Backward}
              style={{ width: "80%", height: "70%" }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/*  FullScreen Carousel */}
          <FlatList
            initialScrollIndex={0}
            data={profile.all_images}
            renderItem={renderItem2}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX2 } } }],
              {
                useNativeDriver: false,
              }
            )}
            scrollEventThrottle={32}
            onViewableItemsChanged={viewableItemsChanged2}
            viewabilityConfig={viewConfig2}
            ref={slidesRef2}
          />

          <Paginator
            data={profile.all_images}
            scrollX={scrollX2}
            currentIndex={currentIndex2}
          />
        </View>
      </FullModal>
    </>
  );
};

export default MatchProfile;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  leftTime: {
    fontSize: rspF(1.4),
    fontFamily: fontFamily.light,
  },
  profileImage: {
    width: rspW(21.64),
    height: rspW(21.64),
    marginBottom: rspH(1.4),
    borderRadius: rspW(43.3),
  },

  profileDetailsSubCont: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  profileDetailsSubCont2: {
    alignSelf: "center",
    width: rspW(82),
    marginTop: rspH(3),
    borderRadius: rspW(1.6),
    height: rspH(9.6),
    paddingHorizontal: rspW(3.2),
    paddingTop: rspH(1.17),
  },
  profileDetailCont: {
    height: rspH(9.6),
    width: rspW(39.5),
    borderRadius: rspW(1.6),
  },
  boxShadowCont: {
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 2.5,
    elevation: 4,
  },
  profileDetailContHeading: {
    fontFamily: fontFamily.bold,
    color: colors.black,
    letterSpacing: 1,
    fontSize: rspF(2.02),
  },
  interestImage: {
    height: rspH(3.75),
    width: rspW(7.64),
    marginRight: rspW(4.52),
  },
  profileDetailContNText: {
    color: colors.blue,
    fontFamily: fontFamily.semi_bold,
    fontSize: rspF(Platform.OS == "ios" ? 2 : 1.8),
    lineHeight: rspH(3.35),
  },

  // Prompt
  // promptContainer: {
  //   width: rspW(82),
  //   marginTop: rspH(2.35),
  //   marginBottom: rspH(-1.7),
  //   paddingHorizontal: rspW(2.5),
  //   paddingVertical: rspH(0.6),
  // },
  // promptQuestionContainer: {
  //   marginBottom: rspH(0.6),
  // },
  // promptQuestion: {
  //   fontFamily: fontFamily.bold,
  //   fontSize: rspF(1.66),
  //   color: colors.black,
  //   lineHeight: rspF(1.96),
  //   letterSpacing: 1,
  // },
  // promptAnswer: {
  //   fontFamily: fontFamily.light,
  //   fontSize: rspF(1.66),
  //   color: colors.black,
  //   lineHeight: rspF(2.18),
  //   letterSpacing: 1,
  // },

  // Prompt
  promptContainer: {
    // width: rspW(82),
    // marginBottom: rspH(3),
    // paddingHorizontal: rspW(2.5),

    // width: rspW(82),
    width: rspW(85),
    // marginTop: rspH(2.35),
    marginVertical: rspH(1.4),
    // marginBottom: rspH(-1.7),
    paddingHorizontal: rspW(4.5),
    paddingVertical: rspH(0.6),
  },

  promptQuestionContainer: {
    // marginBottom: rspH(0.6),
    marginBottom: rspH(2.1),
  },
  promptQuestion: {
    fontFamily: fontFamily.bold,
    fontSize: rspF(2),
    // fontSize: rspF(2),
    color: colors.black,
    lineHeight: rspF(2.1),
    letterSpacing: 1,
  },
  promptAnswer: {
    // fontFamily: fontFamily.light,
    // fontSize: rspF(1.66),
    // color: colors.black,
    // lineHeight: rspF(2.18),
    // letterSpacing: 1,

    fontFamily: fontFamily.light,
    // fontSize: rspF(1.66),
    fontSize: rspF(2),
    color: colors.black,
    lineHeight: rspF(2.8),
    letterSpacing: 1,
  },

  confirmBox: {
    width: rspW(76.5),
    height: rspH(31.16),
    backgroundColor: colors.white,
    borderRadius: rspW(5.1),
    paddingHorizontal: rspW(4),
    alignItems: "center",
    justifyContent: "center",
    marginTop: rspH(17),
  },

  confirmBoxPara: {
    fontFamily: fontFamily.bold,
    fontSize: rspF(1.8),
    color: colors.blue,
    lineHeight: rspH(2.4),
    textAlign: "center",
  },

  habitsImage: {
    width: rspW(10.1),
    aspectRatio: 1,
  },

  dotsCont: {
    width: rspW(6.05),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dots: {
    backgroundColor: colors.blue,
    width: rspW(1),
    borderRadius: rspW(0.51),
    aspectRatio: 1,
  },

  // modal conatainer
  // Full Page Carousel
  imageCont2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    paddingBottom: rspH(1.2),
  },

  item2: {
    borderRadius: rspW(5.1),
    width: scrn_width,
    backgroundColor: "#000",
  },
});
