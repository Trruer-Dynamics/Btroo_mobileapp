import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Platform,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import FormWrapper from "../../components/wrappers/formWrappers/FormWrapper";
import colors from "../../styles/colors";
import FormInput from "../../components/formComponents/FormInput";
import {
  rspF,
  rspH,
  rspW,
  scrn_height,
  scrn_width,
} from "../../styles/responsiveSize";
import FooterBtn from "../../components/Buttons/FooterBtn";
import fontFamily from "../../styles/fontFamily";
import FormWrapperFooter from "../../components/wrappers/formWrappers/FormWrapperFooter";
import ErrorContainer from "../../components/formComponents/ErrorContainer";
import FormInputContainer from "../../components/formComponents/FormInputContainer";
import DatePicker from "react-native-date-picker";
import FormDateSelector from "../../components/formComponents/FormDateSelector";
import FormSelector from "../../components/formComponents/FormSelector";
import FormMultiSelector from "../../components/formComponents/FormMultiSelector";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { apiUrl } from "../../constants";
import {
  setProfiledata,
  setPromptFillingComplete,
  setPromptFillingStart,
  setSessionExpired,
} from "../../store/reducers/authentication/authentication";
import Loader from "../../components/loader/Loader";
import FormHeader from "../../components/wrappers/formWrappers/FormHeader";
import {
  setChatRevealTut,
  setChatTut,
  setMatchTut,
  setSwipeTut,
} from "../../store/reducers/tutorial/tutorial";
import { useFocusEffect } from "@react-navigation/native";
import { setCurrentScreen } from "../../store/reducers/screen/screen";

