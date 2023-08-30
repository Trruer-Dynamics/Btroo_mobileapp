import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  PermissionsAndroid,
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  rspF,
  rspH,
  rspW,
  scrn_height,
  scrn_width,
} from "../../styles/responsiveSize";
import colors from "../../styles/colors";
import fontFamily from "../../styles/fontFamily";

import ADIcon from "react-native-vector-icons/AntDesign";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import Ionicon from "react-native-vector-icons/Ionicons";
import BottomModal from "../../components/modals/BottomModal";
import FormInputContainer from "../../components/formComponents/FormInputContainer";
import FormSelector from "../../components/formComponents/FormSelector";
import FormInput from "../../components/formComponents/FormInput";
import FormMultiSelector from "../../components/formComponents/FormMultiSelector";
import FormWrapperFooter from "../../components/wrappers/formWrappers/FormWrapperFooter";
import ErrorContainer from "../../components/formComponents/ErrorContainer";
import FooterBtn from "../../components/Buttons/FooterBtn";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import { apiUrl } from "../../constants";
import axios from "axios";
import {
  setProfileImgs,
  setProfiledata,
  setSessionExpired,
} from "../../store/reducers/authentication/authentication";
import Loader from "../../components/loader/Loader";
import FormHeader from "../../components/wrappers/formWrappers/FormHeader";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ImageCropPicker from "react-native-image-crop-picker";
import CentralModal from "../../components/modals/CentralModal";
import { UserContext } from "../../context/user";
import AutoGrowingTextInput from "react-native-autogrow-textinput-ts";
import { Image as CompImage } from "react-native-compressor";
import { stat } from "react-native-fs";

const mainBoxSize = rspW(84);

