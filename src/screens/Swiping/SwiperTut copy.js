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
} from "react-native";

import React, { useRef, useState, useLayoutEffect } from "react";
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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import { setAllGenders } from "../../store/reducers/allData/allData";

const DATA = [
  {
    id: 1,
    image: require("../../assets/images/Tutorial/Tut1.png"),
    image2: require("../../assets/images/Tutorial/Tut2.png"),
  },
  {
    id: 2,
    image: require("../../assets/images/Tutorial/Tut1.png"),
    image2: require("../../assets/images/Tutorial/Tut2.png"),
  },
  {
    id: 3,
    image: require("../../assets/images/Tutorial/Tut1.png"),
    image2: require("../../assets/images/Tutorial/Tut2.png"),
  },
  {
    id: 4,
    image: require("../../assets/images/Tutorial/Tut1.png"),
    image2: require("../../assets/images/Tutorial/Tut2.png"),
  },
  {
    id: 5,
    image: require("../../assets/images/Tutorial/Tut1.png"),
    image2: require("../../assets/images/Tutorial/Tut2.png"),
  },
  {
    id: 6,
    image: require("../../assets/images/Tutorial/Tut1.png"),
    image2: require("../../assets/images/Tutorial/Tut2.png"),
  },
  {
    id: 7,
    image: require("../../assets/images/Tutorial/Tut1.png"),
    image2: require("../../assets/images/Tutorial/Tut2.png"),
  },
  {
    id: 8,
    image: require("../../assets/images/Tutorial/Tut1.png"),
    image2: require("../../assets/images/Tutorial/Tut2.png"),
  },
];

