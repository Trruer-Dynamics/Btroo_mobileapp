import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Platform,
  FlatList,
  Animated,
} from "react-native";
import React, { useState, useRef } from "react";
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
import { useSelector } from "react-redux";
import {
  DrinkingNo,
  DrinkingYes,
  MarijuanaNo,
  MarijuanaYes,
  SmokingNo,
  SmokingYes,
} from "../../assets";
import { useFocusEffect } from "@react-navigation/native";
import FormHeader from "../../components/wrappers/formWrappers/FormHeader";
import truncateStr from "../../components/functions/truncateStr";
import Paginator from "../../components/screenComponents/swiping/Paginator";
import FullModal from "../../components/modals/FullModal";

const Item2 = ({ item }) => {
  let imageUri = String(item[0]);

  return (
    <View style={styles.item2}>
      <Image
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

  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );
  const profile_imgs = useSelector(
    (state) => state.authentication.profile_imgs
  );

  const [active_prf_imgs, setactive_prf_imgs] = useState([]);
  const [modalVisible, setmodalVisible] = useState(false);
  const [currentIndex3, setcurrentIndex3] = useState(0);

  const scrollX3 = useRef(new Animated.Value(0)).current;
  const slidesRef3 = useRef(null);

  const viewableItemsChanged3 = useRef(({ viewableItems }) => {
    setcurrentIndex3(viewableItems[0]?.index);
  }).current;

  const viewConfig3 = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const [age, setage] = useState("");

  const [pets_list, setpets_list] = useState([]);
  const [interest_list, setinterest_list] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused

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
      ]);

      setpets_list(usr_pets);

      let usr_interest = profile_data?.userinterest.map((v) => [
        v.interestmaster.id,
        v.interestmaster.iconblue,
      ]);

      // console.log("usr_interest",usr_interest[0])
      setinterest_list(usr_interest);

      let actv = profile_imgs.filter((v) => v[0] != "");
      console.log("profile_imgs",profile_imgs[0])
      setactive_prf_imgs(actv);

      return () => {
        // Do something when the screen is unfocused
      };
    }, [profile_data, profile_imgs])
  );

  // Full Screen Carosel Item Render Function
  const renderItem2 = ({ item, index }) => {
    return <Item2 item={item} />;
  };

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
              (profile_data?.userprofile?.name.split(" ")[0].length < 8
                ? profile_data?.userprofile?.name.split(" ")[0]
                : truncateStr(
                    profile_data?.userprofile?.name.split(" ")[0],
                    7
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
              <Image
                style={styles.profileImage}
                source={{ uri: profile_imgs[0][1] }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("EditProfile");
              }}
              style={styles.editBtn}
            >
              <Text style={styles.editBtnTxt}>Edit My Profile</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
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
                    <Image
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
                      {profile_data?.userprofile?.city?.length > 11
                        ? profile_data?.userprofile?.city.substring(0, 7) +
                          "..."
                        : profile_data?.userprofile?.city}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Image
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
                            7
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
                    <Image
                      source={
                        profile_data?.userprofile?.drinking
                          ? DrinkingYes
                          : DrinkingNo
                      }
                      style={{
                        ...styles.habitsImage,
                      }}
                    />
                    <Image
                      source={
                        profile_data?.userprofile?.smoking
                          ? SmokingYes
                          : SmokingNo
                      }
                      style={{
                        ...styles.habitsImage,
                      }}
                    />
                    <Image
                      source={
                        profile_data?.userprofile?.marijuana
                          ? MarijuanaYes
                          : MarijuanaNo
                      }
                      style={{
                        ...styles.habitsImage,
                      }}
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
                    <Image
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
                            8
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
                    <Image
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
                    bounces={false}
                    style={{ marginTop: rspH(0.8) }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  >
                    {pets_list.map((img, indx) => {
                      return (
                        <Image
                          source={{ uri: img[1] }}
                          style={styles.interestImage}
                          resizeMode="cover"
                        />
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
                  bounces={false}
                  style={{ marginTop: rspH(0.8) }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  {interest_list.map((img, idx) => {
                    return (
                      <Image
                        source={{ uri: img[1] }}
                        style={styles.interestImage}
                        resizeMode="cover"
                      />
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
                  bounces={false}
                  style={{ marginTop: rspH(0.8) }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  {languages.map((lng, idx) => {
                    return (
                      <View
                        style={{
                          paddingHorizontal: 15,
                          borderRadius: 5,
                          marginRight: 10,
                          backgroundColor: colors.lightBlue + "99",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            ...styles.profileDetailContHeading,
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
            <ADIcon size={20} name="left" color={"#fff"} />
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
    // width: rspW(23.6),
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
    height: rspH(4.7),
    resizeMode: "contain",
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
