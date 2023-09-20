import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import React, { useLayoutEffect, useState, useRef } from "react";
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
import { useDispatch } from "react-redux";
import { setStatusBarArgs } from "../../../store/reducers/authentication/authentication";
import Loader from "../../loader/Loader";
import { Image as CompImage } from "react-native-compressor";
import FastImage from "react-native-fast-image";

const PhotoVerifyCamera = ({}) => {
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const [devicec, setdevicec] = useState("");
  const cameraRef = useRef(null);
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

  const finalLoad = async (img) => {
    let n_img = await compressImg(img);

    setloading(false);
    navigation.navigate("PhotoVerificationFinal", {
      imgUri: n_img,
    });
  };

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

  const checkCameraPer = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    if (newCameraPermission == "authorized") {
      sethasCameraPermission(true);
    } else {
      sethasCameraPermission(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setdevicec("front");

      checkCameraPer();
      dispatch(
        setStatusBarArgs({ barStyle: "light-content", backgroundColor: "#000" })
      );
      // if (Platform.OS == 'android') {
      //   dispatch(
      //     setStatusBarArgs({
      //       barStyle: 'light-content',
      //       backgroundColor: 'transparent',
      //     }),
      //   );
      //   StatusBar.setTranslucent(true);
      // }

      return () => {
        dispatch(
          setStatusBarArgs({
            barStyle: "dark-content",
            backgroundColor: "#fff",
          })
        );
        // if (Platform.OS == 'android') {
        //   StatusBar.setTranslucent(false);
        // }
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
            // top: rspH(7.04),
            top: rspH(Platform.OS == "ios" ? 7.04 : 4),
            left: rspW(9.8),
            justifyContent: "center",
            alignItems: "center",
            height: rspW(7.64),
            width: rspW(7.64),
            borderRadius: rspW(4),
          }}
          //   style={{
          //     // backgroundColor:'red',
          //     justifyContent:'center',
          //   alignItems:'center',
          //   height: rspW(7.64),
          //    width:rspW(7.64),
          //   borderRadius: rspW(4),
          // }}
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
                isActive={true}
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
    // height: scrn_height,
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor:'green',

    // position:'relative',
  },
  camCont: {
    height: Platform.OS == "ios" ? scrn_height * 0.88 : scrn_height * 0.9085,
    // height:  scrn_height * 0.88 ,

    width: scrn_width,
    // backgroundColor:'green',
  },
  btnCont: {
    width: scrn_width,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: rspH(1.2),
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
    resizeMode: "contain",
  },
});
