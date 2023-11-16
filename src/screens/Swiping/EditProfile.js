import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
  Linking,
  Keyboard,
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
  setLocations,
  setProfileImgs,
  setProfileRefresh,
  setProfiledata,
  setPromptFillingComplete,
  setSessionExpired,
} from "../../store/reducers/authentication/authentication";
import Loader from "../../components/loader/Loader";
import FormHeader from "../../components/wrappers/formWrappers/FormHeader";
import { useSharedValue } from "react-native-reanimated";
import ImageCropPicker from "react-native-image-crop-picker";
import CentralModal from "../../components/modals/CentralModal";
import { UserContext } from "../../context/user";
import AutoGrowingTextInput from "react-native-autogrow-textinput-ts";
import { Image as CompImage } from "react-native-compressor";
import Draggable from "../../components/screenComponents/picUpload/draggable";
import Box from "../../components/screenComponents/picUpload/box";
import _ from "lodash";
import FormSelectorLS from "../../components/formComponents/FormSelectorLS";
import { useFocusEffect } from "@react-navigation/native";


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

  const lcl_locations = useSelector(
    (state) => state.authentication.locations
  );


  const { appStateVisible } = useContext(UserContext);

  const scrollViewRef = useRef();

  const [current_pos, setcurrent_pos] = useState(0);

  const [changes_made, setchanges_made] = useState(false);

  // draggable positions
  const [pic_list, setpic_list] = useState([]);
  const positions = useSharedValue(
    Object.assign({}, ...profile_imgs.map((item, indx) => ({ [indx]: indx })))
  );

  const is_network_connected = useSelector(
    (state) => state.authentication.is_network_connected
  );

  const [pos2, setpos2] = useState(
    Object.assign({}, ...profile_imgs.map((item, indx) => ({ [indx]: indx })))
  );

  const [pos_change, setpos_change] = useState(false);

  const changeImgPosition = async (pic_lis) => {
    // Set the API endpoint URL
    setloading(true);
    const url = apiUrl + "image_Position/";

    // Set the headers and token

    const headers = {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    };

    const data = {
      image_id_1: pic_lis[0][4] != "" ? pic_lis[0][4] : null,
      position_1: pic_lis[0][4] != "" ? positions.value[0] : null,

      image_id_2: pic_lis[1][4] != "" ? pic_lis[1][4] : null,
      position_2: pic_lis[1][4] != "" ? positions.value[1] : null,

      image_id_3: pic_lis[2][4] != "" ? pic_lis[2][4] : null,
      position_3: pic_lis[2][4] != "" ? positions.value[2] : null,

      image_id_4: pic_lis[3][4] != "" ? pic_lis[3][4] : null,
      position_4: pic_lis[3][4] != "" ? positions.value[3] : null,

      image_id_5: pic_lis[4][4] != "" ? pic_lis[4][4] : null,
      position_5: pic_lis[4][4] != "" ? positions.value[4] : null,

      image_id_6: pic_lis[5][4] != "" ? pic_lis[5][4] : null,
      position_6: pic_lis[5][4] != "" ? positions.value[5] : null,

      image_id_7: pic_lis[6][4] != "" ? pic_lis[6][4] : null,
      position_7: pic_lis[6][4] != "" ? positions.value[6] : null,

      image_id_8: pic_lis[7][4] != "" ? pic_lis[7][4] : null,
      position_8: pic_lis[7][4] != "" ? positions.value[7] : null,

      image_id_9: pic_lis[8][4] != "" ? pic_lis[8][4] : null,
      position_9: pic_lis[8][4] != "" ? positions.value[8] : null,
    };

    let up_pos_lis = _.cloneDeep(pic_lis);
    for (let t = 0; t < up_pos_lis.length; t++) {
      const ele = up_pos_lis[t];
      ele[3] = positions.value[t];
    }

    up_pos_lis = up_pos_lis.sort((a, b) => a[3] - b[3]);

    try {
      const resp = await axios.post(url, data, { headers });
      setloading(false);

      let code = resp.data.code;
      let user_data = resp.data.data;

      if (code == 200) {
        dispatch(setProfileImgs(up_pos_lis));
      } else if (code == 401) {
        dispatch(setSessionExpired(true));
      }
    } catch (error) {
      setloading(false);
    }
  };

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
  const [count, setcount] = useState(0);

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
  const [preference_list, setpreference_list] = useState([]);
  const [selected_preference_list, setselected_preference_list] = useState([]);
  const [preference_blr, setpreference_blr] = useState(false);

  const [education, seteducation] = useState("");
  const [education_id, seteducation_id] = useState(0);
  const [education_list, seteducation_list] = useState([]);
  const [education_blr, seteducation_blr] = useState(false);

  const [occupation, setoccupation] = useState("");
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
    setpic_list(tmp_lis);
    setrefresh(!refresh);
  };

  const onNextPress = async () => {
    if (pos_change) {
      await changeImgPosition(pic_list);
    }
    await saveProfileData();
  };

  const reArrangeList = async (indx) => {
    let tmp_lis = _.cloneDeep(pic_list);
    tmp_lis.splice(indx, 1);
    tmp_lis.push(["", "", true, "2", ""]);

    let positions_list = Object.entries(positions.value);

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

    positions.value = up_pos;
    setpos2(up_pos);

    dispatch(setProfileImgs(tmp_lis));
    await atLast(tmp_lis);
    await changeImgPosition(tmp_lis);
  };

  const saveProfileImage = async (mnImage, crpImage) => {
    setloading_img(true);
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

        if (activeIndx < 8 && !tmp_lst[activeIndx + 1][2]) {
          tmp_lst[activeIndx + 1] = ["", "", true, String(activeIndx + 2), ""];
        }

        setpic_list(tmp_lst);
        dispatch(setProfileImgs(tmp_lst));
        setrefresh(!refresh);

        setloading_img(false);
      } else if (code == 401) {
        dispatch(setSessionExpired(true));
      } else {
        setloading_img(false);
        ifFail(activeIndx);
      }
    } catch (error) {
      setloading_img(false);
      ifFail(activeIndx);
    }
  };

  const updateProfileImage = async (mnImage, crpImage, tmp_a) => {
    setloading_img(true);

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

        setloading_img(false);
      } else if (code == 401) {
        dispatch(setSessionExpired(true));
      } else {
        setloading_img(false);
        ifFail(activeIndx, tmp_a);
      }
    } catch (error) {
      setloading_img(false);
      ifFail(activeIndx, tmp_a);
    }
  };

  const deleteProfileImage = async (indx) => {
    setloading(true);

    let image_id = pic_list[indx][4];
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
      }
    } catch (error) {
      setloading(false);
    }
  };

  const compressImg = async (img) => {
    // Compressor
    const compr_img = await CompImage.compress(img, {
      compressionMethod: "auto",
    });
    return compr_img;
  };

  const finalLoad = async (img, crp_img) => {
    let n_img = await compressImg(img);
    let comp_crp_img = await compressImg(crp_img);

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
      cropperStatusBarColor: 'black', // don't add 3 digit color code like '#000'
      cropperActiveWidgetColor: colors.blue,
    }).then((image) => {
      let crp_img = image.path;
      finalLoad(img, crp_img);
    });
  };

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
      width: 300,
      height: 400,
      avoidEmptySpaceAroundImage: false,
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


  const getLocation = async (page, onpage = false) => {
    setcity_refresh(true);
    let url = `GetLocation/`
    let data = {
      location: city_search,
    };

    const headers = {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    };

    await axios
      .post(apiUrl + url, data, { headers })
      .then((resp) => {
        if (resp.data.code == 200) {
          setcity_refresh(false);

          let f_list = [];
          // if (onpage) {
          //   f_list = [...city_list];
          // }
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
          dispatch(setLocations(f_list))

        } else {
          setcity_refresh(false);
        }
      })
      .catch((err) => {
        setcity_refresh(false);
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
        },
      },
    ]);
  };


  

  //Debounce the showAlert function with a delay of 300 milliseconds
  const debounceShowConfirmDialog = _.debounce(showConfirmDialog, 200, {
    leading: true,
    trailing: false,
  });

  const userExist = async () =>{
  
    let url_path = 'isacountavialable/'

    // setloading(true);
    const data = {
      user_id: profile_data.user.id,
    };

    const headers = {
      // Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(
        apiUrl + url_path,
        data,
        {
          headers,
        }
      );
      let resp_data = response.data;

      // setloading(false);

      if (resp_data.code == 400) {

           Alert.alert("Your account deleted!", "Please Contact admin at contact@btrooapp.com.", [
            
            {
              text: "OK",
              onPress: () => {
                dispatch(setSessionExpired(true))
              },
            },
          ]);
        
      }
      
    } catch (error) {
      // setloading(false);
      return false;

    }

  }

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
        }
      })
      .catch((err) => {});
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
        }
      })
      .catch((err) => {});
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
      .catch((err) => {});
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
      .catch((err) => {});
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
      .catch((err) => {});
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
      .catch((err) => {});
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
          savePrompts(user_prof_data);
          //   setloading(false);
          //   dispatch(setProfiledata(user_prof_data));
          //   navigation.navigate("ProfileMain");
        }
      } else if (code == 401) {
        dispatch(setSessionExpired(true));
      } else {
        setloading(false);
      }
    } catch (error) {
      setloading(false);
    }
  };

  const savePrompts = async (user_prof_data) => {
    const url = apiUrl + "createuserpormpts/";

    const headers = {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    };

    const data = {
      userid: profile_data.user.id,
      publicprompts: [
        {
          prompstid: public_prompt1_q[0],
          answer: public_prompt1_a,
        },
        {
          prompstid: public_prompt2_q[0],
          answer: public_prompt2_a,
        },
      ],
      privateprompts: [
        {
          prompstid: private_prompt1_q[0],
          answer: private_prompt1_a,
        },
        {
          prompstid: private_prompt2_q[0],
          answer: private_prompt2_a,
        },
      ],
      refralcode: "",
    };

    try {
      const resp = await axios.post(url, data, { headers });
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
        dispatch(setPromptFillingComplete(true));
        dispatch(setProfiledata(user_prof_datap));
        setloading(false);
        navigation.navigate("ProfileMain");
      } else if (code == 401) {
        setloading(false);
        dispatch(setSessionExpired(true));
      }
    } catch (error) {
      setloading(false);
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
      }
    } catch (error) {
      setloading(false);
    }
  };

  useEffect(() => {
    if (prompts_list.length > 0) {
      setPrompts();
    }
  }, []);

  useEffect(() => {
    if (pos_change) {
      setrefresh(!refresh);
      setchanges_made(true);
    }
  }, [pos_change]);

  const loadData = async () => {

    let usr_profile = profile_data.userprofile;
    setheight_cm(usr_profile.height.toString());
    setoccupation(usr_profile.occupation);
    await atLast(profile_imgs.slice(0, 9));
    await getGenders();
    await getEducation();
    await getInterests();
    await getLanguages();
    await getPets();
    await getPoliticalInclinations();

    if (prompts_list_all.length > 0) {
      await setPrompts();
    }
  };

  useLayoutEffect(() => {
    if (is_network_connected) {
      loadData();
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

  useEffect(() => {
    if (!is_network_connected) {
     setmodalVisible(false)
    }
   }, [is_network_connected])

  useLayoutEffect(() => {
    getLocation(1)
  }, [])

  useFocusEffect(
    React.useCallback(() => {
    if (appStateVisible == 'active') {
      userExist()
    }

    }, [appStateVisible])
  );

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
                  debounceShowConfirmDialog();
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
              // extraScrollHeight={Platform.OS == "ios" ? 0 : scrn_height / 6}
              // extraHeight={Platform.OS == "ios" ? scrn_height / 6 : 0}

              // extraScrollHeight={Platform.OS == "ios" ? 0 : 0}
              extraScrollHeight={Platform.OS == "ios" ? -scrn_height * 0.22 : 0}
              extraHeight={
                Platform.OS == "ios" ? scrn_height * 0.38 : scrn_height * 0.23
              }
              style={{
                flex: 1,
                backgroundColor: "#fff",
                //  backgroundColor: "red",
                width: scrn_width,
              }}
              bounces={false}
              showsVerticalScrollIndicator={false}
              horizontal={false}
            >
              <View
                style={{
                  paddingHorizontal: rspW(10),
                  // width: '100%',
                  // backgroundColor:'green'
                }}
              >
                {/* Inputs Container*/}
                <View style={{ ...styles.inputCont }}>
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
                        setpos_change={setpos_change}
                        setpos2={setpos2}
                      >
                        <Box
                          up_img_len={pic_list.filter((v) => v[0] != "").length}
                          positions={positions}
                          index={index}
                          loading={loading_img}
                          item={item}
                          activeIndx={activeIndx}
                          setactiveIndx={setactiveIndx}
                          modalVisible={modalVisible}
                          setmodalVisible={setmodalVisible}
                          deleteProfileImage={deleteProfileImage}
                          editscreen={true}
                          pos2={pos2}
                        />
                      </Draggable>
                    );
                  })}
                </View>

                <View
                  style={{
                    marginTop: rspH(1.2),
                  }}
                >
                  

                  <FormInputContainer label="City">
                    <FormSelectorLS
                      setSelectedEntry={setcity}
                      selectedId={city_id}
                      setSelectedId={setcity_id}
                      blr_value={city_blr}
                      setblr_value={setcity_blr}
                      title="City"
                      placeholder={"Select"}
                      width={"100%"}
                      list={lcl_locations}
                      selectedValue={city[1]}
                      // refreshing={city_refresh}
                      // reshing={setcity_refresh}
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
                      maxLength={20}
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
                  {/* {profile_data?.userprivateprompts?.length > 0 && ( */}
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
                        <Text style={{ ...styles.label }}>Public Prompts</Text>
                      </View>

                      <View style={{ marginBottom: rspH(3.7) }}>
                        <Text style={{ ...styles.promptpara }}>
                          Stand out! Don’t be just another fish in the sea.
                          {"\n"}
                          {"\n"}The prompts in this section will be visible only
                          to the{"\n"}
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
                              error={profile_data?.userpublicprompts?.length > 0 ? true : false}
                              placeholder={"Public Prompt Question 1"}
                              width={"100%"}
                              list={prompts_list}
                              selectedValue={public_prompt1_q[1]}
                              setchanges_made={setchanges_made}
                              removable={true}
                              multiline={true}
                              rmv_list={prompts_list_rmv}
                              setrmv_list={setprompts_list_rmv}
                            />
                          </View>

                          <View ref={pup_a1_ref}>
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
                                    : public_prompt1_blr
                                    &&
                                    profile_data?.userpublicprompts?.length > 0
                                    ? colors.error
                                    : colors.grey,
                                textAlignVertical: "top",
                              }}
                              value={public_prompt1_a}
                              onFocus={() => {
                                setpublic_prompt1_blr(true);
                              }}
                              onChangeText={(val) => {
                                setpublic_prompt1_a(val);

                                if (public_prompt1_blr) {
                                  setchanges_made(true);
                                }
                              }}
                              onBlur={() => {
                                setpublic_prompt1_blr(true);
                              }}
                              editable={public_prompt1_q != ""}
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
                              error={profile_data?.userpublicprompts?.length > 0 ? true : false}
                              list={prompts_list}
                              search={false}
                              selectedValue={public_prompt2_q[1]}
                              setchanges_made={setchanges_made}
                              removable={true}
                              multiline={true}
                              rmv_list={prompts_list_rmv}
                              setrmv_list={setprompts_list_rmv}
                            />
                          </View>
                          <View ref={pup_a2_ref}>
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
                                    : public_prompt2_blr
                                    &&
                                    profile_data?.userpublicprompts?.length > 0
                                    ? colors.error
                                    : colors.grey,

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
                              editable={public_prompt2_q != ""}
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
                        <Text style={{ ...styles.label }}>Private Prompts</Text>
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
                              error={profile_data?.userprivateprompts?.length > 0 ? true : false}
                              placeholder={"Private Prompt Question 1"}
                              width={"100%"}
                              list={prompts_list}
                              selectedValue={private_prompt1_q[1]}
                              setchanges_made={setchanges_made}
                              removable={true}
                              multiline={true}
                              rmv_list={prompts_list_rmv}
                              setrmv_list={setprompts_list_rmv}
                            />
                          </View>
                          <View ref={prp_a1_ref}>
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
                                    : private_prompt1_blr
                                    &&
                                    profile_data?.userprivateprompts?.length > 0
                                    ? colors.error
                                    : colors.grey,
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
                              editable={private_prompt1_q != ""}
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
                              error={profile_data?.userprivateprompts?.length > 0 ? true : false}
                              placeholder={"Private Prompt Question 2"}
                              width={"100%"}
                              list={prompts_list}
                              selectedValue={private_prompt2_q[1]}
                              search={false}
                              setchanges_made={setchanges_made}
                              removable={true}
                              multiline={true}
                              rmv_list={prompts_list_rmv}
                              setrmv_list={setprompts_list_rmv}
                            />
                          </View>
                          <View ref={prp_a2_ref}>
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
                                    : private_prompt2_blr
                                    &&
                                    profile_data?.userprivateprompts?.length > 0
                                    ? colors.error
                                    : colors.grey,
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
                              editable={private_prompt2_q != ""}
                              
                              maxHeight={rspH(11.5)}
                              minHeight={rspH(11.5)}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                  {/* )} */}
                </View>
              </View>
            </KeyboardAwareScrollView>

            <View>
              <FormWrapperFooter
                containerStyle={{
                  height: rspH(13.59),

                  marginBottom: rspH(-2.32),
                }}
              >
                <ErrorContainer error_msg="" />

                <FooterBtn
                  title={"Save"}
                  disabled={
                    !is_network_connected 
                    ||
                    !changes_made ||
                    height_cm < 60 ||
                    height_cm > 270 ||
                    occupation == "" ||
                    (!habits_list[0][1] && !habits_list[0][2]) ||
                    (!habits_list[1][1] && !habits_list[1][2]) ||
                    (!habits_list[2][1] && !habits_list[2][2]) ||
                    public_prompt1_q_id == 0 ||
                    public_prompt1_a.length < 3 ||
                    public_prompt2_q_id == 0 ||
                    public_prompt2_a.length < 3 ||
                    private_prompt1_q_id == 0 ||
                    private_prompt1_a.length < 3 ||
                    private_prompt2_q_id == 0 ||
                    private_prompt2_a.length < 3
                    // )
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
                      height_cm >= 60 &&
                      height_cm <= 270 &&
                      occupation != "" &&
                      smok != null &&
                      drik != null &&
                      marij != null &&
                      public_prompt1_q_id != 0 &&
                      public_prompt1_a.length > 2 &&
                      public_prompt2_q_id != 0 &&
                      public_prompt2_a.length > 2 &&
                      private_prompt1_q_id != 0 &&
                      private_prompt1_a.length > 2 &&
                      private_prompt2_q_id != 0 &&
                      private_prompt2_a.length > 2
                    ) {
                      if (is_network_connected) {
                        onNextPress();
                      }
         
                    } 
                    else {
                      // if (profile_data?.userprivateprompts?.length > 0) {
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
                      } else if (public_prompt1_a.length < 3) {
                        console.log("public_prompt1_a",public_prompt1_a)
                        pup_a1_ref.current.measure(
                          (x, y, width, height, pageX, pageY) => {
                            pageY = pageY + current_pos;

                            scrollViewRef.current.scrollToPosition(
                              0,
                              pageY
                               - rspH(16),
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
                      } else if (public_prompt2_a.length < 3) {
                        console.log("public_prompt1_a",public_prompt2_a)
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
                      } else if (private_prompt1_a.length < 3) {
                        console.log("private_prompt1_a",private_prompt1_a)

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
                      } else if (private_prompt2_a.length < 3) {
                        console.log("private_prompt2_a",private_prompt2_a)
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
                      if (public_prompt1_a.length < 3) {
                        setpublic_prompt1_blr(true);
                      }
                      if (public_prompt2_q_id == 0) {
                        setpublic_prompt2_q_blr(true);
                      }
                      if (public_prompt2_a.length < 3) {
                        setpublic_prompt2_blr(true);
                      }
                      if (private_prompt1_q_id == 0) {
                        setprivate_prompt1_q_blr(true);
                      }
                      if (private_prompt1_a.length < 3) {
                        setprivate_prompt1_blr(true);
                      }
                      if (private_prompt2_q_id == 0) {
                        setprivate_prompt2_q_blr(true);
                      }
                      if (private_prompt2_a.length < 3) {
                        setprivate_prompt2_blr(true);
                      }
                      // }
                    // }
                    }
                  }}
                />
              </FormWrapperFooter>
            </View>
          </View>
        </SafeAreaView>

        <BottomModal
          padding={0}
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
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: rspH(8),
                width: scrn_width,
                borderBottomWidth: 1,
                borderBottomColor: colors.blue,
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
                if (Platform.OS == "ios") {
                  Linking.openURL("app-settings:");
                } else {
                  Linking.openSettings();
                }
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
    alignItems: "center",
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
    lineHeight: rspF(2.65),
    marginBottom: rspH(2.35),
    letterSpacing: 1,
  },

  inputCont: {
    marginHorizontal: rspW(-2),
    width: rspW(85),
    height: rspW(85),
    marginTop: rspH(1),
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageUpCont: {
    alignItems: "center",
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
    paddingHorizontal: rspW(3.2),
    marginBottom: rspH(0.6),
  },
  radioTxt: {
    lineHeight: rspF(2.05),
    fontFamily: fontFamily.medium,
    color: colors.black,
    fontSize: rspF(2.02),
  },
  radioBtnCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: rspW(23.6),
  },
  radioBtn: {
    width: rspW(6.34),
    height: rspW(6.34),
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
