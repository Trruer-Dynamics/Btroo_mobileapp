import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import SendSMS from "react-native-sms";

const Test = () => {
  const checkSms = () => {
    SendSMS.send(
      {
        body: "The default body of the SMS!",
        recipients: ["9822310725"],
        successTypes: ["sent", "queued"],
        allowAndroidSendWithoutReadPermission: false,
      },
      (completed, cancelled, error) => {
        console.log(
          "SMS Callback: completed: " +
            completed +
            " cancelled: " +
            cancelled +
            "error: " +
            error
        );
      }
    );
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button onPress={checkSms} title="Check Msg" />
    </View>
  );
};

export default Test;

const styles = StyleSheet.create({});
