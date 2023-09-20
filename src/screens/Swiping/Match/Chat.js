import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  BackHandler,
  AppState,
} from "react-native";
import React, {
  useState,
  useLayoutEffect,
  useEffect,
  useRef,
  useContext,
} from "react";
import moment from "moment";
import ETIcon from "react-native-vector-icons/Entypo";
import Ionicon from "react-native-vector-icons/Ionicons";

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

import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
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
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";
import _ from "lodash";
import {
  setChatMsgs,
  setDraftMsgs,
  setIceBreakers,
} from "../../../store/reducers/chats/chats";

const ChatItem = ({
  item,
  index,
  msg,
  replySet,
  setreplySet,
  setactreplyID,
  rply_item_indx,
  setrply_item_indx,
  chatlist,
  setchatlist,
  scrollViewRef,
  profile,
  dispatch,
}) => {
  const vibtr = async () => {
    // await Vibration.vibrate(50);
    await setactreplyID(item[4]);
    await setreplySet(true);
  };

  const animation = useSharedValue(0);

  const canRply = useSharedValue(false);

  const checkCanReply = () => {
    if (item[4] == null) {
      canRply.value = false;
    } else {
      canRply.value = true;
    }
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      runOnJS(checkCanReply)();
      ctx.startX = animation.value;
    },
    onActive: (event, ctx) => {
      if (
        canRply.value &&
        event.translationX > 0 &&
        ctx.startX + event.translationX <= 60
      ) {
        animation.value = ctx.startX + event.translationX;
      }
    },

    onEnd: (event, ctx) => {
      if (animation.value < 40) {
        animation.value = withTiming(0);
      }
      if (animation.value >= 40) {
        runOnJS(vibtr)();
        animation.value = withTiming(0);
      }
    },
  });
  const boxRef = useRef();

  let c_time = "07:00";

  c_time = moment(item[2]).format("LT").padStart(8, "0");

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: animation.value }],
    };
  });

  const animatedIconLeft = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animation.value, [0, 50], [0, 1]),
      transform: [{ translateX: animation.value }],
    };
  });

  const animation2 = useSharedValue(1);
  const fadeIn = async () => {
    animation2.value = withDelay(
      500,
      withTiming(100, {
        duration: 2000,
      })
    );
  };

  const animatedBox = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animation2.value, [0, 100], [1, 0]),
    };
  });

  let btmMarg =
    index == 0 ? 1.6 : chatlist[index - 1][1] == chatlist[index][1] ? 0.5 : 1.6;

  return (
    <View
      style={{
        flex: 1,
        position: "relative",

        // marginBottom: rspH(2.35) ,
        marginBottom: rspH(btmMarg),
      }}
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            height: 20,
            width: 40,
            left: -40,
            zIndex: 100,
            height: "100%",
            justifyContent: "center",
          },
          animatedIconLeft,
        ]}
      >
        <View
          style={{
            alignSelf: "center",
            backgroundColor: colors.grey,
            padding: 4,
            alignItems: "center",
            borderRadius: 40,
            height: 30,
            width: 30,
          }}
        >
          <ETIcon name="reply" size={20} color={"#fff"} />
        </View>
      </Animated.View>

      <PanGestureHandler
        onGestureEvent={gestureHandler}
        activeOffsetX={[-5, 5]}
      >
        <Animated.View
          ref={boxRef}
          style={[
            {
              ...styles.chatCont,
              flexDirection: "column",
              zIndex: 1,
              backgroundColor: item[1] == 1 ? colors.blue : "#F5F5F5",
              alignSelf: item[1] == 0 ? "flex-start" : "flex-end",
              position: "relative",
            },
            animatedStyle,
          ]}
        >
          {item[5] != null && (
            <TouchableOpacity
              onPress={() => {
                let rply_itm = chatlist.find((v) => v[4] == item[5]);

                let rply_itm_indx = chatlist.indexOf(rply_itm);
                setrply_item_indx(rply_itm_indx);
                let tmp_lis = [...chatlist];
                setchatlist(tmp_lis);

                scrollViewRef.current.scrollToIndex({
                  index: rply_itm_indx,
                  animated: true,
                });
              }}
              style={{
                backgroundColor: item[1] == 0 ? "#e6e8eb" : "#4986CA",

                borderLeftColor: "#000",
                paddingVertical: rspH(1.2),
                // paddingHorizontal: rspW(5.8),
                paddingHorizontal: rspW(3.8),

                marginBottom: rspH(1.2),
                maxWidth: rspW(52),
                borderRadius: rspW(3),
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  borderLeftWidth: rspW(0.6),
                  paddingHorizontal: rspF(1.6),
                }}
              >
                <Text
                  style={{
                    ...styles.rpyMsgHead,
                    color: item[1] == 0 ? colors.black : colors.white,
                  }}
                >
                  {chatlist.find((v) => v[4] == item[5])[1] == "1"
                    ? "You"
                    : profile.userprofile.name}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    ...styles.rpyMsgPara,
                    color: item[1] == 0 ? colors.black : colors.white,
                  }}
                >
                  {chatlist.find((v) => v[4] == item[5])[0]}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          <View
            style={{
              flexDirection: "column",
              // flexDirection: "row",
              zIndex: 2,
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
            {/* {item[5] == null && (
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
            )} */}
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

          {/* {item[5] && ( */}
          <View
            style={{
              // backgroundColor:'red',
              paddingTop: rspH(1),
              marginRight: rspW(-2.7),
              // marginBottom: rspH(-1.5),
              paddingLeft: rspW(2),
              // justifyContent: "flex-end",
              zIndex: 2,
            }}
          >
            <View
              style={{
                marginBottom: rspH(-1.3),
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
          </View>
          {/* )} */}
        </Animated.View>
      </PanGestureHandler>

      {index === rply_item_indx && (
        <Animated.View
          onLayout={() => {
            fadeIn().then(() => {
              setTimeout(() => {
                animation2.value = 0;
                setrply_item_indx(null);
                let tmp_lis = [...chatlist];
                setchatlist(tmp_lis);
              }, 1800);
            });
          }}
          style={[
            {
              paddingVertical: rspH(0.4),
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: "#2364aa4e",
            },
            animatedBox,
          ]}
        />
      )}
    </View>
  );
};

const Chat = ({ profile }) => {
  const chat_reveal_tut = useSelector(
    (state) => state.tutorial.chat_reveal_tut
  );
  const { sckop } = useContext(UserContext);

  const [replySet, setreplySet] = useState(false);
  const [actreplyID, setactreplyID] = useState(null);
  const access_token = useSelector(
    (state) => state.authentication.access_token
  );
  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );

  const is_network_connected = useSelector(
    (state) => state.authentication.is_network_connected
  );

  const chats_msgs = useSelector((state) => state.chats.chats_msgs);

  const drafts_msgs = useSelector((state) => state.chats.drafts_msgs);

  const icebreakers = useSelector((state) => state.chats.icebreakers);

  const [connectSocketS, setconnectSocketS] = useState(false);

  const [loading, setloading] = useState(false);
  const [show_rvl_tut, setshow_rvl_tut] = useState(false);

  const [inp_btp, setinp_btp] = useState(2);

  const scrollViewRef = useRef(null);
  const inBottom = useRef(true);

  const ws = useRef();
  const [SocketOpen, setSocketOpen] = useState(false);

  const navigation = useNavigation();

  const dispatch = useDispatch();

  const [chatlist, setchatlist] = useState([]);
  const chatlist_ref = useRef(null);
  const socket_con = useRef(null);
  const [chatlist_remain, setchatlist_remain] = useState([]);
  const [rply_item_indx, setrply_item_indx] = useState(null);

  const [chatPage, setchatPage] = useState(1);

  const [rvl_activate, setrvl_activate] = useState(false);
  const [rvl_time, setrvl_time] = useState(false);
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
          dispatch(setIceBreakers(active_ibs));
        }
      })
      .catch((err) => {
        // dispatch(setSessionExpired(true));
      });
  };

  const chatRvlTutDone = async () => {
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
        // dispatch(setSessionExpired(true));
      }
    } catch (error) {
      setloading(false);
      // dispatch(setSessionExpired(true));
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
        // dispatch(setSessionExpired(true));
      }
    } catch (error) {
      setloading(false);
      // dispatch(setSessionExpired(true));
      return false;
    }
  };

  const revealProfileTime = async () => {
    setloading(true);

    const api = apiUrl + "sendnotificationforprofilereveal/";

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    const data = {
      profileid1: profile_data.userprofile.id,
      profileid2: profile.userprofile.id,
    };

    console.log("data", data);

    try {
      const response = await axios.post(api, data, {
        headers,
      });
      setloading(false);

      let resp_data = response.data;

      console.log("revealProfileTime resp", response);
    } catch (error) {
      setloading(false);
      // dispatch(setSessionExpired(true));
      console.log("revealProfileTime error", error);
      return false;
    }
  };

  const getPrevChats = async (list = []) => {
    // setloading(true);

    let url = apiUrl + "chat_history/" + profile.chat_id + "/";
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

          let tmp_2 = [];
          for (let i = 0; i < resp_data.length; i++) {
            const ele = resp_data[i];
            let turn = ele.sender == profile_data.user.id ? 1 : 0;
            let day_tmp = moment(new Date(ele.timestamp))
              .calendar()
              .split(" at")[0]
              .trim();
            let sitm = [
              ele.content,
              turn,
              ele.timestamp,
              ele.sender,
              ele.id,
              ele.reply_msg_id != null ? ele.reply_msg_id : null,
              day_tmp,
              "",
              profile.chat_id,
            ];

            tmp_lis.push(sitm);
          }

          for (const itm of [...tmp_lis].reverse()) {
            if (!tmp_2.includes(itm[6])) {
              tmp_2.push(itm[6]);
            } else {
              tmp_2.push("");
            }
          }

          let k = 0;
          for (const trw of [...tmp_2].reverse()) {
            tmp_lis[k][6] = trw;
            k += 1;
          }

          console.log("chats_msgs.length", chats_msgs.length);
          console.log("tmp_lis.length", tmp_lis.length);

          if (chats_msgs.length > tmp_lis.length) {
            let tmp = chats_msgs.filter((v) => v[8] == profile.chat_id);
            setchatlist(tmp);
            chatlist_ref.current = tmp;
          } else {
            setchatlist(tmp_lis);
            chatlist_ref.current = tmp_lis;
          }

          setconnectSocketS(true);
        }
      })
      .catch((err) => {
        console.log("getPrevChats err", err);
        setloading(false);
      });
  };

  const SeenMe = () => {
    let data = {
      message: null,
      sender: null,
      datetime: new Date(),
      chat_id: profile.chat_id,
      seen_by_user_id: profile_data.user.id,
      reply_msg_id: null,
    };

    ws.current.send(JSON.stringify(data));
  };

  const connectSocket = async () => {
    console.log("connectSocket Call");

    ws.current = new WebSocket(webSocketUrl + "chat/" + profile.chat_id);

    ws.current.onopen = (e) => {
      console.log("Open");
      socket_con.current = true;
      SeenMe();

      setSocketOpen(true);
      sckop.current = true;
      dispatch(setSocketClose(false));

      if (drafts_msgs.length > 0) {
        sentDraftMesg();
      }
    };

    ws.current.onclose = (e) => {
      console.log(Platform.OS, "Close");
      sckop.current = false;
      socket_con.current = false;
      setSocketOpen(false);
      dispatch(setSocketClose(true));
    };

    ws.current.onerror = (e) => {
      console.log("Error");
      dispatch(setSocketClose(true));
    };

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.sender != profile_data.user.id) {
        console.log(Platform.OS, "on message", data.sender);

        try {
          let day_tmp = moment(new Date(data.datetime))
            .calendar()
            .split(" at")[0]
            .trim();

          let day_t = !chatlist_ref.current.map((v) => v[6]).includes(day_tmp);
          setchatlist((prv) => [
            [
              data.message,
              0,
              data.datetime,
              data.sender,
              data.id,
              data.reply_msg_id,
              day_t ? day_tmp : "",
              "",
              profile.chat_id,
            ],
            ...prv,
          ]);

          chatlist_ref.current = [
            [
              data.message,
              0,
              data.datetime,
              data.sender,
              data.id,
              data.reply_msg_id,
              day_t ? day_tmp : "",
            ],
            ...chatlist_ref.current,
          ];
        } catch (error) {}
      } else {
        console.log(Platform.OS, " othe on message", data.sender);

        setchatlist_remain([data, ...chatlist_remain]);
      }
    };
  };

  const renderItem = ({ item, index }) => {
    return (
      <GestureHandlerRootView>
        {item[6] != "" && (
          <View
            style={{
              // minWidth: rspW(18.1),
              paddingHorizontal: rspW(2.5),
              paddingTop: rspH(1.1),
              paddingBottom: rspH(0.7),
              borderRadius: rspW(3.2),
              justifyContent: "center",
              alignSelf: "center",
              backgroundColor: "#CCCCCC",
              marginBottom: rspH(1.83),
              // marginBottom: rspH(1.5),
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
              {item[6]}
            </Text>
          </View>
        )}
        <ChatItem
          profile={profile}
          item={item}
          index={index}
          msg={msg}
          dispatch={dispatch}
          rply_item_indx={rply_item_indx}
          setrply_item_indx={setrply_item_indx}
          scrollViewRef={scrollViewRef}
          replySet={replySet}
          setreplySet={setreplySet}
          setactreplyID={setactreplyID}
          chatlist={chatlist}
          setchatlist={setchatlist}
        />
      </GestureHandlerRootView>
    );
  };

  useEffect(() => {
    if (chatlist.length > 0) {
      console.log("chatlist 0", chatlist[0]);
      dispatch(setChatMsgs(chatlist));
    }
  }, [chatlist]);

  useEffect(() => {
    if (connectSocketS) {
      connectSocket();
    }

    return () => {
      if (connectSocketS) {
        if (ws.current.readyState == 1) {
          console.log("useEffect Close");
          ws.current.close();
        }
      }
    };
  }, [connectSocketS]);

  useEffect(() => {
    if (socket_con.current == false) {
      connectSocket();
    }
  }, [socket_con.current]);

  const sentDraftMesg = () => {
    for (let l = 0; l < drafts_msgs.length; l++) {
      const et = drafts_msgs[l];
      ws.current.send(JSON.stringify(et));
    }

    dispatch(setDraftMsgs([]));
  };

  useEffect(() => {
    if (chatlist_remain.length > 0) {
      let draft_msgs_tmp = [...drafts_msgs];

      for (let p = 0; p < chatlist_remain.length; p++) {
        const msg_itm = chatlist_remain[p];
        draft_msgs_tmp = draft_msgs_tmp.filter(
          (v) => v.unique_id != msg_itm.unique_id
        );
      }
      dispatch(setDraftMsgs(draft_msgs_tmp));

      let frm = [];
      for (let t = 0; t < chatlist_remain.length; t++) {
        const ele = chatlist_remain[t];
        let day_tmp = moment(new Date(ele.datetime))
          .calendar()
          .split(" at")[0]
          .trim();

        let day_t = !chatlist.map((v) => v[6]).includes(day_tmp);

        let itm = [
          ele.message,
          1,
          ele.datetime,
          ele.sender,
          ele.id,
          ele.reply_msg_id,
          day_t ? day_tmp : "",
          ele.unique_id,
        ];
        frm.unshift(itm);
      }

      let tmp = _.cloneDeep(chatlist);

      let tmpR = tmp.reverse();

      for (const itm of frm) {
        let indx = tmp.map((v) => String(itm)).indexOf(String(itm), -1);
        tmpR[indx][4] = itm[4];
      }
      let tmp3 = tmpR.reverse();

      setchatlist(tmp3);

      chatlist_ref.current = tmp;
    }
  }, [chatlist_remain]);

  useEffect(() => {
    if (chatlist.length >= 25 && !profile.prof_rvl && !rvl_activate) {
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

        if (tmpl3.length > 0) {
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
    }
  }, [chatlist]);

  useEffect(() => {
    // console.log("rvl_activate",rvl_activate)
    if (rvl_activate) {
      setrvl_time(true);
      // revealProfileTime()
    }
  }, [rvl_activate]);

  useLayoutEffect(() => {
    if (profile.matchType == "New Match") {
      setmsg("Hi!");
    }
  }, []);

  useLayoutEffect(() => {
    if (is_network_connected) {
      getIceBreaker();
    } else {
      seticebreaker_list(icebreakers);
    }
  }, []);

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

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        AppState.currentState = "background";
        Keyboard.dismiss();
        return true;
      }
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    // dispatch(setDraftMsgs([]))
    // dispatch(setChatMsgs([]))
    console.log("profile", profile.chat_id);

    let tmp = chats_msgs.filter((v) => v[8] == profile.chat_id);
    console.log("tmp[0]", tmp[0], tmp.length);

    console.log("is_network_connected", is_network_connected);

    if (!is_network_connected && tmp.length > 0) {
      setchatlist(tmp);
    }

    if (is_network_connected && drafts_msgs.length > 0) {
      connectSocket();
    }
  }, [is_network_connected]);

  useLayoutEffect(() => {
    if (is_network_connected) {
      getPrevChats(chatlist);
    }
  }, []);

  return (
    <>
      {loading && <Loader />}
      <SafeAreaView style={{ height: scrn_height, backgroundColor: "#fff" }}>
        <KeyboardAvoidingView
          style={{
            flex: 1,
            backgroundColor: "#fff",
            justifyContent: "flex-start",
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
                              revealProfile();
                            }
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

          <FlashList
            keyboardDismissMode="interactive"
            estimatedItemSize={10}
            data={chatlist}
            contentContainerStyle={{
              paddingHorizontal: rspW(6.2),
              flexDirection: "column-reverse",
            }}
            ref={scrollViewRef}
            inverted
            keyboardShouldPersistTaps={
              Platform.OS == "android" ? "always" : "never"
            }
            onContentSizeChange={() => {
              let lastMsg = chatlist[0];
              let sender = "";
              if (lastMsg) {
                sender = lastMsg[3];
                let login_user = profile_data.user.id;

                if (login_user === sender) {
                  scrollViewRef.current.scrollToIndex({
                    index: 0,
                    animated: false,
                  });
                }
              }
            }}
            renderItem={renderItem}
            keyExtractor={(_, index) => index}
            bounces={false}
          />

          <View
            style={{
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
                borderColor: colors.grey,
                borderRadius: rspW(3.2),
                borderWidth: 1,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {replySet && actreplyID && (
                <View
                  style={{
                    backgroundColor:
                      chatlist.find((v) => v[4] == actreplyID)[1] == 0
                        ? "#e6e8eb"
                        : "#4986CA",
                    borderLeftWidth: rspW(1),
                    borderLeftColor: "#000",
                    paddingVertical: rspH(1.2),
                    paddingHorizontal: rspW(5.8),
                    marginTop: 10,
                    width: rspW(90),
                    borderRadius: rspW(2),
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ width: "96%" }}>
                    <Text
                      style={{
                        color:
                          chatlist.find((v) => v[4] == actreplyID)[1] == 0
                            ? colors.black
                            : colors.white,
                        fontWeight: "600",
                      }}
                    >
                      {chatlist.find((v) => v[4] == actreplyID)[1] == "1"
                        ? "You"
                        : profile.userprofile.name}
                    </Text>
                    <View style={{}}>
                      <Text
                        style={{
                          color:
                            chatlist.find((v) => v[4] == actreplyID)[1] == 0
                              ? colors.black
                              : colors.white,
                        }}
                      >
                        {truncateStr(
                          chatlist.find((v) => v[4] == actreplyID)[0],
                          120
                        )}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      setreplySet(false);
                      setactreplyID(null);
                    }}
                  >
                    <Ionicon
                      name="close"
                      size={20}
                      color={
                        chatlist.find((v) => v[4] == actreplyID)[1] == 0
                          ? colors.black
                          : colors.white
                      }
                    />
                  </TouchableOpacity>
                </View>
              )}

              <View
                style={{
                  ...styles.messageInputCont,
                  paddingVertical: rspH(Platform.OS == "ios" ? 1 : 0),
                }}
              >
                <AutoGrowingTextInput
                  placeholder="Enter Message Here..."
                  placeholderTextColor={"#7b7b7b"}
                  keyboardType="default"
                  style={styles.messageInput}
                  value={msg}
                  onChangeText={(val) => {
                    setmsg(val);
                  }}
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

                        let ung_id = Math.random().toString(36).slice(2);

                        let day_tmp = moment(new Date())
                          .calendar()
                          .split(" at")[0]
                          .trim();

                        let day_t = !chatlist
                          .map((v) => v[6])
                          .includes(day_tmp);

                        let tmp_lis = [...chatlist];
                        let nitm = [
                          msg.replace(/\s+/g, " ").trim(),
                          1,
                          new Date(),
                          profile_data.user.id,
                          null,
                          actreplyID != null ? actreplyID : null,
                          day_t ? day_tmp : "",
                          ung_id,
                          profile.chat_id,
                        ];
                        console.log("nitm", nitm);
                        tmp_lis.unshift(nitm);

                        setchatlist(tmp_lis);

                        chatlist_ref.current = tmp_lis;
                        setreplySet(false);

                        let data = {
                          message: msg.replace(/\s+/g, " ").trim(),
                          sender: profile_data.user.id,
                          datetime: new Date(),
                          chat_id: profile.chat_id,
                          seen_by_user_id: null,
                          reply_msg_id: actreplyID != null ? actreplyID : null,
                          unique_id: ung_id,
                        };

                        let all_drafts_msgs = [...drafts_msgs];

                        all_drafts_msgs.push(data);

                        dispatch(setDraftMsgs(all_drafts_msgs));
                        if (SocketOpen) {
                          ws.current.send(JSON.stringify(data));
                        }

                        setmsg("");
                        setactreplyID(null);
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
    borderRadius: rspW(5.1),
    borderRadius: rspW(2),
    marginHorizontal: rspW(4),
  },
  chatMsgTxt: {
    fontSize: rspF(1.8),
    fontFamily: fontFamily.medium,
    lineHeight: rspF(2.1),
    // minWidth: rspW(10),
    minWidth: rspW(12),
    maxWidth: rspW(45),
    letterSpacing: Platform.OS == "ios" ? 0 : 0.5,
  },
  rpyMsgHead: {
    fontSize: rspF(1.7),
    fontFamily: fontFamily.bold,
    lineHeight: rspF(2),
    color: colors.black,
  },

  rpyMsgPara: {
    fontSize: rspF(1.5),
    fontFamily: fontFamily.bold,
    lineHeight: rspF(1.8),

    color: colors.black,
  },
  chatTimeTxt: {
    fontSize: rspF(1.302),
    fontFamily: fontFamily.regular,
    lineHeight: rspF(1.31),
  },
  messageInputArea: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: rspH(1.2),
  },
  iceBreakerCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    alignItems: "center",
    justifyContent: "center",
  },

  profilePhotoHighCont: {
    top: rspH(Platform.OS == "ios" ? 5.6 : 0.3),
    right: rspW(3),
    width: rspW(16),
    height: rspW(16),
    borderRadius: rspW(8.1),
  },
});
