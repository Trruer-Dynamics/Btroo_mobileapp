import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatTut from "./ChatTut";
import Chat from "./Chat";
import { setRepeatTut } from "../../../store/reducers/tutorial/tutorial";
import { useFocusEffect } from "@react-navigation/native";
import { setCurrentScreen } from "../../../store/reducers/screen/screen";
import { UserContext } from "../../../context/user";

const ChatStack = ({ route }) => {
  const { profile, reveal } = route.params;

  const chat_tut = useSelector((state) => state.tutorial.chat_tut);
  const repeat_tut = useSelector((state) => state.tutorial.repeat_tut);
  const { sckop,c_scrn } = useContext(UserContext);

  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      console.log("Chat Focus")
      c_scrn.current = 'Chat'

      dispatch(setCurrentScreen("Chat"));
      return () => {
        dispatch(setRepeatTut(false));
      };
    }, [])
  );

  return (
    <View>
      {chat_tut || repeat_tut ? 
      // {true ? 

    (
        <ChatTut profile={profile} repeat_tut={repeat_tut} />
      ) : (
        <Chat profile={profile} reveal={reveal} />
      )}
    </View>
  );
};

export default ChatStack;

const styles = StyleSheet.create({});