const UserIntro = ({ navigation, route }) => {
  const [step, setstep] = useState(1);

  const access_token = useSelector(
    (state) => state.authentication.access_token
  );
  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );

  const dispatch = useDispatch();

  //All data states
  //Step 1
  const [name, setname] = useState("");
  const [name_blr, setname_blr] = useState(false);

  const [step1blr, setstep1blr] = useState(false);
  const [step2blr, setstep2blr] = useState(false);
  const [step3blr, setstep3blr] = useState(false);

  const [user_intro_err, setuser_intro_err] = useState("");
  const [user_intro_err2, setuser_intro_err2] = useState("");
  const [user_intro_err3, setuser_intro_err3] = useState("");

  const [step1_all_fill, setstep1_all_fill] = useState(false);
  const [step2_all_fill, setstep2_all_fill] = useState(false);
  const [step3_all_fill, setstep3_all_fill] = useState(false);

  const [dob, setdob] = useState(null);
  const [maxdate, setmaxdate] = useState(new Date("2002-11-02"));
  const [date_open, setdate_open] = useState(false);
  const [dob_blr, setdob_blr] = useState(false);
  const [dob_blr2, setdob_blr2] = useState(false);

  const [city, setcity] = useState("");
  const [city_id, setcity_id] = useState(0);
  const [city_list, setcity_list] = useState([]);
  const [city_refresh, setcity_refresh] = useState(false);
  const [city_blr, setcity_blr] = useState(false);
  const [city_page, setcity_page] = useState(1);
  const [city_search, setcity_search] = useState("");
  const [height_cm, setheight_cm] = useState("");
  const [height_blr, setheight_blr] = useState(false);
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
  const [occupation_blr, setoccupation_blr] = useState(false);

  const [habits_list, sethabits_list] = useState([
    ["Smoking", null, null],
    ["Drinking", null, null],
    ["Marijuana", null, null],
  ]);

  const [refresh, setrefresh] = useState(false);

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
  const [selected_pets_list, setselected_pets_list] = useState([]);
  const [pets_blr, setpets_blr] = useState(false);

  const [political_inclination, setpolitical_inclination] = useState("");
  const [political_inclination_id, setpolitical_inclination_id] = useState(0);
  const [political_inclination_list, setpolitical_inclination_list] = useState([
    [1, "Liberal"],
    [2, "Right"],
    [3, "Center"],
    [4, "Other"],
    [5, "Rather not say"],
  ]);
  const [political_inclination_blr, setpolitical_inclination_blr] =
    useState(false);

  const [loading, setloading] = useState(false);

  useEffect(() => {
    if (step == 1 && step1blr) {
      if (
        name.length > 1 ||
        (height_cm >= 60 && height_cm <= 270) ||
        dob ||
        city ||
        gender
      ) {
        setuser_intro_err("");
      }
    }
    if (
      step == 1 &&
      height_cm >= 60 &&
      height_cm <= 270 &&
      name.length > 1 &&
      dob &&
      gender &&
      city &&
      name != ""
    ) {
      setstep1_all_fill(true);
    } else {
      setstep1_all_fill(false);
    }
  }, [name, height_cm, dob, city, height_cm, gender, step]);

  useEffect(() => {
    if (step1blr) {
      setname_blr(true);
      setdob_blr(true);
      setcity_blr(true);
      setheight_blr(true);
      setgender_blr(true);
    }
  }, [step1blr]);

  useEffect(() => {
    let smok = habits_list[0][1] ? true : habits_list[0][2] ? false : null;
    let drik = habits_list[1][1] ? true : habits_list[1][2] ? false : null;
    let marij = habits_list[2][1] ? true : habits_list[2][2] ? false : null;

    if (step == 2 && step2blr) {
      if (
        selected_preference_list.length > 0 ||
        education ||
        occupation.length > 1 ||
        habits_list
      ) {
        setuser_intro_err2("");
      }
    }
    if (
      step == 2 &&
      smok != null &&
      drik != null &&
      marij != null &&
      selected_preference_list.length > 0 &&
      education &&
      occupation.length > 1
    ) {
      setstep2_all_fill(true);
    } else {
      setstep2_all_fill(false);
    }
  }, [selected_preference_list, education, occupation, refresh]);

  useEffect(() => {
    if (step2blr) {
      setpreference_blr(true);
      seteducation_blr(true);
      setoccupation_blr(true);
    }
  }, [step2blr]);

  useEffect(() => {
    if (step == 3 && step3blr) {
      if (
        selected_interests_list.length > 0 ||
        selected_languages_list.length > 0
      ) {
        setuser_intro_err3("");
      }
    }
    if (
      step == 3 &&
      selected_interests_list.length > 0 &&
      selected_languages_list.length > 0
    ) {
      setstep3_all_fill(true);
    } else {
      setstep3_all_fill(false);
    }
  }, [
    selected_interests_list,
    interests,
    languages_list,
    selected_languages_list,
    step,
  ]);

  useEffect(() => {
    if (step3blr) {
      setinterests_blr(true);
      setlanguages_blr(true);
    }
  }, [step3blr]);

  const onNextPress = () => {
    let val = false;

    if (step == 1) {
      setstep1blr(true);

      if (name.length < 2) {
        setuser_intro_err("The name you have entered is too short.");
      } else if (dob == null) {
        setuser_intro_err("Please select your date of birth");
      } else if (city == "") {
        setuser_intro_err("Please select your city");
      } else if (height_cm < 60 || height_cm > 270) {
        setuser_intro_err("Please enter a height between 60 to 270 cms");
      } else if (gender == "") {
        setuser_intro_err("Please select your gender");
      } else {
        if (height_cm != "" && dob && gender && city && name != "") {
          setstep1_all_fill(true);
        } else {
          setstep1_all_fill(false);
        }

        setuser_intro_err("");
      }
    } else if (step == 2) {
      setstep2blr(true);

      let smok = habits_list[0][1] ? true : habits_list[0][2] ? false : null;
      let drik = habits_list[1][1] ? true : habits_list[1][2] ? false : null;
      let marij = habits_list[2][1] ? true : habits_list[2][2] ? false : null;

      if (selected_preference_list.length == 0) {
        setuser_intro_err2("Please select your preference.");
      } else if (education == "") {
        setuser_intro_err2("Please select your education");
      } else if (occupation.length < 2) {
        setuser_intro_err2("Please enter your occupation");
      } else if (smok == null || drik == null || marij == null) {
        setuser_intro_err2("Please select all habits");
        setstep2_all_fill(false);
      } else {
        setuser_intro_err2("");
      }
    } else if (step == 3) {
      setstep3blr(true);

      if (selected_interests_list.length == 0) {
        setuser_intro_err3("Please select your interest.");
      } else if (selected_languages_list.length == 0) {
        setuser_intro_err3("Please select your languages.");
      } else {
        setuser_intro_err3("");
      }
    }

    if (
      (step == 1 &&
        name.length > 1 &&
        dob &&
        city &&
        height_cm >= 60 &&
        height_cm <= 270 &&
        gender) ||
      (step == 2 &&
        selected_preference_list.length > 0 &&
        education &&
        occupation &&
        (habits_list[0][1] || habits_list[0][2]) &&
        (habits_list[1][1] || habits_list[1][2]) &&
        (habits_list[2][1] || habits_list[2][2])) ||
      (step == 3 &&
        selected_interests_list.length > 0 &&
        selected_languages_list.length > 0)
    ) {
      val = true;
    }

    if (val) {
      if (step < 3) {
        setstep(step + 1);
      } else {
        saveProfileData();
      }
    }
  };

  const saveProfileData = async () => {
    // Set the API endpoint URL
    setloading(true);
    const url = apiUrl + "profile/";

    // Set the headers and token

    const headers = {
      Authorization: `Bearer ${access_token}`,

      "Content-Type": "application/json",
    };

    let dobd = `${dob.getFullYear()}-${dob.getMonth() + 1}-${dob.getDate()}`;

    // Set the data to be sent in the request body

    const data = {
      user_id: profile_data.user.id, //data should be in integer

      name: name,

      dob: dobd,

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
      setloading(false);

      let code = resp.data.code;
      let user_data = resp.data.data;

      if (code == 200) {
        let u_pref = user_data.userprefrances.map((v) => v.gendermaster.id);

        let user_prof_data = {
          user: user_data.user,
          userinterest: user_data.userinterest,
          userlanguages: user_data.userlanguages,
          userpets: user_data.userpets,
          userpreferances: u_pref,
          userprofile: user_data.userprofile,
          userpublicprompts: [],
          userprivateprompts: [],
        };

        dispatch(
          setPromptFillingStart(user_data.userprofile.is_promptsfillingstarted)
        );
        dispatch(
          setPromptFillingComplete(
            user_data.userprofile.is_promptsfillingcomplete
          )
        );

        dispatch(setSwipeTut(!user_data.userprofile.is_swapping_tutorial_view));
        dispatch(setMatchTut(!user_data.userprofile.is_matching_tutorial_view));
        dispatch(setChatTut(!user_data.userprofile.is_chatting_tutorial_view));
        dispatch(
          setChatRevealTut(
            !user_data.userprofile.is_chatting_reveal_tutorial_view
          )
        );
        dispatch(setProfiledata(user_prof_data));

        navigation.navigate("PicUpload");

        setstep(1);
      } else if (code == 401) {
        dispatch(setSessionExpired(true));
      }
    } catch (error) {
      setloading(false);
    }
  };

  const getLocation = async (page, onpage = false) => {
    setcity_refresh(true);

    let data = {
      location: city_search,
    };
    const headers = {
      Authorization: `Bearer ${access_token}`,

      "Content-Type": "application/json",
    };
    await axios
      .post(apiUrl + `GetLocation/?page=${page}`, data, { headers })
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
                (v?.state?.state_name && v?.state?.state_name + ", ") +
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
      });
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
        } else {
          console.warn("Error occur while getting Education");
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

  useLayoutEffect(() => {
    let mxdate = new Date().setFullYear(new Date().getFullYear() - 18);
    let mxdate_f = new Date(mxdate).toISOString().split("T")[0];

    setmaxdate(mxdate_f);

    if (Platform.OS == "android") {
      setdob(new Date(mxdate_f));
    }

    getGenders();
    getEducation();
    getInterests();
    getLanguages();
    getPets();
    getPoliticalInclinations();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(setCurrentScreen(route.name));
      return () => {};
    }, [])
  );

  return (
    <>
      {loading && <Loader />}
      <SafeAreaView style={{ height: scrn_height, backgroundColor: "#fff" }}>
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          extraScrollHeight={Platform.OS == "ios" ? 0 : scrn_height / 7}
          style={{ backgroundColor: "#fff", flex: 1 }}
          bounces={false}
        >
          <FormWrapper>
            {/* Main Form UI */}

            <FormHeader
              left_icon={step > 1}
              onPress={() => {
                if (step > 1) {
                  setstep(step - 1);
                }
              }}
              title="Introduce Yourself"
              para={`Let people know more about you ${"\n"} by filling out some details about ${"\n"} yourself.`}
            />

            {/* Inputs Container*/}
            <View style={styles.inputCont}>
              {step == 1 && (
                <>
                  <FormInputContainer label="Name">
                    <FormInput
                      maxLength={15}
                      value={name}
                      setvalue={setname}
                      width={"100%"}
                      height={rspW(12.76)}
                      placeholder={"Add your first name"}
                      error_cond={name.length < 2 && step1blr}
                      keyboardType="default"
                      value_blr={name_blr}
                      setvalue_blr={setname_blr}
                      s_allow={false}
                      n_allow={false}
                    />
                  </FormInputContainer>

                  {/* Select Date */}
                  <FormInputContainer label="Date of Birth">
                    <FormDateSelector
                      width={"100%"}
                      title={"Select"}
                      date={dob && dob_blr2 ? dob : ""}
                      onPress={() => {
                        setdob_blr(true);
                        setdate_open(true);
                      }}
                      dob_blr={dob_blr && step1blr}
                    />

                    <DatePicker
                      modal
                      open={date_open}
                      date={dob ? dob : new Date()}
                      onConfirm={(date) => {
                        setdob_blr2(true);
                        setdate_open(false);
                        setdob(date);
                      }}
                      maximumDate={new Date(maxdate)}
                      mode="date"
                      onCancel={() => {
                        setdate_open(false);
                      }}
                    />
                  </FormInputContainer>

                  <FormInputContainer label="City">
                    <FormSelector
                      setSelectedEntry={setcity}
                      selectedId={city_id}
                      setSelectedId={setcity_id}
                      blr_value={city_blr && step1blr}
                      setblr_value={setcity_blr}
                      title="City"
                      placeholder={"Select"}
                      width={"100%"}
                      list={city_list}
                      selectedValue={city[1]}
                      pull_refresh={true}
                      refreshing={city_refresh}
                      setrefreshing={setcity_refresh}
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
                    />
                  </FormInputContainer>

                  <View style={styles.multiInputContainer}>
                    <FormInputContainer label="Height (cms)">
                      <FormInput
                        maxLength={3}
                        value={height_cm}
                        setvalue={setheight_cm}
                        width={scrn_width / 2.6}
                        height={rspH(5.9)}
                        placeholder={"cms"}
                        error_cond={
                          (height_cm < 60 || height_cm > 270) && step1blr
                        }
                        value_blr={height_blr}
                        setvalue_blr={setheight_blr}
                        s_allow={false}
                        a_allow={false}
                        unit="cms"
                        inputwidth="40%"
                      />
                    </FormInputContainer>

                    <FormInputContainer label="Gender">
                      <FormSelector
                        search={false}
                        setSelectedEntry={setgender}
                        selectedId={gender_id}
                        setSelectedId={setgender_id}
                        blr_value={gender_blr && step1blr}
                        setblr_value={setgender_blr}
                        title="Gender"
                        placeholder={"Select"}
                        width={scrn_width / 2.6}
                        list={gender_list}
                        selectedValue={gender[1]}
                      />
                    </FormInputContainer>
                  </View>
                </>
              )}

              {step == 2 && (
                <>
                  <FormInputContainer label="Your Preference">
                    <FormMultiSelector
                      selected_list={selected_preference_list}
                      setselected_list={setselected_preference_list}
                      search={false}
                      setSelectedEntry={setpreference}
                      selectedId={preference_id}
                      setSelectedId={setpreference_id}
                      blr_value={preference_blr && step2blr}
                      setblr_value={setpreference_blr}
                      title="Preference"
                      placeholder={"Select"}
                      width={"100%"}
                      list={preference_list}
                      selectedValue={preference[1]}
                    />
                  </FormInputContainer>

                  <FormInputContainer label="Education">
                    <FormSelector
                      search={false}
                      setSelectedEntry={seteducation}
                      selectedId={education_id}
                      setSelectedId={seteducation_id}
                      blr_value={education_blr && step2blr}
                      setblr_value={seteducation_blr}
                      title="Education"
                      placeholder={"Select"}
                      width={"100%"}
                      list={education_list}
                      selectedValue={education[1]}
                    />
                  </FormInputContainer>

                  <FormInputContainer label="Occupation">
                    <FormInput
                      value={occupation}
                      setvalue={setoccupation}
                      maxLength={20}
                      width={"100%"}
                      height={rspW(12.76)}
                      placeholder={"Enter Occupation"}
                      error_cond={occupation.length < 2 && step2blr}
                      keyboardType="default"
                      value_blr={occupation_blr}
                      setvalue_blr={setoccupation_blr}
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
                    <View style={{ ...styles.radioCont }}>
                      {/* Habits */}
                      <View>
                        <Text style={styles.radioTxt}>{""}</Text>
                      </View>

                      {/* Chioce */}
                      <View style={styles.radioBtnCont}>
                        <TouchableOpacity activeOpacity={1}>
                          <Text
                            style={{
                              ...styles.radioBtnLabel,
                              marginLeft: rspW(0.5),
                            }}
                          >
                            Yes
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1}>
                          <Text
                            style={{
                              ...styles.radioBtnLabel,
                              //  backgroundColor:'red',
                              marginRight: rspW(1),
                            }}
                          >
                            No
                          </Text>
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
                  </FormInputContainer>
                </>
              )}

              {step == 3 && (
                <>
                  <FormInputContainer label="Interests">
                    <FormMultiSelector
                      selected_list={selected_interests_list}
                      setselected_list={setselected_interests_list}
                      multi={true}
                      setSelectedEntry={setinterests}
                      selectedId={interests_id}
                      setSelectedId={setinterests_id}
                      blr_value={interests_blr && step3blr}
                      setblr_value={setinterests_blr}
                      title="Interests"
                      placeholder={"Select"}
                      width={"100%"}
                      list={interests_list}
                      selectedValue={interests[1]}
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
                      blr_value={languages_blr && step3blr}
                      setblr_value={setlanguages_blr}
                      title="Languages"
                      placeholder={"Select"}
                      width={"100%"}
                      list={languages_list}
                      selectedValue={languages[1]}
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
                      error={false}
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
                      error={false}
                    />
                  </FormInputContainer>
                </>
              )}
            </View>

            <FormWrapperFooter>
              {/* Error Show Here */}

              <ErrorContainer
                error_msg={
                  step == 1
                    ? // && step1blr
                      user_intro_err
                    : step == 2
                    ? user_intro_err2
                    : step == 3
                    ? user_intro_err3
                    : ""
                }
              />
              {/* Next Btn To Navigate to Next Form Components */}
              <FooterBtn
                title={"Next"}
                disabled={
                  (step == 1 && !step1_all_fill) ||
                  (step == 2 && !step2_all_fill) ||
                  (step == 3 && !step3_all_fill)
                }
                onPress={onNextPress}
              />
            </FormWrapperFooter>
          </FormWrapper>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

export default UserIntro;

const styles = StyleSheet.create({
  inputCont: {
    marginTop: rspH(2),
    height: rspH(56),
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
  },
  radioTxt: {
    fontFamily: fontFamily.medium,
    color: colors.black,
    fontSize: rspF(2.02),
    lineHeight: rspF(2.05),
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
    paddingBottom: rspH(Platform.OS == "ios" ? 1 : 0.1),
    textAlign: "center",
    letterSpacing: 1,
  },
});
