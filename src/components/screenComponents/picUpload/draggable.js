import React, { useEffect } from "react";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { MARGIN, getOrder, getPosition } from "./utils";

const Draggable = ({
  children,
  positions,
  id,
  activeIndx,
  item,
  pic_list,
  refresh,
  setrefresh,
  setpos_change = null,
  setpos2,
}) => {
  // get position of index item ( index item which is dragging)
  const position = getPosition(positions.value[id]);

  // get x and y position
  const translateX = useSharedValue(position.x);
  const translateY = useSharedValue(position.y);

  // check if image status active or not ( imag uploaded or not)
  const isGestureActive = useSharedValue(false);

  // check if other item is in dragging or not
  const isDraggable = useSharedValue(false);

  // translate positon after dragging
  useAnimatedReaction(
    () => positions.value[id],
    (newOrder) => {
      const newPostions = getPosition(newOrder);
      translateX.value = withTiming(newPostions.x);
      translateY.value = withTiming(newPostions.y);
    }
  );

  const setDraggable = () => {
    if (item[1] != "") {
      isDraggable.value = true;
    } else {
      isDraggable.value = false;
    }
  };

  // Refresh Screen to show changes
  const refreshScreen = () => {
    setrefresh(!refresh);
    setpos2(positions.value);
  };

  // to activate save button after any changes occur
  const imgPosChange = () => {
    if (setpos_change != null) {
      setpos_change(true);
    }
  };

  // Pan Gesture handler function
  const panGesture = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      runOnJS(setDraggable)();
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;

      isGestureActive.value = true;
    },

    onActive: (evt, ctx) => {
      // check item is available to drag
      if (isDraggable.value) {
        translateX.value = ctx.startX + evt.translationX;
        translateY.value = ctx.startY + evt.translationY;

        const oldOrder = positions.value[id];
        const newOrder = getOrder(translateX.value, translateY.value);

        if (oldOrder !== newOrder) {
          runOnJS(imgPosChange)();
          const idToSwap = Object.keys(positions.value).find(
            (key) => positions.value[key] === newOrder
          );

          // to dragging item overlap other grid list item
          if (idToSwap) {
            let actV = pic_list[idToSwap][1] != "";
            if (actV) {
              const newPostions = JSON.parse(JSON.stringify(positions.value));

              let exact_pos = newPostions[id];

              // to get list of position objects
              let new_pos_list = Object.entries(newPostions);

              // sort list and reverse it
              let sort_lis0 = new_pos_list.sort((a, b) => a[1] - b[1]);
              let sort_lis = sort_lis0.map((a, b) => [b, a[0]]);
              let swipe_pos = sort_lis.find((v) => v[0] == exact_pos);

              // in ascending order
              if (newOrder > oldOrder) {
                // get remaining positions after dragging item
                let rem_poses = sort_lis.slice(swipe_pos[0] + 1, newOrder + 1);

                let lst = [];

                for (let j = 0; j < rem_poses.length; j++) {
                  let ele = rem_poses[j];
                  ele = [ele[0] - 1, ele[1]];
                  lst.push(ele);
                }

                let r_lst = lst.map((a) => [a[1], a[0]]);

                // get first item position
                let first_ele = [String(swipe_pos[1]), newOrder];

                // add it in first position
                r_lst.unshift(first_ele);

                // check if first position change then
                if (swipe_pos[0] > 0) {
                  let prev_list = new_pos_list
                    .sort((a, b) => a[1] - b[1])
                    .slice(0, swipe_pos[0]);
                  r_lst = prev_list.concat(r_lst);
                }

                // concate previous and updated list
                let slice_rv = sort_lis0.slice(r_lst.length);
                let f_lista = r_lst.concat(slice_rv);
                let f_obj = {};

                // convert into onjects
                for (const itm of f_lista) {
                  f_obj[itm[0]] = itm[1];
                }

                positions.value = f_obj;
              }
              //  In descending order
              else {
                let rem_poses = sort_lis.slice(newOrder, exact_pos);

                let lst = [];

                for (let j = 0; j < rem_poses.length; j++) {
                  let ele = rem_poses[j];
                  ele = [ele[0] + 1, ele[1]];
                  lst.push(ele);
                }

                let r_lst = lst.map((a) => [a[1], a[0]]);
                let first_ele = [String(swipe_pos[1]), newOrder];

                r_lst.unshift(first_ele);

                if (newOrder > 0) {
                  let prev_list = new_pos_list
                    .sort((a, b) => a[1] - b[1])
                    .slice(0, newOrder);

                  r_lst = prev_list.concat(r_lst);
                }

                let slice_rv = sort_lis0.slice(r_lst.length);

                let f_lista = r_lst.concat(slice_rv);

                let f_obj = {};

                for (const itm of f_lista) {
                  f_obj[itm[0]] = itm[1];
                }

                positions.value = f_obj;
              }
            }
          }
        }
      }
    },

    onEnd: () => {
      const destination = getPosition(positions.value[id]);

      translateX.value = withTiming(destination.x);

      translateY.value = withTiming(destination.y);
    },

    onFinish: () => {
      isGestureActive.value = false;
      isDraggable.value = false;
      runOnJS(refreshScreen)();
    },
  });

  // To change position using styling translation
  const animatedStyle = useAnimatedStyle(() => {
    const zIndex = isGestureActive.value ? 1000 : 1;

    const scale = isGestureActive.value ? 1.1 : 1;

    return {
      position: "absolute",

      margin: MARGIN * 2,

      zIndex,

      transform: [
        { translateX: translateX.value },

        { translateY: translateY.value },

        { scale },
      ],
    };
  });

  return (
    <Animated.View style={{ ...animatedStyle }}>
      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.View>{children}</Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};

export default Draggable;
