import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import colors from "../../styles/colors";
import fontFamily from "../../styles/fontFamily";
import Ionicon from "react-native-vector-icons/Ionicons";
import { rspF, rspH, rspW } from "../../styles/responsiveSize";

const SearchInputBackend = ({
  width = rspW(75.9),
  height = rspH(4.7),
  search,
  setsearch,
  refreshing,
}) => {
  const [placeholder, setplaceholder] = React.useState("Search");

  return (
    <View
      style={[
        styles.searchContainer,
        {
          height: rspH(Platform.OS == "ios" ? 4.7 : 5),
          width: width,
        },
      ]}
    >
      <TextInput
        style={{
          width: "90%",
          fontSize: rspF(1.9),
          paddingHorizontal: rspW(4),
          fontFamily: fontFamily.regular,
          color: "#000",
          lineHeight: rspF(2.2),
        }}
        onFocus={() => {
          setplaceholder("");
        }}
        onBlur={() => {
          setplaceholder("Search");
        }}
        onChangeText={(text) => {
          // Get last character type
          let last = text.charAt(text.length - 1);
          let as_code = last.charCodeAt();

          // Add validation to allow / disallow character 
          let alphabet_con =
            (as_code > 64 && as_code < 91) ||
            (as_code > 96 && as_code < 123);

          if ((alphabet_con || as_code == 32) || text.length == 0) {
          setsearch(text);
          }
        }}
        value={search}
        placeholder={placeholder}
        placeholderTextColor={colors.black}
      />
      <TouchableOpacity
        onPress={() => {
          setsearch("");
        }}
      >
        <Ionicon name="close-circle" size={20} color={colors.black} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInputBackend;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: "#DCDCDC33", // 0.2 opacity added,
    borderColor: "#DCDCDC",
    paddingHorizontal: rspW(4),
    borderRadius: rspW(2.5),
    marginBottom: rspH(3.9),
  },
});
