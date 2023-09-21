import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatTut from "./ChatTut";
import Chat from "./Chat";

const ChatStack = ({ route }) => {
  const { profile, reveal } = route.params;

  const chat_tut = useSelector((state) => state.tutorial.chat_tut);

  const repeat_tut = route.params?.repeat_tut
    ? route.params?.repeat_tut
    : false;

  return (
    <View>
      {chat_tut || repeat_tut ? (
        <ChatTut profile={profile} repeat_tut={repeat_tut} />
      ) : (
        <Chat profile={profile} reveal={reveal} />
      )}
    </View>
  );
};

export default ChatStack;

const styles = StyleSheet.create({});
