import { View } from "react-native";
import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import Match_Tut from "./MatchTut";
import Match from "./Match";
import { useFocusEffect } from "@react-navigation/native";
import { setCurrentScreen } from "../../../store/reducers/screen/screen";
import { UserContext } from "../../../context/user";

const MatchStack = ({ route }) => {
  const match_tut = useSelector((state) => state.tutorial.match_tut);
  const repeat_tut = useSelector((state) => state.tutorial.repeat_tut);

  const { c_scrn } = useContext(UserContext);

  const dispatch = useDispatch();
  useFocusEffect(
    React.useCallback(() => {
      c_scrn.current = "Match";
      dispatch(setCurrentScreen("MatchScreen"));

      return () => {};
    }, [])
  );

  return (
    <View>
      {match_tut || repeat_tut ? (
        <Match_Tut repeat_tut={repeat_tut} />
      ) : (
        <Match />
      )}
    </View>
  );
};

export default MatchStack;
