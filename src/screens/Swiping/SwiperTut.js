import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";

import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import colors from "../../styles/colors";
import {
  rspF,
  rspH,
  rspW,
  safe_height,
  scrn_height,
  scrn_width,
} from "../../styles/responsiveSize";
import { FlatList } from "react-native-gesture-handler";
import FullModal from "../../components/modals/FullModal";
import ADIcon from "react-native-vector-icons/AntDesign";
import FAIcon from "react-native-vector-icons/FontAwesome";
import Paginator from "../../components/screenComponents/swiping/Paginator";
import fontFamily from "../../styles/fontFamily";
import { useDispatch, useSelector } from "react-redux";
import {
  AnimalCareBlue,
  AntBlue,
  Backward,
  BaseballBlue,
  BasketballBlue,
  BeachBlue,
  BicyclingBlue,
  BoatingBlue,
  BowlingBlue,
  BoxingBlue,
  CampingBlue,
  ChessBlue,
  CookingBlue,
  DancingBlue,
  DrinkingNo,
  DrivingBlue,
  DrumsBlue,
  HamsterBlue,
  LangIcon,
  MarijuanaNo,
  SmokingNo,
  SmokingYes,
} from "../../assets";
import { setSwipeTut } from "../../store/reducers/tutorial/tutorial";
import { apiUrl } from "../../constants";
import axios from "axios";
import Loader from "../../components/loader/Loader";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import { setAllGenders } from "../../store/reducers/allData/allData";
import { setSessionExpired } from "../../store/reducers/authentication/authentication";
import { initialWindowMetrics } from "react-native-safe-area-context";
import HScroller from "../../components/formComponents/HScroller";
import HScrollerMulti from "../../components/formComponents/HScrollerMulti";
import HScrollerWS from "../../components/formComponents/HScrollerWS";
const insets = initialWindowMetrics.insets;

const DATA = [
  {
    id: 1,
    image: require("../../assets/images/Tutorial/WomanPhotos/SmallPhotos/1.jpeg"),
    image2: require("../../assets/images/Tutorial/WomanPhotos/EnlargedPhotos/1.jpeg"),
  },
  {
    id: 2,
    image: require("../../assets/images/Tutorial/WomanPhotos/SmallPhotos/2.jpeg"),
    image2: require("../../assets/images/Tutorial/WomanPhotos/EnlargedPhotos/2.jpeg"),
  },
  {
    id: 3,
    image: require("../../assets/images/Tutorial/WomanPhotos/SmallPhotos/3.jpeg"),
    image2: require("../../assets/images/Tutorial/WomanPhotos/EnlargedPhotos/3.jpeg"),
  },
  {
    id: 4,
    image: require("../../assets/images/Tutorial/WomanPhotos/SmallPhotos/4.jpeg"),
    image2: require("../../assets/images/Tutorial/WomanPhotos/EnlargedPhotos/4.jpeg"),
  },
  {
    id: 5,
    image: require("../../assets/images/Tutorial/WomanPhotos/SmallPhotos/5.jpeg"),
    image2: require("../../assets/images/Tutorial/WomanPhotos/EnlargedPhotos/5.jpeg"),
  },
  {
    id: 6,
    image: require("../../assets/images/Tutorial/WomanPhotos/SmallPhotos/6.jpeg"),
    image2: require("../../assets/images/Tutorial/WomanPhotos/EnlargedPhotos/6.jpeg"),
  },
  {
    id: 7,
    image: require("../../assets/images/Tutorial/WomanPhotos/SmallPhotos/7.jpeg"),
    image2: require("../../assets/images/Tutorial/WomanPhotos/EnlargedPhotos/7.jpeg"),
  },
  {
    id: 8,
    image: require("../../assets/images/Tutorial/WomanPhotos/SmallPhotos/8.jpeg"),
    image2: require("../../assets/images/Tutorial/WomanPhotos/EnlargedPhotos/8.jpeg"),
  },
  {
    id: 9,
    image: require("../../assets/images/Tutorial/WomanPhotos/SmallPhotos/9.jpeg"),
    image2: require("../../assets/images/Tutorial/WomanPhotos/EnlargedPhotos/9.jpeg"),
  },
];

