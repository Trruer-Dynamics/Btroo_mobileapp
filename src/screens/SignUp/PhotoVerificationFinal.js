import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  SafeAreaView,
  Alert,
  Platform,
} from "react-native";
import React, { useState, useLayoutEffect, useEffect } from "react";
import FormWrapper from "../../components/wrappers/formWrappers/FormWrapper";
import { initialWindowMetrics } from "react-native-safe-area-context";
const insets = initialWindowMetrics.insets;

import colors from "../../styles/colors";
import {
  rspF,
  rspH,
  rspW,
  scrn_height,
  scrn_width,
  srn_height,
} from "../../styles/responsiveSize";
import FooterBtn from "../../components/Buttons/FooterBtn";
import fontFamily from "../../styles/fontFamily";
import FormWrapperFooter from "../../components/wrappers/formWrappers/FormWrapperFooter";
import ErrorContainer from "../../components/formComponents/ErrorContainer";

import FullModal from "../../components/modals/FullModal";
import PhotoVerifyCamera from "../../components/screenComponents/signUp/PhotoVerifyCamera";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { apiUrl } from "../../constants";
import Loader from "../../components/loader/Loader";
import FormHeader from "../../components/wrappers/formWrappers/FormHeader";
import {
  setProfileApproved,
  setSessionExpired,
  setUserLoggined,
} from "../../store/reducers/authentication/authentication";

const PhotoVerificationFinal = ({ navigation, route }) => {
  const access_token = useSelector(
    (state) => state.authentication.access_token
  );
  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );

  const profile_approved = useSelector(
    (state) => state.authentication.profile_approved
  );

  const dispatch = useDispatch();

  const [loading, setloading] = useState(false);

  let imgUri = route.params?.imgUri
    ? route.params?.imgUri
    : "https://images.pexels.com/photos/3099026/pexels-photo-3099026.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load";

  const [openCamera, setopenCamera] = useState(false);
  const [picURI, setpicURI] = useState("");

  const verifyPhoto = async () => {
    setloading(true);

    const url = profile_approved
      ? apiUrl + "userimageverification/"
      : apiUrl + "profilereverification/";

    const headers = {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "multipart/form-data",
    };

    let prof_data = new FormData();
    prof_data.append("user_id", profile_data.user.id);
    if (profile_approved == false) {
      prof_data.append("status", "3");
    }

    prof_data.append("image", {
      uri: "file://" + imgUri,
      // uri: imgUri,

      name: `${profile_data.user.id}_verification_image.jpg`,
      type: `image/jpg`,
    });

    try {
      const resp = await axios.post(url, prof_data, {
        headers,
      });

      let code = resp.data.code;
      setloading(false);
      if (code == 200) {
        if (!profile_approved) {
          dispatch(setProfileApproved(true));
          navigation.navigate("BottomTab", {
            screen: "Swiper",
          });
        } else {
          dispatch(setUserLoggined(true));
          navigation.navigate("Pledge");
        }
      } else if (code == 401) {
        dispatch(setSessionExpired(true));
      } else {
        Alert.alert("verifyPhoto Error", "Some Error Occur" + resp.data.data);
      }
    } catch (error) {
      setloading(false);
      dispatch(setSessionExpired(true));
      console.log("verifyPhoto went wrong error", error);

      Alert.alert("verifyPhoto Error", "Something Went Wrong");
    }
  };

  return (
    <SafeAreaView style={{ height: scrn_height, backgroundColor: "#fff" }}>
      {/* Form Wrapper To Manage Forms Dimension*/}
      {loading && <Loader />}
      <FormWrapper
        containerStyle={{
          // paddingTop: rspH(3.7),
          paddingTop: rspH(3.7),
        }}
      >
        {/* Main Form UI */}
        <View>
          {/*Form  Header */}

          <FormHeader title="Photo Verification" para={``} />

          {/* Inputs Container*/}
          <View style={styles.inputCont}>
            <View
              style={{
                ...styles.poseImageCont,
              }}
            >
              <Image
                // source={require('../../assets/images/FormImages/PhotoPoseBL.png')}
                source={require("../../assets/images/PicVerifyBL.png")}
                style={styles.poseImage}
                resizeMode="stretch"
              />
            </View>

            <View
              style={{
                ...styles.poseImageCont,
                // backgroundColor: colors.lightBlue,
              }}
            >
              <Image
                // source={require('../../assets/images/FormImages/PhotoPoseBL.png')}
                // source={{uri: 'file://' + imgUri}}
                source={{ uri: imgUri }}
                style={{ ...styles.poseImageCont }}
                resizeMode="cover"
                // resizeMode='contain'
              />
            </View>
          </View>

          <View style={styles.middleTitle}>
            <View
            // style={{marginBottom: rspH(1)}}
            >
              <Text style={styles.headerTitle}>Satisfied with your photo?</Text>
            </View>
            {/* Para Here */}
            <Text style={styles.infoPara}>
              {`Please remember to check that your ${"\n"} face must be clearly visible and that ${"\n"} you have copied the pose exactly.${"\n"}${"\n"} This photo will only be used for ${"\n"} verification.`}
            </Text>
          </View>

          <View
            style={{
              height: rspH(13.5),
              // backgroundColor:'yellow',
              justifyContent: "space-between",
              marginTop: rspH(7),
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("PhotoVerifyCamera");
              }}
              style={{ ...styles.btn }}
            >
              <Text style={styles.btn_txt}>Retake</Text>
            </TouchableOpacity>
            <FooterBtn
              title={"Finish"}
              disabled={false}
              onPress={verifyPhoto}
            />
          </View>
        </View>
      </FormWrapper>

      {/* Camera with Pose */}
      <FullModal modalVisible={openCamera} setModalVisible={setopenCamera}>
        <PhotoVerifyCamera
          setpicURI={setpicURI}
          setModalVisible={setopenCamera}
        />
      </FullModal>
    </SafeAreaView>
  );
};

