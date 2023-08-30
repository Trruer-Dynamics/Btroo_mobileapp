import { StyleSheet, View, Animated, useWindowDimensions } from "react-native";
import React, { memo } from "react";
import { rspW } from "../../../styles/responsiveSize";

const Paginator2 = ({ data, scrollX, currentIndex }) => {
  console.log("data", data);
  return (
    <View style={styles.carouselDotCont}>
      {/* {/* {data.map((_, i) => {
        console.log("in", i)
        return ( */}
      <Animated.View
        style={[
          styles.dot,
          {
            width: 0 == currentIndex ? 8 : 6,
            // height: 6,

            borderRadius: 0 == currentIndex ? 4 : 3,
            opacity: 0 == currentIndex ? 1 : 0.3,
          },
        ]}
        key={"h".toString()}
      />
      {/* );
      })} */}
    </View>
  );
};

export default memo(Paginator2);

const styles = StyleSheet.create({
  dot: {
    aspectRatio: 1,
    backgroundColor: "#fff",
    // marginHorizontal: rspW(0.8),
    marginHorizontal: rspW(0.8),
  },
  carouselDotCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
