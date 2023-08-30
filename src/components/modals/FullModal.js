import React from "react";
import { Modal, SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { rspF, rspH, rspW } from "../../styles/responsiveSize";

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
          {/* <SafeAreaView style={{backgroundColor:'#000'}} /> */}

          <SafeAreaView style={{ flex: 1, backgroundColor: backgroundColor }}>
            {/* <View style={styles.modalView}> */}

            {children}
            {/* </View> */}
          </SafeAreaView>
          {/* <SafeAreaView style={{backgroundColor:'#000'}} /> */}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  backBtn: {
    alignSelf: "flex-start",
    marginTop: rspH(4.7),
  },
});

export default FullModal;
