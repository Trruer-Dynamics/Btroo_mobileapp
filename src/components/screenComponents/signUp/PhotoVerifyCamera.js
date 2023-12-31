import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import {
  rspH,
  rspW,
  scrn_height,
  scrn_width,
} from "../../../styles/responsiveSize";

import { Camera, useCameraDevices } from "react-native-vision-camera";
import colors from "../../../styles/colors";
import IoIcon from "react-native-vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ADIcon from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import { setStatusBarArgs } from "../../../store/reducers/authentication/authentication";
import Loader from "../../loader/Loader";
import { Image as CompImage } from "react-native-compressor";
import FastImage from "react-native-fast-image";
import { setCurrentScreen } from "../../../store/reducers/screen/screen";

const PhotoVerifyCamera = ({ route }) => {
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const is_network_connected = useSelector(
    (state) => state.authentication.is_network_connected
  );
  const current_screen = useSelector((state) => state.screen.current_screen);

  const [devicec, setdevicec] = useState("");
  const cameraRef = useRef(null);
  const [cameraActive, setcameraActive] = useState(true);
  const [hasCameraPermission, sethasCameraPermission] = useState(false);
  const [flash, setflash] = useState("off");

  const [loading, setloading] = useState(false);

  const devices = useCameraDevices();

  const device = devices[devicec];

  const compressImg = async (img) => {
    // Compressor
    const compr_img = await CompImage.compress(img, {
      compressionMethod: "auto",
    });
    return compr_img;
  };

  // Save Image after compress
  const finalLoad = async (img) => {
    let n_img = await compressImg(img);

    setloading(false);

    navigation.navigate("PhotoVerificationFinal", {
      imgUri: n_img,
    });
  };

  // Capture Image
  const handleCapturePress = async () => {
    setloading(true);

    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePhoto({
          flash: flash,
        });

        if (photo.path) {
          finalLoad("file://" + photo.path);
        }
      } else {
        setloading(false);
      }
    } catch (error) {
      setloading(false);
    }
  };

  // Check Camera Permission
  const checkCameraPer = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    if (newCameraPermission == "authorized") {
      sethasCameraPermission(true);
    } else {
      sethasCameraPermission(false);
    }
  };

  useEffect(() => {
    if (!is_network_connected
       && current_screen == 'PhotoVerifyCamera'
       ) {
    
      navigation.goBack()
    }
  }, [is_network_connected])
  

  useFocusEffect(
    React.useCallback(() => {
      setcameraActive(true);
      dispatch(setCurrentScreen(route.name));

      // Camera must open with front / selfi camera
      setdevicec("front");

      checkCameraPer();
      // Change statusBar Color
      dispatch(
        setStatusBarArgs({ barStyle: "light-content", backgroundColor: "#000" })
      );

      return () => {
        dispatch(
          setStatusBarArgs({
            barStyle: "dark-content",
            backgroundColor: "#fff",
          })
        );
        // close camera after capture image
        setcameraActive(false);
      };
    }, [])
  );

  return (
    <>
      {loading && <Loader />}
      <SafeAreaView style={styles.mainCont}>
        {/* Back Btn */}
        <TouchableOpacity
          style={{
            position: "absolute",
            zIndex: 2,
            top: rspH(Platform.OS == "ios" ? 7.04 : 4),
            left: rspW(9.8),
            justifyContent: "center",
            alignItems: "center",
            height: rspW(7.64),
            width: rspW(7.64),
            borderRadius: rspW(4),
          }}
          onPress={() => {
            navigation.navigate("PhotoVerification");
          }}
        >
          <ADIcon size={20} name="left" color={"#fff"} />
        </TouchableOpacity>

        <View style={{ flex: 1, width: scrn_width }}>
          {device && hasCameraPermission ? (
            <>
              <Camera
                photo={true}
                ref={cameraRef}
                style={styles.camCont}
                device={device}
                isActive={cameraActive}
              />

              {/* Demo Pose Pic */}
              <View style={styles.posePicCont}>
                <View style={styles.poseSubPicCont}>
                  <FastImage
                    style={styles.posePic}
                    source={require("../../../assets/images/PicVerifyBL.png")}
                    resizeMode="stretch"
                  />
                </View>
              </View>
            </>
          ) : (
            <View>{/* <Text>Provide Camera Permission</Text> */}</View>
          )}
        </View>

        <View style={styles.btnCont}>
          {/* Flash Switch */}
          <TouchableOpacity
            onPress={() => {
              if (flash == "on") {
                setflash("off");
              } else {
                setflash("on");
              }
            }}
          >
            <IoIcon
              size={30}
              name={flash == "on" ? "flash" : "flash-off"}
              color="#fff"
            />
          </TouchableOpacity>

          {/* Capture Btn */}
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleCapturePress}
          />

          {/* Change Camera Btn */}
          <TouchableOpacity
            onPress={() => {
              if (devicec == "back") {
                setdevicec("front");
              } else {
                setdevicec("back");
              }
            }}
          >
            <FastImage
              source={require("../../../assets/images/FormImages/switch_camera.png")}
              style={styles.switchCamera}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <SafeAreaView />
      </SafeAreaView>
    </>
  );
};

export default PhotoVerifyCamera;

const styles = StyleSheet.create({
  mainCont: {
    backgroundColor: "#000",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  camCont: {
    height: Platform.OS == "ios" ? scrn_height * 0.88 : scrn_height * 0.9085,
    width: scrn_width,
  },
  btnCont: {
    width: scrn_width,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: rspH(0.6),
    backgroundColor: "#000",
  },

  posePicCont: {
    position: "absolute",
    bottom: rspH(1),
    right: rspW(2),
  },

  poseSubPicCont: {
    width: rspW(30),
    height: rspH(16),
    borderRadius: rspW(3),
    backgroundColor: "#C6E3F4",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  posePic: {
    height: rspH(16),
    width: rspW(32),
  },

  flash: {
    width: rspW(10),
    height: rspW(10),
  },

  captureButton: {
    width: rspW(15.4),
    height: rspW(15.4),
    borderWidth: rspW(1.2),
    borderColor: "#fff",
    borderRadius: rspW(8),
    backgroundColor: colors.blue,
  },

  switchCamera: {
    height: rspH(6.8),
    width: rspW(7.64),
  },
});
