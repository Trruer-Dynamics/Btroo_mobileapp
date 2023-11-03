import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  BackHandler,
  AppState,
  FlatList,
  LayoutAnimation,
} from "react-native";
import React, {
  useState,
  useLayoutEffect,
  useEffect,
  useRef,
  useContext,
  useCallback,
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
import truncateStr from "../../../components/functions/truncateStr";
import {
  setSessionExpired,
  setSocketClose,
} from "../../../store/reducers/authentication/authentication";
import FormHeaderChatN from "../../../components/wrappers/formWrappers/FormHeaderChatN";
import Animated, {
  Easing,
  Layout,
  SlideInDown,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";
import _ from "lodash";
import {
  setChatMsgs,
  setDraftMsgs,
  setIceBreakers,
} from "../../../store/reducers/chats/chats";
import FastImage from "react-native-fast-image";

// Chat Bubble item
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
  setrply_animation,
  dispatch,
}) => {
  // To set reply id
  const vibtr = async () => {
    // await Vibration.vibrate(50);
    await setactreplyID(item[4]);
    await setreplySet(true);
  };

  const animation = useSharedValue(0);

  const canRply = useSharedValue(false);

  // To check message is sent successfully and user able to reply
  const checkCanReply = () => {
    if (item[4] == null) {
      canRply.value = false;
    } else {
      canRply.value = true;
    }
  };

  // To handle reply feature animation
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
      if (animation.value < 38) {
        animation.value = withTiming(0);
      }
      if (animation.value >= 38) {
        runOnJS(vibtr)();
        animation.value = withTiming(0,{
          easing: Easing.linear
        });
      }
    },
  });
  const boxRef = useRef();

  // 24 hour format
  let c_time = moment(item[2]).format("HH:mm").padStart(5, "0");

  // 12 hour format
  // c_time = moment(item[2]).format("LT").padStart(8, "0");

  // Bubble Trasnslate styling
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: animation.value }],
    };
  });

  // reply icon visibilty styling
  const animatedIconLeft = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animation.value, [0, 50], [0, 1]),
      transform: [{ translateX: animation.value }],
    };
  });

  const animation2 = useSharedValue(1);

  // Fade Animation on reply item tab message
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
    <PanGestureHandler
        onGestureEvent={gestureHandler}
        activeOffsetX={[-5, 5]}
      >
    <Animated.View
      style={{
        flex: 1,
        position: "relative",
        backgroundColor:'red',
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

      
        <Animated.View
          ref={boxRef}
          style={[
            {
              ...styles.chatCont,
              flexDirection: "column",
              zIndex: 1,
            
              backgroundColor: item[1] == 1 ? colors.blue : "#F5F5F5",
              alignSelf: item[1] == 0 ? "flex-start" : "flex-end",
              // position: "relative",
            },
            animatedStyle,
          ]}
        >
          {/* If chat item type is reply */}
          {item[5] != null && (
            <TouchableOpacity
              onPress={() => {
                let rply_itm = chatlist.find((v) => v[4] == item[5]);

                let rply_itm_indx = chatlist.indexOf(rply_itm);
                setrply_item_indx(rply_itm_indx);
                let tmp_lis = [...chatlist];
                setchatlist(tmp_lis);
                setrply_animation(true);
                scrollViewRef.current.scrollToIndex({
                  index: rply_itm_indx,
                  animated: true,
                });
              }}
              style={{
                backgroundColor: item[1] == 0 ? "#e6e8eb" : "#4986CA",
                paddingVertical: rspH(1),
                marginTop: rspH(-0.5),
                marginHorizontal: rspW(-0.8),
                marginBottom: rspH(0.6),
                maxWidth: rspW(80),
                borderRadius: rspW(2),
                borderLeftWidth: rspW(1),
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  paddingHorizontal: rspF(1),
                }}
              >
                <Text
                  style={{
                    fontSize: rspF(1.8),
                    ...styles.rpyMsgHead,
                    color: item[1] == 0 ? colors.black : colors.white,
                    paddingBottom: rspH(0.2),
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
          </View>
          {item[1] == 0 ? (
            <View
              style={{
                position: "absolute",
                zIndex: -1,
                bottom: 0,
                left: rspW(-4.8),
              }}
            >
              <FastImage
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
                zIndex: -1,
                bottom: 0,
                right: rspW(-4.8),
              }}
            >
              <FastImage
                source={require("../../../assets/images/Matching/Message/RightCut.png")}
                style={{
                  width: rspW(10.3),
                  height: rspH(3.6),
                  zIndex: 2,
                }}
              />
            </View>
          )}

          <View
            style={{
              paddingTop: rspH(0.3),
              marginRight: rspW(0),
              paddingLeft: rspW(2),
              zIndex: 2,
            }}
          >
            <View
              style={{
                marginBottom: rspH(-1.3),
                marginBottom: rspH(-1),
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
        </Animated.View>


      {index === rply_item_indx && (
        <Animated.View
          onLayout={() => {
            fadeIn().then(() => {
              setTimeout(() => {
                animation2.value = 0;
                setrply_item_indx(null);
                let tmp_lis = [...chatlist];
                setchatlist(tmp_lis);
                setrply_animation(false);
              }, 1800);
            });
          }}
          style={[
            {
              paddingVertical: rspH(0.4),
              position: "absolute",
              left: rspW(-3.5),
              width: scrn_width * 0.95,
              height: "100%",
              backgroundColor: "#2364aa4e",
            },
            animatedBox,
          ]}
        />
      )}
    </Animated.View>
    </PanGestureHandler>
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
  const scrollViewRef2 = useRef(null);

  const inBottom = useRef(true);

  const ws = useRef();
  const [SocketOpen, setSocketOpen] = useState(false);

  const navigation = useNavigation();

  const dispatch = useDispatch();

  const [chatlist, setchatlist] = useState([]);
  const [scrollable, setscrollable] = useState(true);
  const chatlist_ref = useRef(null);
  const socket_con = useRef(null);
  const [chatlist_remain, setchatlist_remain] = useState([]);
  const [rply_item_indx, setrply_item_indx] = useState(null);
  const [rply_animation, setrply_animation] = useState(false);

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
      .catch((err) => {});
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
      return false;
    }
  };

  const revealProfileTime = async () => {
    console.log("\nrevealProfileTime")
    setloading(true);

    const api = apiUrl + "sendnotificationforprofilereveal/";

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    const data = {
      profileid1: profile_data.userprofile.id,
      profileid2: profile.userprofile.id,
    };

    try {
      const response = await axios.post(api, data, {
        headers,
      });
      setloading(false);
      let resp_data = response.data;
      console.log("resp_data",resp_data)
    } catch (error) {
      setloading(false);
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
        // setloading(false);

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

          let tmps = chats_msgs.filter((v) => v[8] == profile.chat_id);

          // if new message avalable load chats from backend or from local storage
          if (tmps.length > tmp_lis.length) {
            let tmp = chats_msgs.filter((v) => v[8] == profile.chat_id);
            setchatlist(tmp);
            chatlist_ref.current = tmp;
          } else {
            setchatlist(tmp_lis);
            chatlist_ref.current = tmp_lis;
          }

          if (tmp_lis.length == 0) {
            setloading(false);
          }
          // Connect socket after chat message get
          setconnectSocketS(true);
        }
      })
      .catch((err) => {
        setloading(false);
      });
  };

  // To set message seen or not
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
      console.log("onError", e);
      dispatch(setSocketClose(true));
    };

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);

      // IF message recived by user
      if (data.sender != profile_data.user.id) {
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
        // IF message send by user
        setchatlist_remain([data, ...chatlist_remain]);
      }
    };
  };

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <GestureHandlerRootView>
          {/* To show day */}
          {item[6] != "" && (
            <View
              style={{
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
            setrply_animation={setrply_animation}
            scrollViewRef={scrollViewRef}
            replySet={replySet}
            setreplySet={setreplySet}
            setactreplyID={setactreplyID}
            chatlist={chatlist}
            setchatlist={setchatlist}
          />
        </GestureHandlerRootView>
      );
    },
    [chatlist]
  );

  // save chats locally
  useEffect(() => {
    if (chatlist.length > 0) {
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

  // To set id of sent message by user
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

  // To Calculate Reveal Time
  useEffect(() => {
    // run below code if chats available and profile not reveal and activated
    if (chatlist.length > 0 && !profile.prof_rvl && !rvl_activate) {
      // first get count of message sent by each user
      let mymsgs = chatlist.filter((v) => v[1] == 1);

      let othmsgs = chatlist.filter((v) => v[1] == 0);

      // then get counts of word sent by each user
      let mycount = mymsgs
        .map((v) => v[0])
        .flat()
        .join(" ")
        .split(" ").length;

      let othcount = othmsgs
        .map((v) => v[0])
        .flat()
        .join(" ")
        .split(" ").length;

      let tlis = [...chatlist];

      // To set category of message to differentiate ( sent or receive )
      let tmpp = tlis.map((v) => {
        let rti = { val: v, category: v[1] };
        return rti;
      });

      // To create sequencial group of message to get oldest message of same user linearly
      function groupSimilarItemsSequentially(items) {
        const groupedItems = [];
        let currentGroup = [];

        for (let i = 0; i < items.length; i++) {
          if (i === 0 || items[i].category === items[i - 1].category) {
            currentGroup.push(items[i]);
          } else {
            groupedItems.push(currentGroup);
            currentGroup = [items[i]];
          }
        }
        if (currentGroup.length > 0) {
          groupedItems.push(currentGroup);
        }

        return groupedItems;
      }

      // Convert the list of items into sequentially grouped lists
      const sequentiallyGroupedItems = groupSimilarItemsSequentially(tmpp);
      let tlis1 = [];
      for (const iterator of sequentiallyGroupedItems) {
        // to get oldest message of same user linearly
        let exval = iterator[iterator.length - 1].val;
        // let exval = iterator[0].val;
        tlis1.push(exval);
      }

      let tlis221 = [];
      //  to create list of list of two message of each user
      p = 0;
      for (const itm of tlis1) {
        if (p > 0) {
          tlis221.push(tlis1[p - 1], itm);
        }
        p += 1;
      }

      //  to get time difference between sent and recive oldest msg
      if (tlis221 && tlis221?.length > 0) {
        let tmp_22 = tlis221?.map((v) => v[2]);
        let tmp_33 = [];

        s = 0;
        for (const iter of tmp_22) {
          if ((s + 1) % 2 !== 0) {
            let t1 = new Date(tmp_22[s]);
            let t2 = new Date(tmp_22[s + 1]);
            let diff = Math.abs(t2 - t1);
            tmp_33.push(diff / 1000 / 60);
          }

          s = s + 1;
        }

        // to get avg time in conversation
        if (tmp_33.length > 0) {
          let tot_min = tmp_33.reduce((a, b) => a + b);
          let avg_min = tot_min / tmp_33.length;

          let ttact = false;

          if (
            avg_min <= 5 &&
            mymsgs.length >= 25 &&
            othmsgs.length >= 25 &&
            mycount >= 120 &&
            othcount >= 120
          ) {
            ttact = true;
          } else if (
            mymsgs.length >= 40 &&
            othmsgs.length >= 40 &&
            mycount >= 130 &&
            othcount >= 130
          ) {
            ttact = true;
          }

          // Activate User for Reveal if above either condition satisfy
          if (ttact) {
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
    if (rvl_activate) {
      revealProfileTime();
    }
  }, [rvl_activate]);

  // useLayoutEffect(() => {
  //   // if user start chatting
  //   if (profile?.matchType == "New Match") {
  //     setmsg("Hi!");
  //   }
  // }, []);

  // load icebreaker according network status
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

  // load chat message according to network status
  useEffect(() => {
    let tmp = chats_msgs.filter((v) => v[8] == profile.chat_id);

    if (!is_network_connected && tmp.length > 0) {
      setchatlist(tmp);
      setloading(false);
    }

    if (is_network_connected && drafts_msgs.length > 0) {
      connectSocket();
    }
  }, [is_network_connected]);

  useLayoutEffect(() => {
    setloading(false);
    if (is_network_connected) {
      getPrevChats(chatlist);
    }
  }, []);

  // Auto scroll down
  useEffect(() => {
    if (chatlist.length > 0 && !rply_animation) {
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
    }
  }, [chatlist]);

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
                          <FastImage
                            source={rvl_img}
                            style={styles.profilePhoto}
                          />
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
            estimatedItemSize={100}
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
            renderItem={renderItem}
            keyExtractor={(_, index) => index}
            bouncesZoom={false}
            bounces={false}
            removeClippedSubviews={true}
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
                <FastImage
                  source={require("../../../assets/images/Matching/Message/Icebreaker.png")}
                  style={styles.iceBreakerImg}
                />
                <Text style={styles.iceBreakerTxt}>
                  Stuck with the conversation? Use this!
                </Text>
              </TouchableOpacity>
            </View>
            <Animated.View
           
              style={{
                borderColor: colors.grey,
                borderRadius: rspW(3.2),
                borderWidth: 1,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position:'relative',
              }}
            >
              {replySet && actreplyID && (
                
                <Animated.View
      
                  style={{
                    
                    backgroundColor:
                      chatlist.find((v) => v[4] == actreplyID)[1] == 0
                        ? "#e6e8eb"
                        : "#4986CA",
                    borderLeftWidth: rspW(1),
                    borderLeftColor: "#000",
           
                    // paddingVertical: rspH(1.2),
                    paddingVertical: rspH(0.8),
                    // paddingHorizontal: rspW(5.8),
                    paddingLeft: rspW(1.8),
                    paddingRight: rspW(2.4),
                    // marginTop: 10,
                    marginTop: rspH(0.7),
                    width: rspW(90),
           
                    borderRadius: rspW(2),
                    flexDirection: "row",
                    justifyContent: "space-between",
                  
                  }}
                >
                  <View style={{ width: "96%" }}>
                    <Text
                      style={{
                        fontSize: rspF(1.8),
                        color:
                          chatlist.find((v) => v[4] == actreplyID)[1] == 0
                            ? colors.black
                            : colors.white,
                        fontWeight: "600",
                        // lineHeight: rspF(2.4),
                        paddingBottom: rspH(0.2),
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
                </Animated.View>

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
                  <FastImage
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
                    
                          msg.replace(/^\s+|\s+$/g,'').trim(),
                          // .replace(/\s+/g, " ").trim(),
                          1,
                          new Date(),
                          profile_data.user.id,
                          null,
                          actreplyID != null ? actreplyID : null,
                          day_t ? day_tmp : "",
                          ung_id,
                          profile.chat_id,
                        ];
                        tmp_lis.unshift(nitm);
                        setchatlist(tmp_lis);
                        chatlist_ref.current = tmp_lis;
                        setreplySet(false);

                        let data = {
                          message:
                          msg.replace(/^\s+|\s+$/g,'').trim(),
                          // .replace(/\s+/g, " ").trim(),
                          sender: profile_data.user.id,
                          datetime: new Date(),
                          chat_id: profile.chat_id,
                          seen_by_user_id: null,
                          reply_msg_id: actreplyID != null ? actreplyID : null,
                          unique_id: ung_id,
                        };

                        let all_drafts_msgs = [...drafts_msgs];

                        all_drafts_msgs.push(data);

                        console.log("chatMsgTxt",data)

                        dispatch(setDraftMsgs(all_drafts_msgs));
                        if (SocketOpen) {
                          ws.current.send(JSON.stringify(data));
                        }

                        setmsg("");
                        setactreplyID(null);
                      }
                    }}
                  >
                    <FastImage
                      source={require("../../../assets/images/Matching/Message/sendMsgActive.png")}
                      style={styles.sendBtn}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
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
            <FastImage
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
    // paddingVertical: rspH(1.9),
    paddingTop: rspH(1),
    paddingBottom: rspH(1.4),
    // paddingHorizontal: rspW(4),
    paddingHorizontal: rspW(2),
    borderRadius: rspW(5.1),
    borderRadius: rspW(2),
    // marginHorizontal: rspW(4),
    marginHorizontal: rspW(1),
  },
  chatMsgTxt: {
    fontSize: rspF(1.8),
    fontFamily: fontFamily.medium,
    // lineHeight: rspF(2.1),
    lineHeight: rspF(Platform.OS  == 'android' ? 2.12 : 2.33),
    textAlign: "justify",
    minWidth: rspW(24),
    maxWidth: rspW(80),
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
    minWidth: rspW(26),
    color: colors.black,
    textAlign: "justify",
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
