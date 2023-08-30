import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import FormComponentsWrapper from "../../../wrappers/formComponentsWrappers/FormComponentsWrapper";
import FormComponentsWrapperHeader from "../../../wrappers/formComponentsWrappers/FormComponentsWrapperHeader";
import fontFamily from "../../../../styles/fontFamily";
import {
  rspF,
  rspH,
  rspW,
  scrn_height,
} from "../../../../styles/responsiveSize";
import colors from "../../../../styles/colors";
import CentralModal from "../../../modals/CentralModal";
import FooterBtn from "../../../Buttons/FooterBtn";

const Item = ({ item, onPress, action }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item]}>
    <Text
      style={[
        styles.title,
        { color: item == action ? colors.blue : colors.black },
      ]}
    >
      {item}
    </Text>
  </TouchableOpacity>
);

const ReportUnmatch = ({
  report,
  setreport,
  actionNo,
  modalVisible,
  setModalVisible,
  action,
  setaction,
  setactionNo,
  reportConfirm,
  setreportConfirm,
  unmatchProfile,
}) => {
  const [report_list, setreport_list] = useState(["Unmatch", "Report"]);

  const renderItem = ({ item }) => {
    return (
      <Item
        action={action}
        item={item}
        onPress={() => {
          // setreportConfirm(true)

          setaction(item);
          if (item == "Report") {
            setactionNo(2);
          } else {
            setactionNo(1);
            setreportConfirm(true);
          }
        }}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FormComponentsWrapper>
        <FormComponentsWrapperHeader
          title={"Report/Unmatch"}
          visible={modalVisible}
          setvisible={setModalVisible}
          marginBottom={10}
        />
        <View>
          <Text style={styles.para}>
            Do you want to report or unmatch {`\n`} this user?
          </Text>
        </View>
        <View
          style={{
            alignSelf: "center",
            marginTop: rspH(1),
          }}
        >
          <FlatList
            data={report_list}
            renderItem={renderItem}
            keyExtractor={(_, index) => index}
            style={{ height: scrn_height / 1.5 }}
          />
        </View>
      </FormComponentsWrapper>

      <CentralModal
        modalVisible={reportConfirm}
        setModalVisible={setreportConfirm}
      >
        <View style={styles.confirmBox}>
          <View style={{ marginBottom: rspH(4.7) }}>
            <Text style={styles.confirmBoxPara}>
              {actionNo == 2 ? (
                <>
                  You have reported this user. If you want to stop any further
                  contact{`\n`}you can remove them by{`\n`}unmatching them.
                </>
              ) : (
                <>
                  By clicking on unmatch, you will{`\n`}deny any further contact
                  between{`\n`}you two and you will no longer be{`\n`}
                  able to see each other's profile.
                </>
              )}
            </Text>
          </View>
          <FooterBtn
            title={"OK"}
            disabled={false}
            onPress={() => {
              setreportConfirm(false);
              setModalVisible(false);
              if (action != null) {
                setactionNo(1);
                unmatchProfile();
              }
            }}
          />
        </View>
      </CentralModal>
    </SafeAreaView>
  );
};

export default ReportUnmatch;

const styles = StyleSheet.create({
  para: {
    fontFamily: fontFamily.regular,
    fontSize: rspF(2.02),
    color: colors.blue,
    lineHeight: rspF(2.1),
    textAlign: "center",
    marginBottom: rspH(8.24),
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rspW(5.1),
    justifyContent: "flex-start",
    height: rspH(5.6),
    marginBottom: rspH(1.4),
    backgroundColor: colors.lightGrey,
    borderRadius: rspW(1.3),
    width: rspW(75.9),
  },
  title: {
    fontSize: rspF(1.9),
    fontFamily: fontFamily.medium,
    lineHeight: rspF(1.93),
  },
  confirmBox: {
    width: rspW(76.5),
    height: rspH(31.16),
    backgroundColor: colors.white,
    borderRadius: rspW(5.1),
    paddingHorizontal: rspW(4),
    alignItems: "center",
    justifyContent: "center",
    marginTop: rspH(17),
  },

  confirmBoxPara: {
    fontFamily: fontFamily.bold,
    fontSize: rspF(1.85),
    color: colors.blue,
    lineHeight: rspH(2.6),
    textAlign: "center",
  },
});
