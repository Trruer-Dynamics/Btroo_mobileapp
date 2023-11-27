import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  useContext,
  memo,
} from "react";
import Ionicon from "react-native-vector-icons/Ionicons";
import colors from "../../../styles/colors";
import fontFamily from "../../../styles/fontFamily";
import FormWrapperFooter from "../../wrappers/formWrappers/FormWrapperFooter";
import FooterBtn from "../../Buttons/FooterBtn";
import ErrorContainer from "../../formComponents/ErrorContainer";
import { useNavigation } from "@react-navigation/native";
import {
  rspF,
  rspH,
  rspW,
  scrn_height,
  scrn_width,
} from "../../../styles/responsiveSize";
import { useDispatch, useSelector } from "react-redux";
import {
  setAccessToken,
  setActiveUserLocationDetails,
  setProfileImgs,
  setProfiledata,
  setPromptFillingComplete,
  setPromptFillingStart,
  setSessionExpired,
  setUserLoggined,
} from "../../../store/reducers/authentication/authentication";
import axios from "axios";
import { apiUrl } from "../../../constants";
import {
  setChatRevealTut,
  setChatTut,
  setMatchTut,
  setSwipeTut,
} from "../../../store/reducers/tutorial/tutorial";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { UserContext } from "../../../context/user";
import messaging from "@react-native-firebase/messaging";
import { removeListener, startOtpListener } from "react-native-otp-verify";

