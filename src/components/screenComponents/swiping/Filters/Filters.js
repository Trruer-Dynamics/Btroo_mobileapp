import { StyleSheet, View, SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import FormComponentsWrapper from "../../../wrappers/formComponentsWrappers/FormComponentsWrapper";
import FormComponentsWrapperHeader from "../../../wrappers/formComponentsWrappers/FormComponentsWrapperHeader";
import fontFamily from "../../../../styles/fontFamily";
import { rspH, rspW, rspF } from "../../../../styles/responsiveSize";
import colors from "../../../../styles/colors";
import FormWrapperFooter from "../../../wrappers/formWrappers/FormWrapperFooter";
import ErrorContainer from "../../../formComponents/ErrorContainer";
import FooterBtn from "../../../Buttons/FooterBtn";
import FormSelectorFilter from "../../../formComponents/FormSelectorFilter";
import SliderC from "../../../formComponents/SliderC";
import FormSelectorRadio from "../../../formComponents/FormSelectorRadio";
import axios from "axios";
import { apiUrl } from "../../../../constants";
import { useDispatch, useSelector } from "react-redux";
import FormMultiSelectorFilter from "../../../formComponents/FormMultiSelectorFilter";
import Loader from "../../../loader/Loader";
import {
  setProfileRefresh,
  setProfiledata,
  setSessionExpired,
} from "../../../../store/reducers/authentication/authentication";
import {
  setSelectedAgeRange,
  setSelectedDistance,
  setSelectedHabits,
  setSelectedHeightRange,
  setSelectedInterests,
  setSelectedLanguages,
} from "../../../../store/reducers/filter/filter";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import MultiSliderC from "../../../formComponents/MultiSliderC";



const Filters = ({
  filterRefresh = false,
  setfilterRefresh = null,
  modalVisible,
  setModalVisible,
}) => {
  // Interests
  const safe_height = useSelector((state) => state.screen.safe_height);
  const profile_refresh = useSelector(
    (state) => state.authentication.profile_refresh
  );
  const [loading, setloading] = useState(false);

  const dispatch = useDispatch();

  const [screen_loaded, setscreen_loaded] = useState(false);
  const [changes_made, setchanges_made] = useState(false);

  const profile_data = useSelector(
    (state) => state.authentication.profile_data
  );
  const access_token = useSelector(
    (state) => state.authentication.access_token
  );

  const [sliderValues, setSliderValues] = useState([18,  71]);

  const handleValuesChange = (values) => {
    // You can perform any logic here with the updated slider values
    setSliderValues(values);
  };

  const preferences_list = useSelector((state) => state.allData.all_genders);
  const languages_list = useSelector((state) => state.allData.all_languages);
  const interest_list = useSelector((state) => state.allData.all_interests);

  const distance_l = useSelector((state) => state.filter.selected_distance);
  const age_range = useSelector((state) => state.filter.selected_age_range);
  const height_range = useSelector(
    (state) => state.filter.selected_height_range
  );
  const selected_languages = useSelector(
    (state) => state.filter.selected_languages
  );
  const selected_interests = useSelector(
    (state) => state.filter.selected_interests
  );
  const selected_habits = useSelector((state) => state.filter.selected_habits);

  const [preferences, setpreferences] = useState("");
  const [preferences_id, setpreferences_id] = useState(0);

  const [selected_preferences_list, setselected_preferences_list] = useState(
    []
  );

  const [preferences_blr, setpreferences_blr] = useState(false);

  // Distance
  const [distance, setdistance] = useState(distance_l);
  const [distance_max, setdistance_max] = useState(200);
  const [distance_min, setdistance_min] = useState(20);

  //Languages
  const [languages, setlanguages] = useState("");
  const [languages_id, setlanguages_id] = useState(0);
  const [selected_languages_list, setselected_languages_list] = useState([]);
  const [languages_blr, setlanguages_blr] = useState(false);

  //Age
  const [minage, setminage] = useState(age_range[0]);
  const [maxage, setmaxage] = useState(age_range[1]);

  //Height
  const [minheight, setminheight] = useState(height_range[0]);
  const [maxheight, setmaxheight] = useState(height_range[1]);

  // Interests
  const [interest, setinterest] = useState("");
  const [interest_id, setinterest_id] = useState(0);
  const [selected_interest_list, setselected_interest_list] = useState([]);
  const [interest_blr, setinterest_blr] = useState(false);

  // Habits
  const [habits_list, sethabits_list] = useState([
    ["Smoking", false, false],
    ["Drinking", false, false],
    ["Marijuana", false, false],
  ]);

  const [habits_blr, sethabits_blr] = useState(false);

  const [refresh, setrefresh] = useState(false);

  const onNextPress = () => {
    if (changes_made) {
      updateFilterData();
    }
  };

  useEffect(() => {
    if (preferences_list.length > 0) {
      setselected_preferences_list(profile_data.userpreferances);
    }
  }, [preferences_list]);

  const updateFilterData = async () => {
    const url = apiUrl + `FilterUpdateGet/${profile_data.user.id}`;

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    const body = {
      preference: selected_preferences_list,
      distance: distance,
      language: selected_languages_list,
      interests: selected_interest_list,

      habit: {
        smoking: [habits_list[0][1], habits_list[0][2]],
        drinking: [habits_list[1][1], habits_list[1][2]],
        marijuana: [habits_list[2][1], habits_list[2][2]],
      },
      age_min: minage,
      age_max: maxage,
      height_min: minheight,
      height_max: maxheight,
    };

    try {
      const resp = await axios.put(url, body, {
        headers,
      });

      if (resp.data.code == 200) {
        setModalVisible(false);
        if (setfilterRefresh != null) {
          setfilterRefresh(!filterRefresh);
        }

        dispatch(
          setProfiledata({
            ...profile_data,
            ...{ userpreferances: selected_preferences_list },
          })
        );
        dispatch(setProfileRefresh(!profile_refresh));
        dispatch(setSelectedDistance(distance));
        dispatch(setSelectedLanguages(selected_languages_list));
        dispatch(setSelectedAgeRange([minage, maxage]));
        dispatch(setSelectedHeightRange([minheight, maxheight]));
        dispatch(setSelectedInterests(selected_interest_list));
        dispatch(
          setSelectedHabits([habits_list[0], habits_list[1], habits_list[2]])
        );
      } else if (resp.data.code == 401) {
        dispatch(setSessionExpired(true));
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (
      preferences_list.length > 0 &&
      interest_list.length > 0 &&
      languages_list.length > 0
    ) {
      setselected_languages_list(selected_languages);
      setselected_interest_list(selected_interests);

      sethabits_list([
        ["Smoking", selected_habits[0][0], selected_habits[0][1]],
        ["Drinking", selected_habits[1][0], selected_habits[1][1]],
        ["Marijuana", selected_habits[2][0], selected_habits[2][1]],
      ]);
    }
  }, [preferences_list, interest_list, languages_list]);

  useEffect(() => {
    setscreen_loaded(true);
  }, []);

  useEffect(() => {
    if (screen_loaded && changes_made == false) {
      setchanges_made(true);
    }

  }, [distance, minage, maxage, minheight, maxheight]);



  return (
    <>
      {loading && <Loader />}

      <SafeAreaView style={{ flex: 1 }}>
        <FormComponentsWrapper
          barStyle="dark-content"
          statusBarColor="#fff"
          containerStyle={{
            paddingTop: rspH(2),
          }}
        >
          <FormComponentsWrapperHeader
            title={"Filters"}
            visible={modalVisible}
            setvisible={setModalVisible}
            marginBottom={rspH(3)}
          />
          {/* Body */}
          <SafeAreaView
            style={{
              ...styles.container,
              height: safe_height / 1.1,
              // height: safe_height,
            }}
          >
            <View>
              <View style={{ marginTop: rspH(2.5) }}>
                <FormSelectorFilter
                  search={false}
                  setSelectedEntry={setpreferences}
                  selectedId={preferences_id}
                  setSelectedId={setpreferences_id}
                  blr_value={preferences_blr}
                  setblr_value={setpreferences_blr}
                  headtitle={"Interested In"}
                  mainTitle={"Preference"}
                  placeholder={"Select"}
                  width={"100%"}
                  list={preferences_list}
                  selected_list={selected_preferences_list}
                  setselected_list={setselected_preferences_list}
                  selectedValue={preferences[1]}
                  setchanges_made={setchanges_made}
                />
              </View>

              {/* hr */}
              <View style={styles.hr} />

              <SliderC
                label={"Distance"}
                value={distance}
                setvalue={setdistance}
                max={distance_max}
                min={distance_min}
                multi={false}
                unit={"km"}
              />

              {/* hr */}
              <View style={styles.hr} />

              <FormSelectorFilter
                search={true}
                setSelectedEntry={setlanguages}
                selectedId={languages_id}
                setSelectedId={setlanguages_id}
                blr_value={languages_blr}
                setblr_value={setlanguages_blr}
                headtitle={"Languages"}
                mainTitle={"Languages"}
                placeholder={"Select"}
                width={"100%"}
                list={languages_list}
                selected_list={selected_languages_list}
                setselected_list={setselected_languages_list}
                selectedValue={languages[1]}
                setchanges_made={setchanges_made}
              />

              {/* hr */}
              <View style={styles.hr} />

      <MultiSliderC
      label={"Age"}
      value={minage}
      setvalue={setminage}
      value2={maxage}
      setvalue2={setmaxage}
      multi={true}
      unit={""}
      min={18}
      max={71}
      rightUnit={"+"}
      
      />

              {/* hr */}
              <View style={styles.hr} />

              <SliderC
                min={60}
                max={270}
                label={"Height"}
                value={minheight}
                value2={maxheight}
                setvalue={setminheight}
                setvalue2={setmaxheight}
                multi={true}
                unit={"cm"}
              />

              {/* hr */}
              <View style={styles.hr} />

              <FormMultiSelectorFilter
                selected_list={selected_interest_list}
                setselected_list={setselected_interest_list}
                multi={true}
                setSelectedEntry={setinterest}
                selectedId={interest_id}
                setSelectedId={setinterest_id}
                blr_value={interest_blr}
                setblr_value={setinterest_blr}
                title="Interests"
                headtitle={"Interests"}
                mainTitle={"Interests"}
                placeholder={"Select"}
                width={"100%"}
                list={interest_list}
                selectedValue={interest[1]}
                setchanges_made={setchanges_made}
              />

              {/* hr */}
              <View style={styles.hr} />

              <FormSelectorRadio
                blr_value={habits_blr}
                setblr_value={sethabits_blr}
                headtitle={"Habits"}
                mainTitle={"Habits"}
                placeholder={"Select"}
                width={"100%"}
                list={habits_list}
                setlist={sethabits_list}
                refresh={refresh}
                setrefresh={setrefresh}
                setchanges_made={setchanges_made}
              />

              {/* hr */}
              <View style={styles.hr} />
            </View>

            <FormWrapperFooter containerStyle={{ marginTop: rspH(1) }}>
              {/* Error Show Here */}

              <ErrorContainer error_msg="" />

              {/* Next Btn To Navigate to Next Form Components */}
              <FooterBtn
                title={"Save"}
                disabled={!changes_made}
                onPress={onNextPress}
              />
            </FormWrapperFooter>
          </SafeAreaView>
        </FormComponentsWrapper>
      </SafeAreaView>
    </>
  );
};

export default Filters;

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rspW(5.1),
    justifyContent: "flex-start",
    height: rspH(5.6),
    marginBottom: rspH(1.4),
    backgroundColor: colors.grey,
    borderRadius: rspW(1.3),
  },
  title: {
    fontSize: rspF(1.76),
    fontFamily: fontFamily.medium,
    letterSpacing: 1,
  },
  hr: {
    borderBottomColor: colors.grey,
    borderBottomWidth: rspH(0.24),
    marginBottom: 10.5,
  },
});
