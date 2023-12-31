import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  FlatList,
  Animated,
  Image,
} from "react-native";
import React, { useState, useRef, useContext } from "react";
import ADIcon from "react-native-vector-icons/AntDesign";
import {
  rspF,
  rspH,
  rspW,
  scrn_height,
  scrn_width,
} from "../../styles/responsiveSize";
import colors from "../../styles/colors";
import fontFamily from "../../styles/fontFamily";
import { useDispatch, useSelector } from "react-redux";
import {
  Backward,
  BirdBlue,
  DrinkingNo,
  DrinkingYes,
  MarijuanaNo,
  MarijuanaYes,
  SmokingNo,
  SmokingYes,
} from "../../assets";
import * as icn from '../../assets'
import { useFocusEffect } from "@react-navigation/native";
import FormHeader from "../../components/wrappers/formWrappers/FormHeader";
import truncateStr from "../../components/functions/truncateStr";
import Paginator from "../../components/screenComponents/swiping/Paginator";
import FullModal from "../../components/modals/FullModal";
import FastImage from "react-native-fast-image";
import axios from "axios";
import { apiUrl } from "../../constants";
import {
  setAccessToken,
  setProfileImgs,
  setProfiledata,
  setPromptFillingComplete,
  setPromptFillingStart,
} from "../../store/reducers/authentication/authentication";
import {
  setChatRevealTut,
  setChatTut,
  setMatchTut,
  setSwipeTut,
} from "../../store/reducers/tutorial/tutorial";
import { UserContext } from "../../context/user";

