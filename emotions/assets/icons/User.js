import * as React from "react";
import Svg, { Path } from "react-native-svg";

const SvgUser = ({ fill = "#6E6E6E", width = 24, height = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" {...props}>
    <Path
      stroke={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10 10a4.167 4.167 0 1 0 0-8.334A4.167 4.167 0 0 0 10 10M17.158 18.333c0-3.225-3.208-5.833-7.158-5.833s-7.158 2.608-7.158 5.833"
    />
  </Svg>
);

export default SvgUser;
