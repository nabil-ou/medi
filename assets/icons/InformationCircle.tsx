import Svg, { SvgProps, G, Path, Defs, ClipPath } from "react-native-svg";

const InformationCircle = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <G fill="#222" clipPath="url(#a)" opacity={0.6}>
      <Path d="M8.5 7.333a.5.5 0 0 0-1 0v4a.5.5 0 0 0 1 0v-4Z" />
      <Path
        fillRule="evenodd"
        d="M8 .833a7.167 7.167 0 1 0 0 14.334A7.167 7.167 0 0 0 8 .833ZM1.833 8a6.167 6.167 0 1 1 12.334 0A6.167 6.167 0 0 1 1.833 8Z"
        clipRule="evenodd"
      />
      <Path d="M8.667 5.333a.667.667 0 1 1-1.334 0 .667.667 0 0 1 1.334 0Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h16v16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default InformationCircle;
