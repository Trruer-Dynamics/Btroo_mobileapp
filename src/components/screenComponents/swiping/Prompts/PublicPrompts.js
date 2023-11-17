import { StyleSheet, View, SafeAreaView, Alert } from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
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
import fontFamily from "../../../../styles/fontFamily";
import AutoGrowingTextInput from "react-native-autogrow-textinput-ts";

const PublicPrompts = ({
  setpromptStep,
  prompts_list_rmv,
  setprompts_list_rmv,
  public_prompt1_q,
  public_prompt1_a,
  setpublic_prompt1_q,
  setpublic_prompt1_a,
  public_prompt2_q,
  setpublic_prompt2_q,
  public_prompt2_a,
  setpublic_prompt2_a,
}) => {
  const prompts_list = useSelector((state) => state.allData.all_prompts);

  const [error, seterror] = useState("");

  const [public_prompt1_blr, setpublic_prompt1_blr] = useState(false);
  const [public_prompt1_q_id, setpublic_prompt1_q_id] = useState(0);
  const [public_prompt1_q_blr, setpublic_prompt1_q_blr] = useState(false);

  const [public_prompt2_blr, setpublic_prompt2_blr] = useState(false);
  const [public_prompt2_q_id, setpublic_prompt2_q_id] = useState(0);
  const [public_prompt2_q_blr, setpublic_prompt2_q_blr] = useState(false);

  const [pup_blr, setpup_blr] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (public_prompt1_a.length > 1 || public_prompt2_a.length > 1) {
      seterror("");
    }
  }, [public_prompt1_a, public_prompt2_a]);

  const onNextPress = () => {
    setpup_blr(true);
    setpublic_prompt1_q_blr(true);
    setpublic_prompt1_blr(true);
    setpublic_prompt2_q_blr(true);
    setpublic_prompt2_blr(true);

    if (public_prompt1_q == "") {
      seterror("Please Select Prompt Question 1");
    } else if (public_prompt1_a.length < 3) {
      seterror("The Answer you have entered is too short");
    } else if (public_prompt2_q == "") {
      seterror("Please Select Prompt Question 2");
    } else if (public_prompt2_a.length < 3) {
      seterror("The Answer you have entered is too short");
    } else {
      seterror("");
      setpromptStep(3);
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
              title="Public Prompts"
              para={`Stand out! Don’t be just another fish ${"\n"} in the sea. ${"\n"}${"\n"}The prompts in this section will be ${"\n"} visible only to the people who browse ${"\n"} through your profile, and later, to ${"\n"} people that you’ve decided to ${"\n"} unmask yourself to.`}
            />

            <View
              style={{
                alignSelf: "center",
                width: "100%",
                // backgroundColor:'red',
                marginTop: rspH(2.2),
              }}
            >
              <View style={{ marginBottom: rspH(2.5) }}>
                <View style={{ marginBottom: rspH(1.4) }}>
                  <FormSelector
                    setSelectedEntry={setpublic_prompt1_q}
                    selectedId={public_prompt1_q_id}
                    setSelectedId={setpublic_prompt1_q_id}
                    blr_value={public_prompt1_q_blr && pup_blr}
                    setblr_value={setpublic_prompt1_q_blr}
                    title="Prompts"
                    search={false}
                    placeholder={"Public Prompt Question 1"}
                    width={"100%"}
                    list={prompts_list}
                    multiline={true}
                    selectedValue={public_prompt1_q[1]}
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
                        public_prompt1_a !== ""  ? colors.white : "#F8F8F8",
                      borderColor:
                      public_prompt1_blr ?
                      public_prompt1_a.length < 2 ?
                      colors.error:
                      colors.blue
                      :
                        public_prompt1_a !== "" 
                          ? 
                          colors.blue
                          : colors.grey
                      ,
                      textAlignVertical: "top",
                      paddingTop: rspH(1.4),  
                    }}
                    value={public_prompt1_a}
                    onChangeText={(val) => {
                      setpublic_prompt1_a(val);
                    }}
                    editable={!public_prompt1_q == ""}
                    maxHeight={rspH(11.5)}
                    minHeight={rspH(11.5)}
                  />
                </View>
              </View>

              <View style={{ marginBottom: rspH(2.5) }}>
                <View style={{ marginBottom: rspH(1.4) }}>
                  <FormSelector
                    setSelectedEntry={setpublic_prompt2_q}
                    selectedId={public_prompt2_q_id}
                    setSelectedId={setpublic_prompt2_q_id}
                    blr_value={public_prompt2_q_blr && pup_blr}
                    setblr_value={setpublic_prompt2_q_blr}
                    title="Prompts"
                    placeholder={"Public Prompt Question 2"}
                    width={"100%"}
                    list={prompts_list}
                    search={false}
                    multiline={true}
                    selectedValue={public_prompt2_q[1]}
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
                        public_prompt2_a !== "" ? colors.white : "#F8F8F8",
                      borderColor:

                      public_prompt2_blr ?
                      public_prompt2_a.length < 2 ?
                      colors.error:
                      colors.blue
                      :
                        public_prompt2_a !== ""
                          ? colors.blue
                          : colors.grey,
                      textAlignVertical: "top",
                      paddingTop: rspH(1.4),  
                    }}
                    value={public_prompt2_a}
                    onChangeText={(val) => {
                      setpublic_prompt2_a(val);
                    }}
                    editable={!public_prompt2_q == ""}
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
                public_prompt1_q == "" ||
                public_prompt1_a.length < 3 ||
                public_prompt2_q == "" ||
                public_prompt2_a.length < 3
              }
              onPress={onNextPress}
            />
          </FormWrapperFooter>
        </FormWrapper>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default PublicPrompts;

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
