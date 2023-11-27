import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  Image,
  Modal,
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
import FullModal from "../../../modals/FullModal";
import ADIcon from "react-native-vector-icons/AntDesign";
import Paginator from "../Paginator";
import { useDispatch, useSelector } from "react-redux";
import PromptIntro from "../Prompts/PromptIntro";
import PublicPrompts from "../Prompts/PublicPrompts";
import PrivatePrompts from "../Prompts/PrivatePrompts";
import ReferralCode from "../Prompts/ReferralCode";
import Report from "../Report/Report";
import Filters from "../Filters/Filters";
import { apiUrl } from "../../../../constants";
import {
  Backward,
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
import _ from "lodash";
import * as icn from '../../../../assets'
import { initialWindowMetrics } from "react-native-safe-area-context";
const insets = initialWindowMetrics.insets;


// Profile cropped image Carousel item
const Item = ({ item, setmodalVisible, super_liked_profile, index }) => {
  let imageUri = String(item.cropedimage);

  const [img_load, setimg_load] = useState(false);

  return (
    <View
      style={{
        ...styles.item,
        position: "relative",
      }}
    >
      <TouchableOpacityB
        key={index}
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
                  // width: rspW(89),
                  width: rspW(88),

                  height: rspH(42.2),
                  position: "absolute",
                  top: -1,
                  left: 0,
                  zIndex: 1,
                }}
                resizeMode="stretch"
              />
            </>
          )}


          { Platform.OS == 'ios' ?

            <Image
            source={{ uri: imageUri }}
            style={{
              backgroundColor: !img_load ? "#b1b1b1" : "#00000000",
              width: "100%",
              height: "100%",
              borderRadius: rspW(5.1),
              alignSelf: "center",
            }}
            resizeMode="cover"
            onLoad={() => {
              setimg_load(true);
            }}           
            />
:
            <FastImage
          useLastImageAsDefaultSource
            source={{ uri: imageUri }}
            style={{
              backgroundColor: !img_load ? "#b1b1b1" : "#00000000",
              width: "100%",
              height: "100%",
              borderRadius: rspW(5.1),
              alignSelf: "center",
            }}
            resizeMode="cover"
            onLoad={() => {
              setimg_load(true);
            }}
          />}
        </>
      </TouchableOpacityB>
    </View>
  );
};

