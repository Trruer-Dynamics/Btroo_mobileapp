import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import React, { useContext, useLayoutEffect, useState } from "react";
import { rspF, rspH, rspW, scrn_height } from "../../../styles/responsiveSize";
import colors from "../../../styles/colors";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
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
import FastImage from "react-native-fast-image";
import { setCurrentScreen } from "../../../store/reducers/screen/screen";
import { setMatchesImgs } from "../../../store/reducers/chats/chats";
import { UserContext } from "../../../context/user";

const ProfileRevealed = ({ route }) => {
  const navigation = useNavigation();

  const { profile } = route.params;
  const dispatch = useDispatch();
  const access_token = useSelector(
    (state) => state.authentication.access_token
  );
  const matches_imgs = useSelector((state) => state.chats.matches_imgs);
  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );

  const [rvl_img, setrvl_img] = useState("");

  const [updated_prof, setupdated_prof] = useState(null);
  const { sckop,c_scrn } = useContext(UserContext);


  const getRvlProfData = async () => {
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
        prf_usr.prof_img = matches_imgs.filter((v) => v[0] == profile.id)[0][1];
        setupdated_prof(prf_usr);
      } else if (response.data.code == 401) {
        dispatch(setSessionExpired(true));
      }
    } catch (error) {
      setreport("");
      return false;
    }
  };

  useLayoutEffect(() => {
    getRvlProfData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {

      c_scrn.current = 'ProfileRevealed'
      dispatch(setCurrentScreen(route.name));

      let tmplist = [...matches_imgs];
      let indx = tmplist.findIndex((v) => v[0] == profile.id);
      let cprof_img = [tmplist[indx][0], tmplist[indx][1], true];
      tmplist[indx] = cprof_img;

      setrvl_img(tmplist[indx][1]);
      dispatch(setMatchesImgs(tmplist));

      return () => {};
    }, [])
  );

  return (
    <>
      <SafeAreaView style={{ height: scrn_height, backgroundColor: "#fff" }}>
        <FormWrapper>
          <FormHeader
            title="Profile Revealed"
            left_icon={true}
            onPress={() => {
              navigation.navigate("Chat", {
                profile: updated_prof,
              });
            }}
          />

          <View style={styles.container}>
            <FastImage source={{ uri: rvl_img }} style={styles.profileImage} />

            <View
              style={{
                alignItems: "center",
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
    paddingTop: rspH(3.25),
    paddingBottom: rspW(10.24),
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
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
