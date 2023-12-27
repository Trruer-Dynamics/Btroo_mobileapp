import { StyleSheet, View, SafeAreaView } from "react-native";
import React, { useState } from "react";
import { scrn_height, rspH, rspW } from "../../../../styles/responsiveSize";
import FormWrapper from "../../../wrappers/formWrappers/FormWrapper";
import FormWrapperFooter from "../../../wrappers/formWrappers/FormWrapperFooter";
import ErrorContainer from "../../../formComponents/ErrorContainer";
import FooterBtn from "../../../Buttons/FooterBtn";
import FormInput from "../../../formComponents/FormInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FormHeader from "../../../wrappers/formWrappers/FormHeader";
import { useDispatch, useSelector } from "react-redux";
import { apiUrl } from "../../../../constants";
import Loader from "../../../loader/Loader";
import {
  setProfileRefresh,
  setProfiledata,
  setPromptFillingComplete,
  setPromptFillingStart,
  setSessionExpired,
  setUserLoggined,
} from "../../../../store/reducers/authentication/authentication";
import axios from "axios";
import { useNavigation } from "@react-navigation/core";

const ReferralCode = ({
  public_prompt1_q,
  public_prompt1_a,
  public_prompt2_q,
  public_prompt2_a,
  private_prompt1_q,
  private_prompt1_a,
  private_prompt2_q,
  private_prompt2_a,
  setpromptStep,
}) => {
  const navigation = useNavigation();
  const [referral_code, setreferral_code] = useState("");
  const [referral_code_blr, setreferral_code_blr] = useState(false);
  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );
  const access_token = useSelector(
    (state) => state.authentication.access_token
  );

  const is_network_connected = useSelector(
    (state) => state.authentication.is_network_connected
  );

  const [loading, setloading] = useState(false);

  const dispatch = useDispatch();

  const savePrompts = async () => {
    setloading(true);
    const url = apiUrl + "createuserpormpts/";

    const headers = {
      Authorization: `Bearer ${access_token}`,

      "Content-Type": "application/json",
    };

    const data = {
      userid: profile_data.user.id,
      publicprompts: [
        {
          prompstid: public_prompt1_q[0],
          answer: public_prompt1_a,
        },
        {
          prompstid: public_prompt2_q[0],
          answer: public_prompt2_a,
        },
      ],
      privateprompts: [
        {
          prompstid: private_prompt1_q[0],
          answer: private_prompt1_a,
        },
        {
          prompstid: private_prompt2_q[0],
          answer: private_prompt2_a,
        },
      ],
      refralcode: referral_code,
    };

    try {
      const resp = await axios.post(url, data, { headers });

      setloading(false);

      let status = resp.data.code;
      let user_data = resp.data;

      if (status == 200) {
        let user_prof_datap = {
          ...profile_data,
          userpublicprompts: [
            [public_prompt1_q, public_prompt1_a],
            [public_prompt2_q, public_prompt2_a],
          ],
          userprivateprompts: [
            [private_prompt1_q, private_prompt1_a],
            [private_prompt2_q, private_prompt2_a],
          ],
        };
        dispatch(setPromptFillingComplete(true));
        dispatch(setProfiledata(user_prof_datap));
        dispatch(setUserLoggined(true));
        navigation.navigate("Pledge");
      } else if (status == 401) {
        dispatch(setSessionExpired(true));
      }
    } catch (error) {
      setloading(false);
    }
  };

  const onNextPress = () => {
    if (is_network_connected) {
      savePrompts();
    }
  };

  return (
    <>
      {loading && <Loader />}
      <SafeAreaView style={{ height: scrn_height, backgroundColor: "#fff" }}>
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          style={{ flex: 1, backgroundColor: "#fff" }}
          bounces={false}
        >
          {/* Form Wrapper To Manage Forms Dimension*/}
          <FormWrapper>
            {/* Main Form UI */}
            <View>
              {/*Form  Header */}
              <View style={{ marginHorizontal: rspW(-5) }}>
                <FormHeader
                  left_icon={true}
                  onPress={() => setpromptStep(3)}
                  title="Tell us know how you got here"
                  para={`Let us know if someone referred you \n to us. We would like to reward you \n both with some cool premium \n features.`}
                  fontSize={2.2}
                />
              </View>
              {/* Inputs Container*/}
              <View style={styles.inputCont}>
                <FormInput
                  value={referral_code}
                  setvalue={setreferral_code}
                  width={"90%"}
                  height={rspW(12.76)}
                  placeholder={"Add your referral code here!"}
                  error_cond={
                    referral_code.length > 0 && referral_code.length < 3
                  }
                  keyboardType="default"
                  value_blr={referral_code_blr}
                  setvalue_blr={setreferral_code_blr}
                />
              </View>
            </View>

            <FormWrapperFooter>
              {/* Error Show Here */}

              <ErrorContainer error_msg="" />

              {/* Next Btn To Navigate to Next Form Components */}
              <FooterBtn
                title={"Finish"}
                disabled={!is_network_connected}
                onPress={onNextPress}
              />
            </FormWrapperFooter>
          </FormWrapper>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

export default ReferralCode;

const styles = StyleSheet.create({
  inputCont: {
    marginTop: rspH(20),
    height: scrn_height / 3,
    alignItems: "center",
    justifyContent: "center",
  },
  multiInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
