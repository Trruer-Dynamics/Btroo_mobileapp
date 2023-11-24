import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Linking,
  Platform,
} from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";

import { rspF, rspH, rspW, scrn_height, scrn_width } from "../../styles/responsiveSize";
import colors from "../../styles/colors";
import fontFamily from "../../styles/fontFamily";
import FormInputContainer from "../../components/formComponents/FormInputContainer";
import FormInput from "../../components/formComponents/FormInput";
import { Switch } from "react-native-switch";
import CentralModal from "../../components/modals/CentralModal";
import FooterBtn from "../../components/Buttons/FooterBtn";
import FullModal from "../../components/modals/FullModal";
import Referrals from "../../components/screenComponents/settingScreen/Referrals";
import { useDispatch, useSelector } from "react-redux";
import {
  setProfiledata,
  setSessionExpired,
} from "../../store/reducers/authentication/authentication";
import { apiUrl } from "../../constants";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import {
  setRepeatTut,
  setSwipeTut,
} from "../../store/reducers/tutorial/tutorial";
import FormHeader from "../../components/wrappers/formWrappers/FormHeader";

import { UserContext } from "../../context/user";
import Loader from "../../components/loader/Loader";
import FastImage from "react-native-fast-image";
import OffflineAlert from "../../components/functions/OfflineAlert";
import { setCurrentScreen } from "../../store/reducers/screen/screen";
import { initialWindowMetrics } from "react-native-safe-area-context";
const insets = initialWindowMetrics.insets;