const DATA2 = [
  {
    id: 1,
    image: require("../../assets/images/Tutorial/ManPhotos/Smallphotos/Photo1.jpg"),
    image2: require("../../assets/images/Tutorial/ManPhotos/Enlargedphotos/Photo1.jpg"),
  },
  {
    id: 2,
    image: require("../../assets/images/Tutorial/ManPhotos/Smallphotos/Photo2.jpg"),
    image2: require("../../assets/images/Tutorial/ManPhotos/Enlargedphotos/Photo2.jpg"),
  },
  {
    id: 3,
    image: require("../../assets/images/Tutorial/ManPhotos/Smallphotos/Photo3.jpg"),
    image2: require("../../assets/images/Tutorial/ManPhotos/Enlargedphotos/Photo3.jpg"),
  },
  {
    id: 4,
    image: require("../../assets/images/Tutorial/ManPhotos/Smallphotos/Photo4.jpg"),
    image2: require("../../assets/images/Tutorial/ManPhotos/Enlargedphotos/Photo4.jpg"),
  },
  {
    id: 5,
    image: require("../../assets/images/Tutorial/ManPhotos/Smallphotos/Photo5.jpg"),
    image2: require("../../assets/images/Tutorial/ManPhotos/Enlargedphotos/Photo5.jpg"),
  },
  {
    id: 6,
    image: require("../../assets/images/Tutorial/ManPhotos/Smallphotos/Photo6.jpg"),
    image2: require("../../assets/images/Tutorial/ManPhotos/Enlargedphotos/Photo6.jpg"),
  },
  {
    id: 7,
    image: require("../../assets/images/Tutorial/ManPhotos/Smallphotos/Photo7.jpg"),
    image2: require("../../assets/images/Tutorial/ManPhotos/Enlargedphotos/Photo7.jpg"),
  },
  {
    id: 8,
    image: require("../../assets/images/Tutorial/ManPhotos/Smallphotos/Photo8.jpg"),
    image2: require("../../assets/images/Tutorial/ManPhotos/Enlargedphotos/Photo8.jpg"),
  },
];