const EditProfile = ({ navigation }) => {
  const dispatch = useDispatch();

  const access_token = useSelector(
    (state) => state.authentication.access_token
  );
  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );
  const profile_imgs = useSelector(
    (state) => state.authentication.profile_imgs
  );

  const { appStateVisible } = useContext(UserContext);

  const scrollViewRef = useRef();

  const [current_pos, setcurrent_pos] = useState(0);

  const [changes_made, setchanges_made] = useState(false);

  // Drag States And Functions

  const [pic1, setpic1] = useState(["", "", true, "1", ""]);
  const [pic2, setpic2] = useState(["", "", false, "2", ""]);
  const [pic3, setpic3] = useState(["", "", false, "3", ""]);
  const [pic4, setpic4] = useState(["", "", false, "4", ""]);
  const [pic5, setpic5] = useState(["", "", false, "5", ""]);
  const [pic6, setpic6] = useState(["", "", false, "6", ""]);
  const [pic7, setpic7] = useState(["", "", false, "7", ""]);
  const [pic8, setpic8] = useState(["", "", false, "8", ""]);
  const [pic9, setpic9] = useState(["", "", false, "9", ""]);

  const prior = useSharedValue(0);

  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const drgE1 = useSharedValue(true);

  const x2 = useSharedValue(0);
  const y2 = useSharedValue(0);
  const drgE2 = useSharedValue(true);

  const x3 = useSharedValue(0);
  const y3 = useSharedValue(0);
  const drgE3 = useSharedValue(true);

  const x4 = useSharedValue(0);
  const y4 = useSharedValue(0);
  const drgE4 = useSharedValue(true);

  const x5 = useSharedValue(0);
  const y5 = useSharedValue(0);
  const drgE5 = useSharedValue(true);

  const x6 = useSharedValue(0);
  const y6 = useSharedValue(0);
  const drgE6 = useSharedValue(true);

  const x7 = useSharedValue(0);
  const y7 = useSharedValue(0);
  const drgE7 = useSharedValue(true);

  const x8 = useSharedValue(0);
  const y8 = useSharedValue(0);
  const drgE8 = useSharedValue(true);

  const x9 = useSharedValue(0);
  const y9 = useSharedValue(0);
  const drgE9 = useSharedValue(true);

  const changeImgPosition = async (img_id_1, pos_1, img_id_2, pos_2) => {
    setloading(true);
    const url = apiUrl + "image_Position/";
    const headers = {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    };

    const data = {
      image_id_1: img_id_1,
      position_1: pos_1,
      image_id_2: img_id_2,
      position_2: pos_2,
    };

    console.log("data", data);

    try {
      const resp = await axios.post(url, data, { headers });
      setloading(false);

      let code = resp.data.code;
      let user_data = resp.data.data;

      console.log("change pose code", code);
      if (code == 200) {
        // console.log("user_data",user_data)
      } else if (code == 401) {
        dispatch(setSessionExpired(true));
      } else {
        Alert.alert(
          "changeImgPosition Error",
          "Some Error Occur" + JSON.stringify(resp.data.data)
        );
      }
    } catch (error) {
      setloading(false);
      dispatch(setSessionExpired(true));
      console.log("changeImgPosition error", error);
      Alert.alert("changeImgPosition Error catch", "Something Went Wrong");
    }
  };

  const changePos = async (no1, no2) => {
    let tmp_l = [pic1, pic2, pic3, pic4, pic5, pic6, pic7, pic8, pic9];

    let prc1 = tmp_l[no1];
    let prc2 = tmp_l[no2];

    if (prc2[0] != "") {
      let tmp2 = tmp_l[no1];
      tmp_l[no1] = tmp_l[no2];
      tmp_l[no2] = tmp2;

      await dispatch(setProfileImgs(tmp_l));
      await atLast(tmp_l);
    }

    let img_id_1 = tmp_l[no1][4];
    let img_id_2 = tmp_l[no2][4];

    let pos_1 = tmp_l[no1][3];
    let pos_2 = tmp_l[no2][3];

    if (prc2[0] != "") {
      changeImgPosition(img_id_1, pos_1, img_id_2, pos_2);
    }
  };

  const timeR1 = () => {
    if (x.value == 0 && pic1[0] != "") {
      drgE1.value = true;
    } else {
      drgE1.value = false;
    }
    if (prior.value == 0) {
      prior.value = 1;
    }
  };
  const timeR2 = () => {
    if (x2.value == 0 && pic2[0] != "") {
      drgE2.value = true;
    } else {
      drgE2.value = false;
    }
    if (prior.value == 0) {
      prior.value = 2;
    }
  };
  const timeR3 = () => {
    if (x3.value == 0 && pic3[0] != "") {
      drgE3.value = true;
    } else {
      drgE3.value = false;
    }
    if (prior.value == 0) {
      prior.value = 3;
    }
  };
  const timeR4 = () => {
    if (x4.value == 0 && pic4[0] != "") {
      drgE4.value = true;
    } else {
      drgE4.value = false;
    }
    if (prior.value == 0) {
      prior.value = 4;
    }
  };
  const timeR5 = () => {
    if (x5.value == 0 && pic5[0] != "") {
      drgE5.value = true;
    } else {
      drgE5.value = false;
    }
    if (prior.value == 0) {
      prior.value = 5;
    }
  };
  const timeR6 = () => {
    if (x6.value == 0 && pic6[0] != "") {
      drgE6.value = true;
    } else {
      drgE6.value = false;
    }
    if (prior.value == 0) {
      prior.value = 6;
    }
  };
  const timeR7 = () => {
    if (x7.value == 0 && pic7[0] != "") {
      drgE7.value = true;
    } else {
      drgE7.value = false;
    }
    if (prior.value == 0) {
      prior.value = 7;
    }
  };
  const timeR8 = () => {
    if (x8.value == 0 && pic8[0] != "") {
      drgE8.value = true;
    } else {
      drgE8.value = false;
    }
    if (prior.value == 0) {
      prior.value = 8;
    }
  };
  const timeR9 = () => {
    if (x9.value == 0 && pic9[0] != "") {
      drgE9.value = true;
    } else {
      drgE9.value = false;
    }
    if (prior.value == 0) {
      prior.value = 9;
    }
  };

  const gestureHandler1 = useAnimatedGestureHandler({
    onStart: (e, c) => {
      c.startX = x.value;
      c.startY = y.value;
      runOnJS(timeR1)();
    },
    onActive: (e, c) => {
      if (drgE1.value && prior.value == 1) {
        let maxDragX = mainBoxSize / 1.5;
        let maxDragY = mainBoxSize / 1.5;

        if (
          e.translationX > 0 &&
          e.translationY > 0 &&
          e.translationX < maxDragX + 4 &&
          e.translationY < maxDragY
        ) {
          x.value = c.startX + e.translationX;
          y.value = c.startY + e.translationY;
        }
      }
    },
    onEnd: (e, c) => {
      // 2
      if (
        x.value > mainBoxSize / 6 + 4 &&
        x.value <= mainBoxSize / 2 + 8 &&
        y.value <= mainBoxSize / 6 + 4
      ) {
        runOnJS(changePos)(0, 1);
      }

      // 3
      if (x.value > mainBoxSize / 2 + 8 && y.value <= mainBoxSize / 6 + 4) {
        runOnJS(changePos)(0, 2);
      }

      // 4
      if (
        x.value <= mainBoxSize / 6 + 4 &&
        y.value > mainBoxSize / 6 + 4 &&
        y.value <= mainBoxSize / 2 + 8
      ) {
        runOnJS(changePos)(0, 3);
      }

      // 7
      if (x.value <= mainBoxSize / 6 + 4 && y.value > mainBoxSize / 2 + 8) {
        runOnJS(changePos)(0, 6);
      }

      // 5
      if (
        x.value > mainBoxSize / 6 + 4 &&
        x.value <= mainBoxSize / 2 + 8 &&
        y.value > mainBoxSize / 6 + 4 &&
        y.value <= mainBoxSize / 2 + 8
      ) {
        runOnJS(changePos)(0, 4);
      }

      // 9
      if (x.value > mainBoxSize / 2 + 8 && y.value > mainBoxSize / 2 + 8) {
        runOnJS(changePos)(0, 8);
      }

      // 8
      if (
        x.value > mainBoxSize / 6 + 4 &&
        x.value < mainBoxSize / 2 + 8 &&
        y.value > mainBoxSize / 2 + 8
      ) {
        runOnJS(changePos)(0, 7);
      }

      // 6
      if (
        x.value > mainBoxSize / 2 + 8 &&
        y.value > mainBoxSize / 6 + 4 &&
        y.value <= mainBoxSize / 2 + 8
      ) {
        runOnJS(changePos)(0, 5);
      }

      x.value = withTiming(0, { duration: 300 });
      y.value = withTiming(0, { duration: 300 }, () => {
        prior.value = 0;
      });
    },
  });

  const gestureHandler2 = useAnimatedGestureHandler({
    onStart: (e, c) => {
      c.startX = x2.value;
      c.startY = y2.value;
      runOnJS(timeR2)();
    },
    onActive: (e, c) => {
      if (drgE2.value && prior.value == 2) {
        let maxDragX = mainBoxSize / 3;
        let minDragX = -mainBoxSize / 3;
        let maxDragY = mainBoxSize / 1.5;

        if (
          e.translationX > minDragX &&
          e.translationX < maxDragX &&
          e.translationY > 0 &&
          e.translationY < maxDragY
        ) {
          x2.value = c.startX + e.translationX;
          y2.value = c.startY + e.translationY;
        }
      }
    },
    onEnd: (e, c) => {
      // 1
      if (x2.value < -mainBoxSize / 6 + 4 && y2.value <= mainBoxSize / 6 + 4) {
        runOnJS(changePos)(1, 0);
      }

      // 5
      if (
        y2.value > mainBoxSize / 6 + 4 &&
        y2.value <= mainBoxSize / 2 + 8 &&
        x2.value >= -mainBoxSize / 6 + 4 &&
        x2.value <= mainBoxSize / 6 + 4
      ) {
        runOnJS(changePos)(1, 4);
      }

      // 3
      if (x2.value > mainBoxSize / 6 + 4 && y2.value <= mainBoxSize / 6 + 4) {
        runOnJS(changePos)(1, 2);
      }

      // 4
      if (
        x2.value < -mainBoxSize / 6 + 4 &&
        y2.value > mainBoxSize / 6 + 4 &&
        y2.value <= mainBoxSize / 2 + 8
      ) {
        runOnJS(changePos)(1, 3);
      }

      // 6
      if (
        x2.value > mainBoxSize / 6 + 4 &&
        y2.value > mainBoxSize / 6 + 4 &&
        y2.value <= mainBoxSize / 2 + 8
      ) {
        runOnJS(changePos)(1, 5);
      }

      // 7
      if (x2.value < -mainBoxSize / 6 + 4 && y2.value > mainBoxSize / 2 + 8) {
        runOnJS(changePos)(1, 6);
      }

      // 8
      if (
        x2.value >= -mainBoxSize / 6 + 4 &&
        x2.value <= mainBoxSize / 6 + 4 &&
        y2.value > mainBoxSize / 2 + 8
      ) {
        runOnJS(changePos)(1, 7);
      }

      // 9
      if (x2.value > mainBoxSize / 6 + 4 && y2.value > mainBoxSize / 2 + 8) {
        runOnJS(changePos)(1, 8);
      }

      x2.value = withTiming(0, { duration: 300 });
      y2.value = withTiming(0, { duration: 300 }, () => {
        prior.value = 0;
      });
    },
  });

  const gestureHandler3 = useAnimatedGestureHandler({
    onStart: (e, c) => {
      c.startX = x3.value;
      c.startY = y3.value;
      runOnJS(timeR3)();
    },
    onActive: (e, c) => {
      if (drgE3.value && prior.value == 3) {
        let maxDragX = 0;
        let minDragX = -mainBoxSize / 1.5;
        let minDragY = 0;
        let maxDragY = mainBoxSize / 1.5;

        if (
          e.translationX > minDragX &&
          e.translationX < maxDragX &&
          e.translationY > minDragY &&
          e.translationY < maxDragY
        ) {
          x3.value = c.startX + e.translationX;
          y3.value = c.startY + e.translationY;
        }
      }
    },
    onEnd: (e, c) => {
      // 2
      if (
        x3.value < -mainBoxSize / 6 + 4 &&
        x3.value >= -mainBoxSize / 2 + 8 &&
        y3.value <= mainBoxSize / 6 + 4
      ) {
        runOnJS(changePos)(2, 1);
      }

      // 1
      if (x3.value < -mainBoxSize / 2 + 8 && y3.value <= mainBoxSize / 6 + 4) {
        runOnJS(changePos)(2, 0);
      }

      // 5
      if (
        y3.value > mainBoxSize / 6 + 4 &&
        y3.value <= mainBoxSize / 2 + 8 &&
        x3.value < -mainBoxSize / 6 + 4 &&
        x3.value >= -mainBoxSize / 2 + 8
      ) {
        runOnJS(changePos)(2, 4);
      }

      //   // 3
      //   if (x2.value > mainBoxSize / 6 + 4 && y2.value <= mainBoxSize / 6 + 4) {
      //     runOnJS(changePos)(1, 2);
      //   }

      // 4
      if (
        x3.value < -mainBoxSize / 2 + 8 &&
        y3.value > mainBoxSize / 6 + 4 &&
        y3.value <= mainBoxSize / 2 + 8
      ) {
        runOnJS(changePos)(2, 3);
      }

      // 6
      if (
        x3.value > -mainBoxSize / 6 + 4 &&
        y3.value > mainBoxSize / 6 + 4 &&
        y3.value <= mainBoxSize / 2 + 8
      ) {
        runOnJS(changePos)(2, 5);
      }

      // 7
      if (x3.value < -mainBoxSize / 2 + 8 && y3.value > mainBoxSize / 2 + 8) {
        runOnJS(changePos)(2, 6);
      }

      // 8
      if (
        x3.value >= -mainBoxSize / 2 + 8 &&
        x3.value <= -mainBoxSize / 6 + 4 &&
        y3.value > mainBoxSize / 2 + 8
      ) {
        runOnJS(changePos)(2, 7);
      }

      // 9
      if (x3.value > -mainBoxSize / 6 + 4 && y3.value > mainBoxSize / 2 + 8) {
        runOnJS(changePos)(2, 8);
      }

      x3.value = withTiming(0, { duration: 300 });
      y3.value = withTiming(0, { duration: 300 }, () => {
        prior.value = 0;
      });
    },
  });

  const gestureHandler4 = useAnimatedGestureHandler({
    onStart: (e, c) => {
      c.startX = x4.value;
      c.startY = y4.value;
      runOnJS(timeR4)();
    },
    onActive: (e, c) => {
      if (drgE4.value && prior.value == 4) {
        let maxDragX = mainBoxSize / 1.5;
        let minDragX = 0;
        let minDragY = -mainBoxSize / 3;
        let maxDragY = mainBoxSize / 3;

        if (
          e.translationX > minDragX &&
          e.translationX < maxDragX &&
          e.translationY > minDragY &&
          e.translationY < maxDragY
        ) {
          x4.value = c.startX + e.translationX;
          y4.value = c.startY + e.translationY;
        }
      }
    },
    onEnd: (e, c) => {
      // 2
      if (
        x4.value > mainBoxSize / 6 + 4 &&
        x4.value <= mainBoxSize / 2 + 8 &&
        y4.value < -mainBoxSize / 6 + 4
      ) {
        runOnJS(changePos)(3, 1);
      }

      // 1
      if (x4.value <= mainBoxSize / 6 + 4 && y4.value < -mainBoxSize / 6 + 4) {
        runOnJS(changePos)(3, 0);
      }

      // 5
      if (
        y4.value >= -mainBoxSize / 6 + 4 &&
        y4.value <= mainBoxSize / 6 + 4 &&
        x4.value > mainBoxSize / 6 + 4 &&
        x4.value <= mainBoxSize / 2 + 8
      ) {
        runOnJS(changePos)(3, 4);
      }

      // 3
      if (x4.value > mainBoxSize / 2 + 8 && y4.value < -mainBoxSize / 6 + 4) {
        runOnJS(changePos)(3, 2);
      }

      //   // 4
      // if (
      //     x3.value < -mainBoxSize / 2 + 8
      //     &&
      //     y3.value > mainBoxSize / 6 + 4
      //     &&
      //     y3.value <= mainBoxSize / 2 + 8
      //   ) {
      //     runOnJS(changePos)(2, 3);
      //   }

      // 6
      if (
        x4.value > mainBoxSize / 2 + 8 &&
        y4.value >= -mainBoxSize / 6 + 4 &&
        y4.value <= mainBoxSize / 6 + 4
      ) {
        runOnJS(changePos)(3, 5);
      }

      // 7
      if (x4.value < mainBoxSize / 6 + 4 && y4.value > mainBoxSize / 6 + 4) {
        runOnJS(changePos)(3, 6);
      }

      // 8
      if (
        x4.value <= mainBoxSize / 2 + 8 &&
        x4.value > mainBoxSize / 6 + 4 &&
        y4.value > mainBoxSize / 6 + 4
      ) {
        runOnJS(changePos)(3, 7);
      }

      // 9
      if (x4.value > mainBoxSize / 2 + 8 && y4.value > mainBoxSize / 6 + 4) {
        runOnJS(changePos)(3, 8);
      }

      x4.value = withTiming(0, { duration: 300 });
      y4.value = withTiming(0, { duration: 300 }, () => {
        prior.value = 0;
      });
    },
  });

  const gestureHandler5 = useAnimatedGestureHandler({
    onStart: (e, c) => {
      c.startX = x5.value;
      c.startY = y5.value;
      runOnJS(timeR5)();
    },
    onActive: (e, c) => {
      if (drgE5.value && prior.value == 5) {
        let maxDragX = mainBoxSize / 3;
        let minDragX = -mainBoxSize / 3;
        let minDragY = -mainBoxSize / 3;
        let maxDragY = mainBoxSize / 3;

        if (
          e.translationX > minDragX &&
          e.translationX < maxDragX &&
          e.translationY > minDragY &&
          e.translationY < maxDragY
        ) {
          x5.value = c.startX + e.translationX;
          y5.value = c.startY + e.translationY;
        }
      }
    },
    onEnd: (e, c) => {
      // 2
      if (
        x5.value >= -mainBoxSize / 6 + 4 &&
        x5.value <= mainBoxSize / 6 + 4 &&
        y5.value < -mainBoxSize / 6 + 4
      ) {
        runOnJS(changePos)(4, 1);
      }

      // 1
      if (x5.value < -mainBoxSize / 6 + 4 && y5.value < -mainBoxSize / 6 + 4) {
        runOnJS(changePos)(4, 0);
      }

      //   // 5
      // if (
      //     y4.value >= -mainBoxSize / 6 + 4
      //     &&
      //     y4.value <= mainBoxSize / 6 + 4
      //     &&
      //     x4.value > mainBoxSize / 6 + 4
      //     &&
      //     x4.value <=  mainBoxSize / 2 + 8
      //   ) {
      //     runOnJS(changePos)(3, 4);
      //   }

      // 3
      if (x5.value > mainBoxSize / 6 + 4 && y5.value < -mainBoxSize / 6 + 4) {
        runOnJS(changePos)(4, 2);
      }

      // 4
      if (
        x5.value < -mainBoxSize / 6 + 4 &&
        y5.value >= -mainBoxSize / 6 + 4 &&
        y5.value <= mainBoxSize / 6 + 4
      ) {
        runOnJS(changePos)(4, 3);
      }

      // 6
      if (
        x5.value > mainBoxSize / 6 + 4 &&
        y5.value >= -mainBoxSize / 6 + 4 &&
        y5.value <= mainBoxSize / 6 + 4
      ) {
        runOnJS(changePos)(4, 5);
      }

      // 7
      if (x5.value < -mainBoxSize / 6 + 4 && y5.value > mainBoxSize / 6 + 4) {
        runOnJS(changePos)(4, 6);
      }

      // 8
      if (
        x5.value >= -mainBoxSize / 6 + 4 &&
        x5.value <= mainBoxSize / 6 + 4 &&
        y5.value > mainBoxSize / 6 + 4
      ) {
        runOnJS(changePos)(4, 7);
      }

      // 9
      if (x5.value > mainBoxSize / 6 + 4 && y5.value > mainBoxSize / 6 + 4) {
        runOnJS(changePos)(4, 8);
      }

      x5.value = withTiming(0, { duration: 300 });
      y5.value = withTiming(0, { duration: 300 }, () => {
        prior.value = 0;
      });
    },
  });

  const gestureHandler6 = useAnimatedGestureHandler({
    onStart: (e, c) => {
      c.startX = x6.value;
      c.startY = y6.value;
      runOnJS(timeR6)();
    },
    onActive: (e, c) => {
      if (drgE6.value && prior.value == 6) {
        let maxDragX = 0;
        let minDragX = -mainBoxSize / 1.5;
        let minDragY = -mainBoxSize / 3;
        let maxDragY = mainBoxSize / 3;

        if (
          e.translationX > minDragX &&
          e.translationX < maxDragX &&
          e.translationY > minDragY &&
          e.translationY < maxDragY
        ) {
          x6.value = c.startX + e.translationX;
          y6.value = c.startY + e.translationY;
        }
      }
    },
    onEnd: (e, c) => {
      // 2
      if (
        x6.value < -mainBoxSize / 6 + 4 &&
        x6.value >= -mainBoxSize / 2 + 8 &&
        y6.value < -mainBoxSize / 6 + 4
      ) {
        runOnJS(changePos)(5, 1);
      }

      // 1
      if (x6.value < -mainBoxSize / 2 + 8 && y6.value < -mainBoxSize / 6 + 4) {
        runOnJS(changePos)(5, 0);
      }

      // 5
      if (
        y6.value >= -mainBoxSize / 6 + 4 &&
        y6.value <= mainBoxSize / 6 + 4 &&
        x6.value < -mainBoxSize / 6 + 4 &&
        x6.value >= -mainBoxSize / 2 + 8
      ) {
        runOnJS(changePos)(5, 4);
      }

      // 3
      if (x6.value >= -mainBoxSize / 6 + 4 && y6.value < -mainBoxSize / 6 + 4) {
        runOnJS(changePos)(5, 2);
      }

      // 4
      if (
        x6.value < -mainBoxSize / 2 + 8 &&
        y6.value <= mainBoxSize / 6 + 4 &&
        y6.value >= -mainBoxSize / 6 + 4
      ) {
        runOnJS(changePos)(5, 3);
      }

      //   // 6
      //   if (
      //     x4.value >  mainBoxSize / 2 + 8
      // &&
      //     y4.value >= -mainBoxSize / 6 + 4
      //     &&
      // y4.value <=  mainBoxSize / 6 + 4
      //   ) {
      //     runOnJS(changePos)(3, 5);
      //   }

      // 7
      if (x6.value < -mainBoxSize / 2 + 8 && y6.value > mainBoxSize / 6 + 4) {
        runOnJS(changePos)(5, 6);
      }

      // 8
      if (
        x6.value <= -mainBoxSize / 6 + 4 &&
        x6.value >= -mainBoxSize / 2 + 8 &&
        y6.value > mainBoxSize / 6 + 4
      ) {
        runOnJS(changePos)(5, 7);
      }

      // 9
      if (x6.value >= -mainBoxSize / 6 + 4 && y6.value > mainBoxSize / 6 + 4) {
        runOnJS(changePos)(5, 8);
      }

      x6.value = withTiming(0, { duration: 300 });
      y6.value = withTiming(0, { duration: 300 }, () => {
        prior.value = 0;
      });
    },
  });

  const gestureHandler7 = useAnimatedGestureHandler({
    onStart: (e, c) => {
      c.startX = x7.value;
      c.startY = y7.value;
      runOnJS(timeR7)();
    },
    onActive: (e, c) => {
      if (drgE7.value && prior.value == 7) {
        let maxDragX = mainBoxSize / 1.5;
        let minDragX = 0;
        let minDragY = -mainBoxSize / 1.5;
        let maxDragY = 0;

        if (
          e.translationX > minDragX &&
          e.translationX < maxDragX &&
          e.translationY > minDragY &&
          e.translationY < maxDragY
        ) {
          x7.value = c.startX + e.translationX;
          y7.value = c.startY + e.translationY;
        }
      }
    },
    onEnd: (e, c) => {
      // 2
      if (
        x7.value <= mainBoxSize / 2 + 8 &&
        x7.value >= mainBoxSize / 6 + 4 &&
        y7.value < -mainBoxSize / 2 + 8
      ) {
        runOnJS(changePos)(6, 1);
      }

      // 1
      if (x7.value < mainBoxSize / 6 + 4 && y7.value < -mainBoxSize / 2 + 8) {
        runOnJS(changePos)(6, 0);
      }

      // 5
      if (
        y7.value >= -mainBoxSize / 2 + 8 &&
        y7.value < -mainBoxSize / 6 + 4 &&
        x7.value >= mainBoxSize / 6 + 4 &&
        x7.value <= mainBoxSize / 2 + 8
      ) {
        runOnJS(changePos)(6, 4);
      }

      // 3
      if (x7.value > mainBoxSize / 2 + 8 && y7.value < -mainBoxSize / 2 + 8) {
        runOnJS(changePos)(6, 2);
      }

      // 4
      if (
        x7.value <= mainBoxSize / 6 + 4 &&
        y7.value >= -mainBoxSize / 2 + 8 &&
        y7.value < -mainBoxSize / 6 + 4
      ) {
        runOnJS(changePos)(6, 3);
      }

      // 6
      if (
        x7.value > mainBoxSize / 2 + 8 &&
        y7.value <= -mainBoxSize / 6 + 4 &&
        y7.value >= -mainBoxSize / 2 + 8
      ) {
        runOnJS(changePos)(6, 5);
      }

      //   // 7
      //   if (
      // x6.value < -mainBoxSize / 2 + 8
      //   &&
      //   y6.value > mainBoxSize / 6 + 4
      //   ) {
      //     runOnJS(changePos)(5, 6);
      //   }

      // 8
      if (
        x7.value > mainBoxSize / 6 + 4 &&
        x7.value <= mainBoxSize / 2 + 8 &&
        y7.value > -mainBoxSize / 6 + 4
      ) {
        runOnJS(changePos)(6, 7);
      }

      // 9
      if (x7.value > mainBoxSize / 2 + 8 && y7.value > -mainBoxSize / 6 + 4) {
        runOnJS(changePos)(6, 8);
      }

      x7.value = withTiming(0, { duration: 300 });
      y7.value = withTiming(0, { duration: 300 }, () => {
        prior.value = 0;
      });
    },
  });

  const gestureHandler8 = useAnimatedGestureHandler({
    onStart: (e, c) => {
      c.startX = x8.value;
      c.startY = y8.value;
      runOnJS(timeR8)();
    },
    onActive: (e, c) => {
      if (drgE8.value && prior.value == 8) {
        let maxDragX = mainBoxSize / 3;
        let minDragX = -mainBoxSize / 3;
        let minDragY = -mainBoxSize / 1.5;
        let maxDragY = 0;

        if (
          e.translationX > minDragX &&
          e.translationX < maxDragX &&
          e.translationY > minDragY &&
          e.translationY < maxDragY
        ) {
          x8.value = c.startX + e.translationX;
          y8.value = c.startY + e.translationY;
        }
      }
    },
    onEnd: (e, c) => {
      // 2
      if (
        x8.value <= mainBoxSize / 6 + 4 &&
        x8.value >= -mainBoxSize / 6 + 4 &&
        y8.value < -mainBoxSize / 2 + 8
      ) {
        runOnJS(changePos)(7, 1);
      }

      // 1
      if (x8.value < -mainBoxSize / 6 + 4 && y8.value < -mainBoxSize / 2 + 8) {
        runOnJS(changePos)(7, 0);
      }

      // 5
      if (
        y8.value >= -mainBoxSize / 2 + 8 &&
        y8.value < -mainBoxSize / 6 + 4 &&
        x8.value >= -mainBoxSize / 6 + 4 &&
        x8.value <= mainBoxSize / 6 + 4
      ) {
        runOnJS(changePos)(7, 4);
      }

      // 3
      if (x8.value > mainBoxSize / 6 + 4 && y8.value < -mainBoxSize / 2 + 8) {
        runOnJS(changePos)(7, 2);
      }

      // 4
      if (
        x8.value < -mainBoxSize / 6 + 4 &&
        y8.value >= -mainBoxSize / 2 + 8 &&
        y8.value <= -mainBoxSize / 6 + 4
      ) {
        runOnJS(changePos)(7, 3);
      }

      // 6
      if (
        x8.value > mainBoxSize / 6 + 4 &&
        y8.value <= -mainBoxSize / 6 + 4 &&
        y8.value >= -mainBoxSize / 2 + 8
      ) {
        runOnJS(changePos)(7, 5);
      }

      // 7
      if (x8.value < -mainBoxSize / 6 + 4 && y8.value > -mainBoxSize / 6 + 4) {
        runOnJS(changePos)(7, 6);
      }

      // // 8
      // if (
      //   x8.value >  mainBoxSize / 6 + 4
      //   &&
      //   x8.value <=  mainBoxSize /  2 + 8
      //   &&
      //   y8.value > - mainBoxSize / 6 + 4
      // ) {
      //   runOnJS(changePos)(7, 7);
      // }

      // 9
      if (x8.value > mainBoxSize / 6 + 4 && y8.value > -mainBoxSize / 6 + 4) {
        runOnJS(changePos)(7, 8);
      }

      x8.value = withTiming(0, { duration: 300 });
      y8.value = withTiming(0, { duration: 300 }, () => {
        prior.value = 0;
      });
    },
  });

  const gestureHandler9 = useAnimatedGestureHandler({
    onStart: (e, c) => {
      c.startX = x9.value;
      c.startY = y9.value;
      runOnJS(timeR9)();
    },
    onActive: (e, c) => {
      if (drgE9.value && prior.value == 9) {
        let maxDragX = 0;
        let minDragX = -mainBoxSize / 1.5;
        let minDragY = -mainBoxSize / 1.5;
        let maxDragY = 0;

        if (
          e.translationX > minDragX &&
          e.translationX < maxDragX &&
          e.translationY > minDragY &&
          e.translationY < maxDragY
        ) {
          x9.value = c.startX + e.translationX;
          y9.value = c.startY + e.translationY;
        }
      }
    },
    onEnd: (e, c) => {
      // 2
      if (
        x9.value <= -mainBoxSize / 6 + 4 &&
        x9.value >= -mainBoxSize / 2 + 8 &&
        y9.value < -mainBoxSize / 2 + 8
      ) {
        runOnJS(changePos)(8, 1);
      }

      // 1
      if (x9.value < -mainBoxSize / 2 + 8 && y9.value < -mainBoxSize / 2 + 8) {
        runOnJS(changePos)(8, 0);
      }

      // 5
      if (
        y9.value >= -mainBoxSize / 2 + 8 &&
        y9.value < -mainBoxSize / 6 + 4 &&
        x9.value >= -mainBoxSize / 2 + 8 &&
        x9.value <= -mainBoxSize / 6 + 4
      ) {
        runOnJS(changePos)(8, 4);
      }

      // 3
      if (x9.value > -mainBoxSize / 6 + 4 && y9.value < -mainBoxSize / 2 + 8) {
        runOnJS(changePos)(8, 2);
      }

      // 4
      if (
        x9.value < -mainBoxSize / 2 + 8 &&
        y9.value <= -mainBoxSize / 6 + 4 &&
        y9.value >= -mainBoxSize / 2 + 8
      ) {
        runOnJS(changePos)(8, 3);
      }

      // 6
      if (
        x9.value > -mainBoxSize / 6 + 4 &&
        y9.value <= -mainBoxSize / 6 + 4 &&
        y9.value >= -mainBoxSize / 2 + 8
      ) {
        runOnJS(changePos)(8, 5);
      }

      // 7
      if (x9.value < -mainBoxSize / 2 + 8 && y9.value > -mainBoxSize / 6 + 4) {
        runOnJS(changePos)(8, 6);
      }

      // 8
      if (
        x9.value <= -mainBoxSize / 6 + 4 &&
        x9.value >= -mainBoxSize / 2 + 8 &&
        y9.value > -mainBoxSize / 6 + 4
      ) {
        runOnJS(changePos)(8, 7);
      }

      // // 9
      // if (
      //   x8.value > mainBoxSize / 6 + 4
      // &&
      //  y8.value > - mainBoxSize / 6 + 4
      //  ) {
      //   runOnJS(changePos)(8, 8);
      // }

      x9.value = withTiming(0, { duration: 300 });
      y9.value = withTiming(0, { duration: 300 }, () => {
        prior.value = 0;
      });
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      zIndex: prior.value == 1 ? 2 : 1,
      transform: [{ translateX: x.value }, { translateY: y.value }],
    };
  });

  const animatedStyle2 = useAnimatedStyle(() => {
    return {
      zIndex: prior.value == 2 ? 2 : 1,
      transform: [{ translateX: x2.value }, { translateY: y2.value }],
    };
  });

  const animatedStyle3 = useAnimatedStyle(() => {
    return {
      zIndex: prior.value == 3 ? 2 : 1,
      transform: [{ translateX: x3.value }, { translateY: y3.value }],
    };
  });

  const animatedStyle4 = useAnimatedStyle(() => {
    return {
      zIndex: prior.value == 4 ? 2 : 1,
      transform: [{ translateX: x4.value }, { translateY: y4.value }],
    };
  });

  const animatedStyle5 = useAnimatedStyle(() => {
    return {
      zIndex: prior.value == 5 ? 2 : 1,

      transform: [{ translateX: x5.value }, { translateY: y5.value }],
    };
  });

  const animatedStyle6 = useAnimatedStyle(() => {
    return {
      zIndex: prior.value == 6 ? 2 : 1,

      transform: [{ translateX: x6.value }, { translateY: y6.value }],
    };
  });

  const animatedStyle7 = useAnimatedStyle(() => {
    return {
      zIndex: prior.value == 7 ? 2 : 1,
      transform: [{ translateX: x7.value }, { translateY: y7.value }],
    };
  });

  const animatedStyle8 = useAnimatedStyle(() => {
    return {
      zIndex: prior.value == 8 ? 2 : 1,
      transform: [{ translateX: x8.value }, { translateY: y8.value }],
    };
  });

  const animatedStyle9 = useAnimatedStyle(() => {
    return {
      zIndex: prior.value == 9 ? 2 : 1,
      transform: [{ translateX: x9.value }, { translateY: y9.value }],
    };
  });

  // Pic Upload
  const [modalVisible, setmodalVisible] = useState(false);
  const [activeIndx, setactiveIndx] = useState(0);
  const [loading, setloading] = useState(false);
  const [loading_img, setloading_img] = useState(false);

  const [per_modal, setper_modal] = useState(false);
  const [per_type, setper_type] = useState(null);
  const [galler_per, setgaller_per] = useState(true);
  const [camera_per, setcamera_per] = useState(true);

  //All data states

  const [refresh, setrefresh] = useState(false);

  const [selected_pets_list, setselected_pets_list] = useState([]);

  const [city, setcity] = useState("");
  const [city_id, setcity_id] = useState(0);
  const [city_list, setcity_list] = useState([]);
  const [city_refresh, setcity_refresh] = useState(false);
  const [city_blr, setcity_blr] = useState(false);
  const [city_page, setcity_page] = useState(1);
  const [city_search, setcity_search] = useState("");

  const [height_cm, setheight_cm] = useState(0);
  const [height_blr, setheight_blr] = useState(true);

  const [gender, setgender] = useState("");
  const [gender_id, setgender_id] = useState(0);
  const [gender_list, setgender_list] = useState([]);
  const [gender_blr, setgender_blr] = useState(false);

  // Step 2
  const [preference, setpreference] = useState("");
  const [preference_id, setpreference_id] = useState(0);
  const [preference_list, setpreference_list] = useState([]);
  const [selected_preference_list, setselected_preference_list] = useState([]);
  const [preference_blr, setpreference_blr] = useState(false);

  const [education, seteducation] = useState("");
  const [education_id, seteducation_id] = useState(0);
  const [education_list, seteducation_list] = useState([]);
  const [education_blr, seteducation_blr] = useState(false);

  const [occupation, setoccupation] = useState("");
  const [occupation_id, setoccupation_id] = useState(0);
  const [occupation_list, setoccupation_list] = useState([]);
  const [occupation_blr, setoccupation_blr] = useState(true);

  const [habits_list, sethabits_list] = useState([
    [
      "Smoking",
      profile_data.userprofile.smoking,
      !profile_data.userprofile.smoking,
    ],
    [
      "Drinking",
      profile_data.userprofile.drinking,
      !profile_data.userprofile.drinking,
    ],
    [
      "Marijuana",
      profile_data.userprofile.marijuana,
      !profile_data.userprofile.marijuana,
    ],
  ]);
  const [habits_blr, sethabits_blr] = useState(false);

  // Step 3
  const [interests, setinterests] = useState("");
  const [interests_id, setinterests_id] = useState(0);
  const [interests_list, setinterests_list] = useState([]);
  const [selected_interests_list, setselected_interests_list] = useState([]);
  const [interests_blr, setinterests_blr] = useState(false);

  const [languages, setlanguages] = useState("");
  const [languages_id, setlanguages_id] = useState(0);
  const [languages_list, setlanguages_list] = useState([]);
  const [selected_languages_list, setselected_languages_list] = useState([]);
  const [languages_blr, setlanguages_blr] = useState(false);

  const [pets, setpets] = useState("");
  const [pets_id, setpets_id] = useState(0);
  const [pets_list, setpets_list] = useState([]);
  const [pets_blr, setpets_blr] = useState(false);

  const [political_inclination, setpolitical_inclination] = useState("");
  const [political_inclination_id, setpolitical_inclination_id] = useState(0);
  const [political_inclination_list, setpolitical_inclination_list] = useState(
    []
  );
  const [political_inclination_blr, setpolitical_inclination_blr] =
    useState(false);

  const prompts_list_all = useSelector((state) => state.allData.all_prompts);

  const [prompts_list, setprompts_list] = useState(prompts_list_all);
  const [prompts_list_rmv, setprompts_list_rmv] = useState([]);

  const [public_prompt1_a, setpublic_prompt1_a] = useState("");
  const [public_prompt1_blr, setpublic_prompt1_blr] = useState(false);
  const [public_prompt1_q, setpublic_prompt1_q] = useState("");
  const [public_prompt1_q_id, setpublic_prompt1_q_id] = useState(0);
  const [public_prompt1_q_blr, setpublic_prompt1_q_blr] = useState(false);
  const pup_q1_ref = useRef(null);
  const pup_a1_ref = useRef(null);

  const [public_prompt2_a, setpublic_prompt2_a] = useState("");
  const [public_prompt2_blr, setpublic_prompt2_blr] = useState(false);
  const [public_prompt2_q, setpublic_prompt2_q] = useState("");
  const [public_prompt2_q_id, setpublic_prompt2_q_id] = useState(0);
  const [public_prompt2_q_blr, setpublic_prompt2_q_blr] = useState(false);
  const pup_q2_ref = useRef(null);
  const pup_a2_ref = useRef(null);

  const [private_prompt1_a, setprivate_prompt1_a] = useState("");
  const [private_prompt1_blr, setprivate_prompt1_blr] = useState(false);
  const [private_prompt1_q, setprivate_prompt1_q] = useState("");
  const [private_prompt1_q_id, setprivate_prompt1_q_id] = useState(0);
  const [private_prompt1_q_blr, setprivate_prompt1_q_blr] = useState(false);
  const prp_q1_ref = useRef(null);
  const prp_a1_ref = useRef(null);

  const [private_prompt2_a, setprivate_prompt2_a] = useState("");
  const [private_prompt2_blr, setprivate_prompt2_blr] = useState(false);
  const [private_prompt2_q, setprivate_prompt2_q] = useState("");
  const [private_prompt2_q_id, setprivate_prompt2_q_id] = useState(0);
  const [private_prompt2_q_blr, setprivate_prompt2_q_blr] = useState(false);
  const prp_q2_ref = useRef(null);
  const prp_a2_ref = useRef(null);

  const ifFail = async (del_indx, tmp_a = []) => {
    if (tmp_a.length > 0) {
      if (del_indx == 0) {
        setpic1(tmp_a);
      } else if (del_indx == 1) {
        setpic2(tmp_a);
      } else if (del_indx == 2) {
        setpic3(tmp_a);
      } else if (del_indx == 3) {
        setpic4(tmp_a);
      } else if (del_indx == 4) {
        setpic5(tmp_a);
      } else if (del_indx == 5) {
        setpic6(tmp_a);
      } else if (del_indx == 6) {
        setpic7(tmp_a);
      } else if (del_indx == 7) {
        setpic8(tmp_a);
      } else if (del_indx == 8) {
        setpic9(tmp_a);
      }
    } else {
      if (del_indx == 0) {
        setpic1(["", "", true, "1", ""]);
      } else if (del_indx == 1) {
        setpic2(["", "", true, "2", ""]);
      } else if (del_indx == 2) {
        setpic3(["", "", true, "3", ""]);
      } else if (del_indx == 3) {
        setpic4(["", "", true, "4", ""]);
      } else if (del_indx == 4) {
        setpic5(["", "", true, "5", ""]);
      } else if (del_indx == 5) {
        setpic6(["", "", true, "6", ""]);
      } else if (del_indx == 6) {
        setpic7(["", "", true, "7", ""]);
      } else if (del_indx == 7) {
        setpic8(["", "", true, "8", ""]);
      } else if (del_indx == 8) {
        setpic9(["", "", true, "9", ""]);
      }
    }

    return true;
  };

  const atLast = async (tmp_lis) => {
    setpic1(tmp_lis[0]);
    setpic2(tmp_lis[1]);
    setpic3(tmp_lis[2]);
    setpic4(tmp_lis[3]);
    setpic5(tmp_lis[4]);
    setpic6(tmp_lis[5]);
    setpic7(tmp_lis[6]);
    setpic8(tmp_lis[7]);
    setpic9(tmp_lis[8]);
    setrefresh(!refresh);
  };

  const onNextPress = () => {
    saveProfileData();
    // updatePrompts()
  };

  const reArrangeList = async (indx) => {
    let tmp_lis = [pic1, pic2, pic3, pic4, pic5, pic6, pic7, pic8, pic9];

    tmp_lis.splice(indx, 1);
    tmp_lis.push(["", "", true, "2", ""]);

    for (let j = 0; j < tmp_lis.length; j++) {
      const ele = tmp_lis[j];
      ele[3] = j + 1;

      if (j > 0 && tmp_lis[j - 1][0] != "") {
        ele[2] = true;
      } else if (j == 0) {
        ele[2] = true;
      } else {
        ele[2] = false;
      }
    }

    dispatch(setProfileImgs(tmp_lis));
    await atLast(tmp_lis);
  };

  const deleteProfileImage = async (indx) => {
    setloading(true);
    let image_id = 0;
    if (indx == 0) {
      image_id = pic1[4];
    } else if (indx == 1) {
      image_id = pic2[4];
    } else if (indx == 2) {
      image_id = pic3[4];
    } else if (indx == 3) {
      image_id = pic4[4];
    } else if (indx == 4) {
      image_id = pic5[4];
    } else if (indx == 5) {
      image_id = pic6[4];
    } else if (indx == 6) {
      image_id = pic7[4];
    } else if (indx == 7) {
      image_id = pic8[4];
    } else if (indx == 8) {
      image_id = pic9[4];
    }

    const url = apiUrl + `userimage/${image_id}`;

    const headers = {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "multipart/form-data",
    };

    try {
      const resp = await axios.delete(url, {
        headers,
      });

      let code = resp.data.code;
      let data = resp.data.data;

      if (code == 200) {
        reArrangeList(indx);
        setloading(false);
      } else if (code == 401) {
        dispatch(setSessionExpired(true));
      } else {
        setloading(false);

        Alert.alert("Error", "While Deleting Image" + data);
      }
    } catch (error) {
      setloading(false);
      console.log("went  while del img", error);
      dispatch(setSessionExpired(true));
      Alert.alert("Error", "Something Went Wrong while del image");
    }
  };

  const saveProfileImage = async (mnImage, crpImage) => {
    setloading_img(true);

    let active_itm = [];
    if (activeIndx == 0) {
      active_itm = pic1;
    } else if (activeIndx == 1) {
      active_itm = pic2;
    } else if (activeIndx == 2) {
      active_itm = pic3;
    } else if (activeIndx == 3) {
      active_itm = pic4;
    } else if (activeIndx == 4) {
      active_itm = pic5;
    } else if (activeIndx == 5) {
      active_itm = pic6;
    } else if (activeIndx == 6) {
      active_itm = pic7;
    } else if (activeIndx == 7) {
      active_itm = pic8;
    } else if (activeIndx == 8) {
      active_itm = pic9;
    }

    const url = apiUrl + "userimage/";

    const headers = {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "multipart/form-data",
    };

    let prof_data = new FormData();

    prof_data.append("user_id", profile_data.user.id);
    prof_data.append("image", {
      uri: mnImage,
      name: `${profile_data.user.id}_image_${activeIndx}.jpg`,
      type: `image/jpg`,
    });

    prof_data.append("cropedimage", {
      uri: crpImage,
      name: `${profile_data.user.id}_cropedimage_${activeIndx}.jpg`,
      type: `image/jpg`,
    });

    prof_data.append("position", active_itm[3]);

    try {
      const resp = await axios.post(url, prof_data, {
        headers,
      });

      let data = resp.data.data;
      let code = resp.data.code;

      if (code == 200) {
        let n_img = data.image;
        let pid = data.id;
        let crp_imgd = data.cropedimage;

        let tmp_lis = [pic1, pic2, pic3, pic4, pic5, pic6, pic7, pic8, pic9];
        tmp_lis[activeIndx] = [n_img, crp_imgd, true, activeIndx + 1, pid];
        if (activeIndx == 0) {
          setpic1([n_img, crp_imgd, true, "1", pid]);

          if (!pic2[2]) {
            setpic2(["", "", true, "2", ""]);
            tmp_lis[activeIndx + 1] = ["", "", true, "2", ""];
          }
        } else if (activeIndx == 1) {
          setpic2([n_img, crp_imgd, true, "2", pid]);
          if (!pic3[2]) {
            setpic3(["", "", true, "3", ""]);
            tmp_lis[activeIndx + 1] = ["", "", true, "3", ""];
          }
        } else if (activeIndx == 2) {
          setpic3([n_img, crp_imgd, true, "3", pid]);
          if (!pic4[2]) {
            setpic4(["", "", true, "4", ""]);
            tmp_lis[activeIndx + 1] = ["", "", true, "4", ""];
          }
        } else if (activeIndx == 3) {
          setpic4([n_img, crp_imgd, true, "4", pid]);
          if (!pic5[2]) {
            setpic5(["", "", true, "5", ""]);
            tmp_lis[activeIndx + 1] = ["", "", true, "5", ""];
          }
        } else if (activeIndx == 4) {
          setpic5([n_img, crp_imgd, true, "5", pid]);
          if (!pic6[2]) {
            setpic6(["", "", true, "6", ""]);
            tmp_lis[activeIndx + 1] = ["", "", true, "6", ""];
          }
        } else if (activeIndx == 5) {
          setpic6([n_img, crp_imgd, true, "6", pid]);
          if (!pic7[2]) {
            setpic7(["", "", true, "7", ""]);
            tmp_lis[activeIndx + 1] = ["", "", true, "7", ""];
          }
        } else if (activeIndx == 6) {
          setpic7([n_img, crp_imgd, true, "7", pid]);
          if (!pic8[2]) {
            setpic8(["", "", true, "8", ""]);
            tmp_lis[activeIndx + 1] = ["", "", true, "8", ""];
          }
        } else if (activeIndx == 7) {
          setpic8([n_img, crp_imgd, true, "8", pid]);
          if (!pic9[2]) {
            setpic9(["", "", true, "9", ""]);
            tmp_lis[activeIndx + 1] = ["", "", true, "9", ""];
          }
        } else if (activeIndx == 8) {
          setpic9([n_img, crp_imgd, true, "9", pid]);
        }

        dispatch(setProfileImgs(tmp_lis));
        setrefresh(!refresh);

        setloading_img(false);
      } else if (code == 401) {
        dispatch(setSessionExpired(true));
      } else {
        setloading_img(false);
        Alert.alert("Error", "Some Error Occur" + resp.data.data);
        ifFail(activeIndx);
      }
    } catch (error) {
      setloading_img(false);
      ifFail(activeIndx);
      dispatch(setSessionExpired(true));
      console.log("went wrong error", error);

      Alert.alert("Error", "Something Went Wrong");
    }
  };

  const updateProfileImage = async (mnImage, crpImage, tmp_a) => {
    setloading_img(true);

    let active_itm = [];
    if (activeIndx == 0) {
      active_itm = pic1;
    } else if (activeIndx == 1) {
      active_itm = pic2;
    } else if (activeIndx == 2) {
      active_itm = pic3;
    } else if (activeIndx == 3) {
      active_itm = pic4;
    } else if (activeIndx == 4) {
      active_itm = pic5;
    } else if (activeIndx == 5) {
      active_itm = pic6;
    } else if (activeIndx == 6) {
      active_itm = pic7;
    } else if (activeIndx == 7) {
      active_itm = pic8;
    } else if (activeIndx == 8) {
      active_itm = pic9;
    }

    const url = apiUrl + `userimage/`;

    const headers = {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "multipart/form-data",
    };

    let prof_data = new FormData();

    prof_data.append("image_id", active_itm[4]);
    prof_data.append("image", {
      uri: mnImage,
      name: `${profile_data.user.id}_image_${activeIndx}.jpg`,
      type: `image/jpg`,
    });

    prof_data.append("cropedimage", {
      uri: crpImage,
      name: `${profile_data.user.id}_cropedimage_${activeIndx}.jpg`,
      type: `image/jpg`,
    });

    prof_data.append("position", active_itm[3]);

    try {
      const resp = await axios.put(url, prof_data, {
        headers,
      });

      let code = resp.data.code;
      let data = resp.data.data;

      if (code == 200) {
        let n_img = data.image;
        let pid = data.id;
        let crp_imgd = data.cropedimage;
        let tmp_lis = [pic1, pic2, pic3, pic4, pic5, pic6, pic7, pic8, pic9];
        tmp_lis[activeIndx] = [n_img, crp_imgd, true, activeIndx + 1, pid];
        if (activeIndx == 0) {
          setpic1([n_img, crp_imgd, true, "1", pid]);

          if (!pic2[2]) {
            setpic2(["", "", true, "2", ""]);
            tmp_lis[activeIndx + 1] = ["", "", true, "2", ""];
          }
        } else if (activeIndx == 1) {
          setpic2([n_img, crp_imgd, true, "2", pid]);
          if (!pic3[2]) {
            setpic3(["", "", true, "3", ""]);
            tmp_lis[activeIndx + 1] = ["", "", true, "3", ""];
          }
        } else if (activeIndx == 2) {
          setpic3([n_img, crp_imgd, true, "3", pid]);
          if (!pic4[2]) {
            setpic4(["", "", true, "4", ""]);
            tmp_lis[activeIndx + 1] = ["", "", true, "4", ""];
          }
        } else if (activeIndx == 3) {
          setpic4([n_img, crp_imgd, true, "4", pid]);
          if (!pic5[2]) {
            setpic5(["", "", true, "5", ""]);
            tmp_lis[activeIndx + 1] = ["", "", true, "5", ""];
          }
        } else if (activeIndx == 4) {
          setpic5([n_img, crp_imgd, true, "5", pid]);
          if (!pic6[2]) {
            setpic6(["", "", true, "6", ""]);
            tmp_lis[activeIndx + 1] = ["", "", true, "6", ""];
          }
        } else if (activeIndx == 5) {
          setpic6([n_img, crp_imgd, true, "6", pid]);
          if (!pic7[2]) {
            setpic7(["", "", true, "7", ""]);
            tmp_lis[activeIndx + 1] = ["", "", true, "7", ""];
          }
        } else if (activeIndx == 6) {
          setpic7([n_img, crp_imgd, true, "7", pid]);
          if (!pic8[2]) {
            setpic8(["", "", true, "8", ""]);
            tmp_lis[activeIndx + 1] = ["", "", true, "8", ""];
          }
        } else if (activeIndx == 7) {
          setpic8([n_img, crp_imgd, true, "8", pid]);
          if (!pic9[2]) {
            setpic9(["", "", true, "9", ""]);
            tmp_lis[activeIndx + 1] = ["", "", true, "9", ""];
          }
        } else if (activeIndx == 8) {
          setpic9([n_img, crp_imgd, true, "9", pid]);
        }

        dispatch(setProfileImgs(tmp_lis));
        setrefresh(!refresh);

        setloading_img(false);
      } else if (code == 401) {
        dispatch(setSessionExpired(true));
      } else {
        Alert.alert("Error", "Some Error Occur" + resp.data.data);
        setloading_img(false);
        ifFail(activeIndx, tmp_a);
      }
    } catch (error) {
      setloading_img(false);
      dispatch(setSessionExpired(true));
      ifFail(activeIndx, tmp_a);

      console.log("went wrong error", error);

      Alert.alert("Error", "Something Went Wrong");
    }
  };

  const compressImg = async (img) => {
    // Compressor
    const compr_img = await CompImage.compress(img, {
      compressionMethod: "auto",
    });
    return compr_img;
  };

  const getSize = async (img) => {
    const statResult = await stat(img);
    return statResult.size / 1024 / 1024;
  };

  const finalLoad = async (img, crp_img) => {
    // let bf_nsize = await getSize(img)
    // let bf_csize = await getSize(crp_img)

    let n_img = await compressImg(img);
    let comp_crp_img = await compressImg(crp_img);

    // let af_nsize = await getSize(n_img)
    // let af_csize = await getSize(comp_crp_img)

    if (activeIndx == 0) {
      let tmp_a = pic1;
      setpic1([n_img, comp_crp_img, false, "1", ""]);
      if (pic1[0] == "") {
        saveProfileImage(n_img, comp_crp_img);
      } else {
        updateProfileImage(n_img, comp_crp_img, tmp_a);
      }
    } else if (activeIndx == 1) {
      let tmp_a = pic2;
      setpic2([n_img, comp_crp_img, false, "2", ""]);
      if (pic2[0] == "") {
        saveProfileImage(n_img, comp_crp_img);
      } else {
        updateProfileImage(n_img, comp_crp_img, tmp_a);
      }
    } else if (activeIndx == 2) {
      let tmp_a = pic3;
      setpic3([n_img, comp_crp_img, false, "3", ""]);
      if (pic3[0] == "") {
        saveProfileImage(n_img, comp_crp_img);
      } else {
        updateProfileImage(n_img, comp_crp_img, tmp_a);
      }
    } else if (activeIndx == 3) {
      let tmp_a = pic4;
      setpic4([n_img, comp_crp_img, false, "4", ""]);
      if (pic4[0] == "") {
        saveProfileImage(n_img, comp_crp_img);
      } else {
        updateProfileImage(n_img, comp_crp_img, tmp_a);
      }
    } else if (activeIndx == 4) {
      let tmp_a = pic5;
      setpic5([n_img, comp_crp_img, false, "5", ""]);
      if (pic5[0] == "") {
        saveProfileImage(n_img, comp_crp_img);
      } else {
        updateProfileImage(n_img, comp_crp_img, tmp_a);
      }
    } else if (activeIndx == 5) {
      let tmp_a = pic6;
      setpic6([n_img, comp_crp_img, false, "6", ""]);
      if (pic6[0] == "") {
        saveProfileImage(n_img, comp_crp_img);
      } else {
        updateProfileImage(n_img, comp_crp_img, tmp_a);
      }
    } else if (activeIndx == 6) {
      let tmp_a = pic7;
      setpic7([n_img, comp_crp_img, false, "7", ""]);
      if (pic7[0] == "") {
        saveProfileImage(n_img, comp_crp_img);
      } else {
        updateProfileImage(n_img, comp_crp_img, tmp_a);
      }
    } else if (activeIndx == 7) {
      let tmp_a = pic8;
      setpic8([n_img, comp_crp_img, false, "8", ""]);
      if (pic8[0] == "") {
        saveProfileImage(n_img, comp_crp_img);
      } else {
        updateProfileImage(n_img, comp_crp_img, tmp_a);
      }
    } else if (activeIndx == 8) {
      let tmp_a = pic9;
      setpic9([n_img, comp_crp_img, false, "9", ""]);
      if (pic9[0] == "") {
        saveProfileImage(n_img, comp_crp_img);
      } else {
        updateProfileImage(n_img, comp_crp_img, tmp_a);
      }
    }

    setmodalVisible(false);
  };

  const cropImg = async (img) => {
    ImageCropPicker.openCropper({
      path: img,
      width: 300,
      height: 300,
    }).then((image) => {
      let crp_img = image.path;
      finalLoad(img, crp_img);
    });
  };

  // const cropImg = img => {
  //   ImageCropPicker.openCropper({
  //     path: img,
  //     width: 300,
  //     height: 300,
  //   }).then(image => {
  //     let crp_img = image.path;

  //     if (activeIndx == 0) {
  //       let tmp_a = pic1;
  //       setpic1([img, crp_img, false, '1', '']);
  //       if (pic1[0] == '') {
  //         saveProfileImage(img, crp_img);
  //       } else {
  //         updateProfileImage(img, crp_img, tmp_a);
  //       }
  //     } else if (activeIndx == 1) {
  //       let tmp_a = pic2;
  //       setpic2([img, crp_img, false, '2', '']);
  //       if (pic2[0] == '') {
  //         saveProfileImage(img, crp_img);
  //       } else {
  //         updateProfileImage(img, crp_img, tmp_a);
  //       }
  //     } else if (activeIndx == 2) {
  //       let tmp_a = pic3;
  //       setpic3([img, crp_img, false, '3', '']);
  //       if (pic3[0] == '') {
  //         saveProfileImage(img, crp_img);
  //       } else {
  //         updateProfileImage(img, crp_img, tmp_a);
  //       }
  //     } else if (activeIndx == 3) {
  //       let tmp_a = pic4;
  //       setpic4([img, crp_img, false, '4', '']);
  //       if (pic4[0] == '') {
  //         saveProfileImage(img, crp_img);
  //       } else {
  //         updateProfileImage(img, crp_img, tmp_a);
  //       }
  //     } else if (activeIndx == 4) {
  //       let tmp_a = pic5;
  //       setpic5([img, crp_img, false, '5', '']);
  //       if (pic5[0] == '') {
  //         saveProfileImage(img, crp_img);
  //       } else {
  //         updateProfileImage(img, crp_img, tmp_a);
  //       }
  //     } else if (activeIndx == 5) {
  //       let tmp_a = pic6;
  //       setpic6([img, crp_img, false, '6', '']);
  //       if (pic6[0] == '') {
  //         saveProfileImage(img, crp_img);
  //       } else {
  //         updateProfileImage(img, crp_img, tmp_a);
  //       }
  //     } else if (activeIndx == 6) {
  //       let tmp_a = pic7;
  //       setpic7([img, crp_img, false, '7', '']);
  //       if (pic7[0] == '') {
  //         saveProfileImage(img, crp_img);
  //       } else {
  //         updateProfileImage(img, crp_img, tmp_a);
  //       }
  //     } else if (activeIndx == 7) {
  //       let tmp_a = pic8;
  //       setpic8([img, crp_img, false, '8', '']);
  //       if (pic8[0] == '') {
  //         saveProfileImage(img, crp_img);
  //       } else {
  //         updateProfileImage(img, crp_img, tmp_a);
  //       }
  //     } else if (activeIndx == 8) {
  //       let tmp_a = pic9;
  //       setpic9([img, crp_img, false, '9', '']);
  //       if (pic9[0] == '') {
  //         saveProfileImage(img, crp_img);
  //       } else {
  //         updateProfileImage(img, crp_img, tmp_a);
  //       }
  //     }

  //     setmodalVisible(false);
  //   });
  // };

  // To Open Camera
  const cameraLaunch = () => {
    ImageCropPicker.openCamera({
      width: 300,
      height: 400,
    })
      .then((image) => {
        cropImg(image.path);
      })
      .catch((err) => {
        if (err.message == "User did not grant camera permission.") {
          setcamera_per(false);
        }
      });
  };

  // To Open Gallery
  const imageGalleryLaunch = () => {
    ImageCropPicker.openPicker({
      // cropping: true,
      width: 300,
      height: 400,
      avoidEmptySpaceAroundImage: false,
      // cropperCircleOverlay: true,
      // freeStyleCropEnabled: true,
      mediaType: "photo",
    })
      .then((image) => {
        cropImg(image.path);
      })
      .catch((err) => {
        if (
          Platform.OS == "ios" &&
          err.message == "User did not grant library permission."
        ) {
          setgaller_per(false);
        }
      });
  };

  // Request Camera and Gallery Permission
  const requestCameraPermission = async (fcn) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: "App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        fcn();
      } else {
        setgaller_per(false);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getLocation = async (page, onpage = false) => {
    setcity_refresh(true);

    let data = {
      location: city_search,
    };

    await axios
      .post(apiUrl + `GetLocation/?page=${page}`, data)
      .then((resp) => {
        if (resp.data.code == 200) {
          setcity_refresh(false);

          let f_list = [];
          if (onpage) {
            f_list = [...city_list];
          }
          let tmp_cities = [];

          if (resp.data.data.city.length > 0) {
            tmp_cities = resp.data.data.city.map((v) => [
              v.id,
              v?.city_name +
                ", " +
                v?.state?.state_name +
                ", " +
                v?.state?.country?.country_name,
            ]);
          }

          f_list.push(...tmp_cities);

          setcity_list(f_list);
        } else {
          setcity_refresh(false);

          console.warn("Error occur while getting Location");
        }
      })
      .catch((err) => {
        setcity_refresh(false);
        dispatch(setSessionExpired(true));
        console.log("getLocation err", err);
      });
  };

  const setPrompts = async () => {
    let pub_prmt = profile_data?.userpublicprompts;
    let prv_prmt = profile_data?.userprivateprompts;

    let rmv_ls = [];

    if (pub_prmt.length > 0) {
      setpublic_prompt1_q(pub_prmt[0][0]);
      setpublic_prompt1_q_id(pub_prmt[0][0][0]);
      setpublic_prompt1_a(pub_prmt[0][1]);
      setpublic_prompt2_q(pub_prmt[1][0]);
      setpublic_prompt2_q_id(pub_prmt[1][0][0]);
      setpublic_prompt2_a(pub_prmt[1][1]);

      rmv_ls.push(pub_prmt[0][0][0]);
      rmv_ls.push(pub_prmt[1][0][0]);
    }

    if (prv_prmt.length > 0) {
      setprivate_prompt1_q(prv_prmt[0][0]);
      setprivate_prompt1_q_id(prv_prmt[0][0][0]);
      setprivate_prompt1_a(prv_prmt[0][1]);

      setprivate_prompt2_q(prv_prmt[1][0]);
      setprivate_prompt2_q_id(prv_prmt[1][0][0]);
      setprivate_prompt2_a(prv_prmt[1][1]);

      rmv_ls.push(prv_prmt[0][0][0]);
      rmv_ls.push(prv_prmt[1][0][0]);
    }

    setprompts_list_rmv(rmv_ls);
  };

  const showConfirmDialog = () => {
    return Alert.alert("Are You Sure?", "You want to discard your changes", [
      {
        text: "Cancel",
      },
      {
        text: "OK",
        onPress: () => {
          navigation.navigate("ProfileMain");

          // setOtpShowBox(true);
          // signInWithPhoneNumber(`+${selected_ph_code?.phone}  ${ph_no}`);
        },
      },
    ]);
  };

  const getGenders = async () => {
    await axios
      .get(apiUrl + "getactivegender/")
      .then((resp) => {
        if (resp.status == 200) {
          let tmp = resp.data.data;

          let sorted_tmp = tmp.sort(function (a, b) {
            return a["position"] - b["position"];
          });

          let tmp_lis = sorted_tmp.map((v) => [v.id, v.gender]);

          setgender_list(tmp_lis);

          setpreference_list(tmp_lis);
        } else {
          console.warn("Error occur while getting Genders");
        }
      })
      .catch((err) => {
        dispatch(setSessionExpired(true));

        console.log("getGenders err", err);
      });
  };

  const getEducation = async () => {
    await axios
      .get(apiUrl + "getactiveeducation/")
      .then((resp) => {
        if (resp.status == 200) {
          let tmp = resp.data.data;

          let sorted_tmp = tmp.sort(function (a, b) {
            return a["position"] - b["position"];
          });

          let tmp_lis = sorted_tmp.map((v) => [v.id, v.education]);

          seteducation_list(tmp_lis);
        } else {
          console.warn("Error occur while getting Education");
        }
      })
      .catch((err) => {
        dispatch(setSessionExpired(true));

        console.log("getEducations err", err);
      });
  };

  const getInterests = async () => {
    await axios
      .get(apiUrl + "getactiveinterest/")
      .then((resp) => {
        if (resp.status == 200) {
          let tmp = resp.data.data;

          let sorted_tmp = tmp.sort(function (a, b) {
            return a["position"] - b["position"];
          });

          let tmp_lis = sorted_tmp.map((v) => [
            v.id,
            v.interest,
            v.iconblue,
            v.icongrey,
          ]);

          setinterests_list(tmp_lis);
        } else {
          console.warn("Error occur while getInterests");
        }
      })
      .catch((err) => {
        dispatch(setSessionExpired(true));

        console.log("getInterests err", err);
      });
  };

  const getLanguages = async () => {
    await axios
      .get(apiUrl + "getactivelanguage/")
      .then((resp) => {
        if (resp.status == 200) {
          let tmp = resp.data.data;

          let sorted_tmp = tmp.sort(function (a, b) {
            return a["position"] - b["position"];
          });

          let tmp_lis = sorted_tmp.map((v) => [v.id, v.language]);

          setlanguages_list(tmp_lis);
        } else {
          console.warn("Error occur while getLanguages");
        }
      })
      .catch((err) => {
        dispatch(setSessionExpired(true));

        console.log("getLanguages err", err);
      });
  };

  const getPets = async () => {
    await axios
      .get(apiUrl + "getactivepets/")
      .then((resp) => {
        if (resp.status == 200) {
          let tmp = resp.data.data;

          let sorted_tmp = tmp.sort(function (a, b) {
            return a["position"] - b["position"];
          });

          let tmp_lis = sorted_tmp.map((v) => [
            v.id,
            v.pets,
            v.iconblue,
            v.icongrey,
          ]);

          setpets_list(tmp_lis);
        } else {
          console.warn("Error occur while getPets");
        }
      })
      .catch((err) => {
        dispatch(setSessionExpired(true));

        console.log("getPets err", err);
      });
  };

  const getPoliticalInclinations = async () => {
    await axios
      .get(apiUrl + "getactivepoliticalinclination/")
      .then((resp) => {
        if (resp.status == 200) {
          let tmp = resp.data.data;

          let sorted_tmp = tmp.sort(function (a, b) {
            return a["position"] - b["position"];
          });

          let tmp_lis = sorted_tmp.map((v) => [v.id, v.political_inclination]);

          setpolitical_inclination_list(tmp_lis);
        } else {
          console.warn("Error occur while getPoliticalInclination");
        }
      })
      .catch((err) => {
        dispatch(setSessionExpired(true));

        console.log("getPoliticalInclination err", err);
      });
  };

  const saveProfileData = async () => {
    setloading(true);

    // Set the API endpoint URL

    const url = apiUrl + "profile/";

    // Set the headers and token

    const headers = {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    };

    const data = {
      user_id: profile_data.user.id, //data should be in integer

      name: profile_data.userprofile.name,

      dob: profile_data.userprofile.dob.split("T")[0],

      city: city[1],

      height: height_cm,

      gender: gender[1],

      education: education[1],

      occupation: occupation,

      smoking: habits_list[0][1] == true ? 1 : 0, //data should be boolean value either true or false

      drinking: habits_list[1][1] == true ? 1 : 0,

      marijuana: habits_list[2][1] == true ? 1 : 0,

      politicalinclination: political_inclination[1],

      prefrance: selected_preference_list, //ids form gendermaster table

      interest: selected_interests_list, //ids from intresmaster table

      language: selected_languages_list, //ids from languagemaster table

      pets: selected_pets_list,
    };

    try {
      const resp = await axios.post(url, data, { headers });
      setchanges_made(false);

      let code = resp.data.code;
      let user_data = resp.data.data;

      let user_prof_data = {
        user: user_data.user,
        userinterest: user_data.userinterest,
        userlanguages: user_data.userlanguages,
        userpets: user_data.userpets,
        userpreferances: selected_preference_list,
        userprofile: user_data.userprofile,
        userprivateprompts: [],
        userpublicprompts: [],
      };

      if (code == 200) {
        if (profile_data?.userprivateprompts.length > 0) {
          updatePrompts(user_prof_data);
        } else {
          setloading(false);
          dispatch(setProfiledata(user_prof_data));
          navigation.navigate("ProfileMain");
        }
      } else if (code == 401) {
        dispatch(setSessionExpired(true));
      } else {
        setloading(false);

        Alert.alert("Error", "Some Error Occur" + resp.data.data);
      }
    } catch (error) {
      setloading(false);
      dispatch(setSessionExpired(true));
      console.log("saveProfileData error", error);

      Alert.alert("saveProfileData Error", "Something Went Wrong");
    }
  };

  const updatePrompts = async (user_prof_data) => {
    const url = apiUrl + "createuserpormpts/";

    const headers = {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    };

    const data = {
      userid: profile_data.user.id,
      publicprompts: [
        {
          prompstid: public_prompt1_q_id,
          answer: public_prompt1_a,
        },
        {
          prompstid: public_prompt2_q_id,
          answer: public_prompt2_a,
        },
      ],
      privateprompts: [
        {
          prompstid: private_prompt1_q_id,
          answer: private_prompt1_a,
        },
        {
          prompstid: private_prompt2_q_id,
          answer: private_prompt2_a,
        },
      ],
    };

    try {
      const resp = await axios.put(url, data, { headers });

      setchanges_made(false);

      let code = resp.data.code;

      if (code == 200) {
        let user_prof_datap = {
          ...user_prof_data,
          userpublicprompts: [
            [public_prompt1_q, public_prompt1_a],
            [public_prompt2_q, public_prompt2_a],
          ],
          userprivateprompts: [
            [private_prompt1_q, private_prompt1_a],
            [private_prompt2_q, private_prompt2_a],
          ],
        };

        dispatch(setProfiledata(user_prof_datap));
        setloading(false);
        navigation.navigate("ProfileMain");
      } else if (code == 401) {
        dispatch(setSessionExpired(true));
        setloading(false);
      } else {
        Alert.alert("updatePrompts Error", "Some Error Occur" + resp.data.data);
      }
    } catch (error) {
      // setchanges_made(false)

      setloading(false);
      dispatch(setSessionExpired(true));

      console.log("updatePrompts error", error);

      Alert.alert("updatePrompts Error", "Something Went Wrong");
    }
  };

  useEffect(() => {
    if (prompts_list.length > 0) {
      setPrompts();
    }
  }, []);

  useLayoutEffect(() => {
    // getLocation(city_page);

    getGenders();
    getEducation();
    getInterests();
    getLanguages();
    getPets();
    getPoliticalInclinations();

    let usr_profile = profile_data.userprofile;
    setheight_cm(usr_profile.height.toString());
    setoccupation(usr_profile.occupation);

    atLast(profile_imgs);

    if (prompts_list_all.length > 0) {
      setPrompts();
    }
  }, []);

  let usr_profile = profile_data.userprofile;
  let usr_preference = profile_data.userpreferances;

  let usr_interest = profile_data.userinterest.map((v) => v.interestmaster.id);
  let usr_languages = profile_data.userlanguages.map(
    (v) => v.languagemaster.id
  );
  let usr_pets = profile_data.userpets.map((v) => v.petmaster.id);

  useEffect(() => {
    if (education_list.length > 0) {
      let eduction_id = education_list.find(
        (v) => v[1] == usr_profile.education
      );

      seteducation([eduction_id, usr_profile.education]);
    }
  }, [education_list]);

  useEffect(() => {
    if (interests_list.length > 0) {
      setselected_interests_list(usr_interest);
    }
  }, [interests_list]);

  useEffect(() => {
    if (languages_list.length > 0) {
      setselected_languages_list(usr_languages);
    }
  }, [languages_list]);

  useEffect(() => {
    if (pets_list.length > 0 && usr_pets.length > 0) {
      setselected_pets_list(usr_pets);
    }
  }, [pets_list]);

  useEffect(() => {
    if (gender_list.length > 0) {
      let gender_id = gender_list?.find((v) => v[1] == usr_profile?.gender)[0];

      setgender_id(gender_id);
      setgender([gender_id, usr_profile.gender]);
    }
  }, [gender_list]);

  useEffect(() => {
    setcity([1, usr_profile.city]);
  }, []);

  useEffect(() => {
    if (
      political_inclination_list.length > 0 &&
      usr_profile.politicalinclination != ""
    ) {
      let political_inclination_dt = political_inclination_list.find(
        (v) =>
          v[1].toLowerCase() == usr_profile.politicalinclination.toLowerCase()
      );

      setpolitical_inclination([
        political_inclination_dt[0],
        political_inclination_dt[1],
      ]);
    }
  }, [political_inclination_list]);

  useEffect(() => {
    if (preference_list.length > 0) {
      setselected_preference_list(usr_preference);
    }
  }, [preference_list]);

  useEffect(() => {
    if (!galler_per) {
      setmodalVisible(false);
      setper_modal(true);
      setper_type("gallery");
      setgaller_per(true);
    } else if (!camera_per) {
      setmodalVisible(false);
      setper_modal(true);
      setper_type("camera");
      setcamera_per(true);
    }

    if (appStateVisible != "active") {
      setper_modal(false);
    }
  }, [galler_per, camera_per, appStateVisible]);

  return (
    <>
      {loading && <Loader />}
      <SafeAreaView style={{ height: scrn_height, backgroundColor: "#fff" }}>
        <SafeAreaView
          style={{
            flex: 1,
            position: "relative",
          }}
        >
          <View
            style={{
              paddingTop: rspH(3),
              paddingHorizontal: rspW(10),
            }}
          >
            <FormHeader
              title="Edit My Profile"
              left_icon={true}
              onPress={() => {
                if (changes_made == true) {
                  showConfirmDialog();
                  return;
                }

                navigation.navigate("ProfileMain");
              }}
            />
          </View>

          <View
            style={{
              flex: 1,
              paddingBottom: rspH(9.4),
              alignItems: "center",
              backgroundColor: colors.white,
            }}
          >
            <KeyboardAwareScrollView
              ref={scrollViewRef}
              onScroll={(event) => {
                const { y } = event.nativeEvent.contentOffset;

                setcurrent_pos(y);
              }}
              enableOnAndroid={true}
              extraScrollHeight={Platform.OS == "ios" ? 0 : scrn_height / 6}
              extraHeight={Platform.OS == "ios" ? scrn_height / 6 : 0}
              style={{ flex: 1, backgroundColor: "#fff" }}
              bounces={false}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={{
                  paddingHorizontal: rspW(10),
                }}
              >
                {/* Inputs Container*/}
                <View style={{ ...styles.inputCont }}>
                  <GestureHandlerRootView
                    style={{
                      // backgroundColor: 'green',
                      flexDirection: "row",
                      position: "relative",
                      flexWrap: "wrap",
                      // borderWidth: 1,
                      // borderColor: '#000',
                      width: mainBoxSize,
                      height: mainBoxSize,
                    }}
                  >
                    <PanGestureHandler onGestureEvent={gestureHandler1}>
                      <Animated.View
                        style={[
                          {
                            position: "absolute",
                            zIndex: 0,
                            top: 0,
                            left: 0,
                            opacity: pic1[0] != "" || pic1[2] ? 1 : 0.5,
                          },
                          animatedStyle,
                        ]}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            if (pic1[2]) {
                              setmodalVisible(true);
                              setactiveIndx(0);
                            }
                          }}
                          style={styles.uploadSec}
                        >
                          {pic1[0] != "" ? (
                            <View style={{ position: "relative" }}>
                              {loading_img && activeIndx == 0 && (
                                <View
                                  style={{
                                    width: rspW(23),
                                    height: rspW(23),
                                    position: "absolute",

                                    alignSelf: "center",

                                    borderRadius: rspW(2.5),

                                    backgroundColor: "#0000003c",
                                    // backgroundColor:'red',

                                    zIndex: 100,

                                    justifyContent: "center",
                                  }}
                                >
                                  <ActivityIndicator
                                    size="large"
                                    color={colors.blue}
                                    style={{ alignSelf: "center" }}
                                  />
                                </View>
                              )}

                              <Image
                                // source={{uri: `data:image/gif;base64,${itm[0]}`}}
                                source={{ uri: `${pic1[1]}` }}
                                resizeMode="cover"
                                style={{
                                  width: rspW(23),
                                  height: rspW(23),
                                  borderRadius: rspW(2.5),
                                }}
                              />
                              {[
                                pic1,
                                pic2,
                                pic3,
                                pic4,
                                pic5,
                                pic6,
                                pic7,
                                pic8,
                                pic9,
                              ].filter((v) => v[0] != "").length > 3 && (
                                <TouchableOpacity
                                  onPress={() => {
                                    deleteProfileImage(0);
                                  }}
                                  style={{
                                    position: "absolute",
                                    right: rspW(-2.5),
                                    top: rspW(-2.5),
                                    backgroundColor: "#fff",
                                    borderRadius: rspW(6),
                                  }}
                                >
                                  <ADIcon
                                    name="minuscircle"
                                    size={20}
                                    color={colors.error}
                                  />
                                </TouchableOpacity>
                              )}
                              <View
                                style={{
                                  ...styles.positionCont,
                                }}
                              >
                                <Text
                                  style={{
                                    ...styles.positionTxt,
                                  }}
                                >
                                  1
                                </Text>
                              </View>
                            </View>
                          ) : (
                            <Ionicon
                              name="md-add-circle-sharp"
                              size={30}
                              color={pic1[2] ? colors.blue : "#cccccc"}
                            />
                          )}
                        </TouchableOpacity>
                      </Animated.View>
                    </PanGestureHandler>

                    <PanGestureHandler onGestureEvent={gestureHandler2}>
                      <Animated.View
                        style={[
                          {
                            position: "absolute",
                            zIndex: 0,
                            top: 0,
                            left: mainBoxSize / 3,
                            opacity: pic2[0] != "" || pic2[2] ? 1 : 0.5,
                          },
                          animatedStyle2,
                        ]}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            if (pic2[2]) {
                              setmodalVisible(true);
                              setactiveIndx(1);
                            }
                          }}
                          style={styles.uploadSec}
                        >
                          {pic2[0] != "" ? (
                            <View style={{ position: "relative" }}>
                              {loading_img && activeIndx == 1 && (
                                <View
                                  style={{
                                    width: rspW(23),
                                    height: rspW(23),
                                    position: "absolute",

                                    alignSelf: "center",

                                    borderRadius: rspW(2.5),

                                    backgroundColor: "#0000003c",
                                    // backgroundColor:'red',

                                    zIndex: 100,

                                    justifyContent: "center",
                                  }}
                                >
                                  <ActivityIndicator
                                    size="large"
                                    color={colors.blue}
                                    style={{ alignSelf: "center" }}
                                  />
                                </View>
                              )}

                              <Image
                                // source={{uri: `data:image/gif;base64,${itm[0]}`}}
                                source={{ uri: `${pic2[1]}` }}
                                resizeMode="cover"
                                style={{
                                  width: rspW(23),
                                  height: rspW(23),
                                  borderRadius: rspW(2.5),
                                }}
                              />
                              {[
                                pic1,
                                pic2,
                                pic3,
                                pic4,
                                pic5,
                                pic6,
                                pic7,
                                pic8,
                                pic9,
                              ].filter((v) => v[0] != "").length > 3 && (
                                <TouchableOpacity
                                  onPress={() => {
                                    deleteProfileImage(1);
                                  }}
                                  style={{
                                    position: "absolute",
                                    right: rspW(-2.5),
                                    top: rspW(-2.5),
                                    backgroundColor: "#fff",
                                    borderRadius: rspW(6),
                                  }}
                                >
                                  <ADIcon
                                    name="minuscircle"
                                    size={20}
                                    color={colors.error}
                                  />
                                </TouchableOpacity>
                              )}
                              <View
                                style={{
                                  ...styles.positionCont,
                                }}
                              >
                                <Text
                                  style={{
                                    ...styles.positionTxt,
                                  }}
                                >
                                  2
                                </Text>
                              </View>
                            </View>
                          ) : (
                            <Ionicon
                              name="md-add-circle-sharp"
                              size={30}
                              color={pic2[2] ? colors.blue : "#cccccc"}
                            />
                          )}
                        </TouchableOpacity>
                      </Animated.View>
                    </PanGestureHandler>

                    <PanGestureHandler onGestureEvent={gestureHandler3}>
                      <Animated.View
                        style={[
                          {
                            position: "absolute",
                            zIndex: 0,
                            top: 0,
                            left: mainBoxSize / 1.5,
                            opacity: pic3[0] != "" || pic3[2] ? 1 : 0.5,
                          },
                          animatedStyle3,
                        ]}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            if (pic3[2]) {
                              setmodalVisible(true);
                              setactiveIndx(2);
                            }
                          }}
                          style={styles.uploadSec}
                        >
                          {pic3[0] != "" ? (
                            <View style={{ position: "relative" }}>
                              {loading_img && activeIndx == 2 && (
                                <View
                                  style={{
                                    width: rspW(23),
                                    height: rspW(23),
                                    position: "absolute",

                                    alignSelf: "center",

                                    borderRadius: rspW(2.5),

                                    backgroundColor: "#0000003c",
                                    // backgroundColor:'red',

                                    zIndex: 100,

                                    justifyContent: "center",
                                  }}
                                >
                                  <ActivityIndicator
                                    size="large"
                                    color={colors.blue}
                                    style={{ alignSelf: "center" }}
                                  />
                                </View>
                              )}

                              <Image
                                // source={{uri: `data:image/gif;base64,${itm[0]}`}}
                                source={{ uri: `${pic3[1]}` }}
                                resizeMode="cover"
                                style={{
                                  width: rspW(23),
                                  height: rspW(23),
                                  borderRadius: rspW(2.5),
                                }}
                              />
                              {[
                                pic1,
                                pic2,
                                pic3,
                                pic4,
                                pic5,
                                pic6,
                                pic7,
                                pic8,
                                pic9,
                              ].filter((v) => v[0] != "").length > 3 && (
                                <TouchableOpacity
                                  onPress={() => {
                                    deleteProfileImage(2);
                                  }}
                                  style={{
                                    position: "absolute",
                                    right: rspW(-2.5),
                                    top: rspW(-2.5),
                                    backgroundColor: "#fff",
                                    borderRadius: rspW(6),
                                  }}
                                >
                                  <ADIcon
                                    name="minuscircle"
                                    size={20}
                                    color={colors.error}
                                  />
                                </TouchableOpacity>
                              )}
                              <View
                                style={{
                                  ...styles.positionCont,
                                }}
                              >
                                <Text
                                  style={{
                                    ...styles.positionTxt,
                                  }}
                                >
                                  3
                                </Text>
                              </View>
                            </View>
                          ) : (
                            <Ionicon
                              name="md-add-circle-sharp"
                              size={30}
                              color={pic3[2] ? colors.blue : "#cccccc"}
                            />
                          )}
                        </TouchableOpacity>
                      </Animated.View>
                    </PanGestureHandler>

                    <PanGestureHandler onGestureEvent={gestureHandler4}>
                      <Animated.View
                        style={[
                          {
                            position: "absolute",
                            zIndex: 0,
                            top: mainBoxSize / 3,
                            left: 0,
                            opacity: pic4[0] != "" || pic4[2] ? 1 : 0.5,
                          },
                          animatedStyle4,
                        ]}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            if (pic4[2]) {
                              setmodalVisible(true);
                              setactiveIndx(3);
                            }
                          }}
                          style={styles.uploadSec}
                        >
                          {pic4[0] != "" ? (
                            <View style={{ position: "relative" }}>
                              {loading_img && activeIndx == 3 && (
                                <View
                                  style={{
                                    width: rspW(23),
                                    height: rspW(23),
                                    position: "absolute",

                                    alignSelf: "center",

                                    borderRadius: rspW(2.5),

                                    backgroundColor: "#0000003c",
                                    // backgroundColor:'red',

                                    zIndex: 100,

                                    justifyContent: "center",
                                  }}
                                >
                                  <ActivityIndicator
                                    size="large"
                                    color={colors.blue}
                                    style={{ alignSelf: "center" }}
                                  />
                                </View>
                              )}

                              <Image
                                source={{ uri: `${pic4[1]}` }}
                                resizeMode="cover"
                                style={{
                                  width: rspW(23),
                                  height: rspW(23),
                                  borderRadius: rspW(2.5),
                                }}
                              />
                              {[
                                pic1,
                                pic2,
                                pic3,
                                pic4,
                                pic5,
                                pic6,
                                pic7,
                                pic8,
                                pic9,
                              ].filter((v) => v[0] != "").length > 3 && (
                                <TouchableOpacity
                                  onPress={() => {
                                    deleteProfileImage(3);
                                  }}
                                  style={{
                                    position: "absolute",
                                    right: rspW(-2.5),
                                    top: rspW(-2.5),
                                    backgroundColor: "#fff",
                                    borderRadius: rspW(6),
                                  }}
                                >
                                  <ADIcon
                                    name="minuscircle"
                                    size={20}
                                    color={colors.error}
                                  />
                                </TouchableOpacity>
                              )}
                              <View
                                style={{
                                  ...styles.positionCont,
                                }}
                              >
                                <Text
                                  style={{
                                    ...styles.positionTxt,
                                  }}
                                >
                                  4
                                </Text>
                              </View>
                            </View>
                          ) : (
                            <Ionicon
                              name="md-add-circle-sharp"
                              size={30}
                              color={pic4[2] ? colors.blue : "#cccccc"}
                            />
                          )}
                        </TouchableOpacity>
                      </Animated.View>
                    </PanGestureHandler>
                    <PanGestureHandler onGestureEvent={gestureHandler5}>
                      <Animated.View
                        style={[
                          {
                            position: "absolute",
                            zIndex: 0,
                            top: mainBoxSize / 3,
                            left: mainBoxSize / 3,
                            opacity: pic5[0] != "" || pic5[2] ? 1 : 0.5,
                          },
                          animatedStyle5,
                        ]}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            if (pic5[2]) {
                              setmodalVisible(true);
                              setactiveIndx(4);
                            }
                          }}
                          style={styles.uploadSec}
                        >
                          {pic5[0] != "" ? (
                            <View style={{ position: "relative" }}>
                              {loading_img && activeIndx == 4 && (
                                <View
                                  style={{
                                    width: rspW(23),
                                    height: rspW(23),
                                    position: "absolute",

                                    alignSelf: "center",

                                    borderRadius: rspW(2.5),

                                    backgroundColor: "#0000003c",
                                    // backgroundColor:'red',

                                    zIndex: 100,

                                    justifyContent: "center",
                                  }}
                                >
                                  <ActivityIndicator
                                    size="large"
                                    color={colors.blue}
                                    style={{ alignSelf: "center" }}
                                  />
                                </View>
                              )}

                              <Image
                                // source={{uri: `data:image/gif;base64,${itm[0]}`}}
                                source={{ uri: `${pic5[1]}` }}
                                resizeMode="cover"
                                style={{
                                  width: rspW(23),
                                  height: rspW(23),
                                  borderRadius: rspW(2.5),
                                }}
                              />
                              {[
                                pic1,
                                pic2,
                                pic3,
                                pic4,
                                pic5,
                                pic6,
                                pic7,
                                pic8,
                                pic9,
                              ].filter((v) => v[0] != "").length > 3 && (
                                <TouchableOpacity
                                  onPress={() => {
                                    deleteProfileImage(4);
                                  }}
                                  style={{
                                    position: "absolute",
                                    right: rspW(-2.5),
                                    top: rspW(-2.5),
                                    backgroundColor: "#fff",
                                    borderRadius: rspW(6),
                                  }}
                                >
                                  <ADIcon
                                    name="minuscircle"
                                    size={20}
                                    color={colors.error}
                                  />
                                </TouchableOpacity>
                              )}
                              <View
                                style={{
                                  ...styles.positionCont,
                                }}
                              >
                                <Text
                                  style={{
                                    ...styles.positionTxt,
                                  }}
                                >
                                  5
                                </Text>
                              </View>
                            </View>
                          ) : (
                            <Ionicon
                              name="md-add-circle-sharp"
                              size={30}
                              color={pic5[2] ? colors.blue : "#cccccc"}
                            />
                          )}
                        </TouchableOpacity>
                      </Animated.View>
                    </PanGestureHandler>
                    <PanGestureHandler onGestureEvent={gestureHandler6}>
                      <Animated.View
                        style={[
                          {
                            position: "absolute",
                            zIndex: 0,
                            top: mainBoxSize / 3,
                            left: mainBoxSize / 1.5,
                            opacity: pic6[0] != "" || pic6[2] ? 1 : 0.5,
                          },
                          animatedStyle6,
                        ]}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            if (pic6[2]) {
                              setmodalVisible(true);
                              setactiveIndx(5);
                            }
                          }}
                          style={styles.uploadSec}
                        >
                          {pic6[0] != "" ? (
                            <View style={{ position: "relative" }}>
                              {loading_img && activeIndx == 5 && (
                                <View
                                  style={{
                                    width: rspW(23),
                                    height: rspW(23),
                                    position: "absolute",

                                    alignSelf: "center",

                                    borderRadius: rspW(2.5),

                                    backgroundColor: "#0000003c",
                                    // backgroundColor:'red',

                                    zIndex: 100,

                                    justifyContent: "center",
                                  }}
                                >
                                  <ActivityIndicator
                                    size="large"
                                    color={colors.blue}
                                    style={{ alignSelf: "center" }}
                                  />
                                </View>
                              )}

                              <Image
                                source={{ uri: `${pic6[1]}` }}
                                resizeMode="cover"
                                style={{
                                  width: rspW(23),
                                  height: rspW(23),
                                  borderRadius: rspW(2.5),
                                }}
                              />
                              {[
                                pic1,
                                pic2,
                                pic3,
                                pic4,
                                pic5,
                                pic6,
                                pic7,
                                pic8,
                                pic9,
                              ].filter((v) => v[0] != "").length > 3 && (
                                <TouchableOpacity
                                  onPress={() => {
                                    deleteProfileImage(5);
                                  }}
                                  style={{
                                    position: "absolute",
                                    right: rspW(-2.5),
                                    top: rspW(-2.5),
                                    backgroundColor: "#fff",
                                    borderRadius: rspW(6),
                                  }}
                                >
                                  <ADIcon
                                    name="minuscircle"
                                    size={20}
                                    color={colors.error}
                                  />
                                </TouchableOpacity>
                              )}
                              <View
                                style={{
                                  ...styles.positionCont,
                                }}
                              >
                                <Text
                                  style={{
                                    ...styles.positionTxt,
                                  }}
                                >
                                  6
                                </Text>
                              </View>
                            </View>
                          ) : (
                            <Ionicon
                              name="md-add-circle-sharp"
                              size={30}
                              color={pic6[2] ? colors.blue : "#cccccc"}
                            />
                          )}
                        </TouchableOpacity>
                      </Animated.View>
                    </PanGestureHandler>
                    <PanGestureHandler onGestureEvent={gestureHandler7}>
                      <Animated.View
                        style={[
                          {
                            position: "absolute",
                            zIndex: 0,
                            top: mainBoxSize / 1.5,
                            left: 0,
                            opacity: pic7[0] != "" || pic7[2] ? 1 : 0.5,
                          },
                          animatedStyle7,
                        ]}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            if (pic7[2]) {
                              setmodalVisible(true);
                              setactiveIndx(6);
                            }
                          }}
                          style={styles.uploadSec}
                        >
                          {pic7[0] != "" ? (
                            <View style={{ position: "relative" }}>
                              {loading_img && activeIndx == 6 && (
                                <View
                                  style={{
                                    width: rspW(23),
                                    height: rspW(23),
                                    position: "absolute",

                                    alignSelf: "center",

                                    borderRadius: rspW(2.5),

                                    backgroundColor: "#0000003c",
                                    // backgroundColor:'red',

                                    zIndex: 100,

                                    justifyContent: "center",
                                  }}
                                >
                                  <ActivityIndicator
                                    size="large"
                                    color={colors.blue}
                                    style={{ alignSelf: "center" }}
                                  />
                                </View>
                              )}

                              <Image
                                // source={{uri: `data:image/gif;base64,${itm[0]}`}}
                                source={{ uri: `${pic7[1]}` }}
                                resizeMode="cover"
                                style={{
                                  width: rspW(23),
                                  height: rspW(23),
                                  borderRadius: rspW(2.5),
                                }}
                              />
                              {[
                                pic1,
                                pic2,
                                pic3,
                                pic4,
                                pic5,
                                pic6,
                                pic7,
                                pic8,
                                pic9,
                              ].filter((v) => v[0] != "").length > 3 && (
                                <TouchableOpacity
                                  onPress={() => {
                                    deleteProfileImage(6);
                                  }}
                                  style={{
                                    position: "absolute",
                                    right: rspW(-2.5),
                                    top: rspW(-2.5),
                                    backgroundColor: "#fff",
                                    borderRadius: rspW(6),
                                  }}
                                >
                                  <ADIcon
                                    name="minuscircle"
                                    size={20}
                                    color={colors.error}
                                  />
                                </TouchableOpacity>
                              )}
                              <View
                                style={{
                                  ...styles.positionCont,
                                }}
                              >
                                <Text
                                  style={{
                                    ...styles.positionTxt,
                                  }}
                                >
                                  7
                                </Text>
                              </View>
                            </View>
                          ) : (
                            <Ionicon
                              name="md-add-circle-sharp"
                              size={30}
                              color={pic7[2] ? colors.blue : "#cccccc"}
                            />
                          )}
                        </TouchableOpacity>
                      </Animated.View>
                    </PanGestureHandler>
                    <PanGestureHandler onGestureEvent={gestureHandler8}>
                      <Animated.View
                        style={[
                          {
                            position: "absolute",
                            zIndex: 0,
                            top: mainBoxSize / 1.5,
                            left: mainBoxSize / 3,
                            opacity: pic8[0] != "" || pic8[2] ? 1 : 0.5,
                          },
                          animatedStyle8,
                        ]}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            if (pic8[2]) {
                              setmodalVisible(true);
                              setactiveIndx(7);
                            }
                          }}
                          style={styles.uploadSec}
                        >
                          {pic8[0] != "" ? (
                            <View style={{ position: "relative" }}>
                              {loading_img && activeIndx == 7 && (
                                <View
                                  style={{
                                    width: rspW(23),
                                    height: rspW(23),
                                    position: "absolute",

                                    alignSelf: "center",

                                    borderRadius: rspW(2.5),

                                    backgroundColor: "#0000003c",
                                    // backgroundColor:'red',

                                    zIndex: 100,

                                    justifyContent: "center",
                                  }}
                                >
                                  <ActivityIndicator
                                    size="large"
                                    color={colors.blue}
                                    style={{ alignSelf: "center" }}
                                  />
                                </View>
                              )}

                              <Image
                                // source={{uri: `data:image/gif;base64,${itm[0]}`}}
                                source={{ uri: `${pic8[1]}` }}
                                resizeMode="cover"
                                style={{
                                  width: rspW(23),
                                  height: rspW(23),
                                  borderRadius: rspW(2.5),
                                }}
                              />
                              {[
                                pic1,
                                pic2,
                                pic3,
                                pic4,
                                pic5,
                                pic6,
                                pic7,
                                pic8,
                                pic9,
                              ].filter((v) => v[0] != "").length > 3 && (
                                <TouchableOpacity
                                  onPress={() => {
                                    deleteProfileImage(7);
                                  }}
                                  style={{
                                    position: "absolute",
                                    right: rspW(-2.5),
                                    top: rspW(-2.5),
                                    backgroundColor: "#fff",
                                    borderRadius: rspW(6),
                                  }}
                                >
                                  <ADIcon
                                    name="minuscircle"
                                    size={20}
                                    color={colors.error}
                                  />
                                </TouchableOpacity>
                              )}
                              <View
                                style={{
                                  ...styles.positionCont,
                                }}
                              >
                                <Text
                                  style={{
                                    ...styles.positionTxt,
                                  }}
                                >
                                  8
                                </Text>
                              </View>
                            </View>
                          ) : (
                            <Ionicon
                              name="md-add-circle-sharp"
                              size={30}
                              color={pic8[2] ? colors.blue : "#cccccc"}
                            />
                          )}
                        </TouchableOpacity>
                      </Animated.View>
                    </PanGestureHandler>
                    <PanGestureHandler o9GestureEvent={gestureHandler9}>
                      <Animated.View
                        style={[
                          {
                            position: "absolute",
                            zIndex: 0,
                            top: mainBoxSize / 1.5,
                            left: mainBoxSize / 1.5,
                            opacity: pic9[0] != "" || pic9[2] ? 1 : 0.5,
                          },
                          animatedStyle9,
                        ]}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            if (pic9[2]) {
                              setmodalVisible(true);
                              setactiveIndx(8);
                            }
                          }}
                          style={styles.uploadSec}
                        >
                          {pic9[0] != "" ? (
                            <View style={{ position: "relative" }}>
                              {loading_img && activeIndx == 8 && (
                                <View
                                  style={{
                                    width: rspW(23),
                                    height: rspW(23),
                                    position: "absolute",

                                    alignSelf: "center",

                                    borderRadius: rspW(2.5),

                                    backgroundColor: "#0000003c",
                                    // backgroundColor:'red',

                                    zIndex: 100,

                                    justifyContent: "center",
                                  }}
                                >
                                  <ActivityIndicator
                                    size="large"
                                    color={colors.bl9e}
                                    style={{ alignSelf: "center" }}
                                  />
                                </View>
                              )}

                              <Image
                                // source={{uri: `data:image/gif;base64,${itm[0]}`}}
                                source={{ uri: `${pic9[1]}` }}
                                resizeMode="cover"
                                style={{
                                  width: rspW(23),
                                  height: rspW(23),
                                  borderRadius: rspW(2.5),
                                }}
                              />
                              {[
                                pic1,
                                pic2,
                                pic3,
                                pic4,
                                pic5,
                                pic6,
                                pic7,
                                pic8,
                                pic9,
                              ].filter((v) => v[0] != "").length > 3 && (
                                <TouchableOpacity
                                  onPress={() => {
                                    deleteProfileImage(8);
                                  }}
                                  style={{
                                    position: "absolute",
                                    right: rspW(-2.5),
                                    top: rspW(-2.5),
                                    backgroundColor: "#fff",
                                    borderRadius: rspW(6),
                                  }}
                                >
                                  <ADIcon
                                    name="minuscircle"
                                    size={20}
                                    color={colors.error}
                                  />
                                </TouchableOpacity>
                              )}
                              <View
                                style={{
                                  ...styles.positionCont,
                                }}
                              >
                                <Text
                                  style={{
                                    ...styles.positionTxt,
                                  }}
                                >
                                  9
                                </Text>
                              </View>
                            </View>
                          ) : (
                            <Ionicon
                              name="md-add-circle-sharp"
                              size={30}
                              color={pic9[2] ? colors.blue : "#cccccc"}
                            />
                          )}
                        </TouchableOpacity>
                      </Animated.View>
                    </PanGestureHandler>
                  </GestureHandlerRootView>
                </View>

                <View
                  style={{
                    // width: scrn_width,
                    // paddingHorizontal: rspW(10),

                    marginTop: rspH(1.2),
                    //  backgroundColor:'red'
                  }}
                >
                  <FormInputContainer label="City">
                    <FormSelector
                      setSelectedEntry={setcity}
                      selectedId={city_id}
                      setSelectedId={setcity_id}
                      blr_value={city_blr}
                      setblr_value={setcity_blr}
                      title="City"
                      placeholder={"Select"}
                      width={"100%"}
                      list={city_list}
                      selectedValue={city[1]}
                      pull_refresh={true}
                      refreshing={city_refresh}
                      setref
                      reshing={setcity_refresh}
                      onRefresh={(rpage) => {
                        getLocation(rpage, true);
                      }}
                      page={city_page}
                      setpage={setcity_page}
                      backend_search={true}
                      backend_search_txt={city_search}
                      setbackend_search_txt={setcity_search}
                      onBackendSearch={() => {
                        setcity_page(1);
                        if (city_search != "") {
                          getLocation(1);
                        } else {
                          setcity_list([]);
                        }
                      }}
                      setchanges_made={setchanges_made}
                    />
                  </FormInputContainer>

                  <View style={styles.multiInputContainer}>
                    <FormInputContainer label="Height (cms)">
                      <FormInput
                        maxLength={3}
                        value={height_cm}
                        setvalue={setheight_cm}
                        width={scrn_width / 2.65}
                        height={rspH(5.9)}
                        placeholder={"cms"}
                        // error_cond={height_cm > }
                        error_cond={height_cm < 60 || height_cm > 270}
                        keyboardType="number-pad"
                        value_blr={height_blr}
                        setvalue_blr={setheight_blr}
                        unit="cms"
                        inputwidth="40%"
                        setchanges_made={setchanges_made}
                      />
                    </FormInputContainer>

                    <FormInputContainer label="Gender">
                      <FormSelector
                        setSelectedEntry={setgender}
                        selectedId={gender_id}
                        setSelectedId={setgender_id}
                        blr_value={gender_blr}
                        setblr_value={setgender_blr}
                        title="Gender"
                        placeholder={"Select"}
                        width={scrn_width / 2.65}
                        search={false}
                        list={gender_list}
                        selectedValue={gender[1]}
                        setchanges_made={setchanges_made}
                      />
                    </FormInputContainer>
                  </View>

                  <FormInputContainer label="Your Preference">
                    <FormMultiSelector
                      selected_list={selected_preference_list}
                      setselected_list={setselected_preference_list}
                      search={false}
                      blr_value={preference_blr}
                      setblr_value={setpreference_blr}
                      title="Preference"
                      placeholder={"Select"}
                      width={"100%"}
                      list={preference_list}
                      setchanges_made={setchanges_made}
                    />
                  </FormInputContainer>

                  <FormInputContainer label="Education">
                    <FormSelector
                      search={false}
                      setSelectedEntry={seteducation}
                      selectedId={education_id}
                      setSelectedId={seteducation_id}
                      blr_value={education_blr}
                      setblr_value={seteducation_blr}
                      title="Education"
                      placeholder={"Select"}
                      width={"100%"}
                      list={education_list}
                      selectedValue={education[1]}
                      setchanges_made={setchanges_made}
                    />
                  </FormInputContainer>

                  <FormInputContainer label="Occupation">
                    <FormInput
                      value={occupation}
                      setvalue={setoccupation}
                      width={"100%"}
                      maxLength={15}
                      height={rspW(12.76)}
                      placeholder={"Add your title"}
                      error_cond={occupation.length < 3}
                      keyboardType="default"
                      value_blr={occupation_blr}
                      setvalue_blr={setoccupation_blr}
                      setchanges_made={setchanges_made}
                      s_allow={false}
                      n_allow={false}
                    />
                  </FormInputContainer>

                  <FormInputContainer
                    label="Your Habits"
                    marginBottom={0}
                    labelContBottom={0}
                  >
                    {/* Radio Btn Label */}
                    <View style={{ marginBottom: rspH(1.8) }}>
                      <View style={{ ...styles.radioCont }}>
                        {/* Habits */}
                        <View>
                          <Text style={styles.radioTxt}>{""}</Text>
                        </View>

                        {/* Chioce */}
                        <View style={styles.radioBtnCont}>
                          <TouchableOpacity activeOpacity={1}>
                            <Text style={styles.radioBtnLabel}> Yes</Text>
                          </TouchableOpacity>
                          <TouchableOpacity activeOpacity={1}>
                            <Text style={styles.radioBtnLabel}>No{"  "}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      {habits_list.map((itm, idx) => {
                        return (
                          <View
                            key={idx}
                            style={{
                              ...styles.radioCont,
                              marginBottom: idx < 2 ? 5 : 0,
                            }}
                          >
                            {/* Habits */}
                            <View>
                              <Text style={styles.radioTxt}>{itm[0]}</Text>
                            </View>

                            {/* Chioce */}
                            <View style={styles.radioBtnCont}>
                              <TouchableOpacity
                                onPress={() => {
                                  setchanges_made(true);
                                  sethabits_blr(true);
                                  habits_list[idx][1] =
                                    habits_list[idx][1] != null
                                      ? habits_list[idx][1]
                                        ? false
                                        : true
                                      : true;

                                  if (habits_list[idx][1]) {
                                    habits_list[idx][2] = false;
                                  }

                                  setrefresh(!refresh);
                                }}
                                style={{
                                  backgroundColor:
                                    habits_list[idx][1] != null
                                      ? habits_list[idx][1]
                                        ? colors.blue
                                        : colors.grey
                                      : colors.grey,
                                  ...styles.radioBtn,
                                }}
                              ></TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => {
                                  sethabits_blr(true);
                                  setchanges_made(true);

                                  habits_list[idx][2] =
                                    habits_list[idx][2] != null
                                      ? habits_list[idx][2]
                                        ? false
                                        : true
                                      : true;

                                  if (habits_list[idx][2]) {
                                    habits_list[idx][1] = false;
                                  }
                                  setrefresh(!refresh);
                                }}
                                style={{
                                  backgroundColor:
                                    habits_list[idx][2] != null
                                      ? habits_list[idx][2]
                                        ? colors.blue
                                        : colors.grey
                                      : colors.grey,
                                  ...styles.radioBtn,
                                }}
                              ></TouchableOpacity>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </FormInputContainer>

                  <FormInputContainer label="Interests">
                    <FormMultiSelector
                      selected_list={selected_interests_list}
                      setselected_list={setselected_interests_list}
                      multi={true}
                      setSelectedEntry={setinterests}
                      selectedId={interests_id}
                      setSelectedId={setinterests_id}
                      blr_value={interests_blr}
                      setblr_value={setinterests_blr}
                      title="Interests"
                      placeholder={"Select"}
                      width={"100%"}
                      list={interests_list}
                      selectedValue={interests[1]}
                      setchanges_made={setchanges_made}
                    />
                  </FormInputContainer>

                  <FormInputContainer label="Languages">
                    <FormMultiSelector
                      selected_list={selected_languages_list}
                      setselected_list={setselected_languages_list}
                      multi={false}
                      setSelectedEntry={setlanguages}
                      selectedId={languages_id}
                      setSelectedId={setlanguages_id}
                      blr_value={languages_blr}
                      setblr_value={setlanguages_blr}
                      title="Languages"
                      placeholder={"Select"}
                      width={"100%"}
                      list={languages_list}
                      selectedValue={languages[1]}
                      setchanges_made={setchanges_made}
                    />
                  </FormInputContainer>

                  <FormInputContainer label="Pets">
                    <FormMultiSelector
                      selected_list={selected_pets_list}
                      setselected_list={setselected_pets_list}
                      multi={true}
                      setSelectedEntry={setpets}
                      selectedId={pets_id}
                      setSelectedId={setpets_id}
                      blr_value={pets_blr}
                      setblr_value={setpets_blr}
                      title="Pets"
                      placeholder={"Select"}
                      width={"100%"}
                      list={pets_list}
                      selectedValue={pets[1]}
                      setchanges_made={setchanges_made}
                    />
                  </FormInputContainer>

                  <FormInputContainer label="Political Inclination">
                    <FormSelector
                      search={false}
                      setSelectedEntry={setpolitical_inclination}
                      selectedId={political_inclination_id}
                      setSelectedId={setpolitical_inclination_id}
                      blr_value={political_inclination_blr}
                      setblr_value={setpolitical_inclination_blr}
                      title="Political Inclination"
                      placeholder={"Select"}
                      width={"100%"}
                      list={political_inclination_list}
                      selectedValue={political_inclination[1]}
                      setchanges_made={setchanges_made}
                    />
                  </FormInputContainer>
                  {profile_data?.userprivateprompts?.length > 0 && (
                    <>
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{
                            marginTop: rspH(1.2),
                            marginBottom: rspH(1.4),
                          }}
                        >
                          <Text style={{ ...styles.label }}>
                            Public Prompts
                          </Text>
                        </View>

                        <View style={{ marginBottom: rspH(3.7) }}>
                          <Text style={{ ...styles.promptpara }}>
                            Stand out! Don’t be just another fish in the sea.
                            {"\n"}
                            {"\n"}The prompts in this section will be visible
                            only to the{"\n"}
                            people who browse through your profile, and later,to
                            {"\n"} people that you’ve decided to unmask yourself
                            to.
                          </Text>
                        </View>

                        {/* Inputs Container*/}
                        <View style={{ alignSelf: "center", width: "100%" }}>
                          <View style={{ marginBottom: rspH(2.35) }}>
                            <View
                              style={{ marginBottom: rspH(1.2) }}
                              ref={pup_q1_ref}
                            >
                              <FormSelector
                                setSelectedEntry={setpublic_prompt1_q}
                                selectedId={public_prompt1_q_id}
                                setSelectedId={setpublic_prompt1_q_id}
                                blr_value={public_prompt1_q_blr}
                                setblr_value={setpublic_prompt1_q_blr}
                                title="Prompts"
                                search={false}
                                placeholder={"Public Prompt Question 1"}
                                width={"100%"}
                                list={prompts_list}
                                selectedValue={public_prompt1_q[1]}
                                setchanges_made={setchanges_made}
                                removable={true}
                                rmv_list={prompts_list_rmv}
                                setrmv_list={setprompts_list_rmv}
                              />
                            </View>

                            <View ref={pup_a1_ref}>
                              {/* <FormInput
                                value={public_prompt1_a}
                                setvalue={setpublic_prompt1_a}
                                width={'100%'}
                                placeholder={'Type your answer'}
                                error_cond={public_prompt1_a.length < 3}
                                keyboardType="default"
                                value_blr={public_prompt1_blr}
                                setvalue_blr={setpublic_prompt1_blr}
                                multiline={true}
                                // setchanges_made={setchanges_made}
                                disabled={public_prompt1_q == ''}
                              /> */}

                              <AutoGrowingTextInput
                                maxLength={250}
                                placeholder="Type your answer"
                                placeholderTextColor={"#000000"}
                                keyboardType="default"
                                style={{
                                  ...styles.promptsInput,
                                  backgroundColor:
                                    public_prompt1_a.length > 2
                                      ? colors.white
                                      : "#F8F8F8",
                                  borderColor:
                                    public_prompt1_a.length > 2
                                      ? colors.blue
                                      : colors.error,
                                  textAlignVertical: "top",
                                }}
                                value={public_prompt1_a}
                                onFocus={() => setpublic_prompt1_blr(true)}
                                onChangeText={(val) => {
                                  setpublic_prompt1_a(val);

                                  if (public_prompt1_blr) {
                                    setchanges_made(true);
                                  }
                                }}
                                onBlur={() => {
                                  setpublic_prompt1_blr(true);
                                }}
                                disabled={public_prompt1_q == ""}
                                // placeholderTextColor={'black'}

                                maxHeight={rspH(11.5)}
                                minHeight={rspH(11.5)}
                              />
                            </View>
                          </View>

                          <View style={{ marginBottom: rspH(2.35) }}>
                            <View
                              style={{ marginBottom: rspH(1.2) }}
                              ref={pup_q2_ref}
                            >
                              <FormSelector
                                setSelectedEntry={setpublic_prompt2_q}
                                selectedId={public_prompt2_q_id}
                                setSelectedId={setpublic_prompt2_q_id}
                                blr_value={public_prompt2_q_blr}
                                setblr_value={setpublic_prompt2_q_blr}
                                title="Prompts"
                                placeholder={"Public Prompt Question 2"}
                                width={"100%"}
                                list={prompts_list}
                                search={false}
                                selectedValue={public_prompt2_q[1]}
                                setchanges_made={setchanges_made}
                                removable={true}
                                rmv_list={prompts_list_rmv}
                                setrmv_list={setprompts_list_rmv}
                              />
                            </View>
                            <View ref={pup_a2_ref}>
                              {/* <FormInput
                                value={public_prompt2_a}
                                setvalue={setpublic_prompt2_a}
                                width={'100%'}
                                placeholder={'Type your answer'}
                                error_cond={public_prompt2_a.length < 3}
                                keyboardType="default"
                                value_blr={public_prompt2_blr}
                                setvalue_blr={setpublic_prompt2_blr}
                                multiline={true}
                                // setchanges_made={setchanges_made}
                                disabled={public_prompt2_q == ''}
                              /> */}

                              <AutoGrowingTextInput
                                maxLength={250}
                                placeholder="Type your answer"
                                placeholderTextColor={"#000000"}
                                keyboardType="default"
                                style={{
                                  ...styles.promptsInput,
                                  backgroundColor:
                                    public_prompt2_a.length > 2
                                      ? colors.white
                                      : "#F8F8F8",
                                  borderColor:
                                    public_prompt2_a.length > 2
                                      ? colors.blue
                                      : colors.error,
                                  textAlignVertical: "top",
                                }}
                                onFocus={() => setpublic_prompt2_blr(true)}
                                value={public_prompt2_a}
                                onChangeText={(val) => {
                                  setpublic_prompt2_a(val);
                                  if (public_prompt2_blr) {
                                    setchanges_made(true);
                                  }
                                }}
                                onBlur={() => {
                                  setpublic_prompt2_blr(true);
                                }}
                                disabled={public_prompt2_q == ""}
                                // placeholderTextColor={'black'}

                                maxHeight={rspH(11.5)}
                                minHeight={rspH(11.5)}
                              />
                            </View>
                          </View>
                        </View>
                      </View>

                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{
                            marginTop: rspH(1.2),
                            marginBottom: rspH(1.4),
                          }}
                        >
                          <Text style={{ ...styles.label }}>
                            Private Prompts
                          </Text>
                        </View>

                        <View style={{ marginBottom: rspH(3.7) }}>
                          <Text style={{ ...styles.promptpara }}>
                            Your Private Place.{"\n"}
                            {"\n"}This is more exclusive. The prompts in this
                            section will {"\n"}be visible only to the people who
                            you’ve been matched {"\n"}with.
                          </Text>
                        </View>

                        {/* Inputs Container*/}
                        <View style={{ alignSelf: "center", width: "100%" }}>
                          <View style={{ marginBottom: rspH(2.35) }}>
                            <View
                              style={{ marginBottom: rspH(1.2) }}
                              ref={prp_q1_ref}
                            >
                              <FormSelector
                                setSelectedEntry={setprivate_prompt1_q}
                                selectedId={private_prompt1_q_id}
                                setSelectedId={setprivate_prompt1_q_id}
                                blr_value={private_prompt1_q_blr}
                                setblr_value={setprivate_prompt1_q_blr}
                                title="Prompts"
                                search={false}
                                placeholder={"Private Prompt Question 1"}
                                width={"100%"}
                                list={prompts_list}
                                selectedValue={private_prompt1_q[1]}
                                setchanges_made={setchanges_made}
                                removable={true}
                                rmv_list={prompts_list_rmv}
                                setrmv_list={setprompts_list_rmv}
                              />
                            </View>
                            <View ref={prp_a1_ref}>
                              {/* <FormInput
                                value={private_prompt1_a}
                                setvalue={setprivate_prompt1_a}
                                width={'100%'}
                                placeholder={'Type your answer'}
                                error_cond={private_prompt1_a.length < 3}
                                keyboardType="default"
                                value_blr={private_prompt1_blr}
                                setvalue_blr={setprivate_prompt1_blr}
                                multiline={true}
                                // setchanges_made={setchanges_made}
                                disabled={private_prompt1_q == ''}
                              /> */}

                              <AutoGrowingTextInput
                                maxLength={250}
                                placeholder="Type your answer"
                                placeholderTextColor={"#000000"}
                                keyboardType="default"
                                style={{
                                  ...styles.promptsInput,
                                  backgroundColor:
                                    private_prompt1_a.length > 2
                                      ? colors.white
                                      : "#F8F8F8",
                                  borderColor:
                                    private_prompt1_a.length > 2
                                      ? colors.blue
                                      : colors.error,
                                  textAlignVertical: "top",
                                }}
                                value={private_prompt1_a}
                                onFocus={() => setprivate_prompt1_blr(true)}
                                onChangeText={(val) => {
                                  setprivate_prompt1_a(val);
                                  if (private_prompt1_blr) {
                                    setchanges_made(true);
                                  }
                                }}
                                onBlur={() => {
                                  setprivate_prompt1_blr(true);
                                }}
                                disabled={private_prompt1_q == ""}
                                maxHeight={rspH(11.5)}
                                minHeight={rspH(11.5)}
                              />
                            </View>
                          </View>

                          <View style={{ marginBottom: rspH(2.35) }}>
                            <View
                              style={{ marginBottom: rspH(1.2) }}
                              ref={prp_q2_ref}
                            >
                              <FormSelector
                                setSelectedEntry={setprivate_prompt2_q}
                                selectedId={private_prompt2_q_id}
                                setSelectedId={setprivate_prompt2_q_id}
                                blr_value={private_prompt2_q_blr}
                                setblr_value={setprivate_prompt2_q_blr}
                                title="Prompts"
                                placeholder={"Private Prompt Question 2"}
                                width={"100%"}
                                list={prompts_list}
                                selectedValue={private_prompt2_q[1]}
                                search={false}
                                setchanges_made={setchanges_made}
                                removable={true}
                                rmv_list={prompts_list_rmv}
                                setrmv_list={setprompts_list_rmv}
                              />
                            </View>
                            <View ref={prp_a2_ref}>
                              {/* <FormInput
                                value={private_prompt2_a}
                                setvalue={setprivate_prompt2_a}
                                width={'100%'}
                                placeholder={'Type your answer'}
                                error_cond={private_prompt2_a.length < 3}
                                keyboardType="default"
                                value_blr={private_prompt2_blr}
                                setvalue_blr={setprivate_prompt2_blr}
                                multiline={true}
                                // setchanges_made={setchanges_made}
                                disabled={private_prompt2_q == ''}
                              /> */}

                              <AutoGrowingTextInput
                                maxLength={250}
                                placeholder="Type your answer"
                                placeholderTextColor={"#000000"}
                                keyboardType="default"
                                style={{
                                  ...styles.promptsInput,
                                  backgroundColor:
                                    private_prompt2_a.length > 2
                                      ? colors.white
                                      : "#F8F8F8",
                                  borderColor:
                                    private_prompt2_a.length > 2
                                      ? colors.blue
                                      : colors.error,
                                  textAlignVertical: "top",
                                }}
                                value={private_prompt2_a}
                                onFocus={() => setprivate_prompt2_blr(true)}
                                onChangeText={(val) => {
                                  setprivate_prompt2_a(val);
                                  if (private_prompt2_blr) {
                                    setchanges_made(true);
                                  }
                                }}
                                onBlur={() => {
                                  setprivate_prompt2_blr(true);
                                }}
                                disabled={private_prompt2_q == ""}
                                maxHeight={rspH(11.5)}
                                minHeight={rspH(11.5)}
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    </>
                  )}
                </View>
              </View>
            </KeyboardAwareScrollView>

            <View>
              <FormWrapperFooter
                containerStyle={{
                  height: rspH(13.59),

                  marginBottom: rspH(-2.32),

                  // backgroundColor:'red',
                }}
              >
                <ErrorContainer error_msg="" />

                <FooterBtn
                  title={"Save"}
                  disabled={
                    !changes_made ||
                    height_cm < 60 ||
                    height_cm > 270 ||
                    occupation == "" ||
                    (!habits_list[0][1] && !habits_list[0][2]) ||
                    (!habits_list[1][1] && !habits_list[1][2]) ||
                    (!habits_list[2][1] && !habits_list[2][2]) ||
                    // pic_list.filter(v => v[0] != '').length < 3 ||
                    (profile_data?.userprivateprompts.length > 0 &&
                      (public_prompt1_q_id == 0 ||
                        public_prompt1_a == "" ||
                        public_prompt2_q_id == 0 ||
                        public_prompt2_a == "" ||
                        private_prompt1_q_id == 0 ||
                        private_prompt1_a == "" ||
                        private_prompt2_q_id == 0 ||
                        private_prompt2_a == ""))
                  }
                  onPress={() => {
                    let smok = habits_list[0][1]
                      ? true
                      : habits_list[0][2]
                      ? false
                      : null;
                    let drik = habits_list[1][1]
                      ? true
                      : habits_list[1][2]
                      ? false
                      : null;
                    let marij = habits_list[2][1]
                      ? true
                      : habits_list[2][2]
                      ? false
                      : null;

                    if (
                      changes_made &&
                      // pic_list.filter(v => v[0] != '').length >= 3 &&
                      height_cm >= 60 &&
                      height_cm <= 270 &&
                      occupation != "" &&
                      smok != null &&
                      drik != null &&
                      marij != null &&
                      profile_data?.userprivateprompts.length == 0
                    ) {
                      onNextPress();
                    } else {
                      if (
                        profile_data?.userprivateprompts.length > 0 &&
                        changes_made &&
                        // pic_list.filter(v => v[0] != '').length >= 3 &&
                        height_cm >= 50 &&
                        height_cm <= 270 &&
                        occupation != "" &&
                        smok != null &&
                        drik != null &&
                        marij != null &&
                        public_prompt1_q_id != 0 &&
                        public_prompt1_a != "" &&
                        public_prompt2_q_id != 0 &&
                        public_prompt2_a != "" &&
                        private_prompt1_q_id != 0 &&
                        private_prompt1_a != "" &&
                        private_prompt2_q_id != 0 &&
                        private_prompt2_a != ""
                      ) {
                        onNextPress();
                      } else {
                        if (profile_data?.userprivateprompts?.length > 0) {
                          if (public_prompt1_q_id == 0) {
                            pup_q1_ref.current.measure(
                              (x, y, width, height, pageX, pageY) => {
                                pageY = pageY + current_pos;
                                scrollViewRef.current.scrollToPosition(
                                  0,
                                  pageY - rspH(16),
                                  true
                                );
                              }
                            );
                          } else if (public_prompt1_a == "") {
                            pup_a1_ref.current.measure(
                              (x, y, width, height, pageX, pageY) => {
                                pageY = pageY + current_pos;

                                scrollViewRef.current.scrollToPosition(
                                  0,
                                  pageY - rspH(16),
                                  true
                                );
                              }
                            );
                          } else if (public_prompt2_q_id == 0) {
                            pup_q2_ref.current.measure(
                              (x, y, width, height, pageX, pageY) => {
                                pageY = pageY + current_pos;

                                scrollViewRef.current.scrollToPosition(
                                  0,
                                  pageY - rspH(16),
                                  true
                                );
                              }
                            );
                          } else if (public_prompt2_a == "") {
                            pup_a2_ref.current.measure(
                              (x, y, width, height, pageX, pageY) => {
                                pageY = pageY + current_pos;

                                scrollViewRef.current.scrollToPosition(
                                  0,
                                  pageY - rspH(16),
                                  true
                                );
                              }
                            );
                          } else if (private_prompt1_q_id == 0) {
                            prp_q1_ref.current.measure(
                              (x, y, width, height, pageX, pageY) => {
                                pageY = pageY + current_pos;

                                scrollViewRef.current.scrollToPosition(
                                  0,
                                  pageY - rspH(16),
                                  true
                                );
                              }
                            );
                          } else if (private_prompt1_a == "") {
                            prp_a1_ref.current.measure(
                              (x, y, width, height, pageX, pageY) => {
                                pageY = pageY + current_pos;

                                scrollViewRef.current.scrollToPosition(
                                  0,
                                  pageY - rspH(16),
                                  true
                                );
                              }
                            );
                          } else if (private_prompt2_q_id == 0) {
                            prp_q2_ref.current.measure(
                              (x, y, width, height, pageX, pageY) => {
                                pageY = pageY + current_pos;

                                scrollViewRef.current.scrollToPosition(
                                  0,
                                  pageY - rspH(16),
                                  true
                                );
                              }
                            );
                          } else if (private_prompt2_a == "") {
                            prp_a2_ref.current.measure(
                              (x, y, width, height, pageX, pageY) => {
                                pageY = pageY + current_pos;

                                scrollViewRef.current.scrollToPosition(
                                  0,
                                  pageY - rspH(16),
                                  true
                                );
                              }
                            );
                          }

                          if (public_prompt1_q_id == 0) {
                            setpublic_prompt1_q_blr(true);
                          }
                          if (public_prompt1_a == "") {
                            setpublic_prompt1_blr(true);
                          }
                          if (public_prompt2_q_id == 0) {
                            setpublic_prompt2_q_blr(true);
                          }
                          if (public_prompt2_a == "") {
                            setpublic_prompt2_blr(true);
                          }
                          if (private_prompt1_q_id == 0) {
                            setprivate_prompt1_q_blr(true);
                          }
                          if (private_prompt1_a == "") {
                            setprivate_prompt1_blr(true);
                          }
                          if (private_prompt2_q_id == 0) {
                            setprivate_prompt2_q_blr(true);
                          }
                          if (private_prompt2_a == "") {
                            setprivate_prompt2_blr(true);
                          }
                        }
                      }
                    }
                  }}
                />
              </FormWrapperFooter>
            </View>
          </View>
        </SafeAreaView>

        <BottomModal
          bottom={Platform.OS == "android" ? 0 : 3}
          padding={0}
          extContainerStyle={
            {
              // borderBottomWidth:1,
              // borderBottomColor: colors.blue,
            }
          }
          height={rspH(16)}
          modalVisible={modalVisible}
          setModalVisible={setmodalVisible}
          close={false}
        >
          <View
            style={{
              ...styles.imageUpCont,
              paddingBottom: Platform.OS == "android" ? 0 : rspH(3.6),
            }}
          >
            {/* <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                // backgroundColor:'red',
                height: rspH(8),
                width: scrn_width,
                borderBottomWidth: 1,
                borderBottomColor: colors.blue,
              }}
              onPress={() => {
                Platform.OS == 'ios'
                  ? imageGalleryLaunch()
                  : requestCameraPermission(imageGalleryLaunch);
              }}>
              <Text style={styles.imageUpTxt}>Browse Photos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',

                height: rspH(8),

                width: scrn_width,
              }}
              onPress={() => {
                Platform.OS == 'ios'
                  ? cameraLaunch()
                  : requestCameraPermission(cameraLaunch);
              }}>
              <Text style={styles.imageUpTxt}>Open Camera</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                // backgroundColor:'#fff',
                height: rspH(8),
                width: scrn_width,
                borderBottomWidth: 1,
                borderBottomColor: colors.blue,
                // borderTopLeftRadius: rspW(5),
                // borderTopRightRadius: rspW(5),
              }}
              onPress={() => {
                imageGalleryLaunch();
                // Platform.OS == 'ios'
                //   ? imageGalleryLaunch()
                //   : requestCameraPermission(imageGalleryLaunch);
              }}
            >
              <Text style={styles.imageUpTxt}>Browse Photos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: rspH(8),
                width: scrn_width,
                borderBottomColor: colors.blue,
                borderBottomWidth: Platform.OS == "ios" ? 1 : 0,
              }}
              onPress={() => {
                cameraLaunch();
                // Platform.OS == 'ios'
                //   ? cameraLaunch()
                //   : requestCameraPermission(cameraLaunch);
              }}
            >
              <Text style={styles.imageUpTxt}>Open Camera</Text>
            </TouchableOpacity>
          </View>
        </BottomModal>

        <CentralModal modalVisible={per_modal} setModalVisible={setper_modal}>
          <View style={styles.perModalBox}>
            <View
              style={{
                marginBottom: rspH(2),
              }}
            >
              <Text style={styles.perModalHeading}>Permission Denied!</Text>
            </View>
            <Text style={styles.perModalPara}>
              You denied {per_type} permission, Please allow {per_type}{" "}
              permission to upload pictures.
            </Text>

            <TouchableOpacity
              style={styles.loadingBtn}
              onPress={() => {
                // setredirect_to_settings(true)
                if (Platform.OS == "ios") {
                  Linking.openURL("app-settings:");
                } else {
                  Linking.openSettings();
                }
                // setper_modal(false)
              }}
            >
              <Text style={styles.loadingBtnTxt}>Got to Settings</Text>
            </TouchableOpacity>
          </View>
        </CentralModal>
      </SafeAreaView>
    </>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    // flex: 1,

    // justifyContent:'center',
    alignItems: "center",
    // backgroundColor:'#ef854895',
    // marginHorizontal: 36,
  },

  profileDetailCont: {
    height: rspH(9.6),
    width: rspW(39.5),
    borderRadius: rspW(1.6),
  },
  boxShadowCont: {
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 4,
  },

  headerTitle: {
    fontFamily: fontFamily.bold,
    fontSize: rspF(2.62),
    color: colors.black,
    // lineHeight: rspF(2.65),
    lineHeight: rspF(2.65),
    // backgroundColor:'red',
    marginBottom: rspH(2.35),
    letterSpacing: 1,
  },

  inputCont: {
    // alignItems: 'center',
    alignSelf: "center",
    marginHorizontal: rspW(-3),
    // backgroundColor:'yellow',
    width: rspW(84),
    height: rspW(84),
    marginTop: rspH(1),
    // marginBottom: rspH(4),
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  imageUpCont: {
    alignItems: "center",
  },

  imageUpTxt: {
    fontFamily: fontFamily.regular,
    // fontSize: rspF(2.02),
    fontSize: rspF(2.02),

    lineHeight: rspF(2.1),
    color: colors.blue,
  },
  uploadSec: {
    borderRadius: rspW(2.5),
    width: rspW(23),
    height: rspW(23),
    backgroundColor: colors.grey + "37",
    alignItems: "center",
    justifyContent: "center",
    margin: rspW(2),
  },

  multiInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // radio Btn Styling
  radioCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingHorizontal: rspW(5.1),
    paddingHorizontal: rspW(3.2),
    // backgroundColor:'green',
    marginBottom: rspH(0.6),
  },
  radioTxt: {
    lineHeight: rspF(2.05),

    fontFamily: fontFamily.medium,
    color: colors.black,
    fontSize: rspF(2.02),
    // letterSpacing:1,
  },
  radioBtnCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: rspW(23.6),
  },
  radioBtn: {
    width: rspW(6.34),
    // width: rspW(6.34),

    height: rspW(6.34),
    // borderRadius: rspW(1.3),
    borderRadius: rspW(1.3),
  },
  radioBtnLabel: {
    fontSize: rspF(1.302),
    fontFamily: fontFamily.bold,
    lineHeight: rspF(1.31),
    color: colors.black,
    textAlign: "center",
    letterSpacing: 1,
  },

  label: {
    color: colors.black,
    lineHeight: rspF(2.18),
    fontSize: rspF(2.138),
    fontFamily: fontFamily.bold,
    letterSpacing: 1,
  },
  promptpara: {
    fontFamily: fontFamily.regular,
    fontSize: rspF(1.302),
    color: colors.blue,
    lineHeight: 13.38,
    textAlign: "center",
  },

  positionCont: {
    position: "absolute",
    left: rspW(1),
    top: rspH(8),
    // backgroundColor: 'red',
    backgroundColor: "#00000089",
    paddingTop: rspH(0.5),
    borderRadius: rspW(6),
    width: rspW(5),
    height: rspW(5),
    alignItems: "center",
    justifyContent: "center",
  },
  positionTxt: {
    textAlign: "center",
    fontSize: rspF(1.5),
    fontFamily: fontFamily.semi_bold,
    color: "#fff",
    lineHeight: rspF(1.5),
  },
  perModalBox: {
    width: rspW(76.5),
    height: rspH(31.16),
    backgroundColor: colors.white,
    borderRadius: rspW(5.1),
    paddingHorizontal: rspW(4),
    alignItems: "center",
    justifyContent: "center",
    marginTop: rspH(17),
  },
  perModalHeading: {
    fontFamily: fontFamily.bold,
    fontSize: rspF(2.6),
    color: colors.black,
    lineHeight: rspH(2.7),
    textAlign: "center",
  },

  perModalPara: {
    fontFamily: fontFamily.bold,
    fontSize: rspF(1.85),
    color: colors.blue,
    lineHeight: rspH(2.5),
    textAlign: "center",
  },

  loadingBtn: {
    width: rspW(69),

    height: rspH(5.62),

    borderWidth: 1,
    borderColor: colors.blue,

    borderRadius: rspW(8),

    justifyContent: "center",
    marginTop: rspH(3),
  },

  loadingBtnTxt: {
    textAlign: "center",
    fontSize: rspF(1.9),
    fontFamily: fontFamily.bold,
    color: colors.blue,
    lineHeight: rspF(1.96),
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
