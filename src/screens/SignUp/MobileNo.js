import {
  Alert,
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Platform,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import countries_with_ph_no from "../../data/countries_with_ph_no";
import FormWrapper from "../../components/wrappers/formWrappers/FormWrapper";
import colors from "../../styles/colors";
import FooterBtn from "../../components/Buttons/FooterBtn";
import FormCountrySelector from "../../components/formComponents/FormCountrySelector";
import OtpVerify from "../../components/screenModals/otpVerify/OtpVerify";
import FormWrapperFooter from "../../components/wrappers/formWrappers/FormWrapperFooter";
import ErrorContainer from "../../components/formComponents/ErrorContainer";
import { scrn_height, rspW, rspH, rspF } from "../../styles/responsiveSize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import fontFamily from "../../styles/fontFamily";
import _ from "lodash";
import Loader from "../../components/loader/Loader";
import auth from "@react-native-firebase/auth";
import axios from "axios";
import { apiUrl } from "../../constants";
import CentralModal from "../../components/modals/CentralModal";
import FormHeader from "../../components/wrappers/formWrappers/FormHeader";
import FormInputPhoneNumber from "../../components/formComponents/FormInputPhoneNumber";
import FastImage from "react-native-fast-image";
import { useFocusEffect } from "@react-navigation/native";
import { setCurrentScreen } from "../../store/reducers/screen/screen";
import { useDispatch } from "react-redux";

const MobileNo = ({ navigation, route }) => {
  // All states
  const [selected_ph_code, setselected_ph_code] = useState(null);
  const [selected_ph_code_id, setselected_ph_code_id] = useState("");
  const [selected_ph_code_id_blr, setselected_ph_code_id_blr] = useState(false);
  const [ph_no, setph_no] = useState("");

  const [ph_no_blr, setph_no_blr] = useState(false);

  const [min_ph_no, setmin_ph_no] = useState(0);
  const [max_ph_no, setmax_ph_no] = useState(0);
  const [showOtpBox, setOtpShowBox] = useState(false);

  const [clickBtn, setclickBtn] = useState(false);

  const [otp, setotp] = useState("000000");

  const [show_alert, setshow_alert] = useState(false);

  const [confirm, setconfirm] = useState(null);
  const [loading, setloading] = useState(false);

  const checkUserAvailable = async () => {
    setloading(true);
    // Validation for Israel mobile number validation
    let up_ph =
      selected_ph_code_id == "IL" && ph_no.startsWith("0")
        ? ph_no.substring(1)
        : ph_no;

    const data = {
      mobile: "+" + selected_ph_code?.phone + up_ph,
    };

    // to check user already available
    try {
      const response = await axios.post(apiUrl + "logincheck/", data);
      setloading(false);

      if (response.data.data == true) {
        await showConfirmDialog();
      } else {
        setshow_alert(true);
      }
    } catch (error) {
      setloading(false);
    }
  };

  useEffect(() => {
    // Phone Number Validations
    if (selected_ph_code_id != "") {
      let selected_country = countries_with_ph_no.find(
        (v) => v.code == selected_ph_code_id
      );

      let min_ph_no =
        typeof selected_country.phoneLength != "number"
          ? selected_country.phoneLength[0]
          : selected_country.phoneLength;

      let max_ph_no =
        typeof selected_country.phoneLength != "number"
          ? selected_country.phoneLength[
              selected_country.phoneLength.length - 1
            ]
          : selected_country.phoneLength;

      setmin_ph_no(min_ph_no);
      setmax_ph_no(max_ph_no);
      setselected_ph_code(selected_country);
    }
  }, [selected_ph_code_id]);

  // To confirm to verify phone number
  const showConfirmDialog = async () => {
    return Alert.alert(
      "Verify Phone Number?",
      `+${selected_ph_code?.phone}  ${
        selected_ph_code_id == "IL" && ph_no.startsWith("0")
          ? ph_no.substring(1)
          : ph_no
      }`,
      [
        {
          text: "Cancel",
        },
        {
          text: "OK",
          onPress: () => {
            signInWithPhoneNumber(`+${selected_ph_code?.phone}  ${ph_no}`);
          },
        },
      ]
    );
  };

  // On Next Button Press
  const onNextPress = async () => {

    Keyboard.dismiss();
    if (ph_no.length > 0) {
      setclickBtn(true);

      // Open Otp Modal
      if (
        selected_ph_code_id == "IL" && ph_no.startsWith("0")
          ? ph_no.length <= max_ph_no + 1 && ph_no.length >= min_ph_no + 1
          : ph_no.length <= max_ph_no && ph_no.length >= min_ph_no
      ) {
        if (route.params.action != "signup") {
          await checkUserAvailable();
        } else {
          await showConfirmDialog();
        }
      }
    }
  };

  // To send otp to entered mobile number
  const signInWithPhoneNumber = async (phoneNumber) => {
    try {
      // show Loader
      setloading(true);

      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setconfirm(confirmation);
      console.log("\n");
      console.log("confirmation", JSON.stringify(confirmation));
      console.log("\n");

      setOtpShowBox(true);

      // hide Loader
      setloading(false);
    } catch (error) {
      console.log("SignIn", error.message, typeof error.message);
      Alert.alert("Error", "Please try after sometime.");
      setloading(false);
    }
  };

  // To otp status of phone number
  const onAuthStateChanged = (user) => {
    // console.log("\nonAuthStateChanged", user, "\n");
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    return subscriber; // unsubscribe on unmount
  }, []);

  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      dispatch(setCurrentScreen(route.name));
      return () => {};
    }, [])
  );

  return (
    <>
      {loading && <Loader />}

      <SafeAreaView style={{ height: scrn_height, backgroundColor: "#fff" }}>
        {/* To Autoscroll Input Field on keyboard appear */}
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: "#fff", position: "relative" }}
          extraScrollHeight={Platform.OS == "ios" ? rspH(22) : rspH(28)} // To show Next Button on Keyboard Appear
          keyboardShouldPersistTaps={"always"}
        >
          {/* To Wrap all Form for constant paddings , bg color , margins etc */}
          <FormWrapper>
            {/* Main Form UI */}
            <View>
              <FormHeader
                title="Phone Number"
                left_icon={true}
                onPress={() => {
                  navigation.navigate("Intro");
                }}
                para={
                  route.params.action == "signup"
                    ? `Please enter your phone number. We \njust want to make sure that every \nperson on bTroo is real.`
                    : `Please enter your phone number.`
                }
              />

              {/* Image Block */}
              <View
                style={{
                  marginTop: rspH(route.params.action == "signup" ? 6 : 9),
                  marginBottom: rspH(6),
                }}
              >
                <FastImage
                  source={require("../../assets/images/FormImages/PhVerify.png")}
                  resizeMode="contain"
                  style={{ ...styles.ph_icon_img }}
                />
              </View>

              <View style={{ ...styles.multiInputContainer }}>
                {/* Country Code Select  */}
                <FormCountrySelector
                  width={rspW(20)}
                  selectedId={selected_ph_code_id}
                  blr_value={selected_ph_code_id_blr}
                  setblr_value={setselected_ph_code_id_blr}
                  setSelectedId={setselected_ph_code_id}
                  selectedValue={selected_ph_code?.phone}
                />

                {/* Phone Number Input */}
                <FormInputPhoneNumber
                  value={ph_no}
                  setvalue={setph_no}
                  width={rspW(56)}
                  placeholder={"Phone Number"}
                  placeholderTextColor={colors.blue}
                  disabled={selected_ph_code_id == ""}
                  maxLength={12}
                  error_cond={
                    clickBtn &&
                    (selected_ph_code_id == "IL" && ph_no.startsWith("0")
                      ? !(
                          ph_no.length <= max_ph_no + 1 &&
                          ph_no.length >= min_ph_no + 1
                        )
                      : !(
                          ph_no.length <= max_ph_no && ph_no.length >= min_ph_no
                        ))
                  }
                  refresh={clickBtn}
                  value_blr={ph_no_blr}
                  setvalue_blr={setph_no_blr}
                  s_allow={false}
                  a_allow={false}
                />
              </View>
            </View>

            {/* Footer Btn Wrapper */}
            <FormWrapperFooter>
              {/* Error Show Here */}

              <ErrorContainer
                error_msg={
                  clickBtn &&
                  (selected_ph_code_id == "IL" && ph_no.startsWith("0")
                    ? !(
                        ph_no.length <= max_ph_no + 1 &&
                        ph_no.length >= min_ph_no + 1
                      )
                    : !(
                        ph_no.length <= max_ph_no && ph_no.length >= min_ph_no
                      )) &&
                  ph_no_blr
                    ? "Please check the number you have entered."
                    : ""
                }
              />

              {/* Next Btn To Navigate to Next Form Components */}
              <FooterBtn
                title={"Next"}
                disabled={
                  clickBtn
                    ? selected_ph_code_id == "IL" && ph_no.startsWith("0")
                      ? !(
                          ph_no.length <= max_ph_no + 1 &&
                          ph_no.length >= min_ph_no + 1
                        )
                      : !(
                          ph_no.length <= max_ph_no && ph_no.length >= min_ph_no
                        )
                    : !ph_no.length > 0
                }
                onPress={onNextPress}
              />
            </FormWrapperFooter>
          </FormWrapper>
        </KeyboardAwareScrollView>

        {/* Otp Verify Modal  */}
        {showOtpBox && (
          <OtpVerify
            action={route.params.action}
            onResend={() =>
              signInWithPhoneNumber(`+${selected_ph_code?.phone}  ${ph_no}`)
            }
            selected_ph_code={selected_ph_code}
            loading={loading}
            setloading={setloading}
            confirm={confirm}
            ph_no={ph_no}
            otp={otp}
            ph_code={selected_ph_code?.phone}
            setModalVisible={setOtpShowBox}
          />
        )}

        {/* While login to show alert if entered number is not register  */}
        <CentralModal
          modalVisible={show_alert}
          setModalVisible={() => setshow_alert(false)}
          containerStyle={{
            paddingTop: rspH(19.6),
          }}
        >
          <View
            style={{
              width: rspW(86),
              height: rspH(37.5),
              backgroundColor: "#fff",
              // borderRadius: rspW(4),
              borderRadius: rspW(4),
            }}
          >
            <View
              style={{
                padding: rspW(7.3),
              }}
            >
              <Text
                style={{
                  fontSize: rspF(2.65),
                  fontFamily: fontFamily.regular,
                  lineHeight: rspF(3.6),
                  color: colors.black,
                  textAlign: "center",
                }}
              >
                It seems your number is {"\n"}not registered with us.{"\n"}
                Please create an account {"\n"}or try logging in with a {"\n"}
                different Number.
              </Text>
            </View>
            <FormWrapperFooter>
              {/* Error Show Here */}

              <ErrorContainer error_msg={""} />

              {/* Next Btn To Navigate to Next Form Components */}
              <FooterBtn
                title={"OK"}
                disabled={false}
                onPress={async () => {
                  setshow_alert(false);
                  navigation.navigate("Intro");
                }}
              />
            </FormWrapperFooter>
          </View>
        </CentralModal>
      </SafeAreaView>
    </>
  );
};

export default MobileNo;

const styles = StyleSheet.create({
  multiInputContainer: {
    alignSelf: "center",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ph_icon_img: {
    alignSelf: "center",
    justifyContent: "center",
    width: rspW(70),
    height: rspW(70),
  },
});
