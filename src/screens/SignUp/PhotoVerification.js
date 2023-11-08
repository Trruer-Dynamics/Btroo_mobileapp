import { StyleSheet, View, Platform, SafeAreaView } from "react-native";
import React from "react";
import FormWrapper from "../../components/wrappers/formWrappers/FormWrapper";

import { rspH, rspW, scrn_height } from "../../styles/responsiveSize";
import FooterBtn from "../../components/Buttons/FooterBtn";
import FormWrapperFooter from "../../components/wrappers/formWrappers/FormWrapperFooter";
import ErrorContainer from "../../components/formComponents/ErrorContainer";
import FormHeader from "../../components/wrappers/formWrappers/FormHeader";
import { useDispatch, useSelector } from "react-redux";
import { setUserLoggined } from "../../store/reducers/authentication/authentication";
import { useFocusEffect } from "@react-navigation/native";
import { setCurrentScreen } from "../../store/reducers/screen/screen";
import FastImage from "react-native-fast-image";

const PhotoVerification = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const is_network_connected = useSelector(
    (state) => state.authentication.is_network_connected
  );

  const onNextPress = () => {
    navigation.navigate("PhotoVerifyCamera");
    // dispatch(setUserLoggined(true));
    // navigation.navigate('Pledge');
  };

  useFocusEffect(
    React.useCallback(() => {
      dispatch(setCurrentScreen(route.name));
      return () => {};
    }, [])
  );

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
            <FastImage
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

        <FormWrapperFooter>
          {/* Error Show Here */}

          <ErrorContainer error_msg="" />

          {/* Next Btn To Navigate to Next Form Components */}
          <FooterBtn title={"Next"} disabled={is_network_connected ? false : true} onPress={()=>{
            if (is_network_connected) {
              onNextPress()  
            }
            
            }} />
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
    height: rspH(38.4),
    alignSelf: "center",
  },

  poseImage: {
    alignSelf: "flex-end",
    width: rspW(71.25),
    height: rspH(38.4),
  },
  middleTitle: {
    marginTop: rspH(6),
  },
});