const DATA2 = [
  {
    id: 1,
    // image: require("../../assets/images/Tutorial/Tut1.png"),
    image: require("../../assets/images/Tutorial/ManPhotos/Enlargedphotos/Photo1.jpg"),
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

          // require("../../assets/images/Tutorial/Tut1.png")
          // require('../../assets/images/Tutorial/ManPhotos/Enlargedphotos/Photo1.jpg')
            source={item.image}
          
            style={{
              width: "99%",
              height: "100%",
              borderRadius: rspW(5.1),
              zIndex: 2,
              
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

  const [gender_lis, setgender_lis] = useState([])
  const swipe_tut = useSelector((state) => state.tutorial.swipe_tut);
  const [swipe_tut_l, setswipe_tut_l] = useState(swipe_tut || repeat_tut);
  const [step, setstep] = useState(0);
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
  const [pref_type, setpref_type] = useState('')

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
      return false;
    }
  };

  const getGenders = async () => {
    // setloading(true);


    await axios
      .get(apiUrl + "getactivegender/")
      .then((resp) => {
        if (resp.status == 200) {
          let tmp = resp.data.data;

          let sorted_tmp = tmp.sort(function (a, b) {
            return a["position"] - b["position"];
          });

          let tmp_lis = sorted_tmp.map((v) => [v.id, v.gender]);
          // console.log("tmp_lis",tmp_lis)
          dispatch(setAllGenders(tmp_lis));
          setgender_lis(tmp_lis)
          // console.log("profile_data.userpreferances",profile_data.userpreferances)
         
        }
      })
      .catch((err) => {
        // setloading(false);
      });
  };

  // Main Carosel Item Render Function
  const renderItem = ({ item }) => (
    <Item item={item} masked={masked} setmodalVisible={setmodalVisible} />
  );

  const renderItem2 = ({ item }) => (
    <Item2 item={item} setmodalVisible={setmodalVisible} />
  );

  useFocusEffect(
    React.useCallback(() => {
      console.log("Tut Focus")
     if (gender_lis.length > 0) {
      let w_gen = gender_lis.find(v => v[1] == 'Woman')
        
         let w_pref = profile_data.userpreferances.filter(v => v == w_gen[0])
          console.log("w_pref",w_pref)
        if (w_pref.length > 0) {
          setpref_type("Woman") 
        }
        else{
          setpref_type("Man") 
        }

     }
      setswipe_tut_l(swipe_tut || repeat_tut);
      setstep(0);
      return () => {
        // dispatch(setRepeatTut(false))
      };
    }, [gender_lis,profile_data])
  );

  useLayoutEffect(() => {
    getGenders()
  }, [])

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
              data={pref_type ? pref_type  == 'Woman' ? DATA: DATA2 : []}
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
                  <FastImage
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
                data={pref_type ? pref_type  == 'Woman' ? DATA: DATA2 : []}
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
                data={pref_type ? pref_type  == 'Woman' ? DATA: DATA2 : []}
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
                data={pref_type ? pref_type  == 'Woman' ? DATA: DATA2 : []}
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
                    <FastImage
                      source={require("../../assets/images/Swiping/BioIcons/City.png")}
                      style={{
                        width: rspW(6.75),
                        height: rspH(3),
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
                    <FastImage
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
                    <FastImage
                      source={DrinkingNo}
                      style={{
                        ...styles.habitsImage,
                      }}
                      resizeMode="contain"
                    />
                    <FastImage
                      source={SmokingNo}
                      style={{
                        ...styles.habitsImage,
                      }}
                      resizeMode="contain"
                    />
                    <FastImage
                      source={MarijuanaNo}
                      style={{
                        ...styles.habitsImage,
                      }}
                      resizeMode="contain"
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
                  <FastImage
                    source={require("../../assets/images/Swiping/Interests/InterestsBlue/Beach.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <FastImage
                    source={require("../../assets/images/Swiping/Interests/InterestsBlue/Cooking.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <FastImage
                    source={require("../../assets/images/Swiping/Interests/InterestsBlue/Dancing.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <FastImage
                    source={require("../../assets/images/Swiping/Interests/InterestsBlue/Driving.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <FastImage
                    source={require("../../assets/images/Swiping/Interests/InterestsBlue/Football.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <FastImage
                    source={require("../../assets/images/Swiping/Interests/InterestsBlue/Gaming.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <FastImage
                    source={require("../../assets/images/Swiping/Interests/InterestsBlue/Gym.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <FastImage
                    source={require("../../assets/images/Swiping/Interests/InterestsBlue/Guitar.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <FastImage
                    source={require("../../assets/images/Swiping/Interests/InterestsBlue/Guitar.png")}
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
                  <FastImage
                    source={require("../../assets/images/Swiping/Pets/PetsBlue/Ant.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <FastImage
                    source={require("../../assets/images/Swiping/Pets/PetsBlue/Hamster.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <FastImage
                    source={require("../../assets/images/Swiping/Pets/PetsBlue/GuineaPig.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <FastImage
                    source={require("../../assets/images/Swiping/Pets/PetsBlue/Bird.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <FastImage
                    source={require("../../assets/images/Swiping/Pets/PetsBlue/Butterfly.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <FastImage
                    source={require("../../assets/images/Swiping/Pets/PetsBlue/Cat.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />

                  <FastImage
                    source={require("../../assets/images/Swiping/Pets/PetsBlue/Dog.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <FastImage
                    source={require("../../assets/images/Swiping/Pets/PetsBlue/Chicken.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                  <FastImage
                    source={require("../../assets/images/Swiping/Pets/PetsBlue/Ferret.png")}
                    style={styles.interestImage}
                    resizeMode="cover"
                  />
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </View>

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
                      top: rspH(41),
                      left: rspW(66.3),
                    }}
                  >
                    <View style={{ ...styles.actionHighlightCont }}>
                      <View style={styles.actionCont}>
                        <FastImage
                          source={require("../../assets/images/Swiping/Actions/Fancy.png")}
                          style={{
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
                      top: rspH(41),
                      left: rspW(18),
                    }}
                  >
                    <View style={{ ...styles.actionHighlightCont }}>
                      <View style={styles.actionCont}>
                        <FastImage
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
                          data={pref_type ? pref_type  == 'Woman' ? DATA: DATA2 : []}
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
                                  width: rspW(9.8),
                                  height: rspH(4.8),
                                }}
                              />
                            </TouchableOpacity>

                            {/* Action */}
                            <TouchableOpacity style={styles.actionCont}>
                              <FastImage
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
                            data={pref_type ? pref_type  == 'Woman' ? DATA: DATA2 : []}
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
                            swipeTutDone();
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
                              <FastImage
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
                              <FastImage
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
                              <FastImage
                                source={DrinkingNo}
                                style={{
                                  ...styles.habitsImage,
                                }}
                                resizeMode="contain"
                              />
                              <FastImage
                                source={SmokingNo}
                                style={{
                                  ...styles.habitsImage,
                                }}
                                resizeMode="contain"
                              />
                              <FastImage
                                source={MarijuanaNo}
                                style={{
                                  ...styles.habitsImage,
                                }}
                                resizeMode="contain"
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
                            <FastImage
                              source={require("../../assets/images/Swiping/Interests/InterestsBlue/Beach.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <FastImage
                              source={require("../../assets/images/Swiping/Interests/InterestsBlue/Bowling.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <FastImage
                              source={require("../../assets/images/Swiping/Interests/InterestsBlue/Basketball.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <FastImage
                              source={require("../../assets/images/Swiping/Interests/InterestsBlue/Boating.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <FastImage
                              source={require("../../assets/images/Swiping/Interests/InterestsBlue/Bicycling.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <FastImage
                              source={require("../../assets/images/Swiping/Interests/InterestsBlue/AmericanFootball.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <FastImage
                              source={require("../../assets/images/Swiping/Interests/InterestsBlue/AnimalCare.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <FastImage
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
                            <FastImage
                              source={require("../../assets/images/Swiping/Pets/PetsBlue/Ant.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <FastImage
                              source={require("../../assets/images/Swiping/Pets/PetsBlue/Hamster.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <FastImage
                              source={require("../../assets/images/Swiping/Pets/PetsBlue/GuineaPig.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <FastImage
                              source={require("../../assets/images/Swiping/Pets/PetsBlue/Bird.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <FastImage
                              source={require("../../assets/images/Swiping/Pets/PetsBlue/Butterfly.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <FastImage
                              source={require("../../assets/images/Swiping/Pets/PetsBlue/Cat.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />

                            <FastImage
                              source={require("../../assets/images/Swiping/Pets/PetsBlue/Dog.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <FastImage
                              source={require("../../assets/images/Swiping/Pets/PetsBlue/Chicken.png")}
                              style={styles.interestImage}
                              resizeMode="cover"
                            />
                            <FastImage
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
    // height: rspH(42),
    height: rspH(Platform.OS == "ios" ? 42 : 48.3),
    borderRadius: rspW(5.3),
  },

  item: {
    // borderRadius: rspW(5.1),
    // width: rspW(89),
    alignSelf:'center',
    borderRadius: rspW(5.1),
    width: rspW(89),
    // marginRight: rspW(1),
    // marginLeft: rspW(1),
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
    color: colors.black,
    lineHeight: rspF(1.96),
    letterSpacing: 1,
  },
  promptAnswer: {
    fontFamily: fontFamily.light,
    fontSize: rspF(1.66),
    color: colors.black,
    lineHeight: rspF(2.18),
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
    height: rspH(28.85),
    width: rspW(86),
    borderRadius: rspW(3),
    backgroundColor: colors.white,
    top: rspH(Platform.OS == "ios" ? 53.6 : 55),
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
    height: rspH(38.74),
    width: rspW(91.8),
    borderRadius: rspW(4),
    backgroundColor: colors.white,
  },

  carouselHighlightCont: {
    width: rspW(92.4),
    height: rspH(Platform.OS == "ios" ? 43.6 : 50),
    borderRadius: rspW(6.4),
    position: "relative",
    backgroundColor: "#fff",
    alignItems: "center",
    zIndex:3,
    justifyContent: "center",
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
    aspectRatio: 1,
  },
});