import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import React, { useState } from "react";
import FormWrapper from "../../components/wrappers/formWrappers/FormWrapper";

import {
  scrn_height,
  scrn_width,
  rspF,
  rspH,
  rspW,
} from "../../styles/responsiveSize";
import FooterBtn from "../../components/Buttons/FooterBtn";

import FormWrapperFooter from "../../components/wrappers/formWrappers/FormWrapperFooter";
import ErrorContainer from "../../components/formComponents/ErrorContainer";
import FastImage from "react-native-fast-image";

const Pledge = ({ navigation }) => {
  const onNextPress = () => {
    navigation.navigate("BottomTab", {
      screen: "Swiper",
    });
    // navigation.goBack()
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }} bounces={false}>
      <SafeAreaView style={{ height: scrn_height }}>
        {/* Form Wrapper To Manage Forms Dimension*/}
        <FormWrapper
          containerStyle={{
            paddingTop: rspH(3.7),
          }}
        >
          {/* Main Form UI */}
          <View>
            {/* Inputs Container*/}
            <View style={styles.inputCont}>
              <FastImage
                source={require("../../assets/images/Pledge.jpg")}
                style={{
                  alignSelf: "center",
                  height: rspH(Platform.OS == "ios" ? 70 : 78),

                  width: scrn_width - rspW(5),
                }}
                resizeMode="contain"
              />
            </View>
          </View>

          <FormWrapperFooter>
            {/* Error Show Here */}
            <ErrorContainer error_msg="" />

            {/* Next Btn To Navigate to Next Form Components */}
            <FooterBtn title={"Ok"} disabled={false} onPress={onNextPress} />
          </FormWrapperFooter>
        </FormWrapper>
      </SafeAreaView>
    </View>
  );
};

export default Pledge;

const styles = StyleSheet.create({
  inputCont: {},
});
