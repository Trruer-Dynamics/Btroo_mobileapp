import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  Platform,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";

import {
  rspH,
  rspW,
  rspF,
  scrn_height,
  scrn_width,
} from "../../../styles/responsiveSize";
import colors from "../../../styles/colors";
import fontFamily from "../../../styles/fontFamily";
import IceBreaker from "../../../components/screenComponents/matching/IceBreaker";
import FullModal from "../../../components/modals/FullModal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FormHeader from "../../../components/wrappers/formWrappers/FormHeader";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import {
  setChatTut,
  setMatchTut,
} from "../../../store/reducers/tutorial/tutorial";
import axios from "axios";
import { apiUrl } from "../../../constants";
import Loader from "../../../components/loader/Loader";
import { setSessionExpired } from "../../../store/reducers/authentication/authentication";

const ChatItem = (item) => {
  return (
    <View
      style={{
        ...styles.chatCont,
        zIndex: 3,
        backgroundColor: item[1] == 1 ? colors.blue : colors.grey + "39",
        alignSelf: item[1] == 0 ? "flex-start" : "flex-end",
      }}
    >
      <Text
        style={{
          ...styles.chatMsgTxt,
          color: item[1] == 0 ? colors.black : colors.white,
        }}
      >
        {item[0]}
      </Text>
      <View
        style={{
          position: "absolute",
          bottom: rspH(0.6),
          right: rspW(2.5),
          zIndex: 2,
        }}
      >
        <Text
          style={{
            ...styles.chatTimeTxt,
            textAlign: "right",
            color: item[1] == 0 ? colors.black : colors.white,
          }}
        >
          7:00
        </Text>
      </View>
      {item[1] == 0 ? (
        <View
          style={{
            position: "absolute",
            zIndex: 1,
            bottom: 0.5,
            left: rspW(-4.8),
          }}
        >
          <Image
            source={require("../../../assets/images/Matching/Message/LeftCut.png")}
            style={{
              width: rspW(10.24),
              height: rspH(3.7),
              zIndex: 1,
            }}
          />
        </View>
      ) : (
        <View
          style={{
            position: "absolute",
            zIndex: 1,
            bottom: 0,
            right: rspW(-5),
          }}
        >
          <Image
            source={require("../../../assets/images/Matching/Message/RightCut.png")}
            style={{
              width: rspW(10.3),
              height: rspH(3.6),

              zIndex: 1,
              // tintColor: 'red',
            }}
          />
        </View>
      )}
    </View>
  );
};

