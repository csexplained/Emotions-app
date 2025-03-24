import * as React from "react";
import Svg, { Path } from "react-native-svg";

const SvgClipboardText = ({ fill = "#6E6E6E", width = 24, height = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" {...props}>
    <Path
      stroke={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M6.667 10.167H12.5M6.667 13.5h3.65M8.333 5h3.334c1.666 0 1.666-.833 1.666-1.667 0-1.666-.833-1.666-1.666-1.666H8.333c-.833 0-1.666 0-1.666 1.666C6.667 5 7.5 5 8.333 5"
    />
    <Path
      stroke={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M13.333 3.35c2.775.15 4.167 1.175 4.167 4.983v5c0 3.334-.833 5-5 5h-5c-4.167 0-5-1.666-5-5v-5c0-3.8 1.392-4.833 4.167-4.983"
    />
  </Svg>
);

export default SvgClipboardText;
