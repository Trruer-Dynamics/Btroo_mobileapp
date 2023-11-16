
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import messaging from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { UserContext } from "../context/user";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
 
const NotificationController = (props) => {
  const { sckop, newMsgRefresh, setnewMsgRefresh } = useContext(UserContext);
  const user_loggined = useSelector(
    (state) => state.authentication.user_loggined
  );
  const matches = useSelector((state) => state.chats.matches);
 
  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );
 
 
  const current_screen = useSelector((state) => state.screen.current_screen);
 
  const [user_interact, setuser_interact] = useState(false);
  const [type, settype] = useState("");
  const [not_data, setnot_data] = useState(null);
  const [refresh, setrefresh] = useState(false);
  const navigation = useNavigation();
 
  useEffect(() => {
    if (
      not_data?.type == "Chat" ||
      not_data?.type == "Hidden" ||
      not_data?.type == "Match"
    ) {
      setnewMsgRefresh(!newMsgRefresh);
    }
 
    if (not_data?.type == "Reveal" && user_loggined) {
      setuser_interact(false);
 
      let dt = JSON.parse(not_data.data);
 
      console.log("dt", dt)
      let expiry_date = dt.expiry_datetime;
 
      let mth = {};
 
      mth.id = dt.chatroom_id;
      mth.chat_id = dt.chat_id;
      mth.no_of_extend = dt.number_of_extend;
      mth.userprofile = { name: dt.Name, id: dt.profile_id };
      mth.expiry_date = new Date(expiry_date);
      mth.user_id = dt.image.user;
      // let prf_img = dt.userprofile.image.find(
      //   (c) => c.position == 0
      // );
 
      mth.prof_img = dt.image.cropedimage;
      mth.prof_rvl = true;
      mth.all_images = [];
      console.log("Till Here")
      navigation.navigate("ProfileRevealed", {
        profile: mth,
      });
    }
 
    if (not_data?.type != "" && user_interact && user_loggined) {
      if (not_data?.type == "Match") {
        setuser_interact(false);
        navigation.navigate("Match");
      } else if (not_data?.type == "Chat") {
        setuser_interact(false);
        let dt = not_data;
        console.log("dt2", dt)
        let cht_id = dt.chatroom_id;
 
        if (matches.length > 0) {
          let c_user_match = matches.filter(
            (v) =>
              v.for_user_id == profile_data.userprofile.id && v.id == cht_id
          )[0];
          navigation.navigate("Chat", {
            profile: c_user_match,
          });
        } else {
          navigation.navigate("Match");
        }
      }
    }
  }, [refresh, user_interact, not_data]);
 
  useLayoutEffect(() => {
    // Must be outside of any component LifeCycle (such as `componentDidMount`).
    PushNotification.createChannel(
      {
        channelId: "com.btroo", // (required)
        channelName: "My channel", // (required)
        channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) => {} // (optional) callback returns whether the channel was created, false means it already existed.
    );
 
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {},
 
      onNotification: function (notification) {
        setuser_interact(notification.userInteraction);
        if (notification.userInteraction) {
          if (!notification.foreground) {
            setnot_data(notification.data);
            setrefresh(!refresh);
          }
        }
 
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
 
      channelId: "com.btroo",
 
      onAction: function (notification) {},
 
      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },
 
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
 
      popInitialNotification: true,
 
      requestPermissions: false,
    });
  }, []);
 
  useLayoutEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      // console.log("remoteMessage",remoteMessage.data)
      const { title, body } = remoteMessage.notification;
      data = remoteMessage.data;
      // console.log("ndata",data)
     
      setnot_data(data);
 
      setrefresh(!refresh);
 
      let notifObj = {
        channelId: "com.btroo",
        message: body,
        title: title,
        body: data,
        soundName: "default",
      };
      if (Platform.OS == "android") {
        notifObj = {
          ...notifObj,
          // actions: ["Yes", "No"],
 
          // largeIcon: '',
          // (optional) default: "ic_launcher". Use "" for no large icon.
          //   smallIcon: 'ic_notification',
          color: "#1c2143",
        };
      }
 
      if (user_loggined && !sckop.current && data?.type != "Hidden" && current_screen != 'current_screen') {
        PushNotification.localNotification(notifObj);
      }
    });
 
    return unsubscribe;
  }, [user_loggined]);
 
  return null;
};
 
export default NotificationController;
 