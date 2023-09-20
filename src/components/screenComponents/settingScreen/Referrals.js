import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import Clipboard from "@react-native-clipboard/clipboard";
import FooterBtn from "../../Buttons/FooterBtn";
import fontFamily from "../../../styles/fontFamily";
import colors from "../../../styles/colors";
import { rspH, rspW, rspF, scrn_height } from "../../../styles/responsiveSize";
import Share from "react-native-share";
import ADIcon from "react-native-vector-icons/AntDesign";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector } from "react-redux";
import Toast from "../../toast/Toast";
import FormHeader from "../../wrappers/formWrappers/FormHeader";

const Referrals = ({ modalVisible, setModalVisible }) => {
  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );

  const [user_ref_code, setuser_ref_code] = useState("");

  const [show_toast, setshow_toast] = useState(false);

  useLayoutEffect(() => {
    let refc =
      profile_data.userprofile.name.split(" ")[0] +
      "_" +
      profile_data.userprofile.referral_code;

    setuser_ref_code(refc);
  }, []);

  return (
    <SafeAreaView style={{ height: scrn_height, backgroundColor: "#fff" }}>
      {/* <KeyboardAwareScrollView
        enableOnAndroid={true}
        style={{flex: 1, backgroundColor: '#fff'}}
        bounces={false}
        showsVerticalScrollIndicator={false}> */}
      <View style={{ paddingHorizontal: rspW(10) }}>
        <View style={{ marginTop: rspH(2.35) }}>
          <View
            style={{
              marginBottom: rspH(3.9),
            }}
          >
            <FormHeader
              title="Referrals"
              left_icon={true}
              onPress={() => {
                setModalVisible(false);
              }}
            />
          </View>

          <View style={{ alignSelf: "center" }}>
            <Image
              source={require("../../../assets/images/Setting/refImage.png")}
              style={{
                // width: rspW(72.6),
                // height: rspW(72.6),
                width: rspW(75),
                height: rspW(75),
              }}
            />
          </View>

          <View>
            <Text style={styles.para}>
              Tell your friends about us!
              {"\n"}
              {"\n"}
              We would like to reward{"\n"}you both with some cool{"\n"}
              premium features.
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              // width: rspW(68.6),
              width: rspW(68.6),
              height: rspH(5.8),
              alignSelf: "center",
              borderWidth: 1,
              borderRadius: rspW(6.34),
              marginTop: rspH(2.9),
              marginBottom: rspH(2.8),
              paddingHorizontal: rspW(5.1),
              // backgroundColor:'red',
            }}
          >
            <Text style={styles.ref_txt}>{user_ref_code}</Text>

            <TouchableOpacity
              // style={{backgroundColor:'green'}}
              onPress={() => {
                Clipboard.setString(user_ref_code);
                setshow_toast(true);
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: rspF(1.302),
                  fontFamily: fontFamily.bold,
                  lineHeight: rspF(1.31),
                  color: colors.blue,
                }}
              >
                COPY
              </Text>
            </TouchableOpacity>
          </View>

          <FooterBtn
            title={"Invite Friends"}
            onPress={() => {
              const url = "";
              const title = "Referrals";
              const message =
                "Hey Guys join btroo " +
                profile_data.userprofile.name.split(" ")[0] +
                "_" +
                profile_data.userprofile.referral_code;

              const options = {
                title,
                url,
                message,
              };

              Share.open(options)
                .then((res) => {})
                .catch((err) => {
                  err && console.log(err);
                });
            }}
          />
        </View>
      </View>

      <Toast
        bottom={14}
        message="Referral Code Copied"
        visible={show_toast}
        setvisible={setshow_toast}
      />

      {/* </KeyboardAwareScrollView> */}
    </SafeAreaView>
  );
};

export default Referrals;

const styles = StyleSheet.create({
  para: {
    fontSize: rspF(2.62),
    lineHeight: rspH(3.35),
    fontFamily: fontFamily.regular,
    color: colors.black,
    textAlign: "center",
  },
  headerTitle: {
    fontFamily: fontFamily.bold,
    fontSize: rspF(2.62),
    color: colors.black,
    lineHeight: rspF(2.65),
    marginBottom: rspH(1.2),
  },
  ref_txt: {
    textAlign: "center",
    fontSize: rspF(1.76),
    fontFamily: fontFamily.bold,
    lineHeight: rspF(1.78),
    color: "#888686",
  },
});
