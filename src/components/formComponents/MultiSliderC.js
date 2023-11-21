import { StyleSheet, Text, View } from 'react-native'
import React,{useState} from 'react'
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import FormInputContainer from './FormInputContainer';
import { rspF, rspH, rspW } from '../../styles/responsiveSize';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';

const MultiSliderC = ({
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

 
  const handleValuesChange = (values) => {

    setvalue(values[0])
    setvalue2(values[1])
  };

  

  return (
    <>
       <FormInputContainer label={label} marginBottom={1}>
<View style={{alignSelf:'center',  marginBottom: rspH(-1.5),
marginTop: rspH(-1.3),
}}>
      <MultiSlider
        values={[value,value2]}
        sliderLength={rspW(73.3)}
        onValuesChange={handleValuesChange}
        min={min}
        max={max}
        step={1}
       
        minMarkerOverlapDistance={5 * rspW(73.3)/53}
        allowOverlap={false}
        snapped={false}
        pressedMarkerStyle={{
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
        markerStyle={{ backgroundColor: "white",
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
        selectedStyle={{ backgroundColor: colors.blue, height: 5,  }}
        unselectedStyle={{ backgroundColor: colors.grey, height: 5, borderRadius:5}}
      />
      </View>
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
  )
}

export default MultiSliderC

const styles = StyleSheet.create({})