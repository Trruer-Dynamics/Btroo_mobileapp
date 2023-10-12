import React from "react";
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  StatusBar,
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
import { initialWindowMetrics } from "react-native-safe-area-context";
const insets = initialWindowMetrics.insets;


const BottomModal = ({
  modalVisible,
  setModalVisible,
  close = true,
  children,
  extContainerStyle = {},
  padding = 5,
  height = scrn_height / 1.875,
}) => {


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      
        <SafeAreaView
          style={{            
            flex:1,
            position: "relative",
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{
              backgroundColor: "#00000087",
              flexGrow: 1,
            }}
            onPress={() => {
              setModalVisible(false);
            }}
          ></TouchableOpacity>

          <View
            style={{
              ...styles.modalView,
              ...extContainerStyle,
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
    borderBottomWidth:1,
    borderBottomColor: colors.blue,
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

export default React.memo(BottomModal);
