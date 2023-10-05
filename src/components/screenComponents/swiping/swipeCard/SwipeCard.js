import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Image,
  StatusBar,
  TouchableWithoutFeedback,
} from "react-native";

import {
  TouchableOpacity as TouchableOpacityB,
  ScrollView,
} from "react-native-gesture-handler";

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  memo,
} from "react";
import {
  rspF,
  rspH,
  rspW,
  scrn_height,
  scrn_width,
} from "../../../../styles/responsiveSize";
import colors from "../../../../styles/colors";
import fontFamily from "../../../../styles/fontFamily";
import { FlatList } from "react-native-gesture-handler";
import FullModal from "../../../../components/modals/FullModal";
import ADIcon from "react-native-vector-icons/AntDesign";
import FAIcon from "react-native-vector-icons/FontAwesome";
import Paginator from "../../../../components/screenComponents/swiping/Paginator";
import { useDispatch, useSelector } from "react-redux";
import PromptIntro from "../Prompts/PromptIntro";
import PublicPrompts from "../Prompts/PublicPrompts";
import PrivatePrompts from "../Prompts/PrivatePrompts";
import ReferralCode from "../Prompts/ReferralCode";
import Report from "../Report/Report";
import Filters from "../Filters/Filters";
import { apiUrl } from "../../../../constants";
import {
  DrinkingNo,
  DrinkingYes,
  MarijuanaNo,
  MarijuanaYes,
  SmokingNo,
  SmokingYes,
} from "../../../../assets";
import axios from "axios";

import {
  setSessionExpired,
  setStatusBarArgs,
} from "../../../../store/reducers/authentication/authentication";
import FastImage from "react-native-fast-image";
import { withTiming } from "react-native-reanimated";

const Item = ({
  item,
  setmodalVisible,
  super_liked_profile,
  currentIndex,
  index,
}) => {
  let imageUri = String(item.cropedimage);

  const [img_load, setimg_load] = useState(false);

  return (
    // <View
    //   style={{
    //     ...styles.item,
    //     zIndex: 2,
    //     position: "relative",
    //   }}
    // >
      <TouchableOpacityB
      style={{
        ...styles.item,
        zIndex: 2,
        position: "relative",
      }}
      
        activeOpacity={1}
        onPress={() => {
          setmodalVisible(true);
        }}
      >
        <>
          {super_liked_profile && (
            <>
              <View
                style={{
                  position: "absolute",
                  top: rspH(0.54),
                  left: 0,
                  zIndex: 2,
                }}
              >
                <FastImage
                  source={require("../../../../assets/images/Swiping/Actions/Softspot.png")}
                  style={{
                    width: rspW(14.5),
                    height: rspH(7),
                  }}
                />
              </View>

              <FastImage
                source={require("../../../../assets/images/Swiping/Masked/Exclude_2.png")}
                style={{
                  width: rspW(89),
                  height: rspH(42.2),
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 1,
                }}
                resizeMode="stretch"
              />
            </>
          )}

          <FastImage
            source={{ uri: imageUri }}
            style={{
              backgroundColor: !img_load ? "#b1b1b1" : "#00000000",
              width: "100%",
              height: "100%",
              borderRadius: rspW(5.1),
            }}
            resizeMode="cover"
            onLoad={() => {
              setimg_load(true);
            }}
          />
        </>
      </TouchableOpacityB>
    // {/* </View> */}
  );
};

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

