import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import React, { useState, useLayoutEffect, useEffect } from "react";
import FormWrapper from "../../components/wrappers/formWrappers/FormWrapper";

import {
  rspH,
  rspW,
  rspF,
  scrn_height,
  scrn_width,
} from "../../styles/responsiveSize";
import FooterBtn from "../../components/Buttons/FooterBtn";
import fontFamily from "../../styles/fontFamily";
import FormWrapperFooter from "../../components/wrappers/formWrappers/FormWrapperFooter";
import ErrorContainer from "../../components/formComponents/ErrorContainer";
import FormHeader from "../../components/wrappers/formWrappers/FormHeader";
import { useDispatch } from "react-redux";
import { setUserLoggined } from "../../store/reducers/authentication/authentication";

const PhotoVerification = ({ navigation }) => {
  const dispatch = useDispatch();

  const onNextPress = () => {
    navigation.navigate("PhotoVerifyCamera");
    // navigation.navigate('PhotoVerificationFinal');
    // dispatch(setUserLoggined(true));
    // navigation.navigate('Pledge');
  };

  return (
    <SafeAreaView style={{ height: scrn_height, backgroundColor: "#fff" }}>
      {/* Form Wrapper To Manage Forms Dimension*/}
      <FormWrapper>
        {/* Main Form UI */}
        <View>
          {/*Form  Header */}

          <FormHeader title="Photo Verification" para={`Strike the Pose`} />

          {/* Inputs Container*/}
          <View style={styles.inputCont}>
            <Image
              source={require("../../assets/images/PicVerifyBL.png")}
              style={styles.poseImage}
              // resizeMode="contain"
            />
          </View>

          <View style={styles.middleTitle}>
            <FormHeader
              title="Pose"
              para={`Copy the gesture in the photo below ${"\n"} as we allow only real and verified ${"\n"} users to join our community.`}
            />
          </View>
        </View>

        <FormWrapperFooter
        // containerStyle={{bottom: rspH(-3.2)}}
        >
          {/* Error Show Here */}

          <ErrorContainer error_msg="" />

          {/* Next Btn To Navigate to Next Form Components */}
          <FooterBtn title={"Next"} disabled={false} onPress={onNextPress} />
        </FormWrapperFooter>
      </FormWrapper>
    </SafeAreaView>
  );
};

export default PhotoVerification;

const styles = StyleSheet.create({
  inputCont: {
    marginTop: rspH(Platform.OS == "ios" ? 8.24 : 8),
    backgroundColor: "#C6E3F4",
    borderRadius: rspW(7.64),
    width: rspW(71.25),
    // width: rspW(71.25),
    height: rspH(38.4),
    // height: rspH(38.4),
    alignSelf: "center",
  },

  poseImage: {
    alignSelf: "flex-end",

    width: rspW(71.25),
    // width: 280,
    height: rspH(38.4),
  },
  middleTitle: {
    marginTop: rspH(6),
  },
});
