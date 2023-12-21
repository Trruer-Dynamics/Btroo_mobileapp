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

const SearchCountryInput = ({
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
          width: rspW(75.9),
        },
      ]}
    >
      <TextInput
        style={{
          width: "90%",
          fontSize: rspF(1.9),
          paddingHorizontal: rspW(4),
          fontFamily: fontFamily.regular,
          lineHeight: rspF(2.2),
          color: "#000",
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

          // Add validation to allow / disallow character or numbers
          let number_con = as_code > 47 && as_code < 58;

          let alphabet_con =
            (as_code > 64 && as_code < 91) ||
            (as_code > 96 && as_code < 123);

          if ((number_con || alphabet_con || as_code == 32 || as_code == 43) || text.length == 0) {
         
            setsearch(text);
            setfilterdatalist(
              datalist.filter(
                (v) =>
                  String(v.label)
                    .toUpperCase()
                    .startsWith(String(text.toUpperCase())) ||
                  String(v.phone)
                    .toUpperCase()
                    .startsWith(String(text.toUpperCase())) ||
                  String("+" + v.phone)
                    .toUpperCase()
                    .startsWith(String(text.toUpperCase()))
              )
            );
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

export default SearchCountryInput;

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
