import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
  SafeAreaView,
  PermissionsAndroid,
  Platform,
  Linking,
} from "react-native";
import publicIP from "react-native-public-ip";
import React, {
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
  useEffect,
  useContext,
  memo,
} from "react";
import colors from "../../styles/colors";
import {
  rspF,
  rspH,
  rspW,
  scrn_height,
  scrn_width,
} from "../../styles/responsiveSize";
import { FlatList } from "react-native-gesture-handler";
import FullModal from "../../components/modals/FullModal";
import fontFamily from "../../styles/fontFamily";
import PromptIntro from "../../components/screenComponents/swiping/Prompts/PromptIntro";
import PublicPrompts from "../../components/screenComponents/swiping/Prompts/PublicPrompts";
import PrivatePrompts from "../../components/screenComponents/swiping/Prompts/PrivatePrompts";
import ReferralCode from "../../components/screenComponents/swiping/Prompts/ReferralCode";
import Filters from "../../components/screenComponents/swiping/Filters/Filters";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveUserLocationDetails,
  setProfileApproved,
  setProfileRefresh,
  setSessionExpired,
} from "../../store/reducers/authentication/authentication";

import Geolocation from "@react-native-community/geolocation";
import axios from "axios";
import { apiUrl } from "../../constants";

import {
  setAllGenders,
  setAllInterests,
  setAllLanguges,
  setAllPrompts,
} from "../../store/reducers/allData/allData";
import {
  setSelectedAgeRange,
  setSelectedDistance,
  setSelectedHabits,
  setSelectedHeightRange,
  setSelectedInterests,
  setSelectedLanguages,
} from "../../store/reducers/filter/filter";
import SwipeCard from "../../components/screenComponents/swiping/swipeCard/SwipeCard";

