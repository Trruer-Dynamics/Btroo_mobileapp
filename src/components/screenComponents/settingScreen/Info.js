import { StyleSheet, View } from "react-native";
import React, { memo, useLayoutEffect, useState } from "react";
import {
  rspH,
  rspF,
  rspW,
  scrn_height,
  scrn_width,
} from "../../../styles/responsiveSize";
import fontFamily from "../../../styles/fontFamily";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { apiUrl } from "../../../constants";
import { useDispatch, useSelector } from "react-redux";
import RenderHTML from "react-native-render-html";
import Loader from "../../loader/Loader";
import Accordion from "../../Accordion";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FormHeader from "../../wrappers/formWrappers/FormHeader";
import LinearGradient from "react-native-linear-gradient";
import { setCurrentScreen } from "../../../store/reducers/screen/screen";
import { useFocusEffect } from "@react-navigation/native";

const Info = ({ navigation, route }) => {
  const { heading } = route.params;
  const [para, setpara] = useState("");
  const [loading, setloading] = useState(false);

  const tagsStyles = {
    p: {
      color: "white",
      fontFamily: "arial",
      textAlign: "justify",
    },
    ol: {
      color: "white",
      fontFamily: "arial",
    },
    ul: {
      color: "white",
      fontFamily: "arial",
    },
    li: {
      color: "white",
      fontFamily: "arial",
      textAlign: "justify",
    },
    h2: {
      color: "white",
      fontFamily: "arial",
    },
    strong: {
      color: "white",
    },
    table: {
      borderWidth: 2,
      borderColor: "white",
    },

    td: {
      borderColor: "white",
      borderWidth: 1,
    },
  };

  const getTAS = async () => {
    setloading(true);
    await axios
      .get(apiUrl + `get_terms_of_services/`)
      .then((resp) => {
        setloading(false);
        if (resp.status == 200) {
          setpara(resp.data.data.text);
        } else {
          console.warn("Error occur while get_terms_of_services");
        }
      })
      .catch((err) => {
        setloading(false);
      });
  };

  const getPrivacyPolicy = async () => {
    setloading(true);

    await axios
      .get(apiUrl + `get_privacy_policy_master/`)
      .then((resp) => {
        setloading(false);

        if (resp.status == 200) {
          setpara(resp.data.data?.text);
        } else {
          console.warn("Error occur while get_privacy_policy_master");
        }
      })
      .catch((err) => {
        setloading(false);
      });
  };

  const getPrivacyPreferance = async () => {
    setloading(true);

    await axios
      .get(apiUrl + `get_privacy_preference_master/`)
      .then((resp) => {
        setloading(false);

        if (resp.status == 200) {
          setpara(resp.data.data.text);
        } else {
          console.warn("Error occur while get_privacy_preference_master");
        }
      })
      .catch((err) => {
        setloading(false);
      });
  };

  const getCookiesPolicy = async () => {
    setloading(true);

    await axios
      .get(apiUrl + `get_cookies_policy_master/`)
      .then((resp) => {
        setloading(false);

        if (resp.status == 200) {
          setpara(resp.data.data.text);
        } else {
          console.warn("Error occur while get_photo_guidelines_master");
        }
      })
      .catch((err) => {
        setloading(false);
      });
  };

  const source = {
    html: para,
  };

  useLayoutEffect(() => {
    // To Set Title according to link press
    if (heading == "Terms of Service") {
      getTAS();
    } else if (heading == "Privacy Policy") {
      getPrivacyPolicy();
    } else if (heading == "Privacy Preference") {
      getPrivacyPreferance();
    } else if (heading == "Cookies Policy") {
      getCookiesPolicy();
    }
  }, []);

  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      dispatch(setCurrentScreen(route.name));
      return () => {};
    }, [])
  );

  return (
    <SafeAreaView
      style={{
        height: scrn_height,
        width: scrn_width,
        backgroundColor: "#fff",
      }}
    >
      {loading && <Loader />}
      {/* To Add Gradient Color To Whole Screen */}
      <LinearGradient
        colors={["#3C75B5", "#7ab7e290"]}
        start={{ x: 0.6, y: 0.4 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <View
          style={{
            paddingHorizontal: rspW(4),
            paddingTop: rspH(1.6),
            paddingTop: rspH(2.6),
          }}
        >
          <FormHeader
            iconColor="#fff"
            extraHeadingStyle={{
              color: "#fff",
              fontFamily: fontFamily.bold,
            }}
            title={heading}
            left_icon={true}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>

        <KeyboardAwareScrollView
          style={{ ...styles.container }}
          bounces={false}
        >
          {/* Para */}
          <View style={{ marginTop: rspH(2.35) }}>
            {/* To render html content from backend */}
            <RenderHTML
              contentWidth={"100%"}
              source={source}
              tagsStyles={tagsStyles}
            />
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default memo(Info);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: rspW(7.64),
  },
});
