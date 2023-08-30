import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import Match_Tut from "./MatchTut";
import Match from "./Match";

const MatchStack = () => {
  const match_tut = useSelector((state) => state.tutorial.match_tut);

  return <View>{match_tut ? <Match_Tut /> : <Match />}</View>;
};

export default MatchStack;

const styles = StyleSheet.create({});