import {
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

import messaging from "@react-native-firebase/messaging";
import { setPromptFillingStart } from "../../store/reducers/authentication/authentication";
import { UserContext } from "../../context/user";

const SwiperOr = ({}) => {
  const navigation = useNavigation();

  const { appStateVisible } = useContext(UserContext);

  const dispatch = useDispatch();
  const active_user_loc_det = useSelector(
    (state) => state.authentication.active_user_location_details
  );

  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );

  const profile_approv = useSelector(
    (state) => state.authentication.profile_approved
  );

  const is_promptsfillingstarted = useSelector(
    (state) => state.authentication.is_promptsfillingstarted
  );

  const profile_refresh = useSelector(
    (state) => state.authentication.profile_refresh
  );
  const [promptTime, setpromptTime] = useState(false);

  const access_token = useSelector(
    (state) => state.authentication.access_token
  );

  const [reports_count, setreports_count] = useState(0);
  const [profile_approved, setprofile_approved] = useState(3);

  const [filter_data_get, setfilter_data_get] = useState(false);

  const prompts_list_all = useSelector((state) => state.allData.all_prompts);

  const [prompts_list_rmv, setprompts_list_rmv] = useState([]);

  const [public_prompt1_a, setpublic_prompt1_a] = useState("");
  const [public_prompt1_q, setpublic_prompt1_q] = useState("");
  const [public_prompt2_a, setpublic_prompt2_a] = useState("");
  const [public_prompt2_q, setpublic_prompt2_q] = useState("");

  const [private_prompt1_a, setprivate_prompt1_a] = useState("");
  const [private_prompt1_q, setprivate_prompt1_q] = useState("");
  const [private_prompt2_a, setprivate_prompt2_a] = useState("");
  const [private_prompt2_q, setprivate_prompt2_q] = useState("");

  const [loading, setloading] = useState(true);
  const [loading2, setloading2] = useState(true);

  const [profile_call, setprofile_call] = useState(false);

  // loading warnings
  const [warning_list, setwarning_list] = useState([
    [
      "Hey! Give us a few\nseconds.",
      "We are fetching the right\npeople for you!",
    ],
    [
      "Hey you, cool down!",
      "Come back tommorrow to\nsee more people you may\nfancy.",
    ],
    [
      "You’ve seen them all!",
      "It seems that you went through\neveryone in your area. Adjust your \nfilters to see more souls or click\nhere to replenish those you\n passed.\n\n Give them another try.",
      "Show me again!",
    ],
    [
      "It seems like\nsomething went wrong",
      "It seems that your account\nhas been reported against\ntoo many times. \n\n In case you think you were\ntreated unfairly, please\n reach out to us at\ncontact@btrooapp.com",
    ],
    [
      "Please give us access\nto your location.",
      "It seems you havent given\n us access to your location.\n\nIn order to continue to use\nthe app please go to your\nphone settings and give us\npermission to access your\nphone’s location.",
      "Go to Settings",
    ],
    [
      "Oops!",
      "It seems there was a problem in\nyour photo verification. Please\n verify yourself again.",
      "Verify yourself!",
    ],
  ]);

  const [warn_step, setwarn_step] = useState(0);
  const [redirect_to_settings, setredirect_to_settings] = useState(false);
  const [promptStep, setpromptStep] = useState(1);
  const [profiles, setprofiles] = useState([]);
  const [empty_profile_call, setempty_profile_call] = useState(false);

  //Filter
  const [showFilter, setshowFilter] = useState(false);

  // Public Prompts State
  const [promptsmodalVisible, setpromptsmodalVisible] = useState(false);

  const [swippingcount, setswippingcount] = useState(0);

  // Carousel States and Function
  //Main Carousel

  const swipe = useRef(new Animated.ValueXY()).current;

  const leftX = useRef(new Animated.Value(0)).current;

  const rightX = useRef(new Animated.Value(0)).current;

  const upY = useRef(new Animated.Value(0)).current;

  const scaleValue = useRef(new Animated.Value(0)).current;

  const iconRotate = useRef(new Animated.Value(0)).current;

  const iconTranslateX = useRef(new Animated.Value(0)).current;
  const iconTranslateY = useRef(new Animated.Value(0)).current;

  const scaleAnimation = () => {
    Animated.timing(scaleValue, {
      fromValue: 0.9,
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {});
  };

  const removeCard = useCallback(
    () => {

      scaleValue.setValue(0.9);
      iconRotate.setValue(0);
      iconTranslateX.setValue(0);
      iconTranslateY.setValue(0);
      leftX.setValue(0);
      rightX.setValue(0);
      upY.setValue(0);
      setprofiles((prevState) => prevState.slice(0, prevState.length - 1));
      swipe.setValue({ x: 0, y: 0 });
  
      if (swippingcount >= 2) {
        setpromptTime(true);
      }
    },
    [swipe, swippingcount]
    //  []
  );

  const handleChoiceButtons = useCallback(
    (direction) => {
      scaleAnimation();

      if (direction == 0) {
        Animated.timing(swipe.y, {
          toValue: -scrn_height,

          duration: 800,

          useNativeDriver: true,
        }).start(removeCard);
      } else {
        Animated.timing(swipe.x, {
          toValue: direction * scrn_width * 2,
          duration: 800,
          useNativeDriver: true,
        }).start(removeCard);
      }
    },

    [removeCard, swipe.x]
  );

  // Location Permission State
  const [permission_denied, setpermission_denied] = useState(false);
  const [mob_ip, setmob_ip] = useState("");
  const [current_lat, setcurrent_lat] = useState("");
  const [current_long, setcurrent_long] = useState("");
  const [current_address, setcurrent_address] = useState("");

  const [filterRefresh, setfilterRefresh] = useState(false);

  // To get Location Permission
  const getLocation = async () => {
    getOneTimeLocation();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  };

  const getReverseGeocodingData = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );

      setcurrent_address(response.data.display_name);
    } catch (error) {
      dispatch(setSessionExpired(true));
      setloading2(true);
    }
  };

  const getOneTimeLocation = async () => {

     Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);
        setpermission_denied(false);
        setcurrent_long(currentLongitude);
        setcurrent_lat(currentLatitude);

        getReverseGeocodingData(currentLatitude, currentLongitude);
      },
      (err) => {
        setpermission_denied(true);
        setwarn_step(4);
      },

      {
        enableHighAccuracy: true,
      }
    );
  };

  const addLocation = async () => {
    const data = {
      user_id: profile_data.user.id,
      longitude: current_long,
      latitude: current_lat,
      location: current_address,
      action: active_user_loc_det.action,
      ip: mob_ip,
    };

    try {
      const response = await axios.post(apiUrl + "last_location/", data);
      let resp_data = response.data;

      setloading(false);

      if (resp_data.code == 200) {
        if (reports_count > 10) {
          setwarn_step(3);
          setloading2(true);
        } else {
          getFilterProfiles();
        }

        return true;
      } else {
        return false;
      }
    } catch (error) {
      setloading(false);
      dispatch(setSessionExpired(true));
      return false;
    }
  };

  const getFilterData = async () => {

    setloading(true);

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    
    await axios
      .get(apiUrl + `FilterUpdateGet/${profile_data.user.id}`, { headers })
      .then((resp) => {
        setloading(false);

        let filter_data = resp.data.data;

        if (resp.data.code == 200) {
          let report_count = filter_data.userreportcount;
          let profile_appr = filter_data.is_profile_approved;

          setreports_count(report_count);
          setprofile_approved(profile_appr);

          let distance = filter_data.distance;
          let languages = filter_data.language?.length > 0 || filter_data.language != null ? filter_data.language.map((v) => v.id): []
          let minage = filter_data.age_min;
          let maxage = filter_data.age_max;
          let age_range = [minage, maxage];
          let minheight = filter_data.height_min;
          let maxheight = filter_data.height_max;
          let height_range = [minheight, maxheight];

          let sorted_tmp = filter_data.interests?.length > 0 || filter_data.interests != null ? filter_data.interests.sort(function (a, b) {
            return a["position"] - b["position"];
          }):[]
          
          let interests = filter_data.interests?.length || filter_data.interests != null ? sorted_tmp.map((v) => v.id): [];

          let habits_data = filter_data.habit;

          let smoking_t = habits_data.smoking
          let drinking_t = habits_data.drinking
          let marijuana_t = habits_data.marijuana
          
          let habits = [smoking_t,drinking_t,marijuana_t]
          
          dispatch(setSelectedDistance(distance));
          dispatch(setSelectedLanguages(languages));
          dispatch(setSelectedAgeRange(age_range));
          dispatch(setSelectedHeightRange(height_range));
          dispatch(setSelectedInterests(interests));
          dispatch(setSelectedHabits(habits));

          if (profile_call) {
            if (report_count > 10) {
              setwarn_step(3);
              setloading2(true);
            } else if (profile_appr === 0) {
              dispatch(setProfileApproved(false));
            } else {
              dispatch(setProfileApproved(true));
              getFilterProfiles();
            }
          } else {
            setfilter_data_get(true);
          }
        } else if (resp.data.code == 401) {
          dispatch(setSessionExpired(true));
        }
      })
      .catch((err) => {
        dispatch(setSessionExpired(true));
        setloading(false);
      });
  };

  const getGenders = async () => {
    setloading(true);

    await axios
      .get(apiUrl + "getactivegender/")
      .then((resp) => {

        if (resp.status == 200) {
          let tmp = resp.data.data;

          let sorted_tmp = tmp.sort(function (a, b) {
            return a["position"] - b["position"];
          });

          let tmp_lis = sorted_tmp.map((v) => [v.id, v.gender]);
          dispatch(setAllGenders(tmp_lis));
         
        }
      })
      .catch((err) => {
        dispatch(setSessionExpired(true));
        setloading(false);
      });
  };

  const getInterests = async () => {
    setloading(true);

    await axios
      .get(apiUrl + "getactiveinterest/")
      .then((resp) => {
        setloading(false);

        if (resp.status == 200) {
          let tmp = resp.data.data;

          let sorted_tmp = tmp.sort(function (a, b) {
            return a["position"] - b["position"];
          });

          let tmp_lis = sorted_tmp.map((v) => [
            v.id,
            v.interest,
            v.iconblue,
            v.icongrey,
          ]);

          dispatch(setAllInterests(tmp_lis));
        }
      })
      .catch((err) => {
        setloading(false);
        dispatch(setSessionExpired(true));
      });
  };

  const getLanguages = async () => {
    setloading(true);

    await axios
      .get(apiUrl + "getactivelanguage/")
      .then((resp) => {

        if (resp.status == 200) {
          let tmp = resp.data.data;

          let sorted_tmp = tmp.sort(function (a, b) {
            return a["position"] - b["position"];
          });

          let tmp_lis = sorted_tmp.map((v) => [v.id, v.language]);
          dispatch(setAllLanguges(tmp_lis));
        }
      })
      .catch((err) => {
        setloading(false);
        dispatch(setSessionExpired(true));
      });
  };

  const getPrompts = async () => {
    setloading(true);
    await axios
      .get(apiUrl + "getactiveprompts/")
      .then((resp) => {
        setloading(true);
        let resp_data = resp.data;

        if (resp.data.code == 200) {
          let act_prompts = resp_data.data.filter((c) => c.is_active == true);
          let act_promptsm = act_prompts.map((c) => [c.id, c.prompts]);

          dispatch(setAllPrompts(act_promptsm));
        } else if (resp.data.code == 401) {
          dispatch(setSessionExpired(true));
        } 
      })
      .catch((err) => {
        dispatch(setSessionExpired(true));
      });
  };

  const getFilterProfiles = async () => {

    setprofile_call(true);
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    await axios
      .get(apiUrl + "filter_user/" + profile_data.user.id + "?page=1", {
        headers,
      })
      .then((resp) => {
        
        let resp_data = resp.data.data;
        let resp_code = resp.data.code;

        if (resp_code == 204) {
          setwarn_step(2);
          setloading2(true);
          setempty_profile_call(true);
        } else if (resp_code == 200) {
          let active_profiles = resp_data.filter((v) => v.active == true);
          setprofiles(active_profiles);
          setloading2(false);
          setempty_profile_call(false);
        } else if (resp_code == 401) {
          dispatch(setSessionExpired(true));
        } else {
          setloading2(true);
          setempty_profile_call(false);
        }
      })
      .catch((err) => {
        dispatch(setSessionExpired(true));
      });
  };

  const getRejectedProfiles = async () => {
    setprofile_call(true);
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };


    await axios
      .get(apiUrl + "swap_again/" + profile_data.user.id, { headers })
      .then((resp) => {
        let resp_data = resp.data;
        if (resp_data.length == 0) {
          setwarn_step(2);
          setloading2(true);
        } else if (resp_data.length > 0) {
          setempty_profile_call(false);
          let active_profiles = resp_data.filter((v) => v.active == true);
          setprofiles(active_profiles);

          setloading2(false);
        }
        
      })
      .catch((err) => {
      });
  };

  useEffect(() => {
    if (
      appStateVisible == "active" &&
      permission_denied &&
      redirect_to_settings
    ) {
      setredirect_to_settings(false);
      getData();
      dispatch(setProfileRefresh(!profile_refresh));
    }
  }, [appStateVisible]);

  useEffect(() => {
    if (profiles.length == 0) {
      if (!empty_profile_call) {
        dispatch(setProfileRefresh(!profile_refresh));
      }
      setwarn_step(2);
      setloading2(true);
    }
  }, [profiles]);

  const startFillingPrompts = async () => {
    setloading(true);
    const data = {
      user_id: profile_data.user.id,
    };

    const headers = {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(
        apiUrl + "promptsfillingstarted/",
        data,
        {
          headers,
        }
      );
      let resp_data = response.data;

      setloading(false);

      if (resp_data.code == 200) {
        dispatch(setPromptFillingStart(true));
      } else {
        return false;
      }
    } catch (error) {
      setloading(false);
      dispatch(setSessionExpired(true));
      return false;
    }
  };

  useEffect(() => {
    let prv_prmt = profile_data?.userprivateprompts;
    if (promptTime && prv_prmt.length == 0) {
      startFillingPrompts();
    }
  }, [promptTime]);

  useEffect(() => {
    let prv_prmt = profile_data?.userprivateprompts;
    if (is_promptsfillingstarted && prv_prmt.length == 0) {
      setpromptsmodalVisible(true);
    }
  }, [is_promptsfillingstarted]);

  useLayoutEffect(() => {
    if (current_lat && current_long && current_address) {
      dispatch(
        setActiveUserLocationDetails({
          ...active_user_loc_det,
          longitude: current_long,
          latitude: current_lat,
          location: current_address,
        })
      );
    }
  }, [current_lat, current_long, current_address]);

  const getIp = () => {
    // Ip Function temporary commentet because it takes too long to load
    publicIP()
      .then((ip) => {
        setmob_ip(ip);
      })
      .catch((error) => {
        dispatch(setSessionExpired(true));
        setloading2(true);
      });
  };

  const requestNotificaionPermission = async () => {
    if (Platform.OS == "ios") {
      const authStatus = await messaging().requestPermission();
    } else if (Platform.OS == "android") {
      let ntf_per = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
    }
  };

  const getData = useCallback(() => {
    getLocation();
    getIp();
  }, []);

  useLayoutEffect(() => {
    setloading2(true);
    setwarn_step(0);
    getGenders();
    getInterests();
    getLanguages();
    getFilterData();
    getPrompts();
  }, [profile_refresh]);

  useEffect(() => {
    
    if (permission_denied) {
      setloading2(true);
      setwarn_step(4);
    } else if (
      filter_data_get &&
      current_lat &&
      current_long &&
      current_address
    ) {
      addLocation();
    }
  }, [
    mob_ip,
    permission_denied,
    current_lat,
    current_long,
    current_address,
    filter_data_get,
  ]);

  const initPer = async () => {
    if (!profile_call) {
      setTimeout(() => {
        requestNotificaionPermission().then(() => {
          getData();
        });
      }, 500);
    }
  };

  useEffect(() => {
    setloading2(true);
    setwarn_step(0);
    initPer();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused

      if (profile_approv == false) {
        setwarn_step(5);
        setloading2(true);
      }

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [profile_approv])
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <SafeAreaView
        style={{
          height: scrn_height,
        }}
      >
        {!loading && !loading2 && !promptsmodalVisible ? (
          <SafeAreaView
            style={{
              flex: 1,
            }}
          >
            <FlatList
              pagingEnabled
              contentContainerStyle={{
                flexGrow: 1,
                borderWidth: 1,
                borderColor: "#fff",
              }}
              bounces={false}
              data={profiles}
              keyExtractor={(itm) => itm.created_on}
              renderItem={({ item, index }) => {
                const isFirst = index == profiles.length - 1;
    
                return (
                  <SwipeCard
                    card_itm={item}
                    iconRotate={iconRotate}
                    iconTranslateX={iconTranslateX}
                    iconTranslateY={iconTranslateY}
                    handleChoiceButtons={handleChoiceButtons}
                    isFirst={isFirst}
                    swipe={swipe}
                    scaleValue={scaleValue}
                    leftX={leftX}
                    rightX={rightX}
                    upY={upY}
                    mainIndex={index}
                    setswippingcount={setswippingcount}
                    swippingcount={swippingcount}
                  />
                );
              }}
            />
            
          </SafeAreaView>
        ) : (
          // Loading Container
          <View style={{ ...styles.container, alignItems: "center" }}>
            <View style={styles.loadingCont}>
              {/* Filter */}
              {warn_step != 4 && (
                <TouchableOpacity
                  style={{
                    ...styles.filterCont,
                  }}
                  onPress={() => {
                    setshowFilter(!showFilter);
                  }}
                >
                  <Image
                    source={require("../../assets/images/Swiping/Filter3.png")}
                    style={{ width: 26, height: 26 }}
                  />
                </TouchableOpacity>
              )}
              <View style={styles.loadingTitleCont}>
                <Text style={styles.loadingTitle}>
                  {/* Hey! Give us a few {'\n'} seconds. */}
                  {warning_list[warn_step][0]}
                </Text>
              </View>

              <View>
                <Text style={styles.loadingPara}>
                  {/* We are fetching the right {'\n'} people for you! */}
                  {warning_list[warn_step][1]}
                </Text>
              </View>

              {/* Warn Btn */}
              {warning_list[warn_step].length > 2 && (
                <TouchableOpacity
                  style={styles.loadingBtn}
                  onPress={() => {
                    if (warn_step == 2) {
                      getRejectedProfiles();
                    }
                    if (warn_step == 5) {
                      navigation.navigate("PhotoVerification");
                    }
                    if (warn_step == 4) {
                      setredirect_to_settings(true);
                      if (Platform.OS == "ios") {
                        Linking.openURL("app-settings:");
                      } else {
                        Linking.openSettings();
                      }
                    }
                  }}
                >
                  <Text style={styles.loadingBtnTxt}>
                    {" "}
                    {warning_list[warn_step][2]}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Prompts Modal */}
        <FullModal
          modalVisible={promptsmodalVisible}
          setModalVisible={setpromptsmodalVisible}
        >
          {promptStep == 1 ? (
            <PromptIntro setpromptStep={setpromptStep} />
          ) : promptStep == 2 ? (
            <PublicPrompts
              public_prompt1_q={public_prompt1_q}
              setpublic_prompt1_q={setpublic_prompt1_q}
              public_prompt1_a={public_prompt1_a}
              setpublic_prompt1_a={setpublic_prompt1_a}
              public_prompt2_q={public_prompt2_q}
              setpublic_prompt2_q={setpublic_prompt2_q}
              public_prompt2_a={public_prompt2_a}
              setpublic_prompt2_a={setpublic_prompt2_a}
              prompts_list_rmv={prompts_list_rmv}
              setprompts_list_rmv={setprompts_list_rmv}
              prompts_list={prompts_list_all}
              setpromptStep={setpromptStep}
            />
          ) : promptStep == 3 ? (
            <PrivatePrompts
              private_prompt1_q={private_prompt1_q}
              setprivate_prompt1_q={setprivate_prompt1_q}
              private_prompt1_a={private_prompt1_a}
              setprivate_prompt1_a={setprivate_prompt1_a}
              private_prompt2_q={private_prompt2_q}
              setprivate_prompt2_q={setprivate_prompt2_q}
              private_prompt2_a={private_prompt2_a}
              setprivate_prompt2_a={setprivate_prompt2_a}
              prompts_list_rmv={prompts_list_rmv}
              setprompts_list_rmv={setprompts_list_rmv}
              prompts_list={prompts_list_all}
              setpromptStep={setpromptStep}
            />
          ) : (
            <ReferralCode
              public_prompt1_q={public_prompt1_q}
              setpublic_prompt1_q={setpublic_prompt1_q}
              public_prompt1_a={public_prompt1_a}
              setpublic_prompt1_a={setpublic_prompt1_a}
              public_prompt2_q={public_prompt2_q}
              setpublic_prompt2_q={setpublic_prompt2_q}
              public_prompt2_a={public_prompt2_a}
              setpublic_prompt2_a={setpublic_prompt2_a}
              private_prompt1_q={private_prompt1_q}
              setprivate_prompt1_q={setprivate_prompt1_q}
              private_prompt1_a={private_prompt1_a}
              setprivate_prompt1_a={setprivate_prompt1_a}
              private_prompt2_q={private_prompt2_q}
              setprivate_prompt2_q={setprivate_prompt2_q}
              private_prompt2_a={private_prompt2_a}
              setprivate_prompt2_a={setprivate_prompt2_a}
              setModalVisible={setpromptsmodalVisible}
            />
          )}
        </FullModal>

        {/* Filter Modal */}
        <FullModal modalVisible={showFilter} setModalVisible={setshowFilter}>
          <Filters
            filterRefresh={filterRefresh}
            setfilterRefresh={setfilterRefresh}
            modalVisible={showFilter}
            setModalVisible={setshowFilter}
          />
        </FullModal>
      </SafeAreaView>
    </View>
  );
};

export default memo(SwiperOr);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: rspW(5.1),
    flex: 1,
    backgroundColor: colors.white,
  },

  // Loading View
  loadingCont: {
    height: scrn_height - rspH(18),
    width: scrn_width,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingTitleCont: {
    marginBottom: rspH(3.5),
  },
  loadingTitle: {
    lineHeight: rspF(3.35),
    fontFamily: fontFamily.bold,
    fontSize: rspF(3.308),
    color: colors.blue,
    textAlign: "center",
    letterSpacing: 1,
  },

  loadingPara: {
    lineHeight: rspH(3.35),
    fontSize: rspF(2.38),
    color: colors.black,
    fontFamily: fontFamily.regular,
    textAlign: "center",
  },
  loadingBtn: {
    position: "absolute",
    bottom: rspH(5),
    width: rspW(69),
    height: rspH(5.62),
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: rspW(8),
    justifyContent: "center",
  },

  loadingBtnTxt: {
    textAlign: "center",
    fontSize: rspF(1.9),
    fontFamily: fontFamily.bold,
    color: colors.blue,
    lineHeight: rspF(1.96),
  },

  // Main Screen
  dotsCont: {
    width: rspW(6.05),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "flex-end",
    marginRight: rspW(5.5),
  },
  dots: {
    backgroundColor: colors.blue,
    width: rspW(1),
    borderRadius: rspW(0.51),
    aspectRatio: 1,
    marginVertical: rspH(1.1),
  },

  imageCont: {
    width: rspW(89),
    height: rspH(42),
    borderRadius: rspW(5.1),
    position: "relative",
  },

  item: {
    borderRadius: rspW(5.1),
    width: rspW(89),
  },

  // Fetures Styling
  featuresCont: {
    position: "absolute",
    alignSelf: "center",
    bottom: rspH(0.6),
  },

  filterCont: {
    top: rspH(1.2),
    right: rspW(2.5),
    width: rspW(12.76),
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: rspW(7),
    position: "absolute",
    alignSelf: "flex-end",
  },
});
