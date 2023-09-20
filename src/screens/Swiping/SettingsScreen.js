import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Linking,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import {
  rspF,
  rspH,
  rspW,
  scrn_height,
  scrn_width,
  srn_height,
} from "../../styles/responsiveSize";
import colors from "../../styles/colors";
import fontFamily from "../../styles/fontFamily";
import FormWrapper from "../../components/wrappers/formWrappers/FormWrapper";
import FormInputContainer from "../../components/formComponents/FormInputContainer";
import FormInput from "../../components/formComponents/FormInput";
import { Switch } from "react-native-switch";
import CentralModal from "../../components/modals/CentralModal";
import FooterBtn from "../../components/Buttons/FooterBtn";
import FullModal from "../../components/modals/FullModal";
import ReferralCode from "../../components/screenComponents/swiping/Prompts/ReferralCode";
import Referrals from "../../components/screenComponents/settingScreen/Referrals";
import { useDispatch, useSelector } from "react-redux";
import {
  setAccessToken,
  setActiveUserLocationDetails,
  setProfiledata,
  setSessionExpired,
  setUserLoggined,
} from "../../store/reducers/authentication/authentication";
import { apiUrl } from "../../constants";
import axios from "axios";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import { setSwipeTut } from "../../store/reducers/tutorial/tutorial";
import FormHeader from "../../components/wrappers/formWrappers/FormHeader";
import { initialWindowMetrics } from "react-native-safe-area-context";
import { UserContext } from "../../context/user";
import Loader from "../../components/loader/Loader";
const insets = initialWindowMetrics.insets;

