import React from "react";
import SwiperOr from "./SwiperOr";
import { useSelector } from "react-redux";
import SwiperTut from "./SwiperTut";
import OffflineAlert from "../../components/functions/OfflineAlert";

const Swiper = ({ route }) => {
  let repeat_tut = route.params?.repeat_tut ? route.params?.repeat_tut : false;

  const swipe_tut = useSelector((state) => state.tutorial.swipe_tut);
  const is_network_connected = useSelector(
    (state) => state.authentication.is_network_connected
  );

  return (
    <>
      {!is_network_connected && <OffflineAlert />}
      {swipe_tut ? <SwiperTut repeat_tut={repeat_tut} /> : <SwiperOr />}
    </>
  );
};

export default Swiper;
