import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
  PermissionsAndroid,
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect, useContext } from "react";
import FormWrapper from "../../components/wrappers/formWrappers/FormWrapper";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import colors from "../../styles/colors";
import {
  rspF,
  rspH,
  rspW,
  scrn_height,
  scrn_width,
} from "../../styles/responsiveSize";
import FooterBtn from "../../components/Buttons/FooterBtn";
import BottomModal from "../../components/modals/BottomModal";
import FormWrapperFooter from "../../components/wrappers/formWrappers/FormWrapperFooter";
import ErrorContainer from "../../components/formComponents/ErrorContainer";
import Ionicon from "react-native-vector-icons/Ionicons";
import ADIcon from "react-native-vector-icons/AntDesign";
import fontFamily from "../../styles/fontFamily";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Loader from "../../components/loader/Loader";
import { apiUrl } from "../../constants";
import {
  setProfileImgs,
  setProfiledata,
  setSessionExpired,
} from "../../store/reducers/authentication/authentication";
import ImageCropPicker, {
  openPicker,
  openCamera,
  openCropper,
} from "react-native-image-crop-picker";
import FormHeader from "../../components/wrappers/formWrappers/FormHeader";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import CentralModal from "../../components/modals/CentralModal";
import { UserContext } from "../../context/user";
import { Image as CompImage } from "react-native-compressor";
import { stat } from "react-native-fs";

const mainBoxSize = rspW(84);

