import { StyleSheet, View, SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import {
  scrn_height,
  rspF,
  rspH,
  rspW,
  scrn_width,
} from "../../../../styles/responsiveSize";
import colors from "../../../../styles/colors";
import FormWrapper from "../../../wrappers/formWrappers/FormWrapper";
import FormWrapperFooter from "../../../wrappers/formWrappers/FormWrapperFooter";
import ErrorContainer from "../../../formComponents/ErrorContainer";
import FooterBtn from "../../../Buttons/FooterBtn";
import FormSelector from "../../../formComponents/FormSelector";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import FormHeader from "../../../wrappers/formWrappers/FormHeader";
import AutoGrowingTextInput from "react-native-autogrow-textinput-ts";
import fontFamily from "../../../../styles/fontFamily";

const PrivatePrompts = ({
  setpromptStep,
  prompts_list_rmv,
  setprompts_list_rmv,
  private_prompt1_q,
  private_prompt1_a,
  setprivate_prompt1_q,
  setprivate_prompt1_a,
  private_prompt2_q,
  setprivate_prompt2_q,
  private_prompt2_a,
  setprivate_prompt2_a,
}) => {
  const prompts_list = useSelector((state) => state.allData.all_prompts);
  const [prp_blr, setprp_blr] = useState(false);
  const [error, seterror] = useState("");

  const [private_prompt1_blr, setprivate_prompt1_blr] = useState(false);
  const [private_prompt1_q_id, setprivate_prompt1_q_id] = useState(0);
  const [private_prompt1_q_blr, setprivate_prompt1_q_blr] = useState(false);

  const [private_prompt2_blr, setprivate_prompt2_blr] = useState(false);
  const [private_prompt2_q_id, setprivate_prompt2_q_id] = useState(0);
  const [private_prompt2_q_blr, setprivate_prompt2_q_blr] = useState(false);

  useEffect(() => {
    if (private_prompt1_a.length > 1 || private_prompt2_a.length > 1) {
      seterror("");
    }
  }, [private_prompt1_a, private_prompt2_a]);

  const onNextPress = () => {
    setprp_blr(true);
    setprivate_prompt1_q_blr(true);
    setprivate_prompt1_blr(true);
    setprivate_prompt2_q_blr(true);
    setprivate_prompt2_blr(true);

    if (private_prompt1_q == "") {
      seterror("Please Select Prompt Question 1");
    } else if (private_prompt1_a.length < 3) {
      seterror("The Answer you have entered is too short");
    } else if (private_prompt2_q == "") {
      seterror("Please Select Prompt Question 2");
    } else if (private_prompt2_a.length < 3) {
      seterror("The Answer you have entered is too short");
    } else {
      seterror("");
      setpromptStep(4);
    }
  };

  return (
    <SafeAreaView style={{ height: scrn_height }}>
      {/* Form Wrapper To Manage Forms Dimension*/}
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        style={{ flex: 1, backgroundColor: "#fff" }}
        bounces={false}
      >
        <FormWrapper>
          {/* Main Form UI */}
          <View>
            {/*Form  Header */}

            <FormHeader
              title="Private Prompts"
              para={`Your Private Place. ${"\n"}${"\n"}This is more exclusive. The prompts ${"\n"}in this section will be visible only to ${"\n"}the people who you've been matched ${"\n"}with.`}
            />

            <View
              style={{
                alignSelf: "center",
                width: "100%",
                marginTop: rspH(6.8),
              }}
            >
              <View style={{ marginBottom: rspH(2.5) }}>
                <View style={{ marginBottom: rspH(1.4) }}>
                  <FormSelector
                    setSelectedEntry={setprivate_prompt1_q}
                    selectedId={private_prompt1_q_id}
                    setSelectedId={setprivate_prompt1_q_id}
                    blr_value={private_prompt1_q_blr && prp_blr}
                    setblr_value={setprivate_prompt1_q_blr}
                    title="Prompts"
                    search={false}
                    placeholder={"Private Prompt Question 1"}
                    width={"100%"}
                    multiline={true}
                    list={prompts_list}
                    selectedValue={private_prompt1_q[1]}
                    removable={true}
                    rmv_list={prompts_list_rmv}
                    setrmv_list={setprompts_list_rmv}
                  />
                </View>

                <View>
                  <AutoGrowingTextInput
                    maxLength={250}
                    placeholder="Type your answer"
                    placeholderTextColor={"#000000"}
                    keyboardType="default"
                    style={{
                      ...styles.promptsInput,
                      backgroundColor:
                        private_prompt1_a !== "" ? colors.white : "#F8F8F8",
                      borderColor:
                      private_prompt1_blr ?
                      private_prompt1_a.length < 2 ?
                      colors.error:
                      colors.blue
                      :
                        private_prompt1_a !== ""
                          ? colors.blue
                          : colors.grey,
                      textAlignVertical: "top",
                    }}
                    value={private_prompt1_a}
                    onChangeText={(val) => {
                      setprivate_prompt1_a(val);
                    }}
                    editable={!private_prompt1_q == ""}
                    maxHeight={rspH(11.5)}
                    minHeight={rspH(11.5)}
                  />
                </View>
              </View>

              <View style={{ marginBottom: rspH(2.5) }}>
                <View style={{ marginBottom: rspH(1.4) }}>
                  <FormSelector
                    setSelectedEntry={setprivate_prompt2_q}
                    selectedId={private_prompt2_q_id}
                    setSelectedId={setprivate_prompt2_q_id}
                    blr_value={private_prompt2_q_blr && prp_blr}
                    setblr_value={setprivate_prompt2_q_blr}
                    title="Prompts"
                    placeholder={"Private Prompt Question 2"}
                    width={"100%"}
                    list={prompts_list}
                    search={false}
                    selectedValue={private_prompt2_q[1]}
                    removable={true}
                    rmv_list={prompts_list_rmv}
                    setrmv_list={setprompts_list_rmv}
                    multiline={true}
                  />
                </View>
                <View>
                  <AutoGrowingTextInput
                    maxLength={250}
                    placeholder="Type your answer"
                    placeholderTextColor={"#000000"}
                    keyboardType="default"
                    style={{
                      ...styles.promptsInput,
                      backgroundColor:
                        private_prompt2_a !== "" ? colors.white : "#F8F8F8",
                      borderColor:
                      private_prompt2_blr ?
                      private_prompt2_a.length < 2 ?
                      colors.error:
                      colors.blue
                      :

                      private_prompt2_a !== "" 
                          ? colors.blue
                          : colors.grey,
                      textAlignVertical: "top",
                    }}
                    value={private_prompt2_a}
                    onChangeText={(val) => {
                      setprivate_prompt2_a(val);
                    }}
                    editable={!private_prompt2_q == ""}
                    maxHeight={rspH(11.5)}
                    minHeight={rspH(11.5)}
                  />
                </View>
              </View>
            </View>
          </View>

          <FormWrapperFooter>
            {/* Error Show Here */}

            <ErrorContainer error_msg={error} />

            {/* Next Btn To Navigate to Next Form Components */}
            <FooterBtn
              title={"Next"}
              disabled={
                private_prompt1_q == "" ||
                private_prompt1_a.length < 3 ||
                private_prompt2_q == "" ||
                private_prompt2_a.length < 3
              }
              onPress={onNextPress}
            />
          </FormWrapperFooter>
        </FormWrapper>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default PrivatePrompts;

const styles = StyleSheet.create({
  inputCont: {
    marginTop: rspH(2.7),
    marginBottom: rspH(3.7),
  },
  promptsInput: {
    color: colors.black,
    width: scrn_width - rspW(20),
    borderRadius: rspW(1.3),
    justifyContent: "center",
    borderWidth: 1,
    fontSize: rspF(2.02),
    fontFamily: fontFamily.regular,
    lineHeight: rspF(2.2),
    paddingVertical: rspH(1),
    paddingHorizontal: rspW(4),
  },
});
