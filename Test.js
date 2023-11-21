import { SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import React,{useState} from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { scrn_height } from './src/styles/responsiveSize'

const Test = () => {
    const [inp, setinp] = useState("")
  return (
    <SafeAreaView style={{flex:1}}>
    <KeyboardAwareScrollView style={{height:scrn_height }}
    bounces={false}
    extraHeight={100}
    >
      <Text>Test</Text>
      <Text>Test</Text>
      <View style={{top:600, position:'absolute'}}>
      <TextInput
      style={{
        padding:5, 
        border:1, 
        borderColor:'#000', 
        backgroundColor:'yellow',
    }}
      value={inp}
      placeholder='Enter Text Here'
      onChangeText={(val)=>{
        setinp(val)
      }}
      />
      </View>
    </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default Test

const styles = StyleSheet.create({})