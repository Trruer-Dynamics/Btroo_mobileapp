import { rspW, scrn_width } from "../../../styles/responsiveSize";

const COL = 3;

export const MARGIN = 8;

export const SIZE = rspW(86) / COL - MARGIN;

export const getPosition = (index) => {
  "worklet";

  return {
    x: (index % COL) * SIZE,

    y: Math.floor(index / COL) * SIZE,
  };
};

export const getOrder = (x, y) => {
  "worklet";

  const row = Math.round(y / SIZE);

  const col = Math.round(x / SIZE);

  return row * COL + col;
};