// Profile full image Carousel item
const Item2 = ({ item, index }) => {
  let imageUri = String(item.image);

  return (
    <View style={styles.item2} key={index}>
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
  actionEnd,
  actionType,
  setactionType,
  showAction,
  traYValue,
  handleChoiceButtons,
  iconRotate,
  iconTranslateX,
  iconTranslateY,
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

  const is_network_connected = useSelector(
    (state) => state.authentication.is_network_connected
  );

  const [enable_swipe, setenable_swipe] = useState(true)
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

  const [pets_list, setpets_list] = useState([]);
  const [interest_list, setinterest_list] = useState([]);

  // Carousel States and Function
  //Main Carousel
  const [super_liked_profile, setsuper_liked_profile] = useState(false);

  const [currentIndex, setcurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);


  const scrollTo = async (large = false) =>{
    // slidesRef2
    
    if (large) {
    if (currentIndex <  card_itm.image.length ) {
      slidesRef2.current.scrollToIndex({ index : currentIndex })
    }
    }
    else{

        if (currentIndex2 <  card_itm.image.length ) {
      setcurrentIndex(currentIndex2)
      slidesRef.current.scrollToIndex({ index : currentIndex2 })
    }}
    
  }



  // To set current Item index to show active carousel item
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
      <Item
        key={index}
        index={index}
        currentIndex={currentIndex}
        item={item}
        setmodalVisible={setmodalVisible}
        super_liked_profile={super_liked_profile}
        icRotate={icRotate}
        icTranslateX={icTranslateX}
        icTranslateY={icTranslateY}
        likeOpacity={likeOpacity}
        superLikeOpacity={superLikeOpacity}
        rejectOpacity={rejectOpacity}
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

  const icRotate = iconRotate.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-18deg", "0deg", "18deg"],
  });

  const icTranslateX = iconTranslateX.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-20, 0, 20],
  });

  const icTranslateY = swipe.y.interpolate({
    inputRange: [-scrn_height, 0],
    outputRange: [-60, 0],
  });

  const scaleAction = swipe.y.interpolate({
    inputRange: [-scrn_height / 1.2, 0],
    outputRange: [1, 0.6],
  });

  const scale2Action = traYValue.interpolate({
    inputRange: [scrn_height / 2.2, scrn_height],
    outputRange: [0, 1],
  });

  const firstCAn = swipe.y.interpolate({
    inputRange: [-100, 0],
    outputRange: [1, 0],
  });

  const firstCAn2 = swipe.y.interpolate({
    inputRange: [-50, 0],
    outputRange: [0, 1],
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

      if (resp_data.code == 401) {
        dispatch(setSessionExpired(true));
      }
    } catch (error) {
      if (is_network_connected) {
        dispatch(setSessionExpired(true));
      }
      return false;
    }
  };

  
  const PassPressIn = () =>{
    setmodalVisible(false)
    rightX.setValue(1);
    setactionType("Pass");
    
  }
  const PassPress = () =>{

    setmodalVisible(false)
    handleChoiceButtons(0);
    swipeProfile(false, false);
    setreport("");
  }

  const debouncePassPressIn = _.debounce(PassPressIn, 200, {
   leading: false,
    trailing: true,
  });

  const debouncePassPress = _.debounce(PassPress, 200, {
   leading: false,
    trailing: true,
  });

  const SoftPressIn = () =>{
    setmodalVisible(false)
                          
                          upY.setValue(1);
                          setactionType("Softspot");

                          // Animated.timing(iconTranslateY, {
                          //   toValue: 1,
                          //   duration: 500,
                          //   useNativeDriver: true,
                          // }).start();
  }
  const SoftPress = () =>{
    
    setmodalVisible(false)
    handleChoiceButtons(0);
                          swipeProfile(true, true);
                          setreport("");
  }

  const debounceSoftPressIn = _.debounce(SoftPressIn, 200, {
   leading: false,
    trailing: true,
  });

  const debounceSoftPress = _.debounce(SoftPress, 200, {
   leading: false,
    trailing: true,
  });


  const FancyPressIn = () =>{
    setmodalVisible(false)
                          leftX.setValue(1);
                          setactionType("Fancy");
                          // Animated.timing(iconTranslateY, {
                          //   toValue: 1,
                          //   duration: 500,
                          //   useNativeDriver: true,
                          // }).start();
  }
  const FancyPress = () =>{
    
    setmodalVisible(false)
    handleChoiceButtons(0);
                          swipeProfile(true, false);
                          setreport("");
  }

  const debounceFancyPressIn = _.debounce(FancyPressIn, 200, {
   leading: false,
    trailing: true,
  });

  const debounceFancyPress = _.debounce(FancyPress, 200, {
   leading: false,
    trailing: true,
  });

  // To send swipe action in backend
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
      if (is_network_connected) {
        dispatch(setSessionExpired(true));
      }
      return false;
    }
  };

  useEffect(() => {
    if (report != "") {
      reportProfile();
    }
  }, [report]);


  


  useEffect(() => {
    
    if (!is_network_connected) {
      setshowFilter(false)
    }
  }, [is_network_connected])
  

  useLayoutEffect(() => {
    setprompts(card_itm.publicprompts);

    let usr_interest = card_itm?.interest.map((v) => [
      v.interestmaster.id,
      v.interestmaster.iconblue,
      v.interestmaster.interest
    ]);

    setinterest_list(usr_interest);

    let usr_pets = card_itm?.pets.map((v) => [
      v.petmaster.id,
      v.petmaster.iconblue,
      v.petmaster.pets
    ]);

    setpets_list(usr_pets);
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

  useEffect(() => {

    if (currentIndex !== currentIndex2 && modalVisible) {
      scrollTo()
    }
  }, [currentIndex,currentIndex2])
  

  useLayoutEffect(() => {
    // To show blue circular mask if loaded profile already superliked loggined user
    if (card_itm.profilestatus.profilestatus == 1) {
      setsuper_liked_profile(true);
    }

    let sorted_images = card_itm.image.sort((a, b) => {
      let pos1 = a.position;
      let pos2 = b.position;
      if (pos1 < pos2) return -1;
      if (pos1 > pos2) return 1;
      return 0;
    });

    
  }, []);

  return (
    <>
      {/* MaskedAction */}
      {showAction && (
        <Animated.View
          style={{
            backgroundColor: colors.white,
            position: "absolute",
            width: scrn_width,
            height: scrn_height,
            left: 0,
            top: 0,
            zIndex: 301 - mainIndex,
            opacity: actionEnd ? scale2Action : firstCAn,
          }}
        >
          <>
            {/* Fancy */}
            <Animated.View
              style={[
                {
                  position: "absolute",
                  alignSelf: "center",
                  top: rspH(30),
                  zIndex: 301,
                },
                {
                  opacity:
                    actionType == "Fancy"
                      ? actionEnd
                        ? scale2Action
                        : likeOpacity
                      : 0,
                },
                {
                  transform: [
                    { scale: scaleAction },
                    { translateY: icTranslateY },
                  ],
                },
              ]}
            >
              <View style={[styles.actionSetCont]}>
                <FastImage
                  source={require("../../../../assets/images/Swiping/Actions/Fancy.png")}
                  style={{
                    width: rspW(24),
                    height: rspH(12.5),
                  }}
                />
              </View>
            </Animated.View>

            {/* Softspot */}
            <Animated.View
              style={[
                {
                  position: "absolute",
                  alignSelf: "center",
                  top: rspH(33),
                  zIndex: 301,
                },
                {
                  opacity:
                    actionType == "Softspot"
                      ? actionEnd
                        ? scale2Action
                        : superLikeOpacity
                      : 0,
                },
                {
                  transform: [
                    { scale: scaleAction },
                    { translateY: icTranslateY },
                  ],
                },
              ]}
            >
              <View style={[styles.actionSetCont]}>
                <FastImage
                  source={require("../../../../assets/images/Swiping/Actions/Softspot.png")}
                  style={{
                    width: rspW(24),
                    height: rspH(12.5),
                  }}
                />
              </View>
            </Animated.View>

            <Animated.View
              style={[
                {
                  position: "absolute",
                  alignSelf: "center",
                  top: rspH(30),
                  zIndex: 301,
                },
                {
                  opacity:
                    actionType == "Pass"
                      ? actionEnd
                        ? scale2Action
                        : rejectOpacity
                      : 0,
                },
                {
                  transform: [
                    { scale: scaleAction },
                    { translateY: icTranslateY },
                  ],
                },
              ]}
            >
              <View style={[styles.actionSetCont]}>
                <FastImage
                  source={require("../../../../assets/images/Swiping/Actions/Pass.png")}
                  style={{
                    width: rspW(24),
                    height: rspH(12.5),
                  }}
                />
              </View>
            </Animated.View>
          </>
        </Animated.View>
      )}
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
            opacity: isFirst ? firstCAn2 : 1,
            transform: [
              {
                translateY: !isFirst ? traYValue : 0,
              },
            ],
          },
        ]}
        key={mainIndex}
      >
        <SafeAreaView
          style={{
            alignItems: "center",
            height: scrn_height,
            width: scrn_width,
          }}
        >
          <View style={{ ...styles.container }}>
            <View
              style={{
                // paddingBottom: rspH(Platform.OS == "ios" ? 14.2 : 9),
                paddingBottom: Platform.OS == "ios" ? rspH(7.7)+ insets.top : rspH(9),

                // backgroundColor:'red',
              }}
            >
              {/* Show this area if Bio not enlarge */}
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

              {/* Show this area if Bio  enlarge */}
              {bio_enlarge && (
                <View
                  style={{
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

              {/* Show this area if Bio not enlarge */}

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
                      debouncePassPressIn()
                        }}
                        onPress={() => {
                          debouncePassPress()
          
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
                
                          debounceSoftPressIn()
                        
                        }}
                        onPress={() => {
                          debounceSoftPress()
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
                          
                          debounceFancyPressIn()
                        
                        }}
                        onPress={() => {

                          // handleChoiceButtons(0);
                          // swipeProfile(true, false);
                          // setreport("");
                          debounceFancyPress()
                          
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
              

<Modal animationType="slide" transparent={true} visible={modalVisible}>
        {
          modalVisible &&
          <View style={{ flex: 1, backgroundColor: "#000" }}>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            {/* {children} */}
         
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
                    
                    {/* <ADIcon size={20} name="left" color={"#fff"} /> */}
                    <Image
                  source={Backward}        
                  style={{width: '80%', height:'70%'}}
                  resizeMode="contain"
                          />
                  </TouchableOpacity>

                  {/*  FullScreen Carousel */}

                  <FlatList
                    initialScrollIndex={currentIndex}
                    onLayout={()=>{
                   
                      setcurrentIndex2(currentIndex)
                      scrollTo(true)
                    }}


getItemLayout={(data, index) => ({
          length: scrn_width,
          offset: scrn_width * index ,
          index,
        })}
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
                </SafeAreaView>
        </View>}
      </Modal>
              {/* </FullModal> */}

              {/* Profile Details Area */}

              <ScrollView

              decelerationRate={0.9}
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
                          style={{
                            flexDirection: "row",
                            alignItems: "baseline",
                          }}
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
                            {card_itm?.city
                            ?.split(",")[0]?.length > 11
                              ? card_itm?.city.split(",")[0]?.substring(0, 9) +
                                "..."
                              : card_itm?.city.split(",")[0]
                              }
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
                              card_itm?.drinking ? DrinkingYes : DrinkingNo
                            }
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
                        decelerationRate={0.9}
                          bounces={false}
                          style={{ marginTop: rspH(0.8) }}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          scrollEventThrottle={1}
                        >
                          {interest_list.map((img, idx) => {
                            let img1 = img[2]
                            if (img[2].split(' ').length > 1) {
                              console.log("item",img[2].split(' '))
                              let itmlis = img[2].split(' ')
                               img1 = itmlis.join('')
                            }
                            return (
                              <FastImage
                                key={idx}
                                // source={{ uri: img[1] }}
                                source={icn[`${img1}Blue`]}
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
                          marginBottom: Platform.OS == 'ios'? rspH(1.6): rspH(2.6),
                        }}
                      >
                        <Text style={styles.profileDetailContHeading}>
                          Pets
                        </Text>
                        <ScrollView
                        decelerationRate={0.9}
                          bounces={false}
                          style={{ marginTop: rspH(0.8) }}
                          horizontal
                          scrollEventThrottle={1}
                          showsHorizontalScrollIndicator={false}
                        >
                          {pets_list.map((img, indx) => {
                            let img1 = img[2]
                            if (img[2].split(' ').length > 1) {
                              console.log("item",img[2].split(' '))
                              let itmlis = img[2].split(' ')
                               img1 = itmlis.join('')
                            }
                            return (
                              <FastImage
                                key={indx}
                                // source={{ uri: img[1] }}
                                source={icn[`${img1}Blue`]}
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
            <FullModal
              modalVisible={openReport}
              setModalVisible={setopenReport}
            >
              <Report
                report={report}
                setreport={setreport}
                modalVisible={openReport}
                setModalVisible={setopenReport}
              />
            </FullModal>

            {/* Filter Modal */}
            <FullModal
              modalVisible={showFilter}
              setModalVisible={setshowFilter}
            >
              <Filters
                filter={filter}
                setfilter={setfilter}
                modalVisible={showFilter}
                setModalVisible={setshowFilter}
              />
            </FullModal>
          </View>
        </SafeAreaView>
      </Animated.View>
    </>
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
    alignSelf: "center",
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
    width: rspW(40),
    height: rspW(40),
    borderRadius: rspW(4),
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
    // textAlign: "justify",
  },
  promptAnswer: {
    fontFamily: fontFamily.light,
    fontSize: rspF(1.66),
    color: colors.black,
    lineHeight: rspF(2.18),
    letterSpacing: 1,
    // textAlign: "justify",
  },
  habitsImage: {
    width: rspW(10.1),
    aspectRatio: 1,
  },
});
