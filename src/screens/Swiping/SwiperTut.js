import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
  SafeAreaView,
  StatusBar,
  PermissionsAndroid,
  Platform,
  Alert,
} from "react-native";

import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
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
import { DrinkingNo, MarijuanaNo, SmokingNo } from "../../assets";
import { setSwipeTut } from "../../store/reducers/tutorial/tutorial";
import { apiUrl } from "../../constants";
import axios from "axios";
import Loader from "../../components/loader/Loader";
import { setSessionExpired } from "../../store/reducers/authentication/authentication";

const DATA = [
  {
    id: 1,
    title: "First Item",
    image: require("../../assets/images/Tutorial/Tut1.png"),
    image2: require("../../assets/images/Tutorial/Tut2.png"),
  },
  {
    id: 2,
    title: "Second Item",
    image:
      // '../../assets/images/Tutorial/Tut1.png',
      require("../../assets/images/Tutorial/Tut1.png"),
    image2: require("../../assets/images/Tutorial/Tut2.png"),
  },
  {
    id: 3,
    title: "Third Item",
    image: require("../../assets/images/Tutorial/Tut1.png"),
    image2: require("../../assets/images/Tutorial/Tut2.png"),
  },
  {
    id: 4,
    title: "Fourth Item",
    image: require("../../assets/images/Tutorial/Tut1.png"),
    image2: require("../../assets/images/Tutorial/Tut2.png"),
  },
];

const Item = ({ item, setmodalVisible, masked }) => {
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
                <Image
                  source={require("../../assets/images/Swiping/Actions/Softspot.png")}
                  style={{
                    width: rspW(14.5),
                    height: rspH(7),
                  }}
                />
              </View>

              <Image
                source={require("../../assets/images/Swiping/Masked/Exclude_2.png")}
                style={{
                  width: rspW(89),
                  height: rspH(42),
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 1,
                  //  borderRadius
                  //  borderTopRightRadius: 30,
                }}
                resizeMode="stretch"
              />
            </>
          )}

          <Image
            source={item.image}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: rspW(5.1),
            }}
            resizeMode="cover"
          />
        </>
      </TouchableOpacity>
    </View>
  );
};

const Item2 = ({ item }) => {
  return (
    <View style={styles.item2}>
      <Image
        source={item.image2}
        style={{ width: "100%", height: "98%" }}
        resizeMode="contain"
      />
    </View>
  );
};