const OtpVerify = ({
  onResend,
  ph_no,
  otp,
  ph_code,
  setModalVisible,
  action = "",
  confirm,
  selected_ph_code,
}) => {
  // Firebase Device TOken defined in user.js
  const { DeviceToken, setDeviceToken } = useContext(UserContext);

  const active_user_location_details = useSelector(
    (state) => state.authentication.active_user_location_details
  );

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const is_network_connected = useSelector(
    (state) => state.authentication.is_network_connected
  );

  const [loading, setloading] = useState(false);

  const [otp1, setotp1] = useState(otp[0] == "0" ? "" : otp);
  const [otp1blr, setotp1blr] = useState(false);

  const ref_inpt1 = useRef();
  const ref_inpt2 = useRef();

  const [otperr, setotperr] = useState(false);
  const [counter, setcounter] = useState(30); // 30 seconds limit
  const [btnClick, setbtnClick] = useState(false);
  const [keyboard_hgt, setkeyboard_hgt] = useState(0);

  // To register mobile number
  const sendActiveUserDetails = async () => {
    setloading(true);

    //  Israel Number validations
    let up_ph_no =
      selected_ph_code.code == "IL" && ph_no.startsWith("0")
        ? ph_no.substring(1)
        : ph_no;

    const data = {
      mobile: "+" + ph_code + "" + up_ph_no,

      longitude:
        active_user_location_details.longitude != ""
          ? active_user_location_details.longitude
          : 0.0,

      latitude:
        active_user_location_details.latitude != ""
          ? active_user_location_details.latitude
          : 0.0,

      location: active_user_location_details.location,

      action: action,

      ip: active_user_location_details.ip,
      // is_introduceyourselfcompleted: true,
    };

    try {
      const response = await axios.post(apiUrl + "account/", data);
      let user_data = response.data.data;
      let user_code = response.data.code;

      setloading(false);
      // setModalVisible(false);
      if (user_code == 400) {
        //
        setModalVisible(false);

        setTimeout(() => {
          alert(
            "It seems like this phone number is already registered with us. Please login with this number or use a different number to create an account."
          );
        }, 100);
      } else if (user_code == 200) {
        dispatch(setSessionExpired(false));

        await sendDeviceToken(
          user_data.userprofile.id,
          user_data?.token?.access
        );

        let usr_imgs = user_data.userimage.map((v) => [
          v.image,
          v.cropedimage,
          v.id,
        ]);

        // save Access Token Locally using redux
        dispatch(setAccessToken(user_data?.token?.access));

        let user_prof_data = {
          user: user_data.user,

          userimage: usr_imgs,

          userinterest: user_data.userinterest,

          userlanguages: user_data.userlanguages,

          userlog: user_data.userlog,

          userpets: user_data.userpets,

          userprefrances: user_data.userprefrances,

          userprivateprompts: user_data.userprivateprompts,

          userpublicprompts: user_data.userpublicprompts,

          userprofile: user_data.userprofile,
        };

        // set Loggined User Profile Data locally using redux toolkit
        dispatch(setProfiledata(user_prof_data));

        navigation.navigate("UserIntro");
        setModalVisible(false);
      } else {
        setModalVisible(false);
      }
    } catch (error) {
      setModalVisible(false);
      setloading(false);
    }
  };

  const getDeviceToken = async () => {
    if (Platform.OS == "ios") {
      const apn_tok = await messaging().getAPNSToken();
    }

    const token = await messaging().getToken();

    setDeviceToken(token);

    return token;
  };

  const sendDeviceToken = async (prof_id, access_token) => {
    setloading(true);

    let dvToken = await getDeviceToken();
    const data = {
      userprofile_id: prof_id,
      device_token: dvToken,
    };

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    try {
      const response = await axios.post(apiUrl + "device_token/", data, {
        headers,
      });

      let user_data = response.data.data;

      setloading(false);
    } catch (error) {
      setloading(false);
    }
  };

  const userLogin = async () => {
    setloading(true);

    let up_ph_no =
      selected_ph_code.code == "IL" && ph_no.startsWith("0")
        ? ph_no.substring(1)
        : ph_no;
    const data = {
      mobile: "+" + ph_code + "" + up_ph_no,

      longitude:
        active_user_location_details.longitude != ""
          ? active_user_location_details.longitude
          : 0.0,

      latitude:
        active_user_location_details.latitude != ""
          ? active_user_location_details.latitude
          : 0.0,

      location: active_user_location_details.location,

      action: action,

      ip: active_user_location_details.ip,
    };

    try {
      const response = await axios.post(apiUrl + "login/", data);
      let user_data = response.data.data;
      let status_code = response.data.code;

      setloading(false);

      if (status_code == 400) {
        Alert.alert(
          "",
          "It's Seemed Your Number Not Registed with us, Please SignUp First"
        );
      } else if (status_code == 200) {
        dispatch(setSessionExpired(false));

        let u_pref = user_data.userprefrances.map((v) => v.gendermaster.id);

        // filter active prompts
        let act_prompts = user_data.userpublicprompts.filter(
          (c) => c.active == true
        );
        let act_promptsm = act_prompts.map((c) => [
          [c.promptsmaster, c.question],
          c.answer,
        ]);
        let act_prompts2 = user_data.userprivateprompts.filter(
          (c) => c.active == true
        );
        let act_promptsm2 = act_prompts2.map((c) => [
          [c.promptsmaster, c.question],
          c.answer,
        ]);

        // rearange user profile images accoriding to position
        let resp_imgs = user_data.userimage.sort((a, b) => {
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

        let user_prof_data = {
          user: user_data.user,
          userinterest: user_data.userinterest,
          userlanguages: user_data.userlanguages,
          userpets: user_data.userpets,
          userpreferances: u_pref,
          userprofile: user_data.userprofile,
          userpublicprompts: act_promptsm,
          userprivateprompts: act_promptsm2,
        };

        await sendDeviceToken(
          user_data.userprofile.id,
          user_data?.token?.access
        );

        // Sets Prompts Filling status locally
        // dispatch(
        //   setPromptFillingStart(user_data.userprofile.is_promptsfillingstarted)
        // );

        // dispatch(
        //   setPromptFillingComplete(
        //     user_data.userprofile.is_promptsfillingcomplete
        //   )
        // );

        // Set Tutorials booleans values
        dispatch(setSwipeTut(!user_data.userprofile.is_swapping_tutorial_view));
        dispatch(setMatchTut(!user_data.userprofile.is_matching_tutorial_view));
        dispatch(setChatTut(!user_data.userprofile.is_chatting_tutorial_view));
        dispatch(
          setChatRevealTut(
            !user_data.userprofile.is_chatting_reveal_tutorial_view
          )
        );

        // Set access tokens and Profiles Data locally
        dispatch(setAccessToken(user_data.token.access));
        dispatch(setProfiledata(user_prof_data));
        dispatch(setProfileImgs(tmp1));

        let usr_prf = user_data.userprofile;

        let nav_to = "";
        if (!usr_prf.is_introduceyourselfcompleted) {
          nav_to = "UserIntro";
        } else if (!usr_prf.is_photoupload) {
          nav_to = "PicUpload";
        } else if (!usr_prf.is_photoverified) {
          nav_to = "PhotoVerification";
        } 
        else if (!user_data.userprofile.is_promptsfillingcomplete) {
          nav_to="Prompts"
        }
        else {
          dispatch(setUserLoggined(true));
          navigation.navigate("BottomTab", {
            screen: "Swiper",
          });
        }

        setModalVisible(false);

        if (nav_to != "") {
          navigation.navigate(nav_to);
        }
      }
    } catch (error) {
      setloading(false);
    }
  };

  // To verify sent otp
  const verifyOtp = async () => {

    if (otp1 == "000000") {
      setotperr(false);

      dispatch(
        setActiveUserLocationDetails({
          ...active_user_location_details,
          mobile: "+" + ph_code + "" + ph_no,
        })
      );
   
      if (action == "login") {
        userLogin(); // if action is login call login api
      } else {
        sendActiveUserDetails(); // if action is signup call signup api
      }
    } else {
      setotperr(true); // if otp is invalid
    }

    // try {
    //   setloading(true);
    //   await confirm.confirm(otp1);
    //   setotperr(false);
    //   dispatch(
    //     setActiveUserLocationDetails({
    //       ...active_user_location_details,
    //       mobile: "+" + ph_code + "" + ph_no,
    //     })
    //   );

    //   if (action == "login") {
    //     userLogin();
    //   } else {
    //     sendActiveUserDetails();
    //   }
    // } catch (error) {
    //   setloading(false);
    //   setotperr(true);
    // }
    
  };

  // To resend OTP after 30 seconds
  const resendOtp = () => {
    setotp1("");

    setcounter(30);
    setotperr(false);
    onResend();
  };

  const listenOtp = async () => {
    try {
      startOtpListener((message) => {

        try {
          const otp = /(\d{6})/g.exec(message)[1];
          setotp1(otp);
          setotp1blr(true);
        } catch (err) {

        }
      });
    } catch (err) {
  
    }
  };

  // 30 seconds timer
  useEffect(() => {
    const timer =
      counter > 0 &&
      setTimeout(() => {
        setcounter(counter - 1);
      }, 1000);
  }, [counter]);

  useLayoutEffect(() => {
    Keyboard.addListener("keyboardDidShow", ({ endCoordinates }) => {
      let hght = endCoordinates.height;
      let rhght = (hght / scrn_height) * 100;

      setkeyboard_hgt(rhght);
    });
  }, []);

  useLayoutEffect(() => {
    if (Platform.OS == "android") {
      listenOtp();
    }

    return () => {
      if (Platform.OS == "android") {
        removeListener();
      }
    };
  }, []);

  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      bounces={false}
      showsVerticalScrollIndicator={false}
      extraScrollHeight={
        Platform.OS == "android" ? rspH(keyboard_hgt > 28 ? 12 : 5) : rspH(0)
      }
      style={{
        position: "absolute",
        top: 0,
        alignSelf: "center",
        width: scrn_width,
        height: scrn_height,
      }}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={{
          backgroundColor: "#00000087",

          height:
            Platform.OS == "android"
              ? scrn_height / 2.2 + rspH(1)
              : scrn_height / 2.1,
          marginBottom: rspH(-1),
        }}
        onPress={() => {
          setModalVisible(false);
        }}
      ></TouchableOpacity>

      <View
        style={{
          height:
            Platform.OS == "android" ? scrn_height / 1.85 : scrn_height / 1.88,
          backgroundColor: "#fff",
          paddingVertical: rspH(2),
          paddingHorizontal: rspW(6),
          borderTopLeftRadius: rspW(3),
          borderTopRightRadius: rspW(3),
          position: "relative",
        }}
      >
        {loading && (
          <SafeAreaView
            style={{
              backgroundColor: "#0000003c",

              height: scrn_height / 1.7,

              width: scrn_width,
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: 0,
              zIndex: 3,
              borderTopLeftRadius: rspW(3),
              borderTopRightRadius: rspW(3),
            }}
          >
            <ActivityIndicator size="large" color={colors.blue} />
          </SafeAreaView>
        )}

        <TouchableOpacity
          style={{ alignSelf: "flex-end", marginBottom: rspH(2) }}
          onPress={() => {
            setModalVisible(false);
          }}
        >
          <Ionicon name="close-circle" size={36} color={colors.blue} />
        </TouchableOpacity>

        <View style={styles.title_cont}>
          {/* Modal Title */}
          <View style={styles.title_txt_cont}>
            <Text style={styles.title_txt}>One Time Password</Text>
          </View>

          {/* Modal T */}
          <View style={styles.subtitle_txt_cont}>
            <Text style={styles.subtitle_txt}>
              Please enter the code that we sent you.
            </Text>
          </View>

          {/* Number on which otp send */}
          <View style={styles.ph_no_txt_cont}>
            <Text style={styles.ph_no_txt}>
              {`+${ph_code} ${
                selected_ph_code.code == "IL" && ph_no.startsWith("0")
                  ? ph_no.substring(1)
                  : ph_no
              }`}
            </Text>
          </View>
        </View>

        {/* OTP Inputs */}
        <View style={styles.otp_input_container}>
          <TextInput
            autoComplete="sms-otp"
            textContentType="oneTimeCode" // param to capture otp on tap
            style={{
              ...styles.otp_input,
              borderColor:
                (btnClick && otp1 == "") || otperr
                  ? colors.error
                  : otp1blr && otp1.length == 6
                  ? colors.blue
                  : "#DCDCDC",
              backgroundColor: otp1blr ? "#fff" : "#F8F8F8",
            }}
            returnKeyType="next"
            blurOnSubmit={false}
            maxLength={6}
            onChangeText={(text) => {
              setotp1blr(true);
              setotperr(false);

              let last = text.charAt(text.length - 1);
              let as_code = last.charCodeAt();
              let number_con = as_code > 47 && as_code < 58;

              if (number_con || text == "") {
                setotp1(text);

                if (text) {
                  ref_inpt2.current?.focus();
                }
              }
            }}
            keyboardType={"number-pad"}
            ref={ref_inpt1}
            value={otp1}
            placeholder={"Enter the code"}
            placeholderTextColor={colors.black}
            onSubmitEditing={() => {
              ref_inpt2.current?.focus();
            }}
          />
        </View>

        {/* Timer */}
        <View style={styles.counter_cont}>
          {counter != 0 ? (
            <View>
              <Text style={styles.counter_txt}>
                00 : {String(counter).padStart(2, "0")} Seconds
              </Text>
            </View>
          ) : (
            <TouchableOpacity onPress={resendOtp}>
              <Text style={styles.counter_txt}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Validate Btn */}
        <FormWrapperFooter
          containerStyle={{
            // bottom: -16,
            bottom: -rspH(1.8),
          }}
        >
          <ErrorContainer
            error_msg={
              (btnClick && otp == "000000") || otperr
                ? "Please check the OTP you have entered."
                : ""
            }
          />
          <FooterBtn
            title={"Validate"}
            disabled={
              !is_network_connected
              ||
              otp1.length < 6 ||
              otperr
            }
            onPress={() => {
              if (
                otp1.length == 6 && is_network_connected
                //  && otp2 && otp3 && otp4 && otp5 && otp6
              ) {
                verifyOtp();
              }
            }}
          />
        </FormWrapperFooter>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default memo(OtpVerify);

const styles = StyleSheet.create({
  title_cont: {
    width: rspW(88),
    paddingHorizontal: rspW(5),
  },
  title_txt_cont: {
    marginBottom: rspH(0.85),
  },
  subtitle_txt_cont: {
    marginBottom: rspH(4),
  },
  title_txt: {
    color: colors.black,
    fontFamily: fontFamily.bold,
    fontSize: rspF(2.68),
    lineHeight: rspF(2.7),
    letterSpacing: 1,
  },

  subtitle_txt: {
    color: colors.blue,
    fontFamily: fontFamily.regular,
    fontSize: rspF(1.64),
    lineHeight: rspF(1.7),
  },
  ph_no_txt_cont: {
    marginBottom: rspH(4.8),
  },
  ph_no_txt: {
    fontFamily: fontFamily.regular,
    color: colors.black,
    fontSize: rspF(1.9),
    lineHeight: rspF(2),
  },
  otp_input_container: {
    width: rspW(88),
    flexDirection: "row",
    justifyContent: "space-between",

    marginBottom: rspH(4.64),
  },
  otp_input: {
    // height: rspW(12.76),
    height: rspW(12.8),
    // width: rspW(12.8),
    width: "100%",

    // textAlign: "center",
    borderWidth: 1,
    backgroundColor: "#F8F8F8",
    borderRadius: rspW(1.5),
    paddingHorizontal: rspW(4),

    fontFamily: fontFamily.regular,

    fontSize: rspF(1.9),
    lineHeight: rspF(2),
    color: colors.black,
  },
  counter_cont: {
    alignSelf: "flex-end",
    marginBottom: rspH(1.2),
  },
  counter_txt: {
    color: colors.lightBlue,
    fontFamily: fontFamily.bold,
    fontSize: rspF(1.64),
    lineHeight: rspF(1.7),
  },
});
