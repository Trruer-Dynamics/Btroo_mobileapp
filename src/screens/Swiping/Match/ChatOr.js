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
  Keyboard,
  KeyboardAvoidingView,
  BackHandler,
  AppState,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, {
  useState,
  useLayoutEffect,
  useEffect,
  useRef,
  useContext,
} from "react";
import moment from "moment";

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

import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { apiUrl, webSocketUrl } from "../../../constants";

import { useStateWithCallbackLazy } from "use-state-with-callback";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { setChatRevealTut } from "../../../store/reducers/tutorial/tutorial";
import Loader from "../../../components/loader/Loader";
import { UserContext } from "../../../context/user";
import FormHeaderChat from "../../../components/wrappers/formWrappers/FormHeaderChat";
import AutoGrowingTextInput from "react-native-autogrow-textinput-ts";
import { useFocusEffect } from "@react-navigation/native";
import truncateStr from "../../../components/functions/truncateStr";
import {
  setSessionExpired,
  setSocketClose,
} from "../../../store/reducers/authentication/authentication";
import FormHeaderChatN from "../../../components/wrappers/formWrappers/FormHeaderChatN";

const ChatItem = ({ item, msg }) => {
  const boxRef = useRef();

  let c_time = "07:00";

  let prt_0 =
    Platform.OS == "ios"
      ? String(new Date(item[2]).toLocaleTimeString()).padStart(11, "0")
      : String(new Date(item[2]).toLocaleTimeString());

  c_time = moment(item[2]).format("LT").padStart(8, "0");

  // if (Platform.OS == 'ios') {

  //   c_time = (prt_0.substring(0,2)) + prt_0.substring(2,5) +' '+ prt_0.substring(8)
  // }
  // else{
  //   let prt_1 = parseInt(prt_0.substring(0,2))
  //   let mprt_1 = prt_1 > 12 ? String(prt_1 - 12).padStart(2,"0") : String(prt_1).padStart(2,"0")
  //   let prt_2 = prt_0.substring(2,5)
  //   let prt_3 = parseInt(prt_0.substring(0,2)) > 12 ? 'PM':'AM'

  //   c_time = mprt_1+ prt_2+' '+prt_3

  // }

  return (
    <View
      ref={boxRef}
      style={{
        ...styles.chatCont,
        flexDirection: "row",
        zIndex: 1,
        backgroundColor: item[1] == 1 ? colors.blue : "#F5F5F5",
        // backgroundColor: item[1] == 1 ? colors.blue : colors.grey + '89',
        alignSelf: item[1] == 0 ? "flex-start" : "flex-end",

        position: "relative",
      }}
    >
      <Text
        style={{
          ...styles.chatMsgTxt,
          color: item[1] == 0 ? colors.black : colors.white,
        }}
      >
        {/* {msg} */}
        {item[0]}
      </Text>
      <View
        style={{
          marginRight: rspW(-3),
          marginBottom: rspH(-1.5),
          paddingLeft: rspW(2),
          justifyContent: "flex-end",
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
          {c_time}
        </Text>
      </View>

      {item[1] == 0 ? (
        <View
          style={{
            position: "absolute",
            zIndex: 3,
            bottom: 0,

            left: rspW(-4.8),
          }}
        >
          <Image
            source={require("../../../assets/images/Matching/Message/LeftCut2.png")}
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
            right: rspW(-4.8),
          }}
        >
          <Image
            source={require("../../../assets/images/Matching/Message/RightCut.png")}
            style={{
              width: rspW(10.3),
              height: rspH(3.6),
              zIndex: 2,
            }}
          />
        </View>
      )}
    </View>
  );
};

