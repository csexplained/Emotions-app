import * as React from "react";
import Svg, { Path } from "react-native-svg";

const SvgEmojiHappy = ({ fill = "#6E6E6E", width = 24, height = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" {...props}>
    <Path
      stroke={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7.5 18.333h5c4.167 0 5.833-1.666 5.833-5.833v-5c0-4.167-1.666-5.833-5.833-5.833h-5c-4.167 0-5.833 1.666-5.833 5.833v5c0 4.166 1.666 5.833 5.833 5.833"
    />
    <Path
      stroke={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M12.917 8.125a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5M7.083 8.125a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5M7 11.084h6c.417 0 .75.333.75.75a3.745 3.745 0 0 1-3.75 3.75 3.745 3.745 0 0 1-3.75-3.75c0-.417.333-.75.75-.75"
    />
  </Svg>
);

export default SvgEmojiHappy;
