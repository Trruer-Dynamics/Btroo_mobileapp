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
import { useNavigation } from "@react-navigation/native";

const Item = ({ item, onPress, report }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item]}>
    <Text
      style={[
        styles.title,
        { color: item == report ? colors.blue : colors.black },
      ]}
    >
      {item}
    </Text>
  </TouchableOpacity>
);

const Report = ({
  action = null,
  actionNo,
  report = "",
  setreport = null,
  modalVisible,
  setModalVisible,
  setactionNo,
  reportConfirm,
  actionType = false,
  setreportConfirm,
}) => {
  const navigation = useNavigation();
  const [report_list, setreport_list] = useState([
    "Illegal Usage",
    "Inappropriate profile photo",
    "Inappropriate profile bio",
    "Offline behavior",
    "Fake/Spam",
    "Underage",
    "Hate Speech",
  ]);

  const renderItem = ({ item }) => {
    return (
      <Item
        report={report}
        item={item}
        onPress={() => {
          setreport(item);
          if (actionType) {
            // setreportConfirm(true);
          } else {
            setModalVisible(!modalVisible);
          }
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }} bounces={false}>
      <SafeAreaView style={{ height: scrn_height }}>
        <FormComponentsWrapper>
          <FormComponentsWrapperHeader
            title={"Report"}
            visible={modalVisible}
            setvisible={() => {
              if (actionType) {
                setactionNo(1);
              } else {
                setModalVisible(false);
              }
            }}
            marginBottom={10}
          />

          <View>
            <Text style={styles.para}>
              In case something was wrong {`\n`} please let us know! Your safety
              is
              {`\n`} our priority and this person will {`\n`}not know about your
              feedback.
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <FlatList
              data={report_list}
              renderItem={renderItem}
              keyExtractor={(_, index) => index}
              style={{ height: scrn_height / 1.5 }}
            />
          </View>
        </FormComponentsWrapper>
      </SafeAreaView>

      {action != null && (
        <CentralModal
          modalVisible={reportConfirm}
          setModalVisible={setreportConfirm}
        >
          <View style={styles.confirmBox}>
            <View style={{ marginBottom: rspH(4.7) }}>
              <>
                {actionNo == 2 ? (
                  <Text style={styles.confirmBoxPara}>
                    You have reported this user. If you want to stop any further
                    contact{`\n`}you can remove them by{`\n`}unmatching them.
                  </Text>
                ) : (
                  <Text style={styles.confirmBoxPara}>
                    By clicking on unmatch,you will{`\n`}deny any further
                    contact between {`\n`} you two and you will no longer be
                    {`\n`} able to see each other's profile.
                  </Text>
                )}
              </>
            </View>
            <FooterBtn
              title={"OK"}
              disabled={false}
              onPress={() => {
                setreportConfirm(false);
                if (actionType) {
                  navigation.navigate("Match");
                }
                setModalVisible(false);

                if (action != null) {
                  setactionNo(1);
                }
              }}
            />
          </View>
        </CentralModal>
      )}
    </View>
  );
};

export default Report;

const styles = StyleSheet.create({
  para: {
    fontFamily: fontFamily.regular,
    fontSize: rspF(2.02),
    color: colors.blue,
    lineHeight: rspF(2.1),
    textAlign: "center",
    marginBottom: rspH(3.7),
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
    lineHeight: rspH(2.5),
    textAlign: "center",
  },
});