const SettingsScreen = ({ navigation }) => {
  const scrollViewRef = useRef();

  const access_token = useSelector(
    (state) => state.authentication.access_token
  );
  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );
  const profile_imgs = useSelector(
    (state) => state.authentication.profile_imgs
  );

  const is_session_expired = useSelector(
    (state) => state.authentication.is_session_expired
  );

  const [loading, setloading] = useState(false);

  let usr_profile = profile_data?.userprofile;
  const kp_mtch = profile_data?.userprofile?.keepmatchingnotification;

  useEffect(() => {
    setkeep_matching(kp_mtch);
  }, [kp_mtch]);

  const active_user_location_details = useSelector(
    (state) => state.authentication.active_user_location_details
  );

  const dispatch = useDispatch();

  const [referral, setreferral] = useState(false);
  const [referral_link, setreferral_link] = useState("");

  const [phone_number, setphone_number] = useState("");
  const [phone_number_blr, setphone_number_blr] = useState(false);

  const [show_my_profile, setshow_my_profile] = useState(
    usr_profile?.showmyprofilenotification
  );

  const [keep_matching, setkeep_matching] = useState(
    usr_profile?.keepmatchingnotification
  );

  const [new_message, setnew_message] = useState(
    usr_profile?.newmessagenotification
  );

  const [new_match, setnew_match] = useState(usr_profile?.newmatchnotification);

  const [profile_reveal, setprofile_reveal] = useState(
    usr_profile?.profilerevealnotification
  );

  const [others, setothers] = useState(usr_profile?.othernotification);

  const [cmodal, setcmodal] = useState(false);

  const [confirmDelete, setconfirmDelete] = useState(false);

  const [contact, setcontact] = useState("");

  const { DeviceToken } = useContext(UserContext);

  const updateShowProfile = async () => {
    // setloading(true);
    const url =
      apiUrl + `show_profile_notification_update/${profile_data.user.id}`;

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    try {
      const resp = await axios.put(
        url,
        {
          showmy_profile_notification: !show_my_profile,
        },
        {
          headers,
        }
      );

      let status = resp.data.status;
      // setloading(false);

      if (resp.data.code == 200) {
        setshow_my_profile(!show_my_profile);

        let update_prof = {
          ...profile_data,
          userprofile: {
            ...profile_data.userprofile,
            showmyprofilenotification: !show_my_profile,
          },
        };

        dispatch(setProfiledata(update_prof));
      } else if (resp.data.code == 401) {
        dispatch(setSessionExpired(true));
      }
    } catch (error) {
      // setloading(false);
      dispatch(setSessionExpired(true));
    }
  };

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

      let code = resp.data.code;
      // setloading(false);

      if (code == 200) {
        setkeep_matching(!keep_matching);

        let update_prof = {
          ...profile_data,
          userprofile: {
            ...profile_data.userprofile,
            keepmatchingnotification: !keep_matching,
          },
        };

        dispatch(setProfiledata(update_prof));
      } else if (code == 401) {
        dispatch(setSessionExpired(true));
      }
    } catch (error) {
      // setloading(false);
      dispatch(setSessionExpired(true));
    }
  };

  const updateNewMessage = async () => {
    // setloading(true);

    const url =
      apiUrl + `new_message_notification_update/${profile_data.user.id}`;

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    try {
      const resp = await axios.put(
        url,
        {
          new_message_notification: !new_message,
        },
        {
          headers,
        }
      );
      // setloading(false);

      let code = resp.data.code;

      if (code == 200) {
        setnew_message(!new_message);

        let update_prof = {
          ...profile_data,
          userprofile: {
            ...profile_data.userprofile,
            newmessagenotification: !new_message,
          },
        };

        dispatch(setProfiledata(update_prof));
      } else if (code == 401) {
        dispatch(setSessionExpired(true));
      }
    } catch (error) {
      // setloading(false);
      dispatch(setSessionExpired(true));
    }
  };

  const updateNewMatch = async () => {
    // setloading(true);

    const url =
      apiUrl + `new_match_notification_update/${profile_data.user.id}`;

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    try {
      const resp = await axios.put(
        url,
        {
          new_match_notification: !new_match,
        },
        {
          headers,
        }
      );

      let code = resp.data.code;
      // setloading(false);

      if (code == 200) {
        setnew_match(!new_match);

        let update_prof = {
          ...profile_data,
          userprofile: {
            ...profile_data.userprofile,
            newmatchnotification: !new_match,
          },
        };

        dispatch(setProfiledata(update_prof));
      } else if (code == 401) {
        dispatch(setSessionExpired(true));
      }
    } catch (error) {
      // setloading(false);
      dispatch(setSessionExpired(true));
    }
  };

  const updateProfileReveal = async () => {
    // setloading(true);

    const url =
      apiUrl + `profile_reveal_notification_update/${profile_data.user.id}`;

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    try {
      const resp = await axios.put(
        url,
        {
          profile_reveal_notification: !profile_reveal,
        },
        {
          headers,
        }
      );

      let code = resp.data.code;
      // setloading(false);

      if (code == 200) {
        setprofile_reveal(!profile_reveal);

        let update_prof = {
          ...profile_data,
          userprofile: {
            ...profile_data.userprofile,
            profilerevealnotification: !profile_reveal,
          },
        };
        dispatch(setProfiledata(update_prof));
      } else if (code == 401) {
        dispatch(setSessionExpired(true));
      }
    } catch (error) {
      // setloading(false);
      dispatch(setSessionExpired(true));
    }
  };

  const updateOthers = async () => {
    // setloading(true);

    const url = apiUrl + `other_notification_update/${profile_data.user.id}`;

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    try {
      const resp = await axios.put(
        url,
        {
          other_notification: !others,
        },
        {
          headers,
        }
      );

      let code = resp.data.code;
      // setloading(false);

      if (code == 200) {
        setothers(!others);

        let update_prof = {
          ...profile_data,
          userprofile: {
            ...profile_data.userprofile,
            othernotification: !others,
          },
        };

        dispatch(setProfiledata(update_prof));
      } else if (code == 401) {
        dispatch(setSessionExpired(true));
      }
    } catch (error) {
      // setloading(false);
      dispatch(setSessionExpired(true));
    }
  };

  const getContact = async () => {
    // setloading(true);
    await axios
      .get(apiUrl + `get_user_contact/`)
      .then((resp) => {
        let contact_data = resp.data.data;
        // setloading(false);
        if (resp.data.code == 200) {
          setcontact(contact_data.usercontact);
        } else if (resp.data.code == 401) {
          dispatch(setSessionExpired(true));
        }
      })
      .catch((err) => {
        // setloading(false);
        dispatch(setSessionExpired(true));
      });
  };

  const showConfirmDialog = () => {
    console.log("session expired", is_session_expired);
    // return Alert.alert("Are you Sure", "sdsd")

    return Alert.alert("Are You Sure?", "You want to logout", [
      {
        text: "Yes",
        onPress: () => {
          dispatch(setSessionExpired(true));
        },
      },
      {
        text: "NO",
        onPress: () => {},
      },
    ]);
  };

  const deleteAccount = async () => {
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    await axios
      .delete(apiUrl + `delete_user/${profile_data.user.id}`, {
        headers,
      })
      .then((resp) => {
        if (resp.data.code == 200) {
          dispatch(setSessionExpired(true));
        }
      })
      .catch((err) => {});
  };

  useLayoutEffect(() => {
    getContact();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      setphone_number(profile_data?.user?.username);
      scrollViewRef.current.scrollTo({ y: 0, animated: true });

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  return (
    <>
      {loading && <Loader />}
      <SafeAreaView
        style={{
          height: scrn_height,
          backgroundColor: colors.white,
          zIndex: 5,
        }}
      >
        <View
          style={{
            paddingTop: rspH(2),
            paddingBottom: rspH(9),
            flex: 1,
          }}
        >
          <FormHeader title={"Settings"} para="" />

          <View
            style={{
              height: rspH(Platform.OS == "ios" ? 72 : 76) + insets.top,
              // height: scrn_height,
              paddingHorizontal: rspW(10),
              alignItems: "center",
              backgroundColor: colors.white,
            }}
          >
            <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              style={{
                width: "100%",
                // height: '100%',
                paddingBottom: rspH(Platform.OS == "ios" ? 10 : 15),
                }}
              bounces={false}
            >
              <View>
                {/* Banner */}

                <TouchableOpacity
                  style={{
                    ...styles.bannerCont,
                    elevation: 3,
                    zIndex: 3,

                    position: "relative",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                  onPress={() => {
                    setreferral(true);
                  }}
                >
                  <View
                    style={{
                      position: "absolute",
                      bottom: rspH(Platform.OS == "ios" ? -1.3 : -2),

                      right: 0,
                    }}
                  >
                    <Image
                      source={require("../../assets/images/Setting/BannerImg.png")}
                      resizeMode="contain"
                      style={{
                        // width: rspW(29),
                        width: rspW(32),
                        height: rspW(29),
                      }}
                    />
                  </View>

                  <View>
                    <Text style={styles.bannerTxt}>Get Extra Features!</Text>
                    <Text style={styles.bannerSubTxt}>
                      By Referring a Friend
                    </Text>
                    <View
                      style={{
                        width: rspW(40.8),

                        marginTop: rspH(0.85),
                      }}
                    >
                      <Text style={styles.bannerPara}>
                        Get more rewards for each person that joins bTroo using
                        your referral code.{" "}
                        <Text
                          style={{
                            ...styles.bannerPara,
                            fontFamily: fontFamily.bold,
                            textDecorationLine: "underline",
                          }}
                        >
                          Refer Now
                        </Text>
                        .
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Account Section */}

                <View
                  style={{
                    width: "100%",
                    
                    paddingTop: rspH(2.8),
                    // paddingTop: rspH(7.2),
                  }}
                >
                  <View
                    style={{
                      marginBottom: rspH(2),
                    }}
                  >
                    <Text style={{ ...styles.title, textAlign: "left" }}>
                      Account
                    </Text>
                  </View>

                  <FormInputContainer label="Phone Number">
                    <FormInput
                      value={phone_number}
                      setvalue={setphone_number}
                      width={"100%"}
                      // height={rspH(5.9)}
                      placeholder={"Add your phone number"}
                      placeholderTextColor={colors.black}
                      error_cond={phone_number.length < 2}
                      // keyboardType="default"

                      maxLength={15}
                      disabled={true}
                      value_blr={phone_number_blr}
                      setvalue_blr={setphone_number_blr}
                    />
                  </FormInputContainer>

                  <View style={{ marginBottom: rspH(2.05) }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.titleS}>Show My Profile</Text>
                      <Switch
                        value={show_my_profile}
                        onValueChange={() => {
                          updateShowProfile();
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
                    <View style={{ marginTop: rspH(1.8) }}>
                      <Text style={styles.para}>
                        While turned off, your profile will not be shown to
                        other people.
                      </Text>
                    </View>
                  </View>

                  <View style={{ marginBottom: rspH(2.05) }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.titleS}>Keep Matching</Text>
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
                    <View
                      style={{
                        // marginTop: rspH(1.68),
                        marginTop: rspH(1.68),
                      }}
                    >
                      <Text style={styles.para}>
                        While turned off, you will not be matched with other
                        people.
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    height: rspH(0.59),
                    // height: rspH(0.59),
                    width: "100%",
                    backgroundColor: colors.blue,
                    // marginBottom: rspH(1.58),
                    marginBottom: rspH(1.58),
                  }}
                />

                <View
                  style={{
                    // marginBottom: rspH(1.9),
                    marginBottom: rspH(1.9),

                    width: "100%",
                  }}
                >
                  <Text style={{ ...styles.title }}>Push Notifications</Text>
                </View>

                <View style={{ width: "100%" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: rspH(1.8),
                    }}
                  >
                    <Text style={styles.titleS}>New Messages</Text>
                    <Switch
                      value={new_message}
                      onValueChange={() => {
                        updateNewMessage();
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

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      // marginBottom: rspH(2.05),
                      marginBottom: rspH(1.8),
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.titleS}>New Match</Text>
                    <Switch
                      value={new_match}
                      onValueChange={() => {
                        updateNewMatch();
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

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      // marginBottom: rspH(2.05),
                      marginBottom: rspH(1.8),
                    }}
                  >
                    <Text style={styles.titleS}>Profile Reveal</Text>
                    <Switch
                      value={profile_reveal}
                      onValueChange={() => {
                        updateProfileReveal();
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

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      // marginBottom: rspH(2.05),
                      marginBottom: rspH(1.8),
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.titleS}>Others</Text>
                    <Switch
                      value={others}
                      onValueChange={() => {
                        updateOthers();
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
                </View>

                <View
                  style={{
                    height: rspH(0.59),
                    width: "100%",
                    backgroundColor: colors.blue,
                    marginBottom: rspH(1.58),
                  }}
                />
              </View>

              <View style={{ marginBottom: rspH(1.9), width: "100%" }}>
                <Text style={{ ...styles.title }}>Help and Support</Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  // navigation.navigate("Info", {
                  //   heading: "FAQ",
                  // });
                  Linking.openURL(
                    "https://btroo.midnightpoha.com/index.php/faqs/"
                  );
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: rspH(2.05),
                }}
              >
                <Text style={styles.titleS}>FAQ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  dispatch(setSwipeTut(true));
                  // navigation.navigate('BottomTab', {
                  //   screen: 'Swiper',
                  // });
                  navigation.navigate("Swiper");
                }}
                // onPress={()=> setcmodal(true)}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: rspH(2.05),
                }}
              >
                <Text style={{ ...styles.titleS, color: colors.black }}>
                  Tutorial
                </Text>
              </TouchableOpacity>

              <View style={{ flexDirection: "row" }}>
                <Text style={{ ...styles.titleS, color: colors.black }}>
                  Contact{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(`mailto:${contact}`);
                  }}
                  // onPress={()=> setcmodal(true)}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: rspH(2.05),
                  }}
                >
                  <Text style={{ ...styles.titleS, color: colors.black }}>
                    {contact}
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  height: rspH(0.59),
                  width: "100%",
                  backgroundColor: colors.blue,
                  marginBottom: rspH(1.58),
                }}
              />

              <View style={{ marginBottom: rspH(1.9), width: "100%" }}>
                <Text style={{ ...styles.title }}>Policies and Guidelines</Text>
              </View>

              <TouchableOpacity
                // onPress={()=> setcmodal(true)}
                onPress={() => {
                  navigation.navigate("Info", {
                    heading: "Terms of Service",
                  });
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: rspH(2.05),
                }}
              >
                <Text style={{ ...styles.titleS, color: colors.black }}>
                  Terms of Service
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                // onPress={()=> setcmodal(true)}
                onPress={() => {
                  navigation.navigate("Info", {
                    heading: "Privacy Policy",
                  });
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: rspH(2.05),
                }}
              >
                <Text style={{ ...styles.titleS, color: colors.black }}>
                  Privacy Policy
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Info", {
                    heading: "Privacy Preference",
                  });
                }}
                // onPress={()=> setcmodal(true)}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: rspH(2.05),
                }}
              >
                <Text style={{ ...styles.titleS, color: colors.black }}>
                  Privacy Preference
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  // navigation.navigate('Info', {
                  //   heading: 'Community Guidelines',
                  // });

                  Linking.openURL(
                    "https://btroo.midnightpoha.com/index.php/community-guidelines/"
                  );
                }}
                // onPress={()=> setcmodal(true)}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: rspH(2.05),
                }}
              >
                <Text style={{ ...styles.titleS, color: colors.black }}>
                  Community Guidelines
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                // onPress={()=> setcmodal(true)}
                onPress={() => {
                  // navigation.navigate('Info', {
                  //   heading: 'Photo Guidelines',
                  // });
                  Linking.openURL(
                    "https://btroo.midnightpoha.com/index.php/photo-guidelines/"
                  );
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: rspH(2.05),
                }}
              >
                <Text style={{ ...styles.titleS, color: colors.black }}>
                  Photo Guidelines
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  height: rspH(0.59),
                  width: "100%",
                  backgroundColor: colors.blue,
                  marginBottom: rspH(1.58),
                }}
              />

              <TouchableOpacity
                onPress={() => {
                  showConfirmDialog();
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: rspH(2.05),
                }}
              >
                <Text style={{ ...styles.titleS, color: colors.black }}>
                  Log Out
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setcmodal(true)}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: rspH(2.05),
                }}
              >
                <Text style={{ ...styles.titleS, color: colors.black }}>
                  Delete Account
                </Text>
              </TouchableOpacity>
            </ScrollView>

            <CentralModal modalVisible={cmodal} setModalVisible={setcmodal}>
              <View
                style={{
                  paddingHorizontal: rspW(4),
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fff",
                  height: rspH(Platform.OS == "ios" ? 52 : 56),
                  // height: rspH(54.38),
                  borderRadius: rspW(5.1),
                  // width: rspW(76.5), 76.5
                  width: rspW(80),
                }}
              >
                {!confirmDelete ? (
                  <>
                    <View
                      style={{
                        marginBottom: rspH(4.1),
                      }}
                    >
                      <Text style={styles.title}>Are you sure?</Text>
                    </View>
                    <View
                      style={{
                        marginBottom: rspH(5.9),
                        // marginBottom: rspH(5.9),
                      }}
                    >
                      <Text style={styles.modalPara}>
                        After deleting your account you {"\n"} will not be able
                        to recover it later {"\n"} and all of the information
                        and {"\n"} converations that you had will be {"\n"}
                        erased. You can always keep your {"\n"}account from
                        showing to others {"\n"} by selecting it on settings.
                      </Text>
                    </View>

                    <FooterBtn
                      title="Take me back!"
                      onPress={() => {
                        setcmodal(false);
                      }}
                    />

                    <TouchableOpacity
                      style={{ marginTop: rspH(3.7) }}
                      onPress={() => {
                        setconfirmDelete(true);
                      }}
                    >
                      <Text
                        style={{
                          color: colors.blue,

                          fontSize: rspF(1.5),
                          fontFamily: fontFamily.bold,
                          lineHeight: rspF(1.51),
                        }}
                      >
                        Yes Delete My Account
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View
                      style={{
                        marginBottom: rspH(3.2),
                      }}
                    >
                      <Image
                        source={require("../../assets/images/Setting/goodBye.png")}
                        style={{
                          width: rspW(70.9),
                          height: rspH(19.4),
                        }}
                      />
                    </View>
                    <View style={{ marginBottom: rspH(3.7) }}>
                      <Text style={styles.modalPara}>
                        We hope that you are leaving {`\n`} bTroo because you
                        found your {`\n`} true love. We wish you all the {`\n`}{" "}
                        success and happiness, and hope {`\n`} that you had the
                        best experience {`\n`} with us!
                      </Text>
                    </View>

                    <View
                      style={{
                        width: "100%",
                        //  marginTop:-10
                      }}
                    >
                      <FooterBtn
                        title="Goodbye!"
                        onPress={() => {
                          setcmodal(false);
                          setconfirmDelete(false);
                          deleteAccount();
                        }}
                      />
                    </View>
                  </>
                )}
              </View>
            </CentralModal>

            <FullModal modalVisible={referral}>
              <Referrals
                modalVisible={referral}
                setModalVisible={setreferral}
              />
            </FullModal>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },

  bannerCont: {
    // width: rspW(75),
    width: rspW(78),
    height: rspH(Platform.OS == "ios" ? 15 : 16),
    // borderRadius: rspW(10),
    borderRadius: rspW(10),
    backgroundColor: "#6B9DFF",
    paddingLeft: rspW(5),
    paddingVertical: rspH(2.4),

    alignSelf: "center",
  },
  bannerTxt: {
    fontFamily: fontFamily.bold,
    fontSize: rspF(Platform.OS == "ios" ? 2.5 : 2.5),
    lineHeight: rspF(2.7),
    color: colors.white,
    letterSpacing: 1,
  },
  bannerSubTxt: {
    fontFamily: fontFamily.bold,
    fontSize: rspF(1.86),
    lineHeight: rspF(Platform.OS == "ios" ? 1.84 : 1.9),
    color: colors.white,
    letterSpacing: 0,
  },
  bannerPara: {
    fontFamily: fontFamily.regular,
    fontSize: rspF(Platform.OS == "ios" ? 1.3 : 1.28),
    lineHeight: rspF(Platform.OS == "ios" ? 1.8 : 1.6),
    color: colors.white,
  },
  title: {
    color: colors.black,
    lineHeight: rspF(2.76),
    fontSize: rspF(2.72),
    fontFamily: fontFamily.bold,
    letterSpacing: 1,
  },
  titleS: {
    color: colors.black,
    lineHeight: rspF(2.01),
    fontSize: rspF(2.01),
    fontFamily: fontFamily.bold,
    letterSpacing: 1,
  },
  para: {
    fontSize: rspF(Platform.OS == "android" ? 1.302 : 1.32),
    // fontSize: rspF(1.302),
    lineHeight: rspF(1.322),
    // lineHeight: rspF(1.31),
    fontFamily: fontFamily.light,
    color: colors.black,
  },
  modalPara: {
    fontSize: rspF(1.9),
    // lineHeight: rspH(2.5),
    lineHeight: rspH(2.5),

    // backgroundColor:colors.error,
    fontFamily: fontFamily.regular,
    color: colors.blue,
    textAlign: "center",
  },
});
