import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { rspF, rspH, rspW } from "../../../../styles/responsiveSize";
import colors from "../../../../styles/colors";

import FormWrapperFooter from "../../../wrappers/formWrappers/FormWrapperFooter";
import ErrorContainer from "../../../formComponents/ErrorContainer";
import FooterBtn from "../../../Buttons/FooterBtn";
import fontFamily from "../../../../styles/fontFamily";
import FormWrapper from "../../../wrappers/formWrappers/FormWrapper";
import FastImage from "react-native-fast-image";

const PromptIntro = ({ setpromptStep }) => {
  const onNextPress = () => {
    setpromptStep(2);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FormWrapper statusBarColor={colors.white} barStyle={"light-content"}>
        <View>
          {/* Top Para */}
          {/* <View style={{}}> */}
          <Text style={{ ...styles.para, fontFamily: fontFamily.bold }}>
            If you want to continue and to {"\n"} meet some other amazing people{" "}
            {"\n"} they will have to know a little more {"\n"} about you.
          </Text>
          {/* </View> */}

          <Text style={styles.heading}>Your Place to Shine!</Text>

          <View style={{}}>
            <Text style={{ ...styles.para, fontFamily: fontFamily.regular }}>
              Use this space to tell people a bit {"\n"} more about your
              personality. {"\n"} Select questions and answer them {"\n"} to
              your heart’s content.
            </Text>
          </View>

          <FastImage
            source={require("../../../../assets/images/Swiping/Prompts/onlineDatinglllutration.png")}
            style={styles.image}
            resizeMode="contain"
          />

          <View style={{}}>
            <Text style={{ ...styles.para, fontFamily: fontFamily.regular }}>
              Take control over your privacy and {"\n"} choose which one of
              these are {"\n"} visible to people who browse through {"\n"} your
              profile and which one of these {"\n"} are visible to only people
              who you
              {"\n"}
              match with.
            </Text>
          </View>
        </View>

        <FormWrapperFooter>
          {/* Error Show Here */}

          <ErrorContainer error_msg="" />

          {/* Next Btn To Navigate to Next Form Components */}
          <FooterBtn title={"Next"} disabled={false} onPress={onNextPress} />
        </FormWrapperFooter>
      </FormWrapper>
    </SafeAreaView>
  );
};

export default PromptIntro;

const styles = StyleSheet.create({
  heading: {
    fontFamily: fontFamily.bold,
    fontSize: rspF(2.62),
    color: colors.black,
    lineHeight: rspF(3),
    marginTop: rspH(3.7),
    marginBottom: rspH(3.3),
    textAlign: "center",
    letterSpacing: 1,
  },
  para: {
    color: colors.blue,
    textAlign: "center",
    lineHeight: rspF(2.87),
    fontSize: rspF(2.02),
  },

  image: {
    width: rspW(48),
    height: rspW(48),
    alignSelf: "center",
  },
});
