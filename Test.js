import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const Test = () => {
  const animation = useSharedValue(1);
  const fadeIn = () => {
    animation.value = withTiming(100, {
      duration: 2000,
    });
  };

  const fadeOut = () => {
    animation.value = withTiming(0, {
      duration: 2000,
    });
  };

  const animatedBox = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animation.value, [0, 100], [1, 0]),
    };
  });

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Animated.View
        style={[
          {
            width: 100,
            height: 100,
            backgroundColor: "red",
          },
          animatedBox,
        ]}
      ></Animated.View>
      <Button title={"Fade In"} onPress={fadeIn} />

      <Button title={"Fade Out"} onPress={fadeOut} />
    </View>
  );
};

export default Test;

const styles = StyleSheet.create({});
