import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import colors from "../../styles/colors";
import fontFamily from "../../styles/fontFamily";
import Ionicon from "react-native-vector-icons/Ionicons";
import { rspW, rspF, rspH } from "../../styles/responsiveSize";

const SearchInput = ({
  width = rspW(75.9),
  height = rspH(4.7),
  search,
  setsearch,
  datalist,
  setfilterdatalist,
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
          setsearch(text);
          setfilterdatalist(
            datalist.filter((v) =>
              String(v[1]).toUpperCase().startsWith(String(text.toUpperCase()))
            )
          );
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

export default SearchInput;

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
