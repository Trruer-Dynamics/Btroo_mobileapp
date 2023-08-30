import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
import {
  rspW,
  rspH,
  rspF,
  scrn_height,
  scrn_width,
} from "../../../styles/responsiveSize";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PinchGestureHandler,
  State,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  withTiming,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import MaskedView from "@react-native-masked-view/masked-view";
import FormHeader from "../../wrappers/formWrappers/FormHeader";
import ErrorContainer from "../../formComponents/ErrorContainer";
import FooterBtn from "../../Buttons/FooterBtn";
import FormWrapperFooter from "../../wrappers/formWrappers/FormWrapperFooter";

const boxSize = scrn_width - rspW(5.1);

const PhotoPositioning = ({ navigation, route }) => {
  const imageUri = route.params.cImage
    ? route.params.cImage
    : "https://images.pexels.com/photos/17059449/pexels-photo-17059449/free-photo-of-wooden-armchair-and-table.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load";

  const access_token = useSelector(
    (state) => state.authentication.access_token
  );
  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );
  const profile_imgs = useSelector(
    (state) => state.authentication.profile_imgs
  );

  const pic_list = route.params?.pic_list;
  const setpic_list = route.params.setpic_list;

  const loading = route.params.loading;
  const setloading = route.params.setloading;

  const isupdating = route.params.isupdating;

  const activeIndx = route.params?.activeIndx;

  const img_h = route.params?.img_h;
  const img_w = route.params?.img_w;

  const panRef = useRef(null);
  const pinchRef = useRef(null);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const pinchPointers = useSharedValue(1);

  const pnREf = useRef(null);
  const boxRef = useRef(null);

  const check = () => {
    pnREf.current.measure((x, y, width, height, pageX, pageY) => {
      // For Horizontal
      let diff = width - scrn_width;
      let rt = width / scrn_width;

      let cr = 0.027;
      if (rt > 1.04 && rt < 1.1) {
        cr = 0.034;
      } else if (rt >= 1.1 && rt < 1.2) {
        cr = 0.045;
      } else if (rt >= 1.2 && rt < 1.4) {
        cr = 0.06;
      } else if (rt >= 1.4 && rt < 1.6) {
        cr = 0.07;
      } else if (rt >= 1.6 && rt < 1.8) {
        cr = 0.09;
      } else if (rt >= 1.8 && rt <= 2) {
        cr = 0.12;
      } else {
        cr = 0.027;
      }

      // console.log("rt",rt, cr)

      let tx = scrn_width * rt * cr;
      // + diff * 0.03;
      // let tx = scrn_width - diff

      // console.log("tx",tx)
      let pageX2 = pageX + diff;
      let percXp = (pageX / scrn_width) * 100;
      let percXpm = (pageX2 / scrn_width) * 100;

      // console.log("translateX.value",translateX.value)
      // console.log("percXp",percXp)

      if (scale.value <= 2) {
        if (percXp > 2.7) {
          // rspW(5.1)
          translateX.value = withTiming(tx);
        } else if (percXpm < -2.7) {
          translateX.value = withTiming(-tx);
        }
      }

      // For Vertical
      let rheight = width + width * (scrn_width / scrn_height);
      let rt_h = ah / scrn_height;
      let extTr = (rheight - 621.37) * 0.05;
      let extTrm = (rheight - 621.37) * 0.038;

      let heC = 178;
      let heCm = 115;

      console.log(height);

      const ty = rt_h * heC;
      const tym = rt_h * heCm + extTrm;

      console.log("translateY.value", translateY.value);
      // console.log("ty", ty)

      if (scale.value <= 2) {
        if (translateY.value > heC) {
          translateY.value = withTiming(ty);
        } else if (translateY.value < -heCm) {
          translateY.value = withTiming(-ty);
        }
      }
    });
  };

  const onPanGestureEvent = useAnimatedGestureHandler({
    onStart: (_, c) => {
      if (pinchPointers.value == 1) {
        c.startX = translateX.value;
        c.startY = translateY.value;
      }
    },
    onActive: (e, c) => {
      runOnJS(check)();
      if (pinchPointers.value == 1) {
        translateX.value = c.startX + e.translationX;
        translateY.value = c.startY + e.translationY;
      }
    },
    onEnd: () => {
      // runOnJS(check)()
    },
  });

  const onPinchGestureEvent = useAnimatedGestureHandler({
    onStart: (e, c) => {
      pinchPointers.value = e.numberOfPointers;
      if (e.numberOfPointers) {
        c.startScale = scale.value;
      }
    },
    onActive: (e, c) => {
      pinchPointers.value = e.numberOfPointers;
      if (e.numberOfPointers) {
        scale.value = c.startScale * e.scale;
      }
    },
    onEnd: (e, c) => {
      if (scale.value < 1) {
        scale.value = withSpring(1);
      }

      if (scale.value > 2) {
        scale.value = withSpring(2);
        runOnJS(check)();
      }
    },
  });

  const panStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const pinchStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // const [loading, setloading] = useState(false);
  const [aw, setaw] = useState(img_w);
  const [ah, setah] = useState(img_h);

  const [cropImage, setcropImage] = useState("");

  const [cropX, setcropX] = useState(0);

  const [cropY, setcropY] = useState(0);

  const [mheight, setmheight] = useState(boxSize);
  const [mwidth, setmwidth] = useState(scrn_width);

  const [xLimit, setxLimit] = useState(0);

  const [yLimit, setyLimit] = useState(0);

  const [showImage, setshowImage] = useState(false);

  const [hw, sethw] = useState(1);

  useLayoutEffect(() => {
    // console.log("scr ", scrn_width, scrn_height)
    // console.log("after",img_w,img_h)

    if (img_w < scrn_width) {
      setaw(scrn_width);
    }
    let sr = 1 + img_w / img_h;

    let mh = img_h * sr;
    // console.log("sr",sr,mh)
    setah(mh);
  }, []);

  return (
    <>
      {/* {loading && <Loader />} */}
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#fff",
          //  height: scrn_height, // width: scrn_width,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <GestureHandlerRootView style={styles.container}>
          <MaskedView
            style={{
              // flex: 1,
              // marginTop: rspH(15),

              height: scrn_height,
              width: scrn_width,
            }}
            maskElement={
              <View
                style={{
                  // Transparent background mask

                  // backgroundColor: 'transparent',
                  // backgroundColor: '#00000077',
                  // The '77' here sets the alpha // flex: 1,

                  width: scrn_width,

                  height: scrn_height,

                  alignItems: "center",

                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    // Solid background as the aperture of the lens-eye.

                    backgroundColor: "#ff00ff", // If you have a set height or width, set this to half

                    borderRadius: 10,

                    height: boxSize - 2,

                    width: boxSize - 2, // flex: 1,
                  }}
                />
              </View>
            }
          >
            <PinchGestureHandler
              ref={pinchRef}
              simultaneousHandlers={panRef}
              onGestureEvent={onPinchGestureEvent}
              onHandlerStateChange={onPinchGestureEvent}
            >
              <Animated.View
                style={[styles.imageContainer, pinchStyle, { elevation: 20 }]}
              >
                <PanGestureHandler
                  ref={panRef}
                  simultaneousHandlers={pinchRef}
                  onGestureEvent={onPanGestureEvent}
                  onHandlerStateChange={onPanGestureEvent}
                >
                  <Animated.Image
                    ref={pnREf}
                    source={{ uri: imageUri }}
                    style={[
                      {
                        width: aw,
                        // height: 621,
                        height: ah,
                        // left: 5,
                        // position: 'absolute',
                        alignSelf: "center",
                        resizeMode: "contain",
                      },
                      panStyle,
                    ]}
                  />
                </PanGestureHandler>
              </Animated.View>
            </PinchGestureHandler>

            {/* </View> */}

            {/* </View> */}
          </MaskedView>

          {/*Form  Header */}
          <SafeAreaView
            style={{
              position: "absolute",

              top: rspH(Platform.OS == "ios" ? 7.02 : 2.5),

              width: scrn_width,
            }}
          >
            <View
              style={{
                // alignSelf: 'center',
                // flexDirection: 'row',
                // justifyContent: 'center',
                // alignItems: 'center',
                // backgroundColor:'red',
                // width: scrn_width,
                paddingHorizontal: rspW(10),

                // backgroundColor:'red',
              }}
            >
              <FormHeader
                title="Photo Positioning"
                para={`Please place the photo in your ${"\n"}preferred place by dragging it.`}
                left_icon={true}
                onPress={() => {
                  navigation.goBack();
                }}
              />
            </View>
          </SafeAreaView>
        </GestureHandlerRootView>

        {/* <View
        ref={boxRef}
        style={{
          position: 'absolute',
          // top: 175,
          // left: 60,
          elevation: 30,
          height: boxSize,
          // width: scrn_width - 120,
          width: boxSize,
          borderWidth: 1,
          borderColor: 'red',
        }}></View> */}

        <FormWrapperFooter
        // containerStyle={{bottom: rspH(Platform.OS == 'ios' ? 18 : 14)}}
        >
          {/* Error Show Here */}

          <ErrorContainer error_msg="" />

          {/* Next Btn To Navigate to Next Form Components */}
          <FooterBtn
            title={"Confirm"}
            disabled={false}
            onPress={() => {
              // if (aw < scrn_width - rspW(5.1)) {
              //   if (isupdating) {
              //     updateProfileImage(imageUri, imageUri);
              //   } else {
              //     saveProfileImage(imageUri, imageUri);
              //   }
              // } else if (hw > 1) {
              //   handleCropImageY();
              // } else {
              //   handleCropImageX();
              // }
            }}
          />
        </FormWrapperFooter>
      </SafeAreaView>
    </>
  );
};

export default PhotoPositioning;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "#fff",
  },
  imageContainer: {
    flex: 1,
    position: "relative",
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    // flex: 1,
    width: scrn_width,
    // height: 621,
    height: scrn_height,
    resizeMode: "contain",
  },
});
