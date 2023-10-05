import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import Video from "react-native-video";
import fontFamily from "../styles/fontFamily";
import colors from "../styles/colors";
import { rspW, rspH, rspF, scrn_height } from "../styles/responsiveSize";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveUserLocationDetails,
  setStatusBarArgs,
} from "../store/reducers/authentication/authentication";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useIsReady from "../components/functions/isScreenReady";
import { setCurrentScreen } from "../store/reducers/screen/screen";
import FastImage from "react-native-fast-image";

const Intro = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const active_user_loc_det = useSelector(
    (state) => state.authentication.active_user_location_details
  );

  // this custom hook is to check the screen is loaded completly or not
  const isReady = useIsReady();

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // To Show transparent status bar, only applicable for android device
  //     if (Platform.OS == "android") {
  //       dispatch(
  //         setStatusBarArgs({
  //           barStyle: "dark-content",
  //           backgroundColor: "transparent",
  //         })
  //       );

  //       StatusBar.setTranslucent(true);
  //     }

  //     return () => {
  //       // remove transparency from status bar while navigating to other screen
  //       dispatch(
  //         setStatusBarArgs({
  //           barStyle: "dark-content",
  //           backgroundColor: "#fff",
  //         })
  //       );

  //       if (Platform.OS == "android") {
  //         StatusBar.setTranslucent(false);
  //       }
  //     };
  //   }, [])
  // );

  useFocusEffect(
    React.useCallback(() => {
      dispatch(setCurrentScreen(route.name));
      return () => {};
    }, [])
  );

  return (
    <>
      {/* Load video only when screen properly load */}
      {isReady && (
        <View style={{ 
          flex: 1 , 
        // marginTop: StatusBar.currentHeight
        // height: scrn_height + StatusBar.currentHeight,
        }}>
          {/* Background Video */}

          <Video
            source={require(`../assets/videos/whitebtroo.mp4`)}
            style={styles.backgroundVideo}
            muted={true}
            repeat={true}
            resizeMode={"cover"}
            rate={1.0}
            ignoreSilentSwitch={"obey"}
            onError={(err) => {
              console.log("err",err)
            }}
          />

          {/* Logo Area */}
          <View style={styles.logoArea}>
            <FastImage
              style={styles.logo}
              source={require("../assets/images/WelcomeScreen/btroo_logo.jpg")}
              resizeMode="contain"
            />
          </View>

          {/* Para Area */}
          <View style={styles.paraContainer}>
            {/* Privact Policy & Terms and Condition */}
            <View style={styles.termsCont}>
              <Text style={styles.termsText}>
                By signing up for bTroo, you agree to {"\n"}our{" "}
                <Text
                  style={[
                    styles.termsText,
                    { textDecorationLine: "underline" },
                  ]}
                  onPress={() => {
                    navigation.navigate("Info", {
                      heading: "Terms of Service",
                    });
                  }}
                >
                  Terms of service.
                </Text>{" "}
                Learn how we {"\n"}process your data in our{" "}
                <Text
                  style={[
                    styles.termsText,
                    { textDecorationLine: "underline" },
                  ]}
                  onPress={() => {
                    navigation.navigate("Info", {
                      heading: "Privacy Policy",
                    });
                  }}
                >
                  Privacy {`\n`}Policy
                </Text>{" "}
                and
                <Text
                  style={[
                    styles.termsText,
                    { textDecorationLine: "underline" },
                  ]}
                  onPress={() => {
                    navigation.navigate("Info", {
                      heading: "Cookies Policy",
                    });
                  }}
                >
                  {" "}
                  Cookies Policy.
                </Text>
              </Text>
            </View>

            {/* Button Container */}
            <View style={styles.buttonContainer}>
              {/* Authentication Buttons */}
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.btn_shadow,
                  {
                    backgroundColor: "#3C75B5",
                    justifyContent: "center",
                    marginBottom: rspH(1.4),
                  },
                ]}
                onPress={() => {
                  dispatch(
                    setActiveUserLocationDetails({
                      ...active_user_loc_det,
                      action: "signup",
                    })
                  );
                  // navigation.navigate('UserIntro')
                  navigation.navigate("MobileNo", { action: "signup" });
                }}
              >
                <Text style={styles.button_txt}>Create Account</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  dispatch(
                    setActiveUserLocationDetails({
                      ...active_user_loc_det,
                      action: "login",
                    })
                  );
                  navigation.navigate("MobileNo", { action: "login" });
                }}
                style={[
                  styles.button,
                  {
                    borderWidth: 1,
                    justifyContent: "center",
                    borderColor: colors.blue,
                  },
                ]}
              >
                <Text style={{ ...styles.button_txt, color: colors.blue }}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default Intro;

const styles = StyleSheet.create({
  backgroundVideo: {
    height: "100%",
    // height: scrn_height,
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "stretch",
    bottom: 0,
    right: 0,
  },
  logoArea: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
  },

  logoSubContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: rspW(76),
    // height: rspH(10),
    aspectRatio: 1,
  },

  paraContainer: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
  },

  termsCont: {
    width: rspW(75),
    height: rspH(Platform.OS == "ios" ? 8.6 : 10.4),
  },

  termsText: {
    color: "#000",
    textAlign: "center",
    fontFamily: fontFamily.regular,
    fontSize: rspF(1.9),
    lineHeight: rspF(2.1),
  },

  buttonContainer: {
    marginTop: rspH(2.3),
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    width: rspW(68.6),
    height: rspH(5.8),
    borderRadius: rspH(2.8),
    paddingVertical: rspH(1.2),
  },

  button_txt: {
    textAlign: "center",
    color: "#fff",
    fontFamily: fontFamily.bold,
    fontSize: rspF(2),
    lineHeight: rspF(2.1),
  },

  btn_shadow: {
    shadowColor: `rgb(8, 49, 90)`,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 12,
  },
});
