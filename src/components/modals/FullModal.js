import React from "react";
import { Modal, SafeAreaView, View } from "react-native";

const FullModal = ({
  backgroundColor = "#fff",
  modalVisible,
  setModalVisible,
  close = true,
  children,
}) => {
  return (
    <>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={{ flex: 1, backgroundColor: "#000" }}>
          <SafeAreaView style={{ flex: 1, backgroundColor: backgroundColor }}>
            {children}
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
};

export default FullModal;
