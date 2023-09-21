import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Slider from "react-native-a11y-slider";
import FormInputContainer from "./FormInputContainer";
import colors from "../../styles/colors";
import { rspF, rspH, rspW } from "../../styles/responsiveSize";
import fontFamily from "../../styles/fontFamily";

function MyMarker({ color }) {
  return (
    <View
      style={{
        backgroundColor: "white",
        height: rspW(7.1),
        width: rspW(7.1),
        borderRadius: rspW(3.6),
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 4,
      }}
    />
  );
}

const SliderC = ({
  label,
  value = 0,
  setvalue,
  setvalue2 = null,
  value2 = 50,
  multi,
  unit,
  min = 0,
  max = 100,
  rightUnit = "",
}) => {
  return (
    <>
      <FormInputContainer label={label} marginBottom={1}>
        <Slider
          min={min}
          max={max}
          values={multi ? [value, value2] : [value]}
          showLabel={false}
          markerComponent={MyMarker}
          trackStyle={{
            height: rspH(0.5),

            borderRadius: rspW(0.51),
            borderBottomWidth: 0,
            backgroundColor: colors.grey,

            marginBottom: rspH(-0.5),
          }}
          selectedTrackStyle={{
            height: rspH(0.5),
            borderBottomWidth: 0,
            backgroundColor: colors.blue,
            marginBottom: rspH(-0.5),
          }}
          onChange={(values) => {
            setvalue(values[0]);
            if (multi) {
              setvalue2(values[1]);
            }
          }}
        />
      </FormInputContainer>

      {/* Selected Distance */}
      <View
        style={{
          marginBottom: rspH(0.325),
          flexDirection: "row",
          marginHorizontal: rspW(1.8),
          alignItems: "center",

          justifyContent: multi ? "space-between" : "flex-end",
        }}
      >
        <View>
          <Text
            style={{
              fontSize: rspF(1.66),
              color: colors.blue,
              fontFamily: fontFamily.bold,
              lineHeight: 13.38,
            }}
          >
            {value}
            {unit}
          </Text>
        </View>
        {multi && (
          <View>
            <Text
              style={{
                fontSize: rspF(1.66),
                color: colors.blue,
                fontFamily: fontFamily.bold,
                lineHeight: 13.38,
              }}
            >
              {rightUnit != "" && value2 >= max ? max - 1 : value2}
              {rightUnit != "" && value2 >= max ? rightUnit : unit}
            </Text>
          </View>
        )}
      </View>
    </>
  );
};

export default SliderC;

const styles = StyleSheet.create({});