export default PhotoVerificationFinal;

const styles = StyleSheet.create({
  inputCont: {
    marginTop: rspH(7),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    // backgroundColor:'red',
    alignSelf: "center",
  },
  multiInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  poseImageCont: {
    width: rspW(38),
    // height: rspH(20),
    // height: rspH(Platform.OS == 'ios' ? 21.5 : 22.5),
    height:
      Platform.OS == "ios" ? srn_height / 4.6 : scrn_height / 5.2 + insets.top,

    borderRadius: rspW(3),
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#C6E3F4",
  },
  poseImage: {
    width: rspW(40),
    // height: rspH(Platform.OS == 'ios' ? 21.5 : 22.5),
    height:
      Platform.OS == "ios" ? srn_height / 4.6 : scrn_height / 5.2 + insets.top,

    // justifyContent:'flex-end',
    // alignSelf:'flex-end',
  },
  middleTitle: {
    marginTop: rspH(9.9),
  },
  headerTitle: {
    textAlign: "center",
    fontFamily: fontFamily.bold,
    fontSize: rspF(2.6),

    color: colors.black,
    lineHeight: rspF(2.65),
    marginBottom: rspH(4.8),
    letterSpacing: 1,
  },
  infoPara: {
    // backgroundColor:'red',
    fontFamily: fontFamily.regular,
    fontSize: rspF(2.02),
    color: colors.blue,
    lineHeight: rspF(2.1),
    textAlign: "center",
  },
  btn: {
    alignSelf: "center",
    backgroundColor: "transparent",
    width: scrn_width / 1.4,
    height: rspH(5.8),
    // height: rspH(5.6),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: rspW(8),
    // borderRadius: rspW(10),
    borderWidth: 1,
    borderColor: colors.blue,
  },

  btn_txt: {
    color: colors.blue,
    fontFamily: fontFamily.bold,
    fontSize: rspF(2.02),
    lineHeight: rspF(2.1),
  },
});