const ChatTut = ({ profile }) => {
  const navigation = useNavigation();
  const [chatlist, setchatlist] = useState([]);

  const [chat_instruction_list, setchat_instruction_list] = useState([
    "Click on your match's \nname to see their profile. If you want to add more time \nto the conversation, click \non the timer on the  \nmatch’s profile.",
    "We have provided you \nsome conversation \nstarters and boosters to \nkeep the conversation \nalive, just in case you need \nsome help.",
    "Once you and your match \nknow each other better \nyou will be able to present \nyour full self to them.",
    "When the button changes \nto this one it means that \nyou can reveal yourself to \nyour match. The full \nprofile will be visible for you two only after you \nBOTH click here.",
  ]);

  const [chat_step, setchat_step] = useState(0);

  const chat_tut = useSelector((state) => state.tutorial.chat_tut);

  const dispatch = useDispatch();
  const [msg, setmsg] = useState("");

  const [modalVisible, setmodalVisible] = useState(false);
  const [icebreaker, seticebreaker] = useState("");

  const access_token = useSelector(
    (state) => state.authentication.access_token
  );
  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );

  const [loading, setloading] = useState(false);

  const chatTutDone = async () => {
    setloading(true);
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    const data = {
      user_id: profile_data.user.id,
    };

    try {
      const response = await axios.post(
        apiUrl + "chatting_tutorial_view/",
        data,
        {
          headers,
        }
      );
      setloading(false);

      let resp_data = response.data;

      if (resp_data.code == 200) {
        dispatch(setChatTut(false));
      } else if (resp_data.code == 401) {
        dispatch(setSessionExpired(true));
      }
    } catch (error) {
      setloading(false);
      dispatch(setSessionExpired(true));
      console.log("chatTutDone error", error);
      Alert.alert("Error", `chatTutDone Something Went Wrong`);
      return false;
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <>
        {index == 0 && (
          <View
            style={{
              width: rspW(18.1),
              height: rspH(2.8),
              borderRadius: rspW(3.2),
              justifyContent: "center",
              alignSelf: "center",
              backgroundColor: "#CCCCCC",
              marginBottom: rspH(1.83),
            }}
          >
            <Text
              style={{
                textAlign: "center",
                lineHeight: rspF(1.31),
                fontFamily: fontFamily.bold,
                fontSize: rspF(1.302),
                color: colors.black,
              }}
            >
              Today
            </Text>
          </View>
        )}
        <ChatItem {...item} />
      </>
    );
  };

  return (
    <>
      {loading && <Loader />}
      <SafeAreaView style={{ height: scrn_height, backgroundColor: "#FFF" }}>
        <SafeAreaView
          style={{
            height: Platform.OS == "ios" ? scrn_height - rspH(10) : scrn_height,
            // paddingVertical: rspW(2.5),
          }}
        >
          <View style={{ paddingHorizontal: rspW(5), paddingTop: rspH(2) }}>
            <FormHeader
              title="Jessica"
              left_icon={true}
              onPress={() => {
                navigation.goBack();
              }}
              rightComp={() => {
                return (
                  <TouchableOpacity
                    style={{ position: "absolute", right: 0, top: rspH(-1) }}
                    onPress={() => {
                      navigation.navigate("MatchProfile", {
                        profile: profile,
                      });
                    }}
                  >
                    <Image
                      source={require("../../../assets/images/Matching/PhotoReveal/MalePhotoRevalStage1.png")}
                      style={styles.profilePhoto}
                    />
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          <View style={{ ...styles.chatMsgArea }}>
            <FlatList
              data={chatlist}
              renderItem={renderItem}
              keyExtractor={(_, index) => index}
              bounces={false}
            />
          </View>
        </SafeAreaView>

        <View
          style={{
            position: "absolute",
            top: rspH(85.8),
            alignSelf: "center",
          }}
        >
          <View
            style={{
              height: rspH(13),

              // flex: 1,

              paddingBottom: rspH(1),

              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Messsage Input Area */}
            <View style={styles.messageInputArea}>
              {/* Icebraker Container */}
              <TouchableOpacity
                style={styles.iceBreakerCont}
                onPress={() => setmodalVisible(true)}
              >
                <Image
                  source={require("../../../assets/images/Matching/Message/Icebreaker.png")}
                  style={styles.iceBreakerImg}
                />
                <Text style={styles.iceBreakerTxt}>
                  Stuck with the conversation? Use this!
                </Text>
              </TouchableOpacity>
            </View>
            {/* Message Input Container */}

            <View
              style={{ ...styles.messageInputCont, borderColor: colors.grey }}
            >
              <TextInput
                style={styles.messageInput}
                value={msg}
                onChangeText={(val) => {
                  setmsg(val);
                }}
                placeholder="Enter Message Here..."
              />
              {msg == "" ? (
                <Image
                  source={require("../../../assets/images/Matching/Message/sendMsg.png")}
                  style={styles.sendBtn}
                  resizeMode="contain"
                />
              ) : (
                <TouchableOpacity>
                  <Image
                    source={require("../../../assets/images/Matching/Message/sendMsgActive.png")}
                    style={styles.sendBtn}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <FullModal
          modalVisible={modalVisible}
          setModalVisible={setmodalVisible}
        >
          <IceBreaker
            icebreaker={icebreaker}
            seticebreaker={seticebreaker}
            modalVisible={modalVisible}
            setModalVisible={setmodalVisible}
          />
        </FullModal>

        <>
          <View style={styles.mainTutCont}>
            <View style={styles.centralModalContMatch}>
              <View style={styles.centralModalTextCont}>
                <Text style={styles.centralModalText}>
                  {chat_instruction_list[chat_step]}
                </Text>
              </View>

              <View>
                <View
                  style={{
                    borderBottomColor: colors.grey,
                    borderBottomWidth: rspH(0.24),
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    if (chat_step < 3) {
                      setchat_step(chat_step + 1);
                    } else {
                      chatTutDone();
                    }
                  }}
                  style={{
                    ...styles.centralModalTextNextCont,
                    // marginVertical: chat_step == 3 ? 0 : 12,
                  }}
                >
                  <Text style={styles.centralModalTextNext}>
                    {chat_step > 2
                      ? chat_step == 3
                        ? "Let's Start!"
                        : "Ok"
                      : "Next"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {chat_step == 0 && (
            <View style={{ ...styles.highCont, ...styles.nameHighCont }}>
              <Text
                style={{
                  ...styles.nameDoneTxt,
                  color: colors.black,
                }}
              >
                Jessica
              </Text>
            </View>
          )}

          {chat_step == 1 && (
            <View
              style={{
                ...styles.iceBreakerHighCont,
                ...styles.highCont,
                ...styles.iceBreakerCont,
              }}
              onPress={() => setmodalVisible(true)}
            >
              <Image
                source={require("../../../assets/images/Matching/Message/Icebreaker.png")}
                style={styles.iceBreakerImg}
              />
              <Text style={styles.iceBreakerTxt}>
                Stuck with the conversation? Use this!
              </Text>
            </View>
          )}

          {chat_step == 2 && (
            <View
              style={{ ...styles.profilePhotoHighCont, ...styles.highCont }}
              onPress={() => setmodalVisible(true)}
            >
              <Image
                source={require("../../../assets/images/Matching/PhotoReveal/MalePhotoRevalStage1.png")}
                style={styles.profilePhoto}
              />
            </View>
          )}

          {chat_step == 3 && (
            <View
              style={{ ...styles.profilePhotoHighCont, ...styles.highCont }}
              onPress={() => setmodalVisible(true)}
            >
              <Image
                source={require("../../../assets/images/Matching/PhotoReveal/MalePhotoRevalStage2.png")}
                style={styles.profilePhoto}
              />
            </View>
          )}
          {chat_step == 4 && (
            <View
              style={{ ...styles.profilePhotoHighCont, ...styles.highCont }}
              onPress={() => setmodalVisible(true)}
            >
              <Image
                source={require("../../../assets/images/Matching/PhotoReveal/MalePhotoRevalStage3.png")}
                style={styles.profilePhoto}
              />
            </View>
          )}
        </>
      </SafeAreaView>
    </>
  );
};

export default ChatTut;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: scrn_height,
  },
  chatMsgArea: {
    paddingHorizontal: rspW(6.2),
    // flex: 1,
    // width: rspW(100),
    height: rspH(Platform.OS == "ios" ? 70 : 75),
    backgroundColor: "#fff",
  },
  chatCont: {
    width: scrn_width / 1.8,
    // width: scrn_width ,
    // backgroundColor:'green',
    paddingVertical: rspH(1.9),
    paddingHorizontal: rspW(2.4),
    marginBottom: rspH(2.35),
    borderRadius: rspW(5.1),
    // marginHorizontal: rspW(6.2),
    marginHorizontal: rspW(4),

    position: "relative",
  },
  chatMsgTxt: {
    fontSize: rspF(2.02),
    fontFamily: fontFamily.medium,
    lineHeight: rspF(2.1),
  },
  chatTimeTxt: {
    fontSize: rspF(1.302),
    fontFamily: fontFamily.regular,
    lineHeight: rspF(1.31),
  },
  messageInputArea: {
    // backgroundColor: 'lightblue',
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: rspH(1.2),
    // paddingHorizontal: rspW(3.2),
  },
  iceBreakerCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor:'red',
    // width: scrn_width - rspW(10),
  },
  iceBreakerImg: {
    width: rspW(6.6),
    height: rspH(3.22),
    marginRight: rspW(1.85),
  },
  iceBreakerTxt: {
    fontFamily: fontFamily.bold,
    lineHeight: rspF(2.18),
    // fontSize: rspF(2.02),
    fontSize: rspF(Platform.OS == "ios" ? 2.02 : 1.9),
    color: colors.blue,
    textAlign: "center",
  },

  messageInputCont: {
    height: rspH(6),

    paddingHorizontal: rspW(2.4),
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: rspW(3.2),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  messageInput: {
    // color: colors.black,
    // width: scrn_width / 1.24,

    // fontFamily: fontFamily.bold,
    // lineHeight: 16.84,
    // fontSize: rspF(2.02),

    color: colors.black,
    width: scrn_width / 1.28,

    fontFamily: fontFamily.bold,
    fontSize: rspF(2.02),
    lineHeight: rspF(2.1),
    // backgroundColor:'red',
  },
  sendBtn: {
    width: rspW(7.64),
    height: rspH(3.7),
  },
  profilePhoto: {
    marginTop: rspH(0.4),
    width: rspW(12.56),
    height: rspH(Platform.OS == "ios" ? 5.5 : 5.9),
    resizeMode: "contain",
  },

  // Tutorial Main Container
  mainTutCont: {
    position: "absolute",
    backgroundColor: "#0000006f",
    top: 0,
    height: scrn_height,
    width: scrn_width,
  },

  centralModalTextCont: {
    marginTop: rspH(3),
  },
  centralModalText: {
    fontSize: rspF(Platform.OS == "ios" ? 2.485 : 2.5),
    lineHeight: rspF(Platform.OS == "ios" ? 3.56 : 2.98),
    fontFamily: fontFamily.bold,
    color: colors.black,
  },

  centralModalTextNextCont: {
    justifyContent: "center",
    marginHorizontal: rspW(3.1),
    paddingHorizontal: 13.2,
    marginVertical: rspH(1.4),
    height: rspH(4.6),
    width: rspW(69.6),
    letterSpacing: 1,
  },

  centralModalTextNext: {
    fontSize: rspF(2.02),
    lineHeight: rspF(2.1),
    fontFamily: fontFamily.bold,
    color: colors.blue,
    letterSpacing: 1,
  },

  // Match Chat Tut
  centralModalContMatch: {
    position: "absolute",
    height: rspH(36),
    width: rspW(87),
    borderRadius: rspW(4),
    backgroundColor: colors.white,
    top: rspH(42),
    alignSelf: "center",
    paddingHorizontal: rspW(7.4),
    justifyContent: "space-between",
  },

  // Match Chat
  highCont: {
    position: "absolute",
    backgroundColor: colors.white,
    // +33
    alignItems: "center",
    justifyContent: "center",
  },
  timeHighCont: {
    top: rspH(19.4),
    right: rspW(12),
    width: rspW(22.2),
    height: rspH(2.75),
    borderRadius: 11,
  },
  timeDoneTxt: {
    fontSize: rspF(1.3),
    lineHeight: rspF(1.31),
    fontFamily: fontFamily.light,
  },
  nameHighCont: {
    top: rspH(Platform.OS == "ios" ? 7.7 : 2.4),
    left: rspW(32),
    width: rspW(36),
    height: rspH(3.8),
    // opacity:0.32,
    alignItems: "center",
    borderRadius: rspW(4),
  },
  nameDoneTxt: {
    fontFamily: fontFamily.bold,
    fontSize: rspF(2.7),
    color: colors.black,
    lineHeight: rspF(2.65),
  },

  iceBreakerHighCont: {
    // bottom: rspH(Platform.OS == 'ios' ? 13 : 9.5),
    top: rspH(87),

    alignSelf: "center",
    // opacity: 0.3,
    // left: rspW(2.5),

    width: rspW(94),
    height: rspH(3.6),
    borderRadius: rspW(7),
  },

  profilePhotoHighCont: {
    top: rspH(Platform.OS == "ios" ? 5.6 : 0.3),
    right: rspW(3),
    width: rspW(16),
    height: rspW(16),
    borderRadius: rspW(8.1),

    // opacity: 0.3,
  },
});
