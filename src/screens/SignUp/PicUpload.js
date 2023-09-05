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
  setProfileImgsPos,
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
import Draggable from "../../components/screenComponents/picUpload/draggable";
import Box from "../../components/screenComponents/picUpload/box";
import _ from "lodash";

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

  // draggable positions
  const [pic_list, setpic_list] = useState([]);
  const positions = useSharedValue(
    Object.assign({}, ...profile_imgs.map((item, indx) => ({ [indx]: indx })))
  );

  const changePos = async (no1, no2) => {
    let tmp_l = [...pic_list];
    // changeImgPosition(img_id_1, pos_1, img_id_2, pos_2);
  };

  const [modalVisible, setmodalVisible] = useState(false);
  const [modalVisible2, setmodalVisible2] = useState(false);
  const [activeIndx, setactiveIndx] = useState(0);
  const [cImage, setcImage] = useState("");

  const [loading, setloading] = useState(false);
  const [mainloading, setmainloading] = useState(false);

  const [refresh, setrefresh] = useState(false);

  const [pic_blr, setpic_blr] = useState(false);

  const ifFail = async (del_indx, tmp_a = []) => {
    let tmp_ls = [...pic_list];
    if (tmp_a.length > 0) {
      tmp_ls[del_indx] = tmp_a;
    } else {
      tmp_ls[del_indx] = ["", "", true, String(activeIndx + 1), ""];
    }

    setpic_list(tmp_ls);

    return true;
  };

  const atLast = async (tmp_lis) => {
    console.log("tmp_lis", tmp_lis.length);
    setpic_list(tmp_lis);

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
    let tup = pic_list.filter((v) => v[0] != "").length;
    if (tup >= 3) {
      changeImgPosition();
      // confirmImageUploads();
    }
  };

  const reArrangeList = async (indx) => {
    console.log("reArrangeList");
    let tmp_lis = _.cloneDeep(pic_list);

    tmp_lis.splice(indx, 1);

    tmp_lis.push(["", "", true, "2", ""]);

    console.log("tmp_lis.length", tmp_lis.length);

    console.log("positions.value", indx, positions.value);

    let positions_list = Object.entries(positions.value);

    console.log("positions_list", positions_list);
    let del_pos = positions_list.find((v) => v[0] == indx);

    for (let j = 0; j < tmp_lis.length; j++) {
      const ele = tmp_lis[j];

      if (j > 0 && tmp_lis[j - 1][0] != "") {
        ele[2] = true;
      } else if (j == 0) {
        ele[2] = true;
      } else {
        ele[2] = false;
      }
      ele[3] = j + 1;
    }

    let up_pos = {};
    for (let m = 0; m < positions_list.length; m++) {
      up_pos[m] = m;
    }
    console.log("up_pos", up_pos);

    positions.value = up_pos;

    dispatch(setProfileImgs(tmp_lis));
    await atLast(tmp_lis);
  };

  const deleteProfileImage = async (indx) => {
    setmainloading(true);

    let image_id = pic_list[indx][4];

    console.log("image_id", image_id);

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

  const changeImgPosition = async () => {
    // Set the API endpoint URL
    setmainloading(true);
    const url = apiUrl + "image_Position/";

    // Set the headers and token

    const headers = {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    };

    const data = {
      image_id_1: pic_list[0][4] != "" ? pic_list[0][4] : null,
      position_1: pic_list[0][4] != "" ? positions.value[0] : null,

      image_id_2: pic_list[1][4] != "" ? pic_list[1][4] : null,
      position_2: pic_list[1][4] != "" ? positions.value[1] : null,

      image_id_3: pic_list[2][4] != "" ? pic_list[2][4] : null,
      position_3: pic_list[2][4] != "" ? positions.value[2] : null,

      image_id_4: pic_list[3][4] != "" ? pic_list[3][4] : null,
      position_4: pic_list[3][4] != "" ? positions.value[3] : null,

      image_id_5: pic_list[4][4] != "" ? pic_list[4][4] : null,
      position_5: pic_list[4][4] != "" ? positions.value[4] : null,

      image_id_6: pic_list[5][4] != "" ? pic_list[5][4] : null,
      position_6: pic_list[5][4] != "" ? positions.value[5] : null,

      image_id_7: pic_list[6][4] != "" ? pic_list[6][4] : null,
      position_7: pic_list[6][4] != "" ? positions.value[6] : null,

      image_id_8: pic_list[7][4] != "" ? pic_list[7][4] : null,
      position_8: pic_list[7][4] != "" ? positions.value[7] : null,

      image_id_9: pic_list[8][4] != "" ? pic_list[8][4] : null,
      position_9: pic_list[8][4] != "" ? positions.value[8] : null,
    };

    console.log("pic_list", pic_list);

    let up_pos_lis = _.cloneDeep(pic_list);
    for (let t = 0; t < up_pos_lis.length; t++) {
      const ele = up_pos_lis[t];
      ele[3] = positions.value[t];
      console.log("\n ele", ele);
    }

    up_pos_lis = up_pos_lis.sort((a, b) => a[3] - b[3]);

    // console.log("up_pos_lis",up_pos_lis)

    // console.log("data",data)

    try {
      const resp = await axios.post(url, data, { headers });
      setmainloading(false);

      let code = resp.data.code;
      let user_data = resp.data.data;
      console.log("user_data", user_data);
      if (code == 200) {
        //
        // dispatch(setProfileImgsPos(positions.value))
        await dispatch(setProfileImgs(up_pos_lis));
        confirmImageUploads();
      } else if (code == 401) {
        dispatch(setSessionExpired(true));
      } else {
        Alert.alert("Error", "pos Some Error Occur" + resp.data.data);
      }
    } catch (error) {
      setmainloading(false);
      dispatch(setSessionExpired(true));
      console.log("error", error);

      Alert.alert("Error", "Something Went Wrong");
    }
  };

  const saveProfileImage = async (mnImage, crpImage) => {
    console.log("saveProfileImage");
    setloading(true);

    let active_itm = [];

    active_itm = pic_list[activeIndx];

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

        let tmp_lst = [...pic_list];
        tmp_lst[activeIndx] = [n_img, crp_imgd, true, activeIndx + 1, pid];

        // let compl_list = tmp_lst.filter(v => v[1] !="")

        if (activeIndx < 8 && !tmp_lst[activeIndx + 1][2]) {
          tmp_lst[activeIndx + 1] = ["", "", true, String(activeIndx + 2), ""];
        }

        setpic_list(tmp_lst);
        dispatch(setProfileImgs(tmp_lst));
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
    active_itm = pic_list[activeIndx];

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
        let tmp_lis = [...pic_list];
        tmp_lis[activeIndx] = [n_img, crp_imgd, true, activeIndx + 1, pid];

        if (activeIndx < 8 && !tmp_lis[activeIndx + 1][2]) {
          tmp_lis[activeIndx + 1] = ["", "", true, String(activeIndx + 2), ""];
        }

        setpic_list(tmp_lis);

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

    console.log("activeIndx", activeIndx);

    let tmp_list = [...pic_list];

    tmp_list[activeIndx] = [
      n_img,
      comp_crp_img,
      false,
      String(activeIndx + 1),
      "",
    ];

    setpic_list(tmp_list);
    let tmp_a = pic_list[activeIndx];

    if (tmp_a[0] == "") {
      saveProfileImage(n_img, comp_crp_img);
    } else {
      updateProfileImage(n_img, comp_crp_img, tmp_a);
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

  useLayoutEffect(() => {
    if (
      active_user_location_details.action != "signup" &&
      profile_imgs[0][0] != ""
    ) {
      console.log("profile_imgs", profile_imgs.length);
      // dispatch(setProfileImgs(profile_imgs.slice(0,9)))
      atLast(profile_imgs.slice(0, 9));
    } else {
      let tmp_lis = [
        ["", "", true, "1", ""],
        ["", "", false, "2", ""],
        ["", "", false, "3", ""],
        ["", "", false, "4", ""],
        ["", "", false, "5", ""],
        ["", "", false, "6", ""],
        ["", "", false, "7", ""],
        ["", "", false, "8", ""],
        ["", "", false, "9", ""],
      ];
      atLast(tmp_lis);
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
              {pic_list.map((item, index) => {
                return (
                  <Draggable
                    key={index}
                    positions={positions}
                    id={index}
                    activeIndx={activeIndx}
                    item={item}
                    pic_list={pic_list}
                    refresh={refresh}
                    setrefresh={setrefresh}
                  >
                    <Box
                      positions={positions}
                      index={index}
                      loading={loading}
                      item={item}
                      activeIndx={activeIndx}
                      setactiveIndx={setactiveIndx}
                      modalVisible={modalVisible}
                      setmodalVisible={setmodalVisible}
                      deleteProfileImage={deleteProfileImage}
                    />
                  </Draggable>
                );
              })}
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
                pic_blr && pic_list.filter((v) => v[0] != "").length < 3
                  ? "Please upload atleast three images"
                  : ""
              }
            />

            {/* Next Btn To Navigate to Next Form Components */}
            <FooterBtn
              title={"Next"}
              disabled={
                !(pic_list.filter((v) => v[0] != "").length >= 3 && !loading)
              }
              onPress={() => {
                setpic_blr(true);
                if (pic_list.filter((v) => v[0] != "").length >= 3) {
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
    // alignSelf: "center",
    // alignItems: "center",
    marginHorizontal: rspW(-2),
    // marginHorizontal: rspW(-4),

    width: rspW(85),
    height: rspW(85),
    // padding: 16,
    marginTop: rspH(7),
    marginBottom: rspH(4),
    flexDirection: "row",
    // justifyContent: "center",
    flexWrap: "wrap",
    // backgroundColor:'red',
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
