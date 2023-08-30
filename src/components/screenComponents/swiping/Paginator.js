import { StyleSheet, View, Animated, useWindowDimensions } from "react-native";
import React, { memo } from "react";
import { rspW } from "../../../styles/responsiveSize";

const Paginator = ({ data, currentIndex }) => {
  return (
    <View style={styles.carouselDotCont}>
      {data.map((_, i) => {
        return (
          <Animated.View
            style={[
              styles.dot,
              {
                width: i == currentIndex ? 8 : 6,
                // height: 6,

                borderRadius: i == currentIndex ? 4 : 3,
                opacity: i == currentIndex ? 1 : 0.3,
              },
            ]}
            key={i.toString()}
          />
        );
      })}
    </View>
  );
};

export default memo(Paginator);

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