const Chat = ({ profile }) => {
  const chat_reveal_tut = useSelector(
    (state) => state.tutorial.chat_reveal_tut
  );

  const { sckop } = useContext(UserContext);

  const access_token = useSelector(
    (state) => state.authentication.access_token
  );
  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );

  const [connectSocketS, setconnectSocketS] = useState(false);

  const [loading, setloading] = useState(false);
  const [loading2, setloading2] = useState(false);
  const [show_rvl_tut, setshow_rvl_tut] = useState(false);

  const [inp_btp, setinp_btp] = useState(2);

  const scrollViewRef = useRef();

  const inBottom = useRef(true);

  const ws = useRef();
  const [SocketOpen, setSocketOpen] = useState(false);

  const navigation = useNavigation();

  const dispatch = useDispatch();

  const [chatlist, setchatlist] = useState([]);
  const [chatlist_scrll, setchatlist_scrll] = useState(true);

  const [chat_refresh, setchat_refresh] = useState(false);
  const [chatPage, setchatPage] = useState(1);

  const [rvl_activate, setrvl_activate] = useState(false);
  const [rvl_click, setrvl_click] = useState(false);
  const [msg, setmsg] = useState("");

  const [modalVisible, setmodalVisible] = useState(false);
  const [icebreaker, seticebreaker] = useState("");
  const [icebreaker_list, seticebreaker_list] = useState([]);

  const getIceBreaker = async () => {
    await axios
      .get(apiUrl + "getactiveicebreaker/")
      .then((resp) => {
        if (resp.status == 200) {
          let tmp = resp.data.data;

          let sorted_tmp = tmp.sort(function (a, b) {
            return a["position"] - b["position"];
          });

          let active_ibs = sorted_tmp
            .filter((c) => c.is_active == true)
            .map((v) => v.icebreaker);

          seticebreaker_list(active_ibs);
        } else {
          console.warn("Error occur while getting IceBreakers");
        }
      })
      .catch((err) => {
        dispatch(setSessionExpired(true));
        console.log("getIceBreaker err", err);
      });
  };

  const chatRvlTutDone = async () => {
    // setloading(true);
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    const data = {
      user_id: profile_data.user.id,
    };

    try {
      const response = await axios.post(
        apiUrl + "chatting_reveal_tutorial_view/",
        data,
        {
          headers,
        }
      );
      setloading(false);

      let resp_data = response.data;

      if (resp_data.code == 200) {
        setshow_rvl_tut(false);
        dispatch(setChatRevealTut(false));
      } else if (resp_data.code == 401) {
        dispatch(setSessionExpired(true));
      }
    } catch (error) {
      setloading(false);
      dispatch(setSessionExpired(true));
      console.log("error", error);
      Alert.alert("Error", `chatRvlTutDone Something Went Wrong`);
      return false;
    }
  };

  const revealProfile = async () => {
    setloading(true);

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    const data = {
      user_id: profile_data.user.id,
      chatroom_id: profile.id,
    };

    try {
      const response = await axios.post(apiUrl + "profile_reveal_api/", data, {
        headers,
      });
      setloading(false);

      let resp_data = response.data;
      if (resp_data.code == 200) {
        setrvl_click(true);
      } else if (resp_data.code == 401) {
        dispatch(setSessionExpired(true));
      }
    } catch (error) {
      setloading(false);
      dispatch(setSessionExpired(true));
      console.log("revealProfile error", error);
      Alert.alert("Error", `revealProfile Something Went Wrong`);
      return false;
    }
  };

  const getPrevChats = async (page, list = []) => {
    setloading(true);

    let url = apiUrl + "chat_history/" + profile.chat_id + "/";
    // '/?page='+ page
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    await axios
      .get(url, { headers })
      .then((resp) => {
        setloading(false);

        let resp_data = resp.data.data;
        let code = resp.data.code;

        if (code == 200) {
          let tmp_lis = [...list];
          // let rev_tmpl = [...list]
          for (let i = 0; i < resp_data.length; i++) {
            const ele = resp_data[i];

            let turn = ele.sender == profile_data.user.id ? 1 : 0;
            let sitm = [ele.content, turn, ele.timestamp, ele.sender];

            // if (page == 1) {
            tmp_lis.push(sitm);
            // }
            // else{

            // rev_tmpl.unshift(sitm)
            // }
          }

          setchatlist(tmp_lis.reverse());

          setconnectSocketS(true);
        }
      })
      .catch((err) => {
        setloading(false);

        dispatch(setSessionExpired(true));

        console.log("getPrevChats err", err);
      });
  };

  const SeenMe = () => {
    let data = {
      message: null,
      sender: null,
      datetime: new Date(),
      chat_id: profile.chat_id,
      seen_by_user_id: profile_data.user.id,
    };

    ws.current.send(JSON.stringify(data));
  };

  const connectSocket = () => {
    ws.current = new WebSocket(webSocketUrl + "chat/" + profile.chat_id);

    ws.current.onopen = (e) => {
      console.log("Open");

      SeenMe();
      setSocketOpen(true);
      sckop.current = true;
      dispatch(setSocketClose(false));
    };

    ws.current.onclose = (e) => {
      console.log("Close");
      sckop.current = false;

      setSocketOpen(false);
      dispatch(setSocketClose(true));
    };

    ws.current.onerror = (e) => {
      console.log("Error");
      dispatch(setSocketClose(true));
    };

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("on message server message data", data);

      if (data.sender != profile_data.user.id) {
        // SeenMe()
        setchatlist((prv) => [
          ...prv,
          [data.message, 0, data.datetime, data.sender],
        ]);
      }
    };
  };

  const scrollDownBtm = () => {
    if (chatlist.length > 0 && chatPage == 1) {
      try {
        scrollViewRef.current.scrollToEnd({ animated: true });
      } catch (error) {
        console.log("Error while boottom", error);
        alert("scrollDownBtm err");
      }
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <>
        {index == 0 && loading2 && <ActivityIndicator />}
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
        <ChatItem item={item} msg={msg} />
      </>
    );
  };

  useEffect(() => {
    if (connectSocketS) {
      connectSocket();
    }

    return () => {
      if (connectSocketS) {
        if (ws.current.readyState == 1) {
          ws.current.close();
        }
      }
    };
  }, [connectSocketS]);

  useEffect(() => {
    if (chatlist.length >= 25 && !profile.prof_rvl) {
      let mymsgs = chatlist.filter((v) => v[1] == 1);
      let othmsgs = chatlist.filter((v) => v[1] == 0);
      let mycount = mymsgs
        .map((v) => v[0])
        .flat()
        .join().length;
      let othcount = othmsgs
        .map((v) => v[0])
        .flat()
        .join().length;

      if (mycount >= 120 && othcount >= 120) {
        let tmpl = [];
        let turn = 0;
        for (let j = 0; j < chatlist.length; j++) {
          const ele = chatlist[j];

          if (ele[1] == turn) {
            tmpl.push(ele);
            turn = turn == 0 ? 1 : 0;
          } else {
            continue;
          }
        }

        let tmpl2 = tmpl[tmpl.length - 1][1] == 0 ? tmpl.slice(0, -1) : tmpl;
        tmp_11 = tmpl2.map((v) => v[2]);

        let tmpl3 = [];

        l = 0;
        for (const iter of tmp_11) {
          if ((l + 1) % 2 !== 0) {
            let t1 = new Date(tmp_11[l]);
            let t2 = new Date(tmp_11[l + 1]);
            let diff = Math.abs(t2 - t1);

            tmpl3.push(diff);
          }

          l = l + 1;
        }

        let total_time = new Date(tmpl3.reduce((a, b) => a + b)).getMinutes();
        let avg_time = total_time / chatlist.length;

        if (avg_time <= 5) {
          setrvl_activate(true);
          if (chat_reveal_tut == true) {
            Keyboard.dismiss();
            setshow_rvl_tut(true);
          }
        }
      }
    }
  }, [chatlist]);

  useLayoutEffect(() => {
    if (profile.matchType == "New Match") {
      setmsg("Hi!");
    }
    getPrevChats(chatPage, chatlist);
  }, []);

  useLayoutEffect(() => {
    getIceBreaker();
  }, []);

  useEffect(() => {
    if (show_rvl_tut == false && chatlist.length > 0) {
      scrollDownBtm();
    }

    // let words_count = chatlist.filter(g => g[3] == profile.user_id).map(v=> v[0]).flat().join(" ").split(' ').length
  }, [chatlist]);

  useLayoutEffect(() => {
    const kb_show = Keyboard.addListener("keyboardDidShow", () => {
      if (inBottom.current) {
        setinp_btp(6);
      }
    });

    const kb_hide = Keyboard.addListener("keyboardDidHide", () => {
      setinp_btp(2);
    });

    return () => {
      kb_show.remove();
      kb_hide.remove();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      scrollDownBtm();
    }, [])
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        AppState.currentState = "background";
        // BackHandler.exitApp();
        Keyboard.dismiss();
        return true;
      }
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <>
      {loading && <Loader />}
      <SafeAreaView style={{ height: scrn_height, backgroundColor: "#fff" }}>
        <KeyboardAvoidingView
          style={{
            flex: 1,
            backgroundColor: "#fff",
            // alignItems:'center',
            justifyContent: "flex-end",
          }}
          behavior="padding"
        >
          <View style={{ paddingHorizontal: rspW(5), paddingTop: rspH(2) }}>
            {profile.prof_rvl ? (
              <FormHeaderChat
                title={truncateStr(
                  profile?.userprofile?.name.split(" ")[0],
                  10
                )}
                image={profile?.prof_img}
                onImgPress={() => {
                  navigation.navigate("MatchProfile", {
                    profile: profile,
                  });
                }}
                onPress={() => {
                  navigation.navigate("Match");
                }}
                onHeaderPress={() => {
                  navigation.navigate("MatchProfile", {
                    profile: profile,
                  });
                }}
              />
            ) : (
              <FormHeaderChatN
                title={truncateStr(
                  profile?.userprofile?.name.split(" ")[0],
                  10
                )}
                left_icon={true}
                onPress={() => {
                  navigation.navigate("Match");
                }}
                onHeadPress={() => {
                  navigation.navigate("MatchProfile", {
                    profile: profile,
                  });
                }}
                rightComp={() => {
                  let rvl_img = require("../../../assets/images/Matching/PhotoReveal/MalePhotoRevalStage1.png");

                  if (profile?.userprofile?.gender == "Man") {
                    if (!rvl_click && rvl_activate) {
                      rvl_img = require("../../../assets/images/Matching/PhotoReveal/MalePhotoRevalStage2.png");
                    } else if (rvl_click) {
                      rvl_img = require("../../../assets/images/Matching/PhotoReveal/MalePhotoRevalStage3.png");
                    }
                  } else {
                    if (!rvl_click && rvl_activate) {
                      rvl_img = require("../../../assets/images/Matching/PhotoReveal/FemalePhotoRevalStage2.png");
                    } else if (rvl_click) {
                      rvl_img = require("../../../assets/images/Matching/PhotoReveal/FemalePhotoRevalStage3.png");
                    } else {
                      rvl_img = require("../../../assets/images/Matching/PhotoReveal/FemalePhotoRevalStage1.png");
                    }
                  }

                  return (
                    <>
                      {rvl_img && (
                        <TouchableOpacity
                          style={{
                            position: "absolute",
                            right: 0,
                            top: rspH(-1),
                          }}
                          onPress={() => {
                            if (rvl_click == false && rvl_activate) {
                              // setrvl_click(true)
                              revealProfile();
                            }
                            // else if (rvl_click) {

                            //   navigation.navigate("ProfileRevealed",{
                            //     profile: profile,
                            //   })
                            // }
                            // else{

                            //   // navigation.navigate('MatchProfile', {
                            //   //   profile: profile,
                            //   // });
                            // }
                          }}
                        >
                          <Image source={rvl_img} style={styles.profilePhoto} />
                        </TouchableOpacity>
                      )}
                    </>
                  );
                }}
              />
            )}
          </View>

          <FlatList
            // keyboardDismissMode='none'
            // scrollEnabled={chatlist_scrll}
            // onScroll={()=>{
            //   setchatlist_scrll(true)
            // }}
            keyboardShouldPersistTaps="always"
            ref={scrollViewRef}
            data={chatlist}
            style={{
              width: scrn_width,
              paddingHorizontal: rspW(6.2),
              // height: scrn_height/3,
              // backgroundColor:'red',
            }}
            renderItem={renderItem}
            keyExtractor={(_, index) => index}
            bounces={false}
            onContentSizeChange={() => scrollDownBtm()}
            onLayout={() => scrollDownBtm()}
          />

          <View
            style={{
              // height: rspH(13),

              // height: rspH(13),

              // flex: 1,

              paddingBottom: rspH(Platform.OS == "android" ? inp_btp : 1),

              justifyContent: "center",
              alignItems: "center",
            }}
          >
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

            <View
              style={{
                ...styles.messageInputCont,

                paddingVertical: rspH(Platform.OS == "ios" ? 1 : 0),

                borderColor: colors.grey,
              }}
            >
              <AutoGrowingTextInput
                placeholder="Enter Message Here..."
                keyboardType="default"
                style={styles.messageInput}
                value={msg}
                onChangeText={(val) => {
                  setmsg(val);
                }}
                // placeholderTextColor={'black'}

                maxHeight={rspH(12.5)}
              />
              {msg == "" ? (
                <Image
                  source={require("../../../assets/images/Matching/Message/sendMsg.png")}
                  style={styles.sendBtn}
                  resizeMode="contain"
                />
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    if (msg.length > 0) {
                      seticebreaker("");

                      let tmp_lis = [...chatlist];
                      tmp_lis.push([
                        msg.replace(/\s+/g, " ").trim(),
                        1,
                        new Date(),
                        profile_data.user.id,
                      ]);
                      setchatlist(tmp_lis);

                      let data = {
                        message: msg.replace(/\s+/g, " ").trim(),
                        sender: profile_data.user.id,
                        datetime: new Date(),
                        chat_id: profile.chat_id,
                        seen_by_user_id: null,
                      };

                      if (SocketOpen) {
                        ws.current.send(JSON.stringify(data));
                      }

                      setmsg("");
                    }
                  }}
                >
                  <Image
                    source={require("../../../assets/images/Matching/Message/sendMsgActive.png")}
                    style={styles.sendBtn}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <FullModal
            modalVisible={modalVisible}
            setModalVisible={setmodalVisible}
          >
            <IceBreaker
              icebreaker={icebreaker}
              seticebreaker={seticebreaker}
              icebreaker_list={icebreaker_list}
              setmsg={setmsg}
              modalVisible={modalVisible}
              setModalVisible={setmodalVisible}
            />
          </FullModal>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {show_rvl_tut && (
        <>
          <View style={styles.mainTutCont}>
            <View style={styles.centralModalContMatch}>
              <View style={styles.centralModalTextCont}>
                <Text style={styles.centralModalText}>
                  You can now reveal {"\n"}yourself to your match. {"\n"}The
                  full profile will be {"\n"}visible for you two only {"\n"}
                  after you BOTH click here.
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
                    chatRvlTutDone();
                  }}
                  style={{
                    ...styles.centralModalTextNextCont,
                  }}
                >
                  <Text style={styles.centralModalTextNext}>Ok</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View
            style={{ ...styles.profilePhotoHighCont, ...styles.highCont }}
            onPress={() => setmodalVisible(true)}
          >
            <Image
              source={require("../../../assets/images/Matching/PhotoReveal/MalePhotoRevalStage2.png")}
              style={styles.profilePhoto}
            />
          </View>
        </>
      )}
    </>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatMsgArea: {
    paddingHorizontal: rspW(6.2),
    height: rspH(Platform.OS == "ios" ? 70 : 75),
    backgroundColor: "#fff",
  },
  chatCont: {
    paddingVertical: rspH(1.9),
    paddingHorizontal: rspW(4),
    marginBottom: rspH(2.35),
    borderRadius: rspW(5.1),
    borderRadius: rspW(2),
    marginHorizontal: rspW(4),
  },
  chatMsgTxt: {
    fontSize: rspF(1.8),
    fontFamily: fontFamily.medium,
    lineHeight: rspF(2.1),
    minWidth: rspW(10),
    maxWidth: rspW(45),
    letterSpacing: Platform.OS == "ios" ? 0 : 0.5,
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
    fontSize: rspF(Platform.OS == "ios" ? 2.02 : 1.9),
    color: colors.blue,
    textAlign: "center",
    letterSpacing: Platform.OS == "ios" ? 0 : 1,
  },
  messageInputCont: {
    paddingHorizontal: rspW(2.4),
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: rspW(3.2),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  messageInput: {
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
    paddingHorizontal: rspW(6),
  },
  profilePhoto: {
    marginTop: rspH(0.4),
    width: rspW(12.56),
    height: rspH(Platform.OS == "ios" ? 5.5 : 5.9),
    resizeMode: "contain",
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

  // Match Chat
  highCont: {
    position: "absolute",
    backgroundColor: colors.white,
    // +33
    alignItems: "center",
    justifyContent: "center",
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
