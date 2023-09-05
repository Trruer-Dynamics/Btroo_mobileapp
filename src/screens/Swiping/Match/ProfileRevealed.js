import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import {
  rspF,
  rspH,
  rspW,
  scrn_height,
  scrn_width,
} from "../../../styles/responsiveSize";
import colors from "../../../styles/colors";
import { useNavigation } from "@react-navigation/native";
import FormWrapperFooter from "../../../components/wrappers/formWrappers/FormWrapperFooter";
import FooterBtn from "../../../components/Buttons/FooterBtn";
import fontFamily from "../../../styles/fontFamily";
import ErrorContainer from "../../../components/formComponents/ErrorContainer";
import FormWrapper from "../../../components/wrappers/formWrappers/FormWrapper";
import FormHeader from "../../../components/wrappers/formWrappers/FormHeader";
import truncateStr from "../../../components/functions/truncateStr";
import { useDispatch, useSelector } from "react-redux";
import { apiUrl } from "../../../constants";
import axios from "axios";
import { setSessionExpired } from "../../../store/reducers/authentication/authentication";

const ProfileRevealed = ({ route }) => {
  const navigation = useNavigation();

  const { profile } = route.params;
  const dispatch = useDispatch();
  const access_token = useSelector(
    (state) => state.authentication.access_token
  );
  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );

  const [updated_prof, setupdated_prof] = useState(null);

  const getRvlProfData = async () => {
    // setloading(true)
    const data = {
      profile_id: profile.userprofile.id,
    };

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    try {
      const response = await axios.post(apiUrl + "profile_data/", data, {
        headers,
      });
      let resp_data = response.data.data;

      if (response.data.code == 200) {
        let prf_usr = { ...profile };

        prf_usr.userprofile = resp_data;
        prf_usr.prof_rvl = true;
        prf_usr.publicprompts = resp_data.publicprompts;
        prf_usr.privateprompts = resp_data.privateprompts;

        setupdated_prof(prf_usr);
      } else if (response.data.code == 401) {
        dispatch(setSessionExpired(true));
      } else {
        console.log("err getRvlProfData", resp_data);
      }
    } catch (error) {
      setreport("");
      // setloading(false);
      console.log("getRvlProfData error", error);
      dispatch(setSessionExpired(true));
      return false;
    }
  };

  useLayoutEffect(() => {
    getRvlProfData();
  }, []);

  return (
    <>
      <SafeAreaView style={{ height: scrn_height, backgroundColor: "#fff" }}>
        <FormWrapper>
          <FormHeader
            title="Profile Revealed"
            left_icon={true}
            onPress={() => {
              // navigation.goBack();
              navigation.navigate("Chat", {
                profile: updated_prof,
              });
            }}
          />

          <View style={styles.container}>
            <Image
              source={{ uri: profile?.prof_img }}
              style={styles.profileImage}
            />

            <View
              style={{
                alignItems: "center",
                // backgroundColor:'red',
                width: rspW(76),
              }}
            >
              <View style={{ marginBottom: rspH(4.8) }}>
                <Text style={styles.title}>
                  {truncateStr(profile?.userprofile?.name.split(" ")[0], 7)} is
                  now unmasked!
                </Text>
              </View>

              <View>
                <Text style={styles.para}>
                  Now you can see their whole profile,{"\n"}including all their
                  photos and bio.
                </Text>
              </View>
            </View>
          </View>
          <FormWrapperFooter>
            <ErrorContainer error_msg="" />

            <FooterBtn
              title={
                "Show me " +
                truncateStr(profile?.userprofile?.name.split(" ")[0], 10)
              }
              disabled={false}
              onPress={() => {
                navigation.navigate("MatchProfile", {
                  profile: updated_prof,
                });
              }}
            />
          </FormWrapperFooter>
        </FormWrapper>
      </SafeAreaView>
    </>
  );
};

export default ProfileRevealed;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // height: scrn_height,
    paddingTop: rspH(3.25),
    paddingBottom: rspW(10.24),
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    // backgroundColor:'#ef854895',
    marginHorizontal: rspW(9.6),
    alignItems: "center",
  },
  profileImage: {
    width: rspW(64),
    height: rspW(64),
    alignSelf: "center",
    borderRadius: rspW(33),
    marginBottom: rspH(7.6),
    marginTop: rspH(3.7),
  },
  title: {
    fontFamily: fontFamily.medium,
    fontSize: rspF(2.44),
    lineHeight: rspF(2.65),
    color: colors.blue,
  },
  para: {
    fontFamily: fontFamily.light,
    fontSize: rspF(1.8),
    lineHeight: rspF(1.94),
    color: colors.black,
    textAlign: "center",
  },
});
