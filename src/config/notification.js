import React, {
  useContext,
  useEffect,
  useRef,
  useLayoutEffect,
  useState,
} from "react";
import { Alert, Platform } from "react-native";
import messaging from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { UserContext } from "../context/user";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { setProfileRevealed } from "../store/reducers/authentication/authentication";

const NotificationController = (props) => {
  const { sckop } = useContext(UserContext);
  const user_loggined = useSelector(
    (state) => state.authentication.user_loggined
  );

  const [user_interact, setuser_interact] = useState(false);
  const [type, settype] = useState("");
  const [not_data, setnot_data] = useState(null);
  const [refresh, setrefresh] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    console.log("\nuser_interact", user_interact);
    console.log("not_data?.type", not_data?.type);
    console.log("user_loggined", user_loggined);
    console.log("\n");

    if (not_data?.type == "Reveal" && user_loggined) {
      setuser_interact(false);

      let dt = JSON.parse(not_data.data);
      let expiry_date = dt.expiry_datetime;

      let mth = {};

      mth.id = dt.chatroom_id;
      mth.chat_id = dt.chat_id;
      mth.no_of_extend = dt.number_of_extend;
      mth.userprofile = { name: dt.Name, id: dt.profile_id };
      mth.expiry_date = new Date(expiry_date);
      mth.user_id = dt.image.user;
      mth.prof_img = dt.image.cropedimage;
      mth.prof_rvl = true;

      navigation.navigate("ProfileRevealed", {
        profile: mth,
      });
    }

    if (not_data?.type != "" && user_interact && user_loggined) {
      if (not_data?.type == "Match" || not_data?.type == "Chat") {
        setuser_interact(false);

        navigation.navigate("Match");
      } else {
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
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {},

      onNotification: function (notification) {
        console.log(
          "\nNOTIFICATION:",
          notification.data.type,
          notification.foreground
        );

        console.log("\nuserInteraction", notification.userInteraction, "\n");

        setuser_interact(notification.userInteraction);
        if (notification.userInteraction) {
          let type = "";
          let data = {};

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
      //   Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));

      console.log("\n remoteMessage", Platform.OS, remoteMessage, "\n");

      const { title, body } = remoteMessage.notification;
      data = remoteMessage.data;

      setnot_data(data);

      setrefresh(!refresh);

      let notifObj = {
        channelId: "com.btroo",
        message: body,
        title: title,
        body: data,
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

      console.log(Platform.OS, "  sckop.current", sckop.current);

      if (user_loggined && !sckop.current) {
        PushNotification.localNotification(notifObj);
      }
    });

    return unsubscribe;
  }, [user_loggined]);

  return null;
};

export default NotificationController;