const Item2 = ({ item }) => {
  let imageUri = String(item[0]);

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

const ProfileMain = ({ navigation }) => {
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

  const dispatch = useDispatch();

  const { appStateVisible } = useContext(UserContext);

  const scrollViewRef = useRef();
  const scrollPetsRef = useRef();
  const scrollInterestsRef = useRef();
  const scrollLanguagesRef = useRef();



  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );
  const profile_imgs = useSelector(
    (state) => state.authentication.profile_imgs
  );

  const is_network_connected = useSelector(
    (state) => state.authentication.is_network_connected
  );


  const [active_prf_imgs, setactive_prf_imgs] = useState([]);
  const [modalVisible, setmodalVisible] = useState(false);
  const [currentIndex3, setcurrentIndex3] = useState(0);
  const [prof_refs, setprof_refs] = useState(false);

  const scrollX3 = useRef(new Animated.Value(0)).current;
  const slidesRef3 = useRef(null);

  const viewableItemsChanged3 = useRef(({ viewableItems }) => {
    setcurrentIndex3(viewableItems[0]?.index);
  }).current;

  const viewConfig3 = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const [age, setage] = useState("");
  const [pets_list, setpets_list] = useState([]);
  const [interest_list, setinterest_list] = useState([]);

  const getData = async () => {
    await axios
      .get(apiUrl + "login/?user_id=" + profile_data.user.id)
      .then((resp) => {
        let user_data = resp.data.data;
        let status_code = resp.data.code;

        if (status_code == 200) {
          let act_prompts = user_data.userprofile.publicprompts.filter(
            (c) => c.active == true
          );
          let act_promptsm = act_prompts.map((c) => [
            [c.promptsmaster, c.question],
            c.answer,
          ]);
          let act_prompts2 = user_data.userprofile.privateprompts.filter(
            (c) => c.active == true
          );
          let act_promptsm2 = act_prompts2.map((c) => [
            [c.promptsmaster, c.question],
            c.answer,
          ]);

          let resp_imgs = user_data.userprofile.image.sort((a, b) => {
            let pos1 = a.position;
            let pos2 = b.position;
            if (pos1 < pos2) return -1;
            if (pos1 > pos2) return 1;
            return 0;
          });

          // // create a empty data list format for 9 images
          let tmp1 = [
            ["", "", false, "1", ""],
            ["", "", false, "2", ""],
            ["", "", false, "3", ""],
            ["", "", false, "4", ""],
            ["", "", false, "5", ""],
            ["", "", false, "6", ""],
            ["", "", false, "7", ""],
            ["", "", false, "8", ""],
            ["", "", false, "9", ""],
          ];

          // set images with active status
          k = 0;
          for (const img of resp_imgs) {
            if ((resp_imgs.length > 1 && k > 0) || resp_imgs.length == 1) {
              tmp1[k + 1] = ["", "", true, k + 2, ""];
            }

            tmp1[k] = [img.image, img.cropedimage, true, k + 1, img.id];
            k += 1;
          }

          dispatch(setProfileImgs(tmp1));

          let usrprf_dt = {
            ...profile_data.userprofile,
            city: user_data.userprofile.city,
            education: user_data.userprofile.education,
            occupation: user_data.userprofile.occupation,
            drinking: user_data.userprofile.drinking,
            marijuana: user_data.userprofile.marijuana,
            smoking: user_data.userprofile.smoking,
            gender: user_data.userprofile.gender,
            height: user_data.userprofile.height,
            keepmatchingnotification:
              user_data.userprofile.keepmatchingnotification,
            newmatchnotification: user_data.userprofile.newmatchnotification,
            newmessagenotification:
              user_data.userprofile.newmessagenotification,
            othernotification: user_data.userprofile.othernotification,
            showmyprofilenotification:
              user_data.userprofile.showmyprofilenotification,
            profilerevealnotification:
              user_data.userprofile.profilerevealnotification,
          };


          let user_prof_data = {
            ...profile_data,
            user: profile_data.user,
            userinterest: user_data.userprofile.interest,
            userpets: user_data.userprofile.pets,
            userpreferances: profile_data.userpreferances,
            userprofile: usrprf_dt,
            userpublicprompts: act_promptsm,
            userprivateprompts: act_promptsm2,
          };
          dispatch(setProfiledata(user_prof_data));

        }
      })
      .catch((err) => {});
  };


  const userExist = async () =>{

    let url_path = 'isacountavialable/'

    const data = {
      user_id: profile_data.user.id,
    };

    const headers = {
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

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
      scrollPetsRef.current.scrollTo({ y: 0, animated: true });
      scrollInterestsRef.current.scrollTo({ y: 0, animated: true });
      scrollLanguagesRef.current.scrollTo({ y: 0, animated: true });

      let dob = new Date(profile_data?.userprofile?.dob);

      var today = new Date();

      var age = today.getFullYear() - dob.getFullYear();
      var m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      setage(age);

      let lang_tmp = profile_data?.userlanguages.map(
        (v) => v?.languagemaster?.language
      );

      setlanguages(lang_tmp);

      let usr_pets = profile_data?.userpets.map((v) => [
        v.petmaster.id,
        v.petmaster.iconblue,
        v.petmaster.pets
      ]);

      setpets_list(usr_pets);

      let usr_interest = profile_data?.userinterest.map((v) => [
        v.interestmaster.id,
        v.interestmaster.iconblue,
        v.interestmaster.interest
      ]);
     
      setinterest_list(usr_interest);
      let actv = profile_imgs.filter((v) => v[0] != "");
      setactive_prf_imgs(actv);

      setprof_refs(true)

      return () => {
        setprof_refs(false)
        // Do something when the screen is unfocused
      };
    }, [profile_data])
  );

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      if (prof_refs) {
        getData();  
      }
      
      return () => {
        // Do something when the screen is unfocused
      };
    }, [prof_refs,is_network_connected])
  );

  // Full Screen Carosel Item Render Function
  const renderItem2 = ({ item, index }) => {
    return <Item2 item={item} />;
  };

  useFocusEffect(
    React.useCallback(() => {
      if (appStateVisible == 'active') {
        userExist()
      }
    }, [appStateVisible])
  );

  return (
    <View style={{ height: scrn_height, backgroundColor: "#fff" }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            paddingTop: rspH(3),
          }}
        >
          <FormHeader
            title={
              (profile_data?.userprofile?.name.split(" ")[0].length < 9
                ? profile_data?.userprofile?.name.split(" ")[0]
                : truncateStr(
                    profile_data?.userprofile?.name.split(" ")[0],
                    8
                  )) +
              ", " +
              age
            }
            para=""
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
            <TouchableOpacity
              onPress={() => {
                setmodalVisible(true);
              }}
            >
              {Platform.OS == "android" ? (
                <FastImage
                  useLastImageAsDefaultSource
                  style={styles.profileImage}
                  source={{
                    uri: profile_imgs[0][1],
                  }}
                />
              ) : (
                <Image
                  style={styles.profileImage}
                  source={{
                    uri: profile_imgs[0][1],
                  }}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (is_network_connected) {
                  navigation.navigate("EditProfile");  
                }
                
              }}
              style={{...styles.editBtn, opacity: is_network_connected? 1 : 0.4}}
            >
              <Text style={styles.editBtnTxt}>Edit My Profile</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
          ref={scrollViewRef}
          decelerationRate={0.9}
            showsVerticalScrollIndicator={false}
            bounces={true}
            style={{
              marginVertical: rspH(2.16),
            }}
          >
            <View
              style={{
                paddingTop: rspH(1.2),
                paddingBottom: rspH(9.64),

                width: scrn_width / 1.2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 1,
                }}
              >
                {/* Profile Detail Container */}
                <View
                  style={{
                    ...styles.profileDetailCont,
                    ...styles.boxShadowCont,
                    paddingHorizontal: rspW(3.2),
                    justifyContent: "center",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FastImage
                      source={require("../../assets/images/Swiping/BioIcons/City.png")}
                      

                      style={{
                        width: rspW(6.75),
                        height: rspH(3),
                        marginRight: rspW(2),
                      }}
                    />
                    <Text
                      style={styles.profileDetailContNText}
                      numberOfLines={1}
                    >
                      {/* {profile_data?.userprofile?.city?.length > 11
                        ? profile_data?.userprofile?.city.substring(0, 8) +
                          "..."
                        : profile_data?.userprofile?.city} */}

{profile_data?.userprofile?.city.split(",")[0]?.length > 11
                          ? profile_data?.userprofile?.city
                              .split(",")[0]
                              .substring(0, 9) + "..."
                          : profile_data?.userprofile?.city.split(",")[0]}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <FastImage
                      source={require("../../assets/images/Swiping/BioIcons/Education.png")}
                      style={{
                        width: rspW(6.75),
                        height: rspH(3),
                        marginRight: rspW(2),
                      }}
                    />
                    <Text
                      numberOfLines={1}
                      style={styles.profileDetailContNText}
                    >
                      {profile_data?.userprofile?.education?.length > 11
                        ? profile_data?.userprofile?.education?.substring(
                            0,
                            9
                          ) + "..."
                        : profile_data?.userprofile?.education}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    ...styles.profileDetailCont,
                    ...styles.boxShadowCont,
                    paddingHorizontal: rspW(3.2),
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <FastImage
                      source={
                        profile_data?.userprofile?.drinking
                          ? DrinkingYes
                          : DrinkingNo
                      }
                      style={{
                        ...styles.habitsImage,
                      }}
                      resizeMode="contain"
                    />
                    <FastImage
                      source={
                        profile_data?.userprofile?.smoking
                          ? SmokingYes
                          : SmokingNo
                      }
                      style={{
                        ...styles.habitsImage,
                      }}
                      resizeMode="contain"
                    />
                    <FastImage
                      source={
                        profile_data?.userprofile?.marijuana
                          ? MarijuanaYes
                          : MarijuanaNo
                      }
                      style={{
                        ...styles.habitsImage,
                      }}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </View>

              {profile_data?.userpublicprompts?.length > 0 && (
                <View style={styles.promptContainer}>
                  <View style={styles.promptQuestionContainer}>
                    <Text style={styles.promptQuestion}>
                      {profile_data?.userpublicprompts[0][0][1]}
                    </Text>
                  </View>
                  <Text style={styles.promptAnswer}>
                    {profile_data?.userpublicprompts[0][1]}
                  </Text>
                </View>
              )}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 1,
                }}
              >
                <View
                  style={{
                    ...styles.profileDetailCont,
                    ...styles.boxShadowCont,
                    paddingHorizontal: rspW(3.2),
                    justifyContent: "center",
                    marginTop: rspH(2.9),
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingBottom: rspH(0.4),
                    }}
                  >
                    <FastImage
                      source={require("../../assets/images/Swiping/BioIcons/Occupation.png")}
                      style={{
                        width: rspW(6.75),
                        height: rspH(3),
                        marginRight: rspW(2),
                      }}
                    />
                    <Text
                      style={{ ...styles.profileDetailContNText }}
                      numberOfLines={1}
                    >
                      {profile_data?.userprofile?.occupation?.length > 11
                        ? profile_data?.userprofile?.occupation.substring(
                            0,
                            9
                          ) + "..."
                        : profile_data?.userprofile?.occupation}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    <FastImage
                      source={require("../../assets/images/Swiping/BioIcons/Height.png")}
                      style={{
                        width: rspW(6.75),
                        height: rspH(3),
                        marginRight: rspW(2),
                      }}
                    />
                    <Text style={{ ...styles.profileDetailContNText }}>
                      {profile_data?.userprofile?.height} cms
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    ...styles.profileDetailsSubCont2,
                    ...styles.boxShadowCont,
                    width: rspW(39.5),
                  }}
                >
                  <Text style={styles.profileDetailContHeading}>Pets</Text>
                  <ScrollView
                  decelerationRate={0.9}
                    bounces={false}
                    style={{ marginTop: rspH(0.8) }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ref={scrollPetsRef}
                  >
                    {pets_list.map((img, indx) => {

                      let img1 = img[2]
                      if (img[2].split(' ').length > 1) {
                        let itmlis = img[2].split(' ')
                         img1 = itmlis.join('')
                      }

                      return (
                        <View key={indx}>
                          {Platform.OS == "ios" ? (
                            <Image
                              source={icn[`${img[2]}Blue`]}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                          ) : (
                            <FastImage
                              useLastImageAsDefaultSource
                              source={{ uri: img1 }}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                          )}
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>

              {profile_data?.userpublicprompts?.length > 0 && (
                <View style={styles.promptContainer}>
                  <View style={styles.promptQuestionContainer}>
                    <Text style={styles.promptQuestion}>
                      {profile_data?.userpublicprompts[1][0][1]}
                    </Text>
                  </View>
                  <Text style={styles.promptAnswer}>
                    {profile_data?.userpublicprompts[1][1]}
                  </Text>
                </View>
              )}

              <View
                style={{
                  ...styles.profileDetailsSubCont2,
                  ...styles.boxShadowCont,
                }}
              >
                <Text style={styles.profileDetailContHeading}>Interests</Text>
                <ScrollView
                decelerationRate={0.9}
                  bounces={false}
                  style={{ marginTop: rspH(0.8) }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ref={scrollInterestsRef}
                >
                  {interest_list.map((img, idx) => {

                    let img1 = img[2]
                    if (img[2].split(' ').length > 1) {
                      let itmlis = img[2].split(' ')
                       img1 = itmlis.join('')
                    }
                    return (
                      <View key={idx}>
                        {Platform.OS == "ios" ? (
                          <Image
                            source={icn[`${img1}Blue`]}
                            style={styles.interestImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <FastImage
                            useLastImageAsDefaultSource
                            source={{ uri: img[1] }}
                            style={styles.interestImage}
                            resizeMode="cover"
                          />
                        )}
                      </View>
                    );
                  })}
                </ScrollView>
              </View>

              {profile_data?.userprivateprompts?.length > 0 && (
                <View style={styles.promptContainer}>
                  <View style={styles.promptQuestionContainer}>
                    <Text style={styles.promptQuestion}>
                      {profile_data?.userprivateprompts[0][0][1]}
                    </Text>
                  </View>
                  <Text style={styles.promptAnswer}>
                    {profile_data?.userprivateprompts[0][1]}
                  </Text>
                </View>
              )}

              <View
                style={{
                  ...styles.profileDetailsSubCont2,
                  ...styles.boxShadowCont,
                  paddingBottom: rspH(1.67),
                }}
              >
                <Text style={styles.profileDetailContHeading}>Languages</Text>
                <ScrollView
                decelerationRate={0.9}
                  bounces={false}
                  style={{ marginTop: rspH(0.8) }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ref={scrollLanguagesRef}
                >
                  {languages.map((lng, idx) => {
                    return (
                      <View
                        key={idx}
                        style={{
                          paddingHorizontal: 15,
                          borderRadius: 5,
                          marginRight: 10,
                          backgroundColor: colors.blue,

                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            ...styles.profileDetailContHeading,
                            color: colors.white,
                            textAlign: "center",
                          }}
                        >
                          {lng}
                        </Text>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>

              {profile_data?.userprivateprompts?.length > 0 && (
                <View style={styles.promptContainer}>
                  <View style={styles.promptQuestionContainer}>
                    <Text style={styles.promptQuestion}>
                      {profile_data?.userprivateprompts[1][0][1]}
                    </Text>
                  </View>
                  <Text style={styles.promptAnswer}>
                    {profile_data?.userprivateprompts[1][1]}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>

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
                  style={{width: '80%', height:'70%'}}
                  resizeMode="contain"
                          />
          </TouchableOpacity>

          <FlatList
            initialScrollIndex={0}
            data={active_prf_imgs}
            renderItem={renderItem2}
            keyExtractor={(item) => item[0]}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX3 } } }],
              {
                useNativeDriver: false,
              }
            )}
            scrollEventThrottle={32}
            onViewableItemsChanged={viewableItemsChanged3}
            viewabilityConfig={viewConfig3}
            ref={slidesRef3}
          />

          <Paginator data={active_prf_imgs} currentIndex={currentIndex3} />
        </View>
      </FullModal>
    </View>
  );
};

export default ProfileMain;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  profileImage: {
    width: rspW(21.64),
    height: rspW(21.64),
    marginBottom: rspH(1.4),
    borderRadius: rspW(43.3),
  },

  editBtn: {
    justifyContent: "center",
    backgroundColor: colors.white,
    paddingHorizontal: rspW(5),
    height: rspH(3),
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
    borderRadius: rspW(3.1),
    borderWidth: 1,
    borderColor: colors.blue,
  },
  editBtnTxt: {
    textAlign: "center",
    fontFamily: fontFamily.bold,
    color: colors.black,
    fontSize: rspF(1.76),
    lineHeight: rspF(1.78),
    letterSpacing: 1,
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
  promptContainer: {
    width: rspW(82),
    marginTop: rspH(2.35),
    marginBottom: rspH(-1.7),
    paddingHorizontal: rspW(2.5),
    paddingVertical: rspH(0.6),
  },
  promptQuestionContainer: {
    marginBottom: rspH(0.6),
  },
  promptQuestion: {
    fontFamily: fontFamily.bold,
    fontSize: rspF(1.66),
    color: colors.black,
    lineHeight: rspF(2.1),
    letterSpacing: 1,
  },
  promptAnswer: {
    fontFamily: fontFamily.light,
    fontSize: rspF(1.66),
    color: colors.black,
    lineHeight: rspF(2.18),
    letterSpacing: 1,
  },

  habitsImage: {
    width: rspW(10.1),
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
