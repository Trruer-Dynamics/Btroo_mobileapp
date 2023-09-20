import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import Match_Tut from "./MatchTut";
import Match from "./Match";

const MatchStack = ({route}) => {
  const match_tut = useSelector((state) => state.tutorial.match_tut);

  const repeat_tut = route.params?.repeat_tut ? route.params?.repeat_tut : false

  console.log("matches repeat_tut",repeat_tut)
  

  return <View>{match_tut || repeat_tut ? <Match_Tut
    repeat_tut={repeat_tut}
    /> : <Match />}</View>;
};

export default MatchStack;

const styles = StyleSheet.create({});