const PicUpload = ({ navigation, route }) => {
  const active_user_location_details = useSelector(
    (state) => state.authentication.active_user_location_details
  );
  const access_token = useSelector(
    (state) => state.authentication.access_token
  );
  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );
  const profile_imgs = useSelector(
    (state) => state.authentication.profile_imgs
  );

  const [galler_per, setgaller_per] = useState(true);
  const [camera_per, setcamera_per] = useState(true);

  const { appStateVisible } = useContext(UserContext);

  const [per_modal, setper_modal] = useState(false);
  const [per_type, setper_type] = useState(null);

  const dispatch = useDispatch();

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

  const changePos = async (no1, no2) => {
    let tmp_l = [pic1, pic2, pic3, pic4, pic5, pic6, pic7, pic8, pic9];

    let prc1 = tmp_l[no1];
    let prc2 = tmp_l[no2];

    if (prc2[0] != "") {
      let tmp2 = tmp_l[no1];
      tmp_l[no1] = tmp_l[no2];
      tmp_l[no2] = tmp2;
      dispatch(setProfileImgs(tmp_l));
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

  const [modalVisible, setmodalVisible] = useState(false);
  const [modalVisible2, setmodalVisible2] = useState(false);
  const [activeIndx, setactiveIndx] = useState(0);
  const [cImage, setcImage] = useState("");

  const [loading, setloading] = useState(false);
  const [mainloading, setmainloading] = useState(false);

  const [refresh, setrefresh] = useState(false);

  const [pic_blr, setpic_blr] = useState(false);

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

  const confirmImageUploads = async () => {
    setmainloading(true);

    const headers = {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    };

    await axios
      .get(apiUrl + "userimageupload/" + profile_data.user.id, {
        headers,
      })
      .then((resp) => {
        setmainloading(false);
        if (resp.data.code == 200) {
          navigation.navigate("PhotoVerification");
        } else {
          console.warn("Error occur while confirmImageUploads");
        }
      })
      .catch((err) => {
        setmainloading(false);
        console.log("confirmImageUploads err", err);
      });
  };

  const onNextPress = () => {
    let tup = [pic1, pic2, pic3, pic4, pic5, pic6, pic7, pic8, pic9].filter(
      (v) => v[0] != ""
    ).length;
    if (tup >= 3) {
      confirmImageUploads();
    }
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
    setmainloading(true);
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
        setmainloading(false);
      } else if (code == 401) {
        dispatch(setSessionExpired(true));
      } else {
        setmainloading(false);

        Alert.alert("Error", "While Deleting Image" + data);
      }
    } catch (error) {
      setmainloading(false);
      dispatch(setSessionExpired(true));
      console.log("went  while del img", error);
      Alert.alert("Error", "Something Went Wrong while del image");
    }
  };

  const changeImgPosition = async (img_id_1, pos_1, img_id_2, pos_2) => {
    // Set the API endpoint URL
    setloading(true);
    const url = apiUrl + "image_Position/";

    // Set the headers and token

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

    try {
      const resp = await axios.post(url, data, { headers });
      setloading(false);

      let code = resp.data.code;
      let user_data = resp.data.data;

      if (code == 200) {
      } else if (code == 401) {
        dispatch(setSessionExpired(true));
      } else {
        Alert.alert("Error", "pos Some Error Occur" + resp.data.data);
      }
    } catch (error) {
      setloading(false);
      dispatch(setSessionExpired(true));
      console.log("error", error);

      Alert.alert("Error", "Something Went Wrong");
    }
  };

  const saveProfileImage = async (mnImage, crpImage) => {
    setloading(true);

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

        setloading(false);
      } else if (code == 401) {
        dispatch(setSessionExpired(true));
      } else {
        setloading(false);
        Alert.alert(
          "saveProfileImage Error",
          "Some Error Occur" + resp.data.data
        );
        ifFail(activeIndx);
      }
    } catch (error) {
      dispatch(setSessionExpired(true));
      setloading(false);
      ifFail(activeIndx);

      console.log("saveProfileImage went wrong error", error);
      Alert.alert("saveProfileImage Error", "Something Went Wrong");
    }
  };

  const updateProfileImage = async (mnImage, crpImage, tmp_a) => {
    setloading(true);

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

        setloading(false);
      } else if (code == 401) {
        dispatch(setSessionExpired(true));
      } else {
        Alert.alert(
          "Error updateProfileImage",
          "Some Error Occur" + resp.data.data
        );
        setloading(false);
        ifFail(activeIndx, tmp_a);
      }
    } catch (error) {
      setloading(false);
      dispatch(setSessionExpired(true));
      ifFail(activeIndx, tmp_a);

      console.log("updateProfileImage went wrong error", error);

      Alert.alert("updateProfileImage Error", "Something Went Wrong");
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

  // To Open Camera
  const cameraLaunch = async () => {
    ImageCropPicker.openCamera({
      // width: 300,
      // height: 400,
      mediaType: "photo",
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
      // width: 300,
      // height: 400,
      avoidEmptySpaceAroundImage: false,
      // cropperCircleOverlay: true,
      // freeStyleCropEnabled: true,
      mediaType: "photo",
    })
      .then((image) => {
        cropImg(image.path);
      })
      .catch((err) => {
        if (err.message == "User did not grant library permission.") {
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

  useLayoutEffect(() => {
    if (
      active_user_location_details.action != "signup" &&
      profile_imgs[0][0] != ""
    ) {
      atLast(profile_imgs);
    }
  }, []);

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
      {mainloading && <Loader />}
      <SafeAreaView
        style={{
          height: scrn_height,
          backgroundColor: "#fff",
        }}
      >
        {/* Form Wrapper To Manage Forms Dimension */}
        <FormWrapper
          statusBarColor={colors.white}
          barStyle={"dark-content"}
          containerStyle={{
            paddingTop: rspH(3.7),
          }}
        >
          {/* Main Form UI */}
          <View>
            {/*Form  Header */}

            <FormHeader
              title="Profile Pictures"
              para={`Show people who you are! bTroo is all\nabout being real, so make sure you \nshow them how you really look like by \nadding updated photos. Please add \nat least three photos.`}
            />

            {/* Inputs Container*/}
            <View style={styles.inputCont}>
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
                          {loading && activeIndx == 0 && (
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
                            source={{ uri: `${pic1[1]}` }}
                            resizeMode="cover"
                            style={{
                              width: rspW(23),
                              height: rspW(23),
                              borderRadius: rspW(2.5),
                            }}
                          />
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
                          {loading && activeIndx == 1 && (
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
                          {loading && activeIndx == 2 && (
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
                          {loading && activeIndx == 3 && (
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
                          {loading && activeIndx == 4 && (
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
                          {loading && activeIndx == 5 && (
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
                          {loading && activeIndx == 6 && (
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
                          {loading && activeIndx == 7 && (
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
                          {loading && activeIndx == 8 && (
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
          </View>

          <View>
            <Text style={styles.guidTxt}>
              Make sure that you are following our{"\n"}
              <Text
                style={{ textDecorationLine: "underline" }}
                onPress={() => {
                  // navigation.navigate('Info', {
                  //   heading: 'Photo Guidelines',
                  // });
                  Linking.openURL(
                    "https://btroo.midnightpoha.com/index.php/photo-guidelines/"
                  );
                }}
              >
                {" "}
                photo guidelines
              </Text>
              .
            </Text>
          </View>

          <FormWrapperFooter>
            {/* Error Show Here */}

            <ErrorContainer
              error_msg={
                pic_blr &&
                [pic1, pic2, pic3, pic4, pic5, pic6, pic7, pic8, pic9].filter(
                  (v) => v[0] != ""
                ).length < 3
                  ? "Please upload atleast three images"
                  : ""
              }
            />

            {/* Next Btn To Navigate to Next Form Components */}
            <FooterBtn
              title={"Next"}
              disabled={
                !(
                  [pic1, pic2, pic3, pic4, pic5, pic6, pic7, pic8, pic9].filter(
                    (v) => v[0] != ""
                  ).length >= 3 && !loading
                )
              }
              onPress={() => {
                setpic_blr(true);
                if (
                  [pic1, pic2, pic3, pic4, pic5, pic6, pic7, pic8, pic9].filter(
                    (v) => v[0] != ""
                  ).length >= 3
                ) {
                  onNextPress();
                }
              }}
            />
          </FormWrapperFooter>
        </FormWrapper>

        <BottomModal
          height={rspH(16)}
          modalVisible={modalVisible}
          setModalVisible={setmodalVisible}
          close={false}
          extContainerStyle={{
            borderBottomWidth: 1,
            borderBottomColor: colors.blue,
          }}
          padding={0}
        >
          <View
            style={{
              ...styles.imageUpCont,
              paddingBottom: Platform.OS == "android" ? 0 : rspH(3.6),
            }}
          >
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

export default PicUpload;

const styles = StyleSheet.create({
  inputCont: {
    alignSelf: "center",
    alignItems: "center",
    marginHorizontal: rspW(-3),
    width: rspW(84),
    height: rspW(84),
    marginTop: rspH(7),
    marginBottom: rspH(4),
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  imageUpCont: {
    // height: scrn_height / 8,
    // justifyContent: 'space-between',
    alignItems: "center",
    // backgroundColor:'red',
    // backgroundColor:'green',
    // marginTop: rspH(-1.7),
    // borderRadius: rspW(5.1),
  },
  imageUpTxt: {
    fontFamily: fontFamily.regular,
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

  guidTxt: {
    textAlign: "center",
    lineHeight: rspF(2.1),
    fontSize: rspF(2),
    fontFamily: fontFamily.bold,
    color: colors.blue,
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
});
