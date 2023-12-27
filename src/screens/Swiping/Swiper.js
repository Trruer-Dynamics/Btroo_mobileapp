import React from "react";
import SwiperOr from "./SwiperOr";
import { useDispatch, useSelector } from "react-redux";
import SwiperTut from "./SwiperTut";
import OffflineAlert from "../../components/functions/OfflineAlert";
import { useFocusEffect } from "@react-navigation/native";
import { setCurrentScreen } from "../../store/reducers/screen/screen";

const Swiper = ({ route }) => {
  const swipe_tut = useSelector((state) => state.tutorial.swipe_tut);
  const repeat_tut = useSelector((state) => state.tutorial.repeat_tut);

  const is_network_connected = useSelector(
    (state) => state.authentication.is_network_connected
  );

  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      dispatch(setCurrentScreen("Swiper"));
      return () => {};
    }, [])
  );

  return (
    <>
      {(is_network_connected && swipe_tut) || repeat_tut ? (
        <SwiperTut repeat_tut={repeat_tut} />
      ) : (
        <SwiperOr />
      )}
    </>
  );
};

export default Swiper;
