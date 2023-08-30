import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import ChatTut from "./ChatTut";
import Chat from "./Chat";

const ChatStack = ({ route }) => {
  const { profile, reveal } = route.params;

  const chat_tut = useSelector((state) => state.tutorial.chat_tut);

  return (
    <View>
      {chat_tut ? (
        <ChatTut profile={profile} />
      ) : (
        <Chat profile={profile} reveal={reveal} />
      )}
    </View>
  );
};

export default ChatStack;

const styles = StyleSheet.create({});