const SwiperTut = ({ navigation }) => {
  const [masked, setmasked] = useState(false);
  const dispatch = useDispatch();

  const [loading, setloading] = useState(false);

  const [profiles, setprofiles] = useState([
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "First Item",
      image: require("../../assets/images/Tutorial/Tut1.png"),
      image2: require("../../assets/images/Tutorial/Tut2.png"),
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "Second Item",
      image:
        // '../../assets/images/Tutorial/Tut1.png',
        require("../../assets/images/Tutorial/Tut1.png"),
      image2: require("../../assets/images/Tutorial/Tut2.png"),
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "Third Item",
      image: require("../../assets/images/Tutorial/Tut1.png"),
      image2: require("../../assets/images/Tutorial/Tut2.png"),
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d73",
      title: "Fourth Item",
      image: require("../../assets/images/Tutorial/Tut1.png"),
      image2: require("../../assets/images/Tutorial/Tut2.png"),
    },
  ]);

  const swipe_tut = useSelector((state) => state.tutorial.swipe_tut);
  const [swipe_tut_l, setswipe_tut_l] = useState(swipe_tut);
  const [step, setstep] = useState(0);
  const [instruction_list, setinstruction_list] = useState([
    "Fancy someone you think \nyou can click with. If they \nlike you back you could \nspeak later on. ",
    "Let people know you fancy \nthem by sending them a \nsoft spot.",
    "Pass on someone that you \nfeel you will not connect \nwith.",
    "Swipe to check out \nmultiple photos. You can \nalso enlarge it by clicking \non it.",
    "Scroll to see the bio of the \nsoul. You can also enlarge \nthe bio by clicking on it.",
  ]);

  const access_token = useSelector(
    (state) => state.authentication.access_token
  );
  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );

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
      dispatch(setSessionExpired(true));
      console.log("error", error);
      return false;
    }
  };

  // Main Carosel Item Render Function
  const renderItem = ({ item }) => (
    <Item item={item} masked={masked} setmodalVisible={setmodalVisible} />
  );

  // Full Screen Carosel Item Render Function
  const renderItem2 = ({ item }) => (
    <Item2 item={item} setmodalVisible={setmodalVisible} />
  );

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
        {/* <View style={{...styles.container}}> */}

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
              data={profiles}
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
              <FAIcon size={30} name="filter" color={"#ffffffcb"} />
            </TouchableOpacity>

            {/* Features Container */}
            <View style={styles.featuresCont}>
              {/* Action Container */}
              <View style={styles.actionsCont}>
                {/* Action */}
                <TouchableOpacity style={styles.actionCont}>
                  <Image
                    source={require("../../assets/images/Swiping/Actions/Pass.png")}
                    style={{
                      width: rspW(8.695),
                      // height: rspH(4),
                      height: rspH(4),
                    }}
                  />
                </TouchableOpacity>

                {/* Action */}
                <TouchableOpacity style={styles.actionCont}>
                  <Image
                    source={require("../../assets/images/Swiping/Actions/Softspot.png")}
                    style={{
                      width: rspW(9.8),

                      height: rspH(4.8),
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
                  <Image
                    source={require("../../assets/images/Swiping/Actions/Fancy.png")}
                    style={{
                      width: rspW(8.46),
                      height: rspH(4.3),
                    }}
                  />
                </TouchableOpacity>
              </View>

              {/* Main Carousel Pagintors / Dots */}
              <Paginator
                data={profiles}
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
                  top: rspH(2.35),
                  left: rspW(10),
                }}
                onPress={() => {
                  setmodalVisible(false);
                }}
              >
                <ADIcon size={20} name="left" color={"#fff"} />
              </TouchableOpacity>

              {/*  FullScreen Carousel */}
              <FlatList
                data={profiles}
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
                data={profiles}
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
          >
            {/* Profile Details Sub Container */}
            <View style={{ alignItems: "center" }}>
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
                    <Image
                      source={require("../../assets/images/Swiping/BioIcons/City.png")}
                      style={{
                        // width: rspW(6.75),
                        width: rspW(6.75),
                        // height: rspH(3),
                        height: rspH(3),
                        // marginRight: rspW(2),
                        marginRight: rspW(2),
                      }}
                    />
                    <Text style={styles.profileDetailContNText}>Tel Aviv</Text>
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
                    <Text style={styles.profileDetailContNText}>Graduate</Text>
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
                      source={DrinkingNo}
                      style={{
                        ...styles.habitsImage,
                      }}
                    />
                    <Image
                      source={SmokingNo}
                      style={{
                        ...styles.habitsImage,
                      }}
                    />
                    <Image
                      source={MarijuanaNo}
                      style={{
                        ...styles.habitsImage,
                      }}
                    />
                  </View>
                </View>
              </View>

              {/* Public Prompt */}
              {showPrompts && (
                <View style={styles.promptContainer}>
                  <View style={styles.promptQuestionContainer}>
                    <Text style={styles.promptQuestion}>
                      Public Prompt Question 1?
                    </Text>
                  </View>
                  <Text style={styles.promptAnswer}>
                    Public Prompt Question 1 Answer Public Prompt Question 1
                    {"\n"}
                    Answer Public Prompt
                    {"\n"}
                    prompt
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
                  style={{
                    marginTop: rspH(0.8),
                  }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  <Image
                    source={require("../../assets/images/Swiping/Interests/InterestsBlue/Beach.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <Image
                    source={require("../../assets/images/Swiping/Interests/InterestsBlue/Bowling.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <Image
                    source={require("../../assets/images/Swiping/Interests/InterestsBlue/Basketball.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <Image
                    source={require("../../assets/images/Swiping/Interests/InterestsBlue/Boating.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <Image
                    source={require("../../assets/images/Swiping/Interests/InterestsBlue/Bicycling.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <Image
                    source={require("../../assets/images/Swiping/Interests/InterestsBlue/AmericanFootball.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <Image
                    source={require("../../assets/images/Swiping/Interests/InterestsBlue/AnimalCare.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <Image
                    source={require("../../assets/images/Swiping/Interests/InterestsBlue/Baking.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                </ScrollView>
              </View>

              {/* Public Prompt */}
              {showPrompts && (
                <View style={styles.promptContainer}>
                  <View style={styles.promptQuestionContainer}>
                    <Text style={styles.promptQuestion}>
                      Public Prompt Question 2?
                    </Text>
                  </View>
                  <Text style={styles.promptAnswer}>
                    Public Prompt Question 2 Answer Public Prompt Question 2
                    {"\n"}
                    Answer Public Prompt
                    {"\n"}
                    prompt
                  </Text>
                </View>
              )}

              <View
                style={{
                  ...styles.profileDetailsSubCont2,
                  ...styles.boxShadowCont,
                  width: rspW(39.5),
                  marginBottom: rspH(0.6),
                }}
              >
                <Text style={styles.profileDetailContHeading}>Pets</Text>
                <ScrollView
                  style={{ marginTop: rspH(0.8) }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  <Image
                    source={require("../../assets/images/Swiping/Pets/PetsBlue/Ant.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <Image
                    source={require("../../assets/images/Swiping/Pets/PetsBlue/Hamster.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <Image
                    source={require("../../assets/images/Swiping/Pets/PetsBlue/GuineaPig.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <Image
                    source={require("../../assets/images/Swiping/Pets/PetsBlue/Bird.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <Image
                    source={require("../../assets/images/Swiping/Pets/PetsBlue/Butterfly.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <Image
                    source={require("../../assets/images/Swiping/Pets/PetsBlue/Cat.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />

                  <Image
                    source={require("../../assets/images/Swiping/Pets/PetsBlue/Dog.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <Image
                    source={require("../../assets/images/Swiping/Pets/PetsBlue/Chicken.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <Image
                    source={require("../../assets/images/Swiping/Pets/PetsBlue/Ferret.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* </View> */}

        <>
          {swipe_tut_l && (
            <SafeAreaView style={styles.mainTutCont}>
              {/* Highligted Action */}
              <View
                style={{
                  position: "relative",

                  // backgroundColor:'red',
                }}
              >
                {step == 0 && (
                  <View
                    style={{
                      position: "absolute",
                      // top: rspH(41),
                      top: rspH(41),
                      left: rspW(66.3),
                    }}
                  >
                    <View style={{ ...styles.actionHighlightCont }}>
                      <View style={styles.actionCont}>
                        <Image
                          source={require("../../assets/images/Swiping/Actions/Fancy.png")}
                          style={{
                            // backgroundColor:'red',
                            // width: rspW(8.46),
                            // height: rspH(4.3),
                            width: rspW(8.9),
                            height: rspH(4.4),
                          }}
                        />
                      </View>
                    </View>
                  </View>
                )}

                {step == 1 && (
                  <View
                    style={{
                      position: "absolute",
                      top: rspH(41),
                      left: rspW(42.1),
                    }}
                  >
                    <View style={{ ...styles.actionHighlightCont }}>
                      <View style={styles.actionCont}>
                        <Image
                          source={require("../../assets/images/Swiping/Actions/Softspot.png")}
                          style={{
                            // width: rspW(8.46),
                            // height: rspH(4.3),
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
                      top: rspH(41),
                      left: rspW(18),
                    }}
                  >
                    <View style={{ ...styles.actionHighlightCont }}>
                      <View style={styles.actionCont}>
                        <Image
                          source={require("../../assets/images/Swiping/Actions/Pass.png")}
                          style={{
                            // width: rspW(8.46),
                            // height: rspH(4.3),
                            width: rspW(8.9),
                            height: rspH(4.4),
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
                      top: rspH(Platform.OS == "ios" ? 7.4 : 2),
                      left: rspW(3.8),
                      zIndex: 5,
                    }}
                  >
                    <View style={{ ...styles.carouselHighlightCont }}>
                      <View style={styles.imageCont}>
                        <FlatList
                          data={DATA}
                          renderItem={renderItem}
                          keyExtractor={(item) => item.id}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          pagingEnabled
                          bounces={false}
                          onScroll={Animated.event(
                            [
                              {
                                nativeEvent: { contentOffset: { x: scrollX } },
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
                          <FAIcon size={30} name="filter" color={"#ffffffcb"} />
                        </TouchableOpacity>

                        {/* Features Container */}
                        <View style={styles.featuresCont}>
                          {/* Action Container */}
                          <View style={styles.actionsCont}>
                            {/* Action */}
                            <TouchableOpacity style={styles.actionCont}>
                              <Image
                                source={require("../../assets/images/Swiping/Actions/Pass.png")}
                                style={{
                                  width: rspW(8.695),
                                  height: rspH(4),
                                }}
                              />
                            </TouchableOpacity>

                            {/* Action */}
                            <TouchableOpacity style={styles.actionCont}>
                              <Image
                                source={require("../../assets/images/Swiping/Actions/Softspot.png")}
                                style={{
                                  width: rspW(9.8),
                                  height: rspH(4.8),
                                }}
                              />
                            </TouchableOpacity>

                            {/* Action */}
                            <TouchableOpacity style={styles.actionCont}>
                              <Image
                                source={require("../../assets/images/Swiping/Actions/Fancy.png")}
                                style={{
                                  width: rspW(8.46),
                                  height: rspH(4.3),
                                }}
                              />
                            </TouchableOpacity>
                          </View>

                          {/* Main Carousel Pagintors / Dots */}
                          <Paginator
                            data={DATA}
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
                      top: rspH(19.76),
                    }}
                  >
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
                          // borderBottomWidth: rspH(0.24),
                        }}
                      />

                      {/* Next Btn */}
                      <TouchableOpacity
                        onPress={() => {
                          setswipe_tut_l(false);
                          swipeTutDone();
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
                      marginTop: rspH(52),
                      alignSelf: "center",
                      ...styles.scrollModalCont,
                    }}
                  >
                    <ScrollView
                      bounces={false}
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
                        {/* Profile Details Sub Container */}
                        <View style={styles.profileDetailsSubCont}>
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
                              <Image
                                source={require("../../assets/images/Swiping/BioIcons/City.png")}
                                style={{
                                  width: rspW(6.75),
                                  height: rspH(3),
                                  marginRight: rspW(2),
                                }}
                              />
                              <Text style={styles.profileDetailContNText}>
                                Tel Aviv
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
                              <Text style={styles.profileDetailContNText}>
                                Graduate
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
                                source={DrinkingNo}
                                style={{
                                  ...styles.habitsImage,
                                }}
                              />
                              <Image
                                source={SmokingNo}
                                style={{
                                  ...styles.habitsImage,
                                }}
                              />
                              <Image
                                source={MarijuanaNo}
                                style={{
                                  ...styles.habitsImage,
                                }}
                              />
                            </View>
                          </View>
                        </View>

                        {/* Public Prompt */}
                        <View style={styles.promptContainer}>
                          <View style={styles.promptQuestionContainer}>
                            <Text style={styles.promptQuestion}>
                              Public Prompt Question 1?
                            </Text>
                          </View>
                          <Text style={styles.promptAnswer}>
                            Public Prompt Question 1 Answer Public Prompt
                            Question 1{"\n"}
                            Answer Public Prompt
                            {"\n"}
                            prompt
                          </Text>
                        </View>

                        <View
                          style={{
                            ...styles.profileDetailsSubCont2,
                            ...styles.boxShadowCont,
                          }}
                        >
                          <Text style={styles.profileDetailContHeading}>
                            Interests
                          </Text>
                          <ScrollView
                            style={{ marginTop: rspH(0.8) }}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                          >
                            <Image
                              source={require("../../assets/images/Swiping/Interests/InterestsBlue/Beach.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <Image
                              source={require("../../assets/images/Swiping/Interests/InterestsBlue/Bowling.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <Image
                              source={require("../../assets/images/Swiping/Interests/InterestsBlue/Basketball.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <Image
                              source={require("../../assets/images/Swiping/Interests/InterestsBlue/Boating.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <Image
                              source={require("../../assets/images/Swiping/Interests/InterestsBlue/Bicycling.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <Image
                              source={require("../../assets/images/Swiping/Interests/InterestsBlue/AmericanFootball.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <Image
                              source={require("../../assets/images/Swiping/Interests/InterestsBlue/AnimalCare.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <Image
                              source={require("../../assets/images/Swiping/Interests/InterestsBlue/Baking.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                          </ScrollView>
                        </View>

                        {/* Public Prompt */}

                        <View style={styles.promptContainer}>
                          <View style={styles.promptQuestionContainer}>
                            <Text style={styles.promptQuestion}>
                              Public Prompt Question 2?
                            </Text>
                          </View>
                          <Text style={styles.promptAnswer}>
                            Public Prompt Question 2 Answer Public Prompt
                            Question 2{"\n"}
                            Answer Public Prompt
                            {"\n"}
                            prompt
                          </Text>
                        </View>

                        <View
                          style={{
                            ...styles.profileDetailsSubCont2,
                            ...styles.boxShadowCont,
                            width: rspW(39.5),
                          }}
                        >
                          <Text style={styles.profileDetailContHeading}>
                            Pets
                          </Text>
                          <ScrollView
                            style={{ marginTop: rspH(0.8) }}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                          >
                            <Image
                              source={require("../../assets/images/Swiping/Pets/PetsBlue/Ant.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <Image
                              source={require("../../assets/images/Swiping/Pets/PetsBlue/Hamster.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <Image
                              source={require("../../assets/images/Swiping/Pets/PetsBlue/GuineaPig.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <Image
                              source={require("../../assets/images/Swiping/Pets/PetsBlue/Bird.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <Image
                              source={require("../../assets/images/Swiping/Pets/PetsBlue/Butterfly.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <Image
                              source={require("../../assets/images/Swiping/Pets/PetsBlue/Cat.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />

                            <Image
                              source={require("../../assets/images/Swiping/Pets/PetsBlue/Dog.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <Image
                              source={require("../../assets/images/Swiping/Pets/PetsBlue/Chicken.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <Image
                              source={require("../../assets/images/Swiping/Pets/PetsBlue/Ferret.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                          </ScrollView>
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                )}
              </View>
            </SafeAreaView>
          )}
        </>
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
    // marginRight: rspW(5.5),
    marginRight: rspW(5.5),
    // backgroundColor:'red',
  },
  dots: {
    backgroundColor: colors.blue,
    // width: rspW(1),
    width: rspW(1),
    borderRadius: rspW(0.51),
    aspectRatio: 1,
    // marginVertical: rspH(1.1),
    marginVertical: rspH(1.1),
  },

  imageCont: {
    width: rspW(89),
    // width: rspW(81),
    height: rspH(42),
    height: rspH(Platform.OS == "ios" ? 42 : 48.3),

    borderRadius: rspW(5.3),
    // borderRadius: rspW(200),

    // position: 'relative',
    // backgroundColor:'red',
  },

  item: {
    borderRadius: rspW(5.1),
    width: rspW(89),
  },

  actionsCont: {
    width: rspW(89),
    paddingHorizontal: rspW(13.8),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: rspH(1.1),
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
    width: rspW(86),
    marginTop: rspH(3.4),
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
    // height: rspH(9.6),
    height: rspH(9.6),
    // width: rspW(39.5),
    width: rspW(39.5),
    // borderRadius: rspW(1.6),
    borderRadius: rspW(1.6),

    // backgroundColor: 'blue',
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
    // fontSize: rspF(2.02),
    fontFamily: fontFamily.bold,
    lineHeight: rspF(2.1),
    color: colors.black,
    letterSpacing: 1,
  },
  interestImage: {
    height: rspH(3.75),
    // height: rspH(3.75),
    // width: rspW(7.64),
    width: rspW(7.64),
    // marginRight: rspW(4.52),
    marginRight: rspW(4.52),
  },
  profileDetailContNText: {
    color: colors.blue,
    fontFamily: fontFamily.semi_bold,
    // fontSize: rspF(2.138),
    fontSize: rspF(2.14),

    // lineHeight: rspF(2.18),
    lineHeight: rspF(2.18),
  },

  // Prompt
  promptContainer: {
    width: rspW(82),
    height: rspH(12.9),
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
    fontSize: rspF(1.9),
    // fontSize: rspF(1.9),
    color: colors.black,

    lineHeight: rspF(1.96),

    letterSpacing: 1,
  },
  promptAnswer: {
    fontFamily: fontFamily.light,
    fontSize: rspF(1.66),
    // fontSize: rspF(1.66),
    color: colors.black,
    lineHeight: rspF(2.18),
    letterSpacing: 1,
  },
  // });

  // const styles = StyleSheet.create({
  // Tutorial Main Container
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

    alignItems: "center",
    justifyContent: "center",
  },
  actionCont: {
    // width: rspW(13),
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

    height: rspH(28.85),

    width: rspW(86),
    borderRadius: rspW(3),
    backgroundColor: colors.white,
    top: rspH(Platform.OS == "ios" ? 53.6 : 55),
    paddingHorizontal: rspW(4.6),
    justifyContent: "space-between",
  },

  centralModalTextCont: {
    // marginTop: rspH(2.8),
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
    // position: 'absolute',
    height: rspH(38.74),
    width: rspW(91.8),
    borderRadius: rspW(4),
    backgroundColor: colors.white,
  },

  carouselHighlightCont: {
    // width: rspW(92.4),
    width: rspW(92.4),
    // height: rspH(43.6),
    height: rspH(Platform.OS == "ios" ? 43.6 : 50),
    borderRadius: rspW(6.4),
    position: "relative",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor:'#d72e2e39',
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
    top: rspH(2.35),
    right: rspW(5.1),
    position: "absolute",
    alignSelf: "flex-end",
  },

  habitsImage: {
    width: rspW(10.1),
    height: rspH(4.7),
    resizeMode: "contain",
  },
});
