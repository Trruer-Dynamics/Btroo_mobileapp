import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import React,{useState} from "react";
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

  const [placeholder, setplaceholder] = useState('Search')

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
          lineHeight: rspF(2),
        }}
        onFocus={()=>{
          setplaceholder("")
        }}
        onChangeText={(text) => {
          if (!refreshing) {
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