const Item = ({ item, setmodalVisible, masked }) => {
  const [img_load, setimg_load] = useState(false);
  return (
    <View style={{ ...styles.item, position: "relative" }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          setmodalVisible(true);
        }}
      >
        <>
          {masked && (
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
                  source={require("../../assets/images/Swiping/Actions/Softspot.png")}
                  style={{
                    width: rspW(14.5),
                    height: rspH(7),
                  }}
                />
              </View>

              <FastImage
                source={require("../../assets/images/Swiping/Masked/Exclude_2.png")}
                style={{
                  width: rspW(89),
                  height: rspH(42),
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
            source={item.image}
            style={{
              backgroundColor: !img_load ? "#b1b1b1" : "#00000000",
              width: rspW(88),
              height: "100%",
              borderRadius: rspW(5.1),

              zIndex: -2,
            }}
            onLoad={() => setimg_load(true)}
            resizeMode="stretch"
          />
          {/* </View> */}
        </>
      </TouchableOpacity>
    </View>
  );
};

const Item2 = ({ item }) => {
  return (
    <View style={styles.item2}>
      <FastImage
        source={item.image2}
        style={{ width: "100%", height: "98%" }}
        resizeMode="contain"
      />
    </View>
  );
};

const SwiperTut = ({ repeat_tut }) => {
  const navigation = useNavigation();

  const [masked, setmasked] = useState(false);
  const dispatch = useDispatch();

  const [loading, setloading] = useState(false);

  const [gender_lis, setgender_lis] = useState([]);
  const swipe_tut = useSelector((state) => state.tutorial.swipe_tut);
  const [swipe_tut_l, setswipe_tut_l] = useState(swipe_tut || repeat_tut);
  const [step, setstep] = useState(0);
  const all_genders = useSelector((state) => state.allData.all_genders);

  const is_network_connected = useSelector(
    (state) => state.authentication.is_network_connected
  );

  const [hide_tut, sethide_tut] = useState(false);

  const [instruction_list, setinstruction_list] = useState([
    "Fancy someone you think \nyou can click with. If they \nlike you back you could \nspeak later on. ",
    "Let people know you fancy \nthem by sending them a \nsoft spot.",
    "Pass on someone that you \nfeel you will not connect \nwith.",
    "Swipe to check out \nmultiple photos. You can \nalso enlarge it by clicking \non it.",
    "Scroll to see the bio of the \nsoul. You can also enlarge \nthe bio by long pressing it.",
  ]);

  const access_token = useSelector(
    (state) => state.authentication.access_token
  );
  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );

  // Preference Type to show Tutorial according to Login user preferance
  const [pref_type, setpref_type] = useState("");

  // Report Control
  const [openReport, setopenReport] = useState(false);

  //Filter
  const [showFilter, setshowFilter] = useState(false);

  // Public Prompts State
  const [showPrompts, setshowPrompts] = useState(true);
  const [promptsmodalVisible, setpromptsmodalVisible] = useState(false);

  // Carousel States and Function
  //Main Carousel
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

  const scrollTo = async (large = false) => {
    let prof_data = pref_type == "Woman" ? DATA : DATA2;
    // slidesRef2

    if (large) {
      if (currentIndex < prof_data.length) {
        slidesRef2.current.scrollToIndex({ index: currentIndex });
      }
    } else {
      if (currentIndex2 < prof_data.length) {
        setcurrentIndex(currentIndex2);
        slidesRef.current.scrollToIndex({ index: currentIndex2 });
      }
    }
  };

  const swipeTutDone = async () => {
    setloading(true);
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    const data = {
      user_id: profile_data.user.id,
    };

    try {
      const response = await axios.post(
        apiUrl + "swapping_tutorial_view/",
        data,
        {
          headers,
        }
      );
      setloading(false);

      let resp_data = response.data;
      if (resp_data.code == 200) {
        dispatch(setSwipeTut(false));
      } else if (resp_data.code == 401) {
        dispatch(setSessionExpired(true));
      }
    } catch (error) {
      setloading(false);
      return false;
    }
  };

  const getGenders = async () => {
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
          setgender_lis(tmp_lis);
        }
      })
      .catch((err) => {
        if (all_genders.length > 0) {
          setgender_lis(all_genders);
        }
      });
  };

  // Main Carosel Item Render Function
  const renderItem = ({ item }) => {
    return (
      <Item item={item} masked={masked} setmodalVisible={setmodalVisible} />
    );
  };

  const renderItem2 = ({ item }) => (
    <Item2 item={item} setmodalVisible={setmodalVisible} />
  );

  useFocusEffect(
    React.useCallback(() => {
      if (gender_lis.length > 0) {
        let w_gen = gender_lis.find((v) => v[1] == "Woman");

        let w_pref = profile_data.userpreferances.filter((v) => v == w_gen[0]);

        if (w_pref.length > 0) {
          setpref_type("Woman");
        } else {
          setpref_type("Man");
        }
      }
      setswipe_tut_l(swipe_tut || repeat_tut);
      setstep(0);
    }, [gender_lis, profile_data])
  );

  useLayoutEffect(() => {
    getGenders();
  }, []);

  useEffect(() => {
    if (currentIndex !== currentIndex2 && modalVisible) {
      scrollTo();
    }
  }, [currentIndex, currentIndex2]);

  useEffect(() => {
    if (is_network_connected && hide_tut) {
      sethide_tut(false);
    }
  }, [is_network_connected]);

  return (
    <>
      {loading && <Loader />}
      <SafeAreaView
        style={{
          alignItems: "center",
          backgroundColor: "#fff",
          height: scrn_height,
          width: scrn_width,
        }}
      >
        <View
          style={{
            paddingBottom: showPrompts ? rspH(6) : 0,
          }}
        >
          {/* Report Dots */}
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

          {/* Profile Images Carousel */}
          <View style={styles.imageCont}>
            <FlatList
              data={pref_type ? (pref_type == "Woman" ? DATA : DATA2) : []}
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
              style={styles.filterCont}
              onPress={() => {
                setshowFilter(!showFilter);
              }}
            >
              {/* <FAIcon size={30} name="filter" color={"#ffffffcb"} /> */}
              <FastImage
                source={require("../../assets/images/Swiping/Filter3.png")}
                style={{ width: 26, height: 26 }}
              />
            </TouchableOpacity>

            {/* Features Container */}
            <View style={styles.featuresCont}>
              {/* Action Container */}
              <View style={styles.actionsCont}>
                {/* Action */}
                <TouchableOpacity style={styles.actionCont}>
                  <FastImage
                    source={require("../../assets/images/Swiping/Actions/Pass.png")}
                    style={{
                      width: rspW(8.695),
                      height: rspH(4),
                    }}
                  />
                </TouchableOpacity>

                {/* Action */}
                <TouchableOpacity style={styles.actionCont}>
                  <FastImage
                    source={require("../../assets/images/Swiping/Actions/Softspot.png")}
                    style={{
                      width: rspW(8.9),
                      height: rspH(4.4),
                    }}
                  />
                </TouchableOpacity>

                {/* Action */}
                <TouchableOpacity
                  onPress={() => {
                    setpromptsmodalVisible(true);
                  }}
                  style={styles.actionCont}
                >
                  <FastImage
                    source={require("../../assets/images/Swiping/Actions/FancyU.png")}
                    style={{
                      width: rspW(8.46),
                      // height: rspH(4.4),
                      height: rspH(4.6),
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              {/* Main Carousel Pagintors / Dots */}
              <Paginator
                data={pref_type ? (pref_type == "Woman" ? DATA : DATA2) : []}
                scrollX={scrollX}
                currentIndex={currentIndex}
              />
            </View>
          </View>

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
                  style={{ width: "80%", height: "70%" }}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/*  FullScreen Carousel */}
              <FlatList
                initialScrollIndex={currentIndex}
                data={pref_type ? (pref_type == "Woman" ? DATA : DATA2) : []}
                onLayout={() => {
                  setcurrentIndex2(currentIndex);
                  scrollTo(true);
                }}
                renderItem={renderItem2}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                bounces={false}
                getItemLayout={(data, index) => ({
                  length: scrn_width,
                  offset: scrn_width * index,
                  index,
                })}
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
                data={pref_type ? (pref_type == "Woman" ? DATA : DATA2) : []}
                scrollX={scrollX2}
                currentIndex={currentIndex2}
              />
            </View>
          </FullModal>

          {/* Profile Details Area */}
          <ScrollView
            decelerationRate={0.9}
            style={styles.profileDetailsCont}
            bounces={true}
            showsVerticalScrollIndicator={false}
          >
            {/* Profile Details Sub Container */}
            <View style={{ alignItems: "center" }}>
              <HScroller
                lis={[
                  [
                    require("../../assets/images/Swiping/BioIcons/City.png"),
                    "Madrid",
                  ],
                  [
                    require("../../assets/images/Swiping/BioIcons/Education.png"),
                    "Undergraduate",
                  ],
                  [
                    require("../../assets/images/Swiping/BioIcons/Politics.png"),
                    "Conservative",
                  ],
                ]}
              />

              {/* Public Prompt */}
              {showPrompts && (
                <View style={styles.promptContainer}>
                  <View style={styles.promptQuestionContainer}>
                    <Text style={styles.promptQuestion}>
                      The sign of a great first date
                    </Text>
                  </View>
                  <Text style={styles.promptAnswer}>
                    A great first date is when you feel like you’ve met your
                    soulmate, and you can’t believe how lucky you are. It’s when
                    you make each other laugh so hard that your stomach hurts,
                    and you tease each other with playful banter. It’s when you
                    open up about your hopes, fears, and secrets, and you feel a
                    deep bond. It’s when you kiss goodnight, and you feel
                    butterflies in your stomach. A great first date is when you
                    text each other right after, and you can’t wait for the next
                    one. 😉
                  </Text>
                </View>
              )}

              <View style={{ marginTop: rspH(0.6) }}>
                <HScrollerMulti
                  lis={[
                    { title: "Pets", values: [HamsterBlue, AntBlue] },
                    {
                      title: "Interests",
                      values: [
                        BeachBlue,
                        BaseballBlue,
                        AnimalCareBlue,
                        BasketballBlue,
                        BicyclingBlue,
                        BoatingBlue,
                        BowlingBlue,
                        BoxingBlue,
                        CampingBlue,
                        CookingBlue,
                        ChessBlue,
                        DancingBlue,
                        DrivingBlue,
                        DrumsBlue,
                      ],
                    },
                  ]}
                />
              </View>

              {/* Public Prompt */}
              {showPrompts && (
                <View style={styles.promptContainer}>
                  <View style={styles.promptQuestionContainer}>
                    <Text style={styles.promptQuestion}>
                      What's your favorite way to spend a rainy weekend at home
                      by yourself
                    </Text>
                  </View>
                  <Text style={styles.promptAnswer}>
                    My favorite way to spend a rainy weekend at home by myself
                    is to enjoy some quality me-time. I like to watch TV and
                    catch up on my favorite shows or movies, or maybe discover
                    something new. I also love to read books and immerse myself
                    in different worlds and stories. I find reading very
                    relaxing and stimulating at the same time. And of course, I
                    like to cook something delicious and healthy for myself, or
                    maybe try a new recipe. Cooking is a great way to express my
                    creativity and have fun. A rainy weekend at home by myself
                    is a perfect opportunity to do the things I love and pamper
                    myself.
                  </Text>
                </View>
              )}

              <View
                style={{
                  marginTop: rspH(0.6),
                  marginBottom:
                    Platform.OS == "ios" ? rspH(1) : insets.bottom / 1.5,
                }}
              >
                <HScroller
                  title={"Habits"}
                  lis={[
                    [DrinkingNo, "Not Drinking"],
                    [SmokingNo, "Not Smoking"],
                    [MarijuanaNo, "No Drugs"],
                  ]}
                />
              </View>

              {/* <HScrollerWS
                title={'Languages'}
                lis={[[LangIcon,'English'],
              [LangIcon,'Hebrew'],
              [LangIcon,'Hindi'],
              [LangIcon,'French'],
              [LangIcon,'Chinese'],
              ]}/> */}
            </View>
          </ScrollView>
        </View>

        {!hide_tut && (
          <>
            {swipe_tut_l && (
              <SafeAreaView style={styles.mainTutCont}>
                {/* Highligted Action */}
                <View
                  style={{
                    position: "relative",
                  }}
                >
                  {step == 0 && (
                    <View
                      style={{
                        position: "absolute",
                        top:
                          Platform.OS == "ios"
                            ? rspH(34.2) + insets.top
                            : rspH(34.3) + insets.bottom / 1.2,
                        left: rspW(66.8),
                      }}
                    >
                      <View style={{ ...styles.actionHighlightCont }}>
                        <View style={styles.actionCont}>
                          <FastImage
                            source={require("../../assets/images/Swiping/Actions/FancyU.png")}
                            style={{
                              width: rspW(8.46),
                              // height: rspH(4.4),
                              height: rspH(4.6),
                            }}
                            resizeMode="contain"
                          />
                        </View>
                      </View>
                    </View>
                  )}

                  {step == 1 && (
                    <View
                      style={{
                        position: "absolute",
                        top:
                          Platform.OS == "ios"
                            ? // ? rspH(35.5) + insets.top
                              // : rspH(35.5) + insets.bottom / 1.2,
                              rspH(34.2) + insets.top
                            : rspH(34.3) + insets.bottom / 1.2,
                        left: rspW(42.1),
                      }}
                    >
                      <View style={{ ...styles.actionHighlightCont }}>
                        <View style={styles.actionCont}>
                          <FastImage
                            source={require("../../assets/images/Swiping/Actions/Softspot.png")}
                            style={{
                              width: rspW(8.9),
                              height: rspH(4.4),
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  )}

                  {step == 2 && (
                    <View
                      style={{
                        position: "absolute",
                        top:
                          Platform.OS == "ios"
                            ? // ? rspH(35.5) + insets.top
                              // : rspH(35.5) + insets.bottom / 1.2,
                              rspH(34.2) + insets.top
                            : rspH(34.3) + insets.bottom / 1.2,
                        left: rspW(18),
                      }}
                    >
                      <View style={{ ...styles.actionHighlightCont }}>
                        <View style={styles.actionCont}>
                          <FastImage
                            source={require("../../assets/images/Swiping/Actions/Pass.png")}
                            style={{
                              width: rspW(8.695),
                              height: rspH(4),
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Highlighted Carousel */}
                  {step == 3 && (
                    <View
                      style={{
                        position: "absolute",
                        top:
                          Platform.OS == "ios"
                            ? rspH(1.7) + insets.top
                            : rspH(2),
                        left: rspW(3.8),
                        zIndex: 5,
                      }}
                    >
                      <View style={{ ...styles.carouselHighlightCont }}>
                        <View style={styles.imageCont}>
                          <FlatList
                            data={
                              pref_type
                                ? pref_type == "Woman"
                                  ? DATA
                                  : DATA2
                                : []
                            }
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            pagingEnabled
                            bounces={false}
                            onScroll={Animated.event(
                              [
                                {
                                  nativeEvent: {
                                    contentOffset: { x: scrollX },
                                  },
                                },
                              ],
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
                            style={styles.filterCont}
                            onPress={() => {}}
                          >
                            <FastImage
                              source={require("../../assets/images/Swiping/Filter3.png")}
                              style={{ width: 26, height: 26 }}
                            />
                          </TouchableOpacity>

                          {/* Features Container */}
                          <View style={styles.featuresCont}>
                            {/* Action Container */}
                            <View style={styles.actionsCont}>
                              {/* Action */}
                              <TouchableOpacity style={styles.actionCont}>
                                <FastImage
                                  source={require("../../assets/images/Swiping/Actions/Pass.png")}
                                  style={{
                                    width: rspW(8.695),
                                    height: rspH(4),
                                  }}
                                />
                              </TouchableOpacity>

                              {/* Action */}
                              <TouchableOpacity style={styles.actionCont}>
                                <FastImage
                                  source={require("../../assets/images/Swiping/Actions/Softspot.png")}
                                  style={{
                                    width: rspW(8.9),
                                    height: rspH(4.4),
                                  }}
                                />
                              </TouchableOpacity>

                              {/* Action */}
                              <TouchableOpacity style={styles.actionCont}>
                                <FastImage
                                  source={require("../../assets/images/Swiping/Actions/FancyU.png")}
                                  style={{
                                    width: rspW(8.46),
                                    // height: rspH(4.4),
                                    height: rspH(4.6),
                                  }}
                                  resizeMode="contain"
                                />
                              </TouchableOpacity>
                            </View>

                            {/* Main Carousel Pagintors / Dots */}
                            <Paginator
                              data={
                                pref_type
                                  ? pref_type == "Woman"
                                    ? DATA
                                    : DATA2
                                  : []
                              }
                              scrollX={scrollX}
                              currentIndex={currentIndex}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Central Modal View */}
                  {step < 4 && (
                    <View style={styles.centralModalCont}>
                      {/* Tut Text */}
                      <View style={styles.centralModalTextCont}>
                        <Text style={styles.centralModalText}>
                          {instruction_list[step]}
                        </Text>
                      </View>

                      <View>
                        {/* hr */}
                        <View
                          style={{
                            borderBottomColor: colors.grey,
                            borderBottomWidth: rspH(0.24),
                          }}
                        />

                        {/* Next Btn */}
                        <TouchableOpacity
                          onPress={() => {
                            if (step < 4) {
                              setstep(step + 1);
                            }
                          }}
                          style={styles.centralModalTextNextCont}
                        >
                          <Text style={styles.centralModalTextNext}>Next</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {/* Central Modal View 2 */}
                  {step == 4 && (
                    <View
                      style={{
                        ...styles.centralModalCont,
                        top:
                          Platform.OS == "ios"
                            ? rspH(14) + insets.top
                            : rspH(14) + insets.bottom,
                      }}
                    >
                      {/* Tut Text */}
                      <View style={styles.centralModalTextCont}>
                        <Text
                          style={styles.centralModalText}
                          numberOfLines={3}
                          adjustsFontSizeToFit
                        >
                          {instruction_list[step]}
                        </Text>
                      </View>

                      <View>
                        {/* hr */}
                        <View
                          style={{
                            borderBottomColor: colors.grey,
                            borderBottomWidth: rspH(0.24),
                          }}
                        />

                        {/* Next Btn */}
                        <TouchableOpacity
                          onPress={() => {
                            setswipe_tut_l(false);

                            if (repeat_tut) {
                              navigation.navigate("Match");
                            } else {
                              if (is_network_connected) {
                                swipeTutDone();
                              } else {
                                sethide_tut(true);
                              }
                            }
                          }}
                          style={styles.centralModalTextNextCont}
                        >
                          <Text style={styles.centralModalTextNext}>
                            Let's Start!
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {/* Scroll Modal View */}
                  {step == 4 && (
                    <View
                      style={{
                        marginTop:
                          Platform.OS == "ios"
                            ? rspH(48.5) + insets.top
                            : rspH(48) + insets.bottom,
                        alignSelf: "center",
                        ...styles.scrollModalCont,
                      }}
                    >
                      <ScrollView
                        decelerationRate={0.9}
                        bounces={true}
                        showsVerticalScrollIndicator={true}
                        style={{
                          ...styles.scrollModalCont,
                        }}
                      >
                        <View
                          style={{
                            alignSelf: "center",
                            paddingVertical: rspH(1.8),
                          }}
                        >
                          <HScroller
                            lis={[
                              [
                                require("../../assets/images/Swiping/BioIcons/City.png"),
                                "Madrid",
                              ],
                              [
                                require("../../assets/images/Swiping/BioIcons/Education.png"),
                                "Undergraduate",
                              ],
                              [
                                require("../../assets/images/Swiping/BioIcons/Politics.png"),
                                "Conservative",
                              ],
                            ]}
                          />

                          {/* Public Prompt */}
                          {showPrompts && (
                            <View
                              style={{
                                ...styles.promptContainer,
                                paddingHorizontal: rspW(5),
                              }}
                            >
                              <View style={styles.promptQuestionContainer}>
                                <Text style={styles.promptQuestion}>
                                  The sign of a great first date
                                </Text>
                              </View>
                              <Text style={styles.promptAnswer}>
                                A great first date is when you feel like you’ve
                                met your soulmate, and you can’t believe how
                                lucky you are. It’s when you make each other
                                laugh so hard that your stomach hurts, and you
                                tease each other with playful banter. It’s when
                                you open up about your hopes, fears, and
                                secrets, and you feel a deep bond. It’s when you
                                kiss goodnight, and you feel butterflies in your
                                stomach. A great first date is when you text
                                each other right after, and you can’t wait for
                                the next one. 😉
                              </Text>
                            </View>
                          )}

                          <View style={{ marginTop: rspH(0.6) }}>
                            <HScrollerMulti
                              lis={[
                                {
                                  title: "Pets",
                                  values: [HamsterBlue, AntBlue],
                                },
                                {
                                  title: "Interests",
                                  values: [
                                    BeachBlue,
                                    BaseballBlue,
                                    AnimalCareBlue,
                                    BasketballBlue,
                                    BicyclingBlue,
                                    BoatingBlue,
                                    BowlingBlue,
                                    BoxingBlue,
                                    CampingBlue,
                                    CookingBlue,
                                    ChessBlue,
                                    DancingBlue,
                                    DrivingBlue,
                                    DrumsBlue,
                                  ],
                                },
                              ]}
                            />
                          </View>

                          {/* Public Prompt */}

                          <View style={styles.promptContainer}>
                            <View style={styles.promptQuestionContainer}>
                              <Text style={styles.promptQuestion}>
                                What's your favorite way to spend a rainy
                                weekend at home by yourself
                              </Text>
                            </View>
                            <Text style={styles.promptAnswer}>
                              My favorite way to spend a rainy weekend at home
                              by myself is to enjoy some quality me-time. I like
                              to watch TV and catch up on my favorite shows or
                              movies, or maybe discover something new. I also
                              love to read books and immerse myself in different
                              worlds and stories. I find reading very relaxing
                              and stimulating at the same time. And of course, I
                              like to cook something delicious and healthy for
                              myself, or maybe try a new recipe. Cooking is a
                              great way to express my creativity and have fun. A
                              rainy weekend at home by myself is a perfect
                              opportunity to do the things I love and pamper
                              myself.
                            </Text>
                          </View>

                          <View style={{ marginTop: rspH(0.6) }}>
                            <HScroller
                              title={"Habits"}
                              lis={[
                                [SmokingNo, "Not Drinking"],
                                [SmokingNo, "Not Smoking"],
                                [MarijuanaNo, "No Drugs"],
                              ]}
                            />
                          </View>
                        </View>
                      </ScrollView>
                    </View>
                  )}
                </View>
              </SafeAreaView>
            )}
          </>
        )}
      </SafeAreaView>
    </>
  );
};

export default SwiperTut;

const styles = StyleSheet.create({
  container: {
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
    zIndex: 5,
    width: rspW(89),
    height: Platform.OS == "ios" ? rspH(42) : rspH(42) + insets.bottom,
    borderRadius: rspW(5.3),
  },

  item: {
    alignSelf: "center",
    borderRadius: rspW(5.1),
    width: rspW(88),
    marginRight: rspW(0.8),
    marginLeft: rspW(0.2),
    zIndex: 5,
  },

  actionsCont: {
    width: rspW(89),
    paddingHorizontal: rspW(13.8),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: rspH(1.1),
    marginBottom: rspH(1.5),
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

  // Profile Details
  profileDetailsCont: {
    alignSelf: "center",
    width: rspW(88),
    // marginTop: rspH(3.4),
    marginTop: rspH(2.5),
  },
  profileDetailsSubCont: {
    width: rspW(82),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileDetailsSubCont2: {
    width: rspW(82),
    marginTop: rspH(3),
    borderRadius: rspW(1.6),
    height: rspH(9.6),
    paddingHorizontal: rspW(3.2),
    paddingTop: rspH(1.17),
    paddingBottom: rspH(1.67),
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
    fontSize: rspF(2.14),
    lineHeight: rspF(2.18),
  },

  // Prompt
  promptContainer: {
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
    fontFamily: fontFamily.light,
    // fontSize: rspF(1.66),
    fontSize: rspF(2),
    color: colors.black,
    lineHeight: rspF(2.8),
    letterSpacing: 1,
  },

  mainTutCont: {
    position: "absolute",
    backgroundColor: "#0000006f",
    top: 0,
    left: 0,
    height: scrn_height,
    width: scrn_width,
  },

  // Actions Highlights
  actionHighlightCont: {
    width: rspW(15.2),
    height: rspW(15.2),
    borderRadius: rspW(7.52),
    backgroundColor: "#ffffffa3",
    // backgroundColor: "#ffffff3d",

    alignItems: "center",
    justifyContent: "center",
  },
  actionCont: {
    width: rspW(13),
    height: rspW(13),
    borderRadius: rspW(7),
    backgroundColor: colors.grey + "85",
    alignItems: "center",
    justifyContent: "center",
  },

  // Tutorial Central Modal
  centralModalCont: {
    alignSelf: "center",
    position: "absolute",
    height: Platform.OS == "ios" ? rspH(28.85) : rspH(28.85),
    width: rspW(86),
    borderRadius: rspW(3),
    backgroundColor: colors.white,
    top:
      Platform.OS == "ios" ? rspH(48) + insets.top : rspH(48.4) + insets.bottom,

    paddingHorizontal: rspW(4.6),
    justifyContent: "space-between",
  },

  centralModalTextCont: {
    marginTop: rspH(2.8),
  },
  centralModalText: {
    fontSize: rspF(2.488),
    lineHeight: rspH(3.35),
    fontFamily: fontFamily.bold,
    color: colors.black,
    letterSpacing: 1,
  },

  centralModalTextNextCont: {
    justifyContent: "center",
    marginHorizontal: rspW(3.1),
    paddingHorizontal: rspW(3.2),
    marginVertical: rspH(1.4),
    height: rspH(4.6),
    width: rspW(69.6),
  },

  centralModalTextNext: {
    fontSize: rspF(2.02),
    lineHeight: rspF(2.1),
    fontFamily: fontFamily.bold,
    color: colors.blue,
    letterSpacing: 1,
  },

  //Tutorial Scroll Modal
  scrollModalCont: {
    height:
      Platform.OS == "ios" ? rspH(44) - insets.top : rspH(43.1) - insets.bottom,
    width: rspW(91.8),
    borderRadius: rspW(4),
    backgroundColor: colors.white,
  },

  carouselHighlightCont: {
    width: rspW(92.4),
    height: Platform.OS == "ios" ? rspH(44) : rspH(44) + insets.bottom,
    borderRadius: rspW(6.4),
    position: "relative",
    backgroundColor: "#ffffff",
    alignItems: "center",
    zIndex: 3,
    justifyContent: "center",
  },

  // Fetures Styling
  featuresCont: {
    position: "absolute",
    alignSelf: "center",
    // bottom: rspH(0.6),
    bottom: rspH(1.6),
  },

  filterCont: {
    top: rspH(2.35),
    right: rspW(5.1),
    position: "absolute",
    alignSelf: "flex-end",
  },

  habitsImage: {
    width: rspW(10.1),
    aspectRatio: 1,
  },
});
