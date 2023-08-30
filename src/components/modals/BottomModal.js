import React from "react";
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from "react-native";
import colors from "../../styles/colors";
import {
  rspH,
  rspW,
  scrn_height,
  scrn_width,
} from "../../styles/responsiveSize";
import Ionicon from "react-native-vector-icons/Ionicons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector } from "react-redux";

const BottomModal = ({
  modalVisible,
  setModalVisible,
  close = true,
  children,
  extContainerStyle = {},
  padding = 5,
  height = scrn_height / 1.875,
}) => {
  const safe_height = useSelector((state) => state.screen.safe_height);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        style={{ height: safe_height }}
        bounces={false}
      >
        <SafeAreaView
          style={{
            // flex:1,
            height: Platform.OS == "ios" ? scrn_height : rspH(99),
            // height: scrn_height,
            position: "relative",
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{
              backgroundColor: "#00000087",
              // backgroundColor: 'red',

              flexGrow: 1,
              // flex:1,
            }}
            onPress={() => {
              setModalVisible(false);
            }}
          ></TouchableOpacity>

          <View
            style={{
              ...styles.modalView,
              ...extContainerStyle,
              // bottom: rspH(2.86),
              bottom: rspH(0),
              padding: rspW(padding),
            }}
          >
            {close && (
              <TouchableOpacity
                style={{ alignSelf: "flex-end" }}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Ionicon name="close-circle" size={34} color={colors.blue} />
              </TouchableOpacity>
            )}
            {children}
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    position: "absolute",

    backgroundColor: "#ffffff",

    alignItems: "center",
    width: scrn_width,
    borderTopLeftRadius: rspW(3),
    borderTopRightRadius: rspW(3),
  },

  button: {
    borderRadius: rspW(5.1),
    padding: rspW(2.5),
    elevation: 2,
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default BottomModal;
