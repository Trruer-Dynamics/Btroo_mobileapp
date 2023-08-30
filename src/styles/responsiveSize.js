import { Dimensions, Platform, StatusBar } from "react-native";

import {
  responsiveHeight as rspH,
  responsiveWidth as rspW,
  responsiveFontSize as rspF,
} from "react-native-responsive-dimensions";
import { initialWindowMetrics } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const srn_height = Dimensions.get("screen").height;
const srn_width = Dimensions.get("screen").width;

export {
  width as scrn_width,
  height as scrn_height,
  srn_height,
  srn_width,
  rspW,
  rspH,
  rspF,
};
