import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { rspF, rspH, rspW, scrn_height, scrn_width } from "../../styles/responsiveSize";
import fontFamily from "../../styles/fontFamily";
import colors from "../../styles/colors";

 
const OffflineAlert = ({offAlert=false}) => {

  
  return (
   
    <SafeAreaView
    style={{position:'absolute', 
    zIndex: 1000}}
    >
   
   {
    offAlert &&
    <SafeAreaView style={styles.mainContainer}>
 
      <View style={styles.messageBox}
      >
       <Text style={styles.messageBoxHeader}>No connection</Text>
       
      </View>
    </SafeAreaView>
  }
    </SafeAreaView>
  




  );
};
 
export default OffflineAlert;
 
const styles = StyleSheet.create({
  mainContainer: {
    width: scrn_width,
    height: rspH(2.2),
    backgroundColor: "#0000008a",
  },
  messageBox: {
    width: scrn_width,
    height: rspH(2.2),
    backgroundColor: '#e54b4b',
    alignItems: "center",
    justifyContent: "center",
  },
  messageBoxHeaderCont: {
    marginBottom: rspH(3),
  },
  messageBoxHeader: {
    fontFamily: fontFamily.bold,
    fontSize: rspF(1.4),
    color: colors.white,
    lineHeight: rspH(2.1),
    textAlign: "center",
  },
  messageBoxPara: {
    fontFamily: fontFamily.regular,
    fontSize: rspF(2.2),
    color: colors.blue,
    lineHeight: rspH(2.5),
    textAlign: "center",
  },
});