import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import colors from "../../styles/colors";
import fontFamily from "../../styles/fontFamily";
import { rspH, rspW, rspF } from "../../styles/responsiveSize";

const FormInputPhoneNumber = ({
  value,
  setvalue,
  width,
  height,
  placeholder = "",
  placeholderTextColor = colors.black,
  disabled = false,
  error_cond = false,
  value_blr,
  setvalue_blr,
  textAlign = "left",
  keyboardType = "decimal-pad",
  ref = null,
  pass_ref = null,
  multiline = false,

  refresh = false,
  maxLength = null,
  onFocus,

  a_allow = true,
  n_allow = true,
  s_allow = true,

  unit = "",
  inputwidth = "100%",
  setchanges_made = null,
}) => {
  const inpt_ref = useRef();
  const [invalid, setinvalid] = useState(false);

  useEffect(() => {
    if (value_blr && error_cond) {
      setinvalid(true);
    } else {
      setinvalid(false);
    }
  }, [value, value_blr, refresh, error_cond]);

  useLayoutEffect(() => {
    if (refresh) {
      setvalue_blr(true);
    }
  }, [refresh]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        inpt_ref.current?.focus();
      }}
      style={{
        ...styles.input_cont,
        height: multiline ? rspH(11.6) : rspH(5.8),
        width: width,
        // backgroundColor:'yellow',
        backgroundColor: value.length > 0 ? "#fff" : "#F8F8F8",
        borderColor: invalid
          ? colors.error
          : value.length > 0
          ? colors.blue
          : "#DCDCDC",
        position: "relative",
      }}
    >
      <View
        style={{
          // backgroundColor:'red',
          position: "absolute",
          // top: 0.3,
          top: rspH(0.6),
          paddingHorizontal: rspW(4),
        }}
      >
        {value.length > 0 && (
          <Text style={styles.inp_title}>{placeholder}</Text>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",

          paddingTop:
            value.length > 0 ? rspH(Platform.OS == "ios" ? 0.6 : 0.4) : 0,
          width: "100%",
        }}
      >
        <TextInput
          ref={inpt_ref}
          onFocus={onFocus}
          // textAlignVertical='top'
          style={{
            width: inputwidth,
            textAlign: textAlign,

            ...styles.input,

            marginTop: value.length > 0 ? 10 : 0,

            paddingHorizontal: 0,
          }}
          maxLength={maxLength}
          multiline={multiline}
          returnKeyType="next"
          blurOnSubmit={false}
          onBlur={() => {
            if (!disabled) {
              setvalue_blr(true);

              if (error_cond) {
                setinvalid(true);
              } else {
                setinvalid(false);
              }
            }
          }}
          onChangeText={(text) => {
            setvalue_blr(true);

            let last = text.charAt(text.length - 1);
            let as_code = last.charCodeAt();

            // console.log("last",last,typeof(as_code) ,as_code)

            let symbol_con =
              (as_code > 32 && as_code < 48) ||
              (as_code > 57 && as_code < 65) ||
              (as_code > 90 && as_code < 97) ||
              (as_code > 122 && as_code <= 126);

            let number_con = as_code > 47 && as_code < 58;

            let alphabet_con =
              (as_code > 64 && as_code < 91) || (as_code > 96 && as_code < 123);

            let symb = s_allow ? true : !symbol_con;
            let numb = n_allow ? true : !number_con;
            let alph = a_allow ? true : !alphabet_con;

            let cond_lis = [symb, numb, alph].every((v) => v == true);

            if (cond_lis) {
              setvalue(text);
            }

            // setvalue(text);

            if (setchanges_made != null) {
              setchanges_made(true);
            }
          }}
          editable={!disabled}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          keyboardType={keyboardType}
          onSubmitEditing={() => {
            if (pass_ref != null) {
              pass_ref.current?.focus();
            }
          }}
        />

        {value != "" && unit != "" && (
          <View
            style={{
              position: "absolute",
              right: 0,
            }}
          >
            <Text
              style={{
                ...styles.input,
              }}
            >
              {unit}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default FormInputPhoneNumber;

const styles = StyleSheet.create({
  input_cont: {
    paddingHorizontal: rspW(4),
    borderWidth: 1,
    borderRadius: rspW(1.3),
    justifyContent: "center",
  },

  inp_title: {
    color: colors.blue,
    fontSize: 10,
    fontFamily: fontFamily.regular,
    lineHeight: 13,

    // marginTop: Platform.OS == 'ios' ? 0 : rspH(0.6),
    // marginBottom: Platform.OS == 'ios' ? rspH(-0.44) : rspH(-1.54),
  },
  input: {
    color: colors.black,
    fontSize: rspF(2.02),
    fontFamily: fontFamily.regular,
    lineHeight: rspF(2.2),
    paddingVertical: 0,
  },
});