const SwipeCard = ({
  card_itm,
  isFirst,
  swipe,
  leftX,
  rightX,
  upY,
  scaleValue,
  handleChoiceButtons,
  iconRotate,
  iconTranslateX,
  iconTranslateY,
  swippingcount,
  mainIndex,
  setswippingcount = null,
}) => {
  // Report Control
  const [openReport, setopenReport] = useState(false);
  const [report, setreport] = useState("");
  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );
  const access_token = useSelector(
    (state) => state.authentication.access_token
  );

  const dispatch = useDispatch();
  //Filter
  const [showFilter, setshowFilter] = useState(false);
  const [filter, setfilter] = useState(false);
  const [bio_enlarge, setbio_enlarge] = useState(false);
  const [promptStep, setpromptStep] = useState(1);
  // Public Prompts State
  const [showPrompts, setshowPrompts] = useState(true);
  const [prompts, setprompts] = useState([]);
  const [promptsmodalVisible, setpromptsmodalVisible] = useState(false);

  // Carousel States and Function
  //Main Carousel
  const [masked, setmasked] = useState(false);

  const [currentIndex, setcurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setcurrentIndex(viewableItems[0]?.index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  //Full Page Carousel
  const [modalVisible, setmodalVisible] = useState(false);
  const [currentIndex2, setcurrentIndex2] = useState(0);
  const scrollX2 = useRef(new Animated.Value(0)).current;
  const slidesRef2 = useRef(null);
  const viewableItemsChanged2 = useRef(({ viewableItems }) => {
    setcurrentIndex2(viewableItems[0]?.index);
  }).current;
  const viewConfig2 = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  // Main Carosel Item Render Function
  const renderItem = ({ item, index }) => {
    return (
      // <Text>Check {item.id}</Text>
      <Item
        index={index}
        currentIndex={currentIndex}
        item={item}
        setmodalVisible={setmodalVisible}
        super_liked_profile={super_liked_profile}
      />
    );
  };

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

  const [pets_list, setpets_list] = useState([]);
  const [interest_list, setinterest_list] = useState([]);

  const icRotate = iconRotate.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-18deg", "0deg", "18deg"],
  });

  const icTranslateX = iconTranslateX.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-20, 0, 20],
  });

  const icTranslateY = iconTranslateY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });



  const rotate = swipe.x.interpolate({
    inputRange: [-100, 0, 100],

    outputRange: ["-4deg", "0deg", "4deg"],
  });

  const rejectOpacity = rightX.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const superLikeOpacity = upY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const likeOpacity = leftX.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  

  // const rejectOpacity = rightX.interpolate({
  //   inputRange: [-100, -20],

  //   outputRange: [1, 0],

  //   extrapolate: "clamp",
  // });

  const reportProfile = async () => {
    const data = {
      user_id: profile_data.user.id,
      user_profile_id: card_itm.id,
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

      if (resp_data.code == 200) {
        rightX.setValue(1)
                        
        Animated.timing(iconTranslateY, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            }).start();

        handleChoiceButtons(0);
        // swipeProfile(false, false);
      } else if (resp_data.code == 401) {
        dispatch(setSessionExpired(true));
      }
    } catch (error) {
      return false;
    }
  };

  const swipeProfile = async (action, superlikestatus) => {
    const data = {
      userprofile1: profile_data.userprofile.id,
      userprofile2: card_itm.id,
      action: action,
      superlikestatus: superlikestatus,
    };

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    try {
      const response = await axios.post(apiUrl + "swappinguser/", data, {
        headers,
      });
      let resp_data = response.data;
      // setloading(false);
      if (resp_data.code == 200) {
        setswippingcount(resp_data.data.swappingcountvalue);
      } else if (resp_data.code == 401) {
        dispatch(setSessionExpired(true));
      }
    } catch (error) {
      // setloading(false);
      return false;
    }
  };

  useEffect(() => {
    if (report != "") {
      reportProfile();
    }
  }, [report]);

  useLayoutEffect(() => {
    setprompts(card_itm.publicprompts);

    let usr_interest = card_itm?.interest.map((v) => [
      v.interestmaster.id,
      v.interestmaster.iconblue,
    ]);

    setinterest_list(usr_interest);

    let usr_pets = card_itm?.pets.map((v) => [
      v.petmaster.id,
      v.petmaster.iconblue,
    ]);

    setpets_list(usr_pets);
  }, []);

  const renderChoice = useCallback(() => {
    return (
      <>
        <Animated.View
          style={[
            { position: "absolute", alignSelf: "center", top: rspH(16) },
            { opacity: likeOpacity },
            {
              transform: [
                { rotate: icRotate },
                { translateX: icTranslateX },
                { translateY: icTranslateY },
              ],
            },
          ]}
        >
          <View style={styles.actionSetCont}>
            <FastImage
              source={require("../../../../assets/images/Swiping/Actions/Fancy.png")}
              style={{
                width: rspW(16.92),
                height: rspH(8.6),
                // aspectRatio:1,
              }}
            />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            { position: "absolute", alignSelf: "center", top: rspH(18) },
            { opacity: superLikeOpacity },
            {
              transform: [{ translateY: icTranslateY }],
            },
          ]}
        >
          <View style={styles.actionSetCont}>
            <FastImage
              source={require("../../../../assets/images/Swiping/Actions/Softspot.png")}
              style={{
                width: rspW(16.92),
                height: rspH(8.6),
              }}
            />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            { position: "absolute", alignSelf: "center", top: rspH(16) },
            { opacity: rejectOpacity },
            {
              transform: [
                { rotate: icRotate },
                { translateX: icTranslateX },
                { translateY: icTranslateY },
              ],
            },
          ]}
        >
          <View style={[styles.actionSetCont]}>
            <FastImage
              source={require("../../../../assets/images/Swiping/Actions/Pass.png")}
              style={{
                width: rspW(16.92),
                height: rspH(8.6),
              }}
            />
          </View>
        </Animated.View>
      </>
    );
  }, []);

  useEffect(() => {
    if (modalVisible) {
      dispatch(setStatusBarArgs({ barStyle: "light-content" }));

      if (Platform.OS == "android") {
        // StatusBar.setTranslucent(false);
      }
    } else {
      dispatch(
        setStatusBarArgs({ barStyle: "dark-content", backgroundColor: "#fff" })
      );
    }
  }, [modalVisible]);

  const [super_liked_profile, setsuper_liked_profile] = useState(false);

  useLayoutEffect(() => {
    if (card_itm.profilestatus.profilestatus == 1) {
      setsuper_liked_profile(true);
    }
  }, []);

  return (
    <Animated.View
      style={[
        {
          backgroundColor: "#fff",
          position: "absolute",
          width: scrn_width,
          height: "100%",
          left: 0,
          top: 0,
          zIndex: 100 - mainIndex,

          transform: [
            {
              scale: !isFirst ? scaleValue : 1,
            },
          ],
        },
        isFirst && {
          transform: [...swipe.getTranslateTransform(), { rotate: rotate }],
        },
      ]}
      key={mainIndex}
    >
      <SafeAreaView
        style={{ alignItems: "center", height: scrn_height, width: scrn_width }}
      >
        <View style={{ ...styles.container }}>
          <View
            style={{
              paddingBottom: rspH(Platform.OS == "ios" ? 14.2 : 9),
            }}
          >
            {/* Report Dots */}

            {!bio_enlarge && (
              <TouchableOpacity
                onPress={() => {
                  setopenReport(!openReport);
                }}
                style={styles.dotsCont}
              >
                <View style={styles.dots} />
                <View style={styles.dots} />
                <View style={styles.dots} />
              </TouchableOpacity>
            )}

            {bio_enlarge && (
              <View
                style={{
                  // backgroundColor:'red',
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",

                  width: scrn_width,
                  paddingHorizontal: rspW(10),
                  paddingTop: rspH(3),
                }}
              >
                <TouchableOpacity
                  style={{
                    alignSelf: "center",
                    justifyContent: "center",
                    alignItems: "center",

                    height: rspW(7.6),
                    borderRadius: rspW(3.8),
                  }}
                  onPress={() => {
                    setbio_enlarge(false);
                  }}
                >
                  <ADIcon size={20} name="left" color={colors.blue} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setopenReport(!openReport);
                  }}
                  style={{
                    width: rspW(6.05),
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={styles.dots} />
                  <View style={styles.dots} />
                  <View style={styles.dots} />
                </TouchableOpacity>
              </View>
            )}

            {/* Profile Images Carousel */}
            {!bio_enlarge && (
              <View style={styles.imageCont}>
               
                <FlatList
                  initialScrollIndex={0}
                  data={card_itm.image}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  pagingEnabled
                  bounces={false}
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    {
                      useNativeDriver: false,
                    }
                  )}
                  scrollEventThrottle={32}
                  onViewableItemsChanged={viewableItemsChanged}
                  viewabilityConfig={viewConfig}
                  ref={slidesRef}
                />
     

                {/* Filter */}
                <TouchableOpacity
                  style={{
                    ...styles.filterCont,
                  }}
                  onPress={() => {
                    setshowFilter(!showFilter);
                  }}
                >
                  <FastImage
                    source={require("../../../../assets/images/Swiping/Filter3.png")}
                    style={{ width: 26, height: 26 }}
                  />
                </TouchableOpacity>

                {/* Features Container */}
                <View style={styles.featuresCont}>
                  {/* Action Container */}
                  <View style={styles.actionsCont}>
                    {/* Action */}
                    <TouchableOpacity
                      style={styles.actionCont}
                     
                      onPressIn={() => {
                        rightX.setValue(1)
                        
                        Animated.timing(iconTranslateY, {
                          toValue: 1,
                          duration: 500,
                          useNativeDriver: true,
                        }).start();
                      }}

                      onPress={()=>{
                        handleChoiceButtons(0);
                        swipeProfile(false, false);
                        setreport("");

                      }}
                      onPressOut={() => {
                        Animated.timing(rightX, {
                          toValue: 0,
                          duration: 500,
                          useNativeDriver: true,
                        }).start();

                        Animated.timing(iconTranslateY, {
                          toValue: 0,
                          duration: 500,
                          useNativeDriver: true,
                        }).start()
                        
                      }}
                    >
                      <FastImage
                        source={require("../../../../assets/images/Swiping/Actions/Pass.png")}
                        style={{
                          width: rspW(8.695),
                          height: rspH(4),
                        }}
                      />
                    </TouchableOpacity>

                    {/* Action */}
                    <TouchableOpacity
                      style={styles.actionCont}
                      

                      onPressIn={() => {
                        upY.setValue(1)
                      
                        Animated.timing(iconTranslateY, {
                          toValue: 1,
                          duration: 500,
                          useNativeDriver: true,
                        }).start();
                      }}

                      onPress={()=>{
                        handleChoiceButtons(0);
                        swipeProfile(true, true);
                        setreport("");

                      }}
                      onPressOut={() => {
                        Animated.timing(upY, {
                          toValue: 0,
                          duration: 500,
                          useNativeDriver: true,
                        }).start()

                        Animated.timing(iconTranslateY, {
                          toValue: 0,
                          duration: 500,
                          useNativeDriver: true,
                        }).start()
                      }}
                    >
                      <FastImage
                        source={require("../../../../assets/images/Swiping/Actions/Softspot.png")}
                        style={{
                          width: rspW(9.8),
                          height: rspH(4.8),
                        }}
                      />
                    </TouchableOpacity>

                    {/* Action */}
                    <TouchableOpacity
                      
                      onPressIn={() => {
                        leftX.setValue(1)
                    
                        Animated.timing(iconTranslateY, {
                          toValue: 1,
                          duration: 500,
                          useNativeDriver: true,
                        }).start();
                      }}

                      onPress={()=>{
                        handleChoiceButtons(0);
                        swipeProfile(true, false);
                        setreport("");

                      }}
                      onPressOut={() => {
                        Animated.timing(leftX, {
                          toValue: 0,
                          duration: 500,
                          useNativeDriver: true,
                        }).start();
                        
                        Animated.timing(iconTranslateY, {
                          toValue: 0,
                          duration: 500,
                          useNativeDriver: true,
                        }).start()
                      }}
                      style={styles.actionCont}
                    >
                      <FastImage
                        source={require("../../../../assets/images/Swiping/Actions/Fancy.png")}
                        style={{
                          width: rspW(8.46),
                          height: rspH(4.3),
                        }}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Main Carousel Pagintors / Dots */}
                  <Paginator
                    data={card_itm.image}
                    scrollX={scrollX}
                    currentIndex={currentIndex}
                  />
                </View>
              </View>
            )}

            {/* FullScreen Image Carousel */}
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
                    // top: rspH(2.35),
                    top: rspH(3),
                    left: rspW(8),
                    // backgroundColor: 'red',

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

                {/*  FullScreen Carousel */}

                <FlatList
                  initialScrollIndex={0}
                  data={card_itm.image}
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
                  data={card_itm.image}
                  scrollX={scrollX2}
                  currentIndex={currentIndex2}
                />
              </View>
            </FullModal>

            {/* Profile Details Area */}

            <ScrollView
              style={styles.profileDetailsCont}
              bounces={false}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={300}
            >
              <TouchableOpacityB
                activeOpacity={1}
                onLongPress={() => {
                  setbio_enlarge(true);
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  {/* Profile Details Sub Container */}
                  <View
                    style={{
                      ...styles.profileDetailsSubCont,

                      paddingTop: rspH(0.25),
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
                      <View
                        style={{ flexDirection: "row", alignItems: "baseline" }}
                      >
                        <FastImage
                          source={require("../../../../assets/images/Swiping/BioIcons/City.png")}
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
                          {card_itm?.city?.length > 11
                            ? card_itm?.city.substring(0, 9) + "..."
                            : card_itm?.city}
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
                          source={require("../../../../assets/images/Swiping/BioIcons/Education.png")}
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
                          {/* Undergraduate */}
                          {card_itm?.education?.length > 11
                            ? card_itm?.education?.substring(0, 9) + "..."
                            : card_itm?.education}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        ...styles.profileDetailCont,
                        ...styles.boxShadowCont,
                        // alignItems:'center',
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
                          source={card_itm?.drinking ? DrinkingYes : DrinkingNo}
                          style={{
                            ...styles.habitsImage,
                          }}
                          resizeMode="contain"
                        />
                        <FastImage
                          source={card_itm?.smoking ? SmokingYes : SmokingNo}
                          style={{
                            ...styles.habitsImage,
                          }}
                          resizeMode="contain"
                        />
                        <FastImage
                          source={
                            card_itm?.marijuana ? MarijuanaYes : MarijuanaNo
                          }
                          style={{
                            ...styles.habitsImage,
                          }}
                          resizeMode="contain"
                        />
                      </View>
                    </View>
                  </View>

                  {/* Public Prompt */}
                  {prompts.length > 0 && (
                    <View style={styles.promptContainer}>
                      <View style={styles.promptQuestionContainer}>
                        <Text style={styles.promptQuestion}>
                          {prompts[0].question}
                        </Text>
                      </View>
                      <Text style={styles.promptAnswer}>
                        {prompts[0].answer}
                      </Text>
                    </View>
                  )}

                  <View
                    style={{
                      ...styles.profileDetailsSubCont2,

                      ...styles.boxShadowCont,
                    }}
                  >
                    <Text style={styles.profileDetailContHeading}>
                      Interests
                    </Text>
                    <TouchableWithoutFeedback>
                      <ScrollView
                        bounces={false}
                        style={{ marginTop: rspH(0.8) }}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={1}
                      >
                        {interest_list.map((img, idx) => {
                          return (
                            <FastImage
                              source={{ uri: img[1] }}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                          );
                        })}
                      </ScrollView>
                    </TouchableWithoutFeedback>
                  </View>

                  {/* Public Prompt */}
                  {prompts.length > 0 && (
                    <View style={styles.promptContainer}>
                      <View style={styles.promptQuestionContainer}>
                        <Text style={styles.promptQuestion}>
                          {prompts[1].question}
                        </Text>
                      </View>
                      <Text style={styles.promptAnswer}>
                        {prompts[1].answer}
                      </Text>
                    </View>
                  )}

                  {pets_list.length > 0 && (
                    <View
                      style={{
                        ...styles.profileDetailsSubCont2,
                        ...styles.boxShadowCont,
                        width: rspW(39.5),
                        marginLeft: rspW(2),
                        alignSelf: "flex-start",
                        marginBottom: rspH(0.6),
                      }}
                    >
                      <Text style={styles.profileDetailContHeading}>Pets</Text>
                      <ScrollView
                        bounces={false}
                        style={{ marginTop: rspH(0.8) }}
                        horizontal
                        scrollEventThrottle={1}
                        showsHorizontalScrollIndicator={false}
                      >
                        {pets_list.map((img, indx) => {
                          return (
                            <FastImage
                              source={{ uri: img[1] }}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                          );
                        })}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </TouchableOpacityB>
            </ScrollView>
          </View>

          {/* Prompts Modal */}
          <FullModal
            modalVisible={promptsmodalVisible}
            setModalVisible={setpromptsmodalVisible}
          >
            {promptStep == 1 ? (
              <PromptIntro setpromptStep={setpromptStep} />
            ) : promptStep == 2 ? (
              <PublicPrompts setpromptStep={setpromptStep} />
            ) : promptStep == 3 ? (
              <PrivatePrompts setpromptStep={setpromptStep} />
            ) : (
              <ReferralCode
                setModalVisible={setpromptsmodalVisible}
                setshowPrompts={setshowPrompts}
              />
            )}
          </FullModal>

          {/* Reports Modal */}
          <FullModal modalVisible={openReport} setModalVisible={setopenReport}>
            <Report
              report={report}
              setreport={setreport}
              modalVisible={openReport}
              setModalVisible={setopenReport}
            />
          </FullModal>

          {/* Filter Modal */}
          <FullModal modalVisible={showFilter} setModalVisible={setshowFilter}>
            <Filters
              filter={filter}
              setfilter={setfilter}
              modalVisible={showFilter}
              setModalVisible={setshowFilter}
            />
          </FullModal>
        </View>
      </SafeAreaView>
      {isFirst && renderChoice()}
    </Animated.View>
  );
};

export default memo(SwipeCard);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: rspW(5.1),
    flex: 1,
    backgroundColor: colors.white,
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
    width: rspW(88),
    marginRight: rspW(1),
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

  actionsCont: {
    width: rspW(89),
    paddingHorizontal: rspW(13.8),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: rspH(1.1),
  },

  actionCont: {
    width: rspW(13),
    height: rspW(13),
    borderRadius: rspW(7),
    backgroundColor: colors.grey + "85",
    alignItems: "center",
    justifyContent: "center",
  },

  actionSetCont: {
    width: rspW(26),
    height: rspW(26),
    borderRadius: rspW(4),
    // backgroundColor: colors.blue + "85",
    alignItems: "center",
    justifyContent: "center",
  },

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

  profileDetailsCont: {
    alignSelf: "center",
    width: rspW(86),
    height: scrn_height,
    marginTop: rspH(3.4),
  },
  profileDetailsSubCont: {
    width: rspW(82),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: rspH(3),
  },
  profileDetailsSubCont2: {
    width: rspW(82),
    marginBottom: rspH(3),
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
    fontSize: rspF(2.02),
    fontFamily: fontFamily.bold,
    lineHeight: rspF(2.1),
    color: colors.black,
    letterSpacing: 1,
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
    lineHeight: rspF(2.18),
  },

  // Prompt
  promptContainer: {
    width: rspW(82),
    marginBottom: rspH(3),
    paddingHorizontal: rspW(2.5),
  },
  promptQuestionContainer: {
    marginBottom: rspH(0.6),
  },
  promptQuestion: {
    fontFamily: fontFamily.bold,
    fontSize: rspF(1.9),
    color: colors.black,
    lineHeight: rspF(1.96),
    letterSpacing: 1,
    textAlign: "justify",
  },
  promptAnswer: {
    fontFamily: fontFamily.light,
    fontSize: rspF(1.66),
    color: colors.black,
    lineHeight: rspF(2.18),
    letterSpacing: 1,
    textAlign: "justify",
  },
  habitsImage: {
    width: rspW(10.1),
    aspectRatio: 1,
  },
});