const SettingsScreen = ({ navigation, route }) => {
  const scrollViewRef = useRef();

  const is_network_connected = useSelector(
    (state) => state.authentication.is_network_connected
  );

  const is_session_expired = useSelector(
    (state) => state.authentication.is_session_expired
  );

  const access_token = useSelector(
    (state) => state.authentication.access_token
  );
  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );

  const [loading, setloading] = useState(false);
  const { appStateVisible } = useContext(UserContext);

  let usr_profile = profile_data?.userprofile;
  const kp_mtch = profile_data?.userprofile?.keepmatchingnotification;

  useEffect(() => {
    setkeep_matching(kp_mtch);
  }, [kp_mtch]);

  useEffect(() => {
    if (is_network_connected && referral) {
      setreferral(false)
    }
  }, [is_network_connected])
  

  const dispatch = useDispatch();

  const [referral, setreferral] = useState(false);

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

  const updateShowProfile = async () => {
    // setshow_my_profile(!show_my_profile);
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

      if (resp.data.code == 200) {
        // setshow_my_profile(!show_my_profile);

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

    }
  };

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

      let code = resp.data.code;

      if (code == 200) {
        // setkeep_matching(!keep_matching);

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


    }
  };

  const updateNewMessage = async () => {


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

      let code = resp.data.code;

      if (code == 200) {
        // setnew_message(!new_message);

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

    }
  };

  const updateNewMatch = async () => {
    

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
     
      if (code == 200) {
   
        // setnew_match(!new_match);

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

    }
  };

  const updateProfileReveal = async () => {

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

      if (code == 200) {
        // setprofile_reveal(!profile_reveal);

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

    }
  };

  const updateOthers = async () => {
    
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

      if (code == 200) {
        // setothers(!others);

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

    }
  };

  const getContact = async () => {
    await axios
      .get(apiUrl + `get_user_contact/`)
      .then((resp) => {
        let contact_data = resp.data.data;

        if (resp.data.code == 200) {
          setcontact(contact_data.usercontact);
        } else if (resp.data.code == 401) {
          dispatch(setSessionExpired(true));
        }
      })
      .catch((err) => {});
  };


  const showConfirmDialog = () => {

    return Alert.alert("Are You Sure?", "You want to logout", [
      {
        text: "Yes",
        onPress: () => {
          dispatch(setSessionExpired(true));
        },
      },
      {
        text: "No",
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

  const userExist = async () =>{

    let url_path = 'isacountavialable/'

    // setloading(true);
    const data = {
      user_id: profile_data.user.id,
    };

    const headers = {
      // Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(
        apiUrl + url_path,
        data,
        {
          headers,
        }
      );
      let resp_data = response.data;

      if (resp_data.code == 400) {

           Alert.alert("Your account has been deleted!", "Please Contact admin at contact@btrooapp.com.", [
            
            {
              text: "OK",
              onPress: () => {
                dispatch(setSessionExpired(true))
              },
            },
          ]);
        
      }
      
    } catch (error) {
      return false;

    }

  }


  useLayoutEffect(() => {
    getContact();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
   
      dispatch(setCurrentScreen("SettingsScreen"));
      // Do something when the screen is focused
      setphone_number(profile_data?.user?.username);
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }, [])
  );

  useFocusEffect(
    React.useCallback(
      () => {
        if (appStateVisible == 'active') {
          userExist()
        }
      },
      [appStateVisible],
    )
    
  )

  
  return (
    <>
   <OffflineAlert offAlert={!is_network_connected} />
      {/* {loading && <Loader />} */}
      <SafeAreaView
        style={{
          height: scrn_height,
          backgroundColor: colors.white,
          zIndex: 5,
        }}
      >
        <View
          style={{
            paddingTop: rspH(7) - insets.top,
            paddingBottom: rspH(9) - insets.top,
            flex: 1,
          }}
        >
          <FormHeader title={"Settings"} para="" />

          <SafeAreaView
            style={{
              height: Platform.OS == 'ios'? rspH(74) + insets.bottom : rspH(80) ,
              // paddingBottom: rspH(10) + insets.bottom,
              paddingHorizontal: rspW(10),
              alignItems: "center",
              backgroundColor: colors.white,
            }}
          >
            <ScrollView
            decelerationRate={0.9}
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              style={{
                width: "100%",
                
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
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                  onPress={() => {
                    if (is_network_connected) {
                      setreferral(true);
                    }
           
                  }}
                >
                  <View
                    style={{
                      position: "absolute",
                      bottom:  0,
                      right: -rspW(2),
                    }}
                  >
                    <FastImage
                      source={require("../../assets/images/Setting/BannerImg.png")}
                      resizeMode="contain"
                      style={{
                        width: scrn_width * 0.32,
                        height: 
                        rspW(22),
                        
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
                      placeholder={"Add your phone number"}
                      placeholderTextColor={colors.black}
                      error_cond={phone_number.length < 2}
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
                          setshow_my_profile(!show_my_profile)
                          updateShowProfile();
                        }}
                        
                        changeValueImmediately={true}
                        disabled={!is_network_connected}
                        circleSize={18}
                        barHeight={24}
                        circleBorderWidth={0}
                        backgroundActive={colors.blue}
                        backgroundInactive={colors.grey}
                        circleActiveColor={"#fff"}
                        circleInActiveColor={"#fff"}
                       
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
                          setkeep_matching(!keep_matching);
                          updateKeepMatching();
                        }}
                        disabled={!is_network_connected}
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
                    width: "100%",
                    backgroundColor: colors.blue,
                    marginBottom: rspH(1.58),
                  }}
                />

                <View
                  style={{
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
                        setnew_message(!new_message);
                        updateNewMessage();
                      }}
                      disabled={!is_network_connected}
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
                      marginBottom: rspH(1.8),
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.titleS}>New Match</Text>
                    <Switch
                      value={new_match}
                      onValueChange={() => {
                        setnew_match(!new_match);
                        updateNewMatch();
                      }}
                      disabled={!is_network_connected}
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
                      marginBottom: rspH(1.8),
                    }}
                  >
                    <Text style={styles.titleS}>Profile Reveal</Text>
                    <Switch
                      value={profile_reveal}
                      onValueChange={() => {
                        setprofile_reveal(!profile_reveal);
                        updateProfileReveal();
                      }}
                      disabled={!is_network_connected}
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
                      marginBottom: rspH(1.8),
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.titleS}>Others</Text>
                    <Switch
                      value={others}
                      onValueChange={() => {
                        setothers(!others);
                        updateOthers();
                      }}
                      disabled={!is_network_connected}
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
                  if (is_network_connected) {
                    Linking.openURL(
                      "https://btroo.midnightpoha.com/index.php/faqs/"
                    );  
                  }
                  
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
                  
                    dispatch(setRepeatTut(true));
                    navigation.navigate("Swiper");
                  
                 
                }}
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
                    if (is_network_connected) {
                      Linking.openURL(`mailto:${contact}`);
                    }
    
                  }}
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
                onPress={() => {
                  if (is_network_connected) {
                    navigation.navigate("Info", {
                      heading: "Terms of Service",
                    });  
                  }
                  
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
                onPress={() => {
                  if (is_network_connected) {
                    navigation.navigate("Info", {
                      heading: "Privacy Policy",
                    });  
                  }
                  
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
                  if (is_network_connected) {
                    Linking.openURL(
                      "https://btroo.midnightpoha.com/index.php/community-guidelines/"
                    );  
                  }
                  
                }}
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
                onPress={() => {
                  if (is_network_connected) {
                    Linking.openURL(
                      "https://btroo.midnightpoha.com/index.php/photo-guidelines/"
                    );  
                  }
                  
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
                  if (is_network_connected) {
                    showConfirmDialog();
                  }
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
                onPress={() => 
                  {
                    if (is_network_connected) {
                      setcmodal(true) 
                    }

                }
                }
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
                  borderRadius: rspW(5.1),
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
                      <FastImage
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
          </SafeAreaView>
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
    width: rspW(78),
    // height: rspH(Platform.OS == "ios" ? 15 : 16),
    height: Platform.OS == "ios" ? rspH(14)  : rspH(10) + insets.top,
    borderRadius: rspW(10),
    backgroundColor: "#6B9DFF",
    paddingLeft: rspW(5),
    paddingVertical: rspH(2.4),
    alignSelf: "center",
    position:'relative',
  },
  bannerTxt: {
    fontFamily: fontFamily.bold,
    // fontSize: rspF(Platform.OS == "ios" ? 2.5 : 2.5),
    fontSize: Platform.OS == "ios" ? rspF(2.5) : scrn_height * 0.027,

    lineHeight: rspF(2.7),
    color: colors.white,
    letterSpacing: 1,
  },
  bannerSubTxt: {
    fontFamily: fontFamily.bold,
    fontSize: Platform.OS =='ios'?rspF(1.9) : scrn_height * 0.021,
    lineHeight: Platform.OS == "ios" ? rspF(1.84) : rspH(2),
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
    lineHeight: rspF(1.322),
    fontFamily: fontFamily.light,
    color: colors.black,
  },
  modalPara: {
    fontSize: rspF(1.9),
    lineHeight: rspH(2.5),
    fontFamily: fontFamily.regular,
    color: colors.blue,
    textAlign: "center",
  },
});
