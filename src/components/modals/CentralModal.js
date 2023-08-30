import React from "react";
import {
  Modal,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { scrn_height } from "../../styles/responsiveSize";

const CentralModal = ({
  modalVisible,
  setModalVisible = null,
  close = true,
  containerStyle = {},
  children,
}) => {
  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            if (modalVisible != null) {
              setModalVisible(false);
            }
          }}
          style={{ ...styles.modalView, ...containerStyle }}
        >
          <TouchableWithoutFeedback>{children}</TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    backgroundColor: "#00000087",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CentralModal;
