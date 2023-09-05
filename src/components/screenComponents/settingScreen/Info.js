import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import ADIcon from "react-native-vector-icons/AntDesign";
import {
  rspH,
  rspF,
  rspW,
  scrn_height,
  scrn_width,
} from "../../../styles/responsiveSize";
import fontFamily from "../../../styles/fontFamily";
import colors from "../../../styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { apiUrl } from "../../../constants";
import { useSelector } from "react-redux";
import RenderHTML from "react-native-render-html";
import Loader from "../../loader/Loader";
import Accordion from "../../Accordion";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FormHeader from "../../wrappers/formWrappers/FormHeader";
import LinearGradient from "react-native-linear-gradient";

const Info = ({ navigation, route }) => {
  // const [heading, setheading] = useState("Terms And Services")
  const { heading } = route.params;

  const [para, setpara] = useState("");

  const [loading, setloading] = useState(false);

  const [arr, setarr] = useState([]);

  const tagsStyles = {
    p: {
      color: "white",
    },
    ol: {
      color: "white",
    },
    ul: {
      color: "white",
    },
    li: {
      color: "white",
    },
    h2: {
      color: "white",
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
        console.log("\n");
        console.log("Terms and Services", resp);
        console.log("\n");
        setloading(false);
        if (resp.status == 200) {
          setpara(resp.data.data.text);
        } else {
          console.warn("Error occur while get_terms_of_services");
        }
      })
      .catch((err) => {
        setloading(false);

        console.log("getTAS err", err);
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

        console.log("get_privacy_policy_master err", err);
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

        console.log("get_privacy_preference_master err", err);
      });
  };

  const getCommunityGuidelines = async () => {
    setloading(true);

    await axios
      .get(apiUrl + `get_community_guidelines_master/`)
      .then((resp) => {
        setloading(false);

        if (resp.status == 200) {
          setpara(resp.data.data.text);
        } else {
          console.warn("Error occur while get_community_guidelines_master");
        }
      })
      .catch((err) => {
        setloading(false);

        console.log("get_community_guidelines_master err", err);
      });
  };

  const getPhotoGuidelines = async () => {
    setloading(true);

    await axios
      .get(apiUrl + `get_photo_guidelines_master/`)
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

        console.log("get_community_guidelines_master err", err);
      });
  };

  const getFAQ = async () => {
    setloading(true);
    await axios
      .get(apiUrl + `get_FAQ_master/`)
      .then((resp) => {
        setloading(false);

        let faq_data = resp.data.data;
        if (resp.data.code == 200) {
          let tmp_arr = faq_data.map((c) => {
            return { id: c.id, question: c.question, answer: c.answer };
          });

          setarr(tmp_arr);
        } else {
          Alert.alert("Something went wrong");
        }
      })
      .catch((err) => {
        setloading(false);
        console.log("getFAQ err", err);
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

        console.log("get_cookies_policy_master err", err);
      });
  };

  const source = {
    html: para,
  };

  useLayoutEffect(() => {
    // To Set Title according to link press
    if (heading == "Terms of Services") {
      getTAS();
    } else if (heading == "Privacy Policy") {
      getPrivacyPolicy();
    } else if (heading == "Privacy Preference") {
      getPrivacyPreferance();
    } else if (heading == "Community Guidelines") {
      getCommunityGuidelines();
    } else if (heading == "Photo Guidelines") {
      getPhotoGuidelines();
    } else if (heading == "FAQ") {
      getFAQ();
    } else if (heading == "Cookies Policy") {
      getCookiesPolicy();
    }
  }, []);

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

            {/* TO render FAQ */}
            {arr.length > 0 && (
              <View style={{ marginTop: rspH(2.35) }}>
                {arr.map((v) => {
                  return (
                    <Accordion
                      key={v.id}
                      heading={v.question}
                      para={v.answer}
                    />
                  );
                })}
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Info;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: rspW(7.64),
    // backgroundColor: '#6B9DFF',
  },
});
