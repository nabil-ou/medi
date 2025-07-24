import Svg, { Path, SvgProps } from "react-native-svg";

export default function MoonIcon(props: SvgProps) {
  return (
    <Svg width={19} height={22} viewBox="0 0 19 22" fill="none" {...props}>
      <Path
        d="M9.27 11.389c4 6.928 11.515 4.899 6.732 7.66-4.783 2.762-10.9 1.123-13.66-3.66C-.42 10.606 1.218 4.49 6.001 1.729c4.783-2.762-.732 2.732 3.268 9.66z"
        stroke={props.color || "#222222"}
        strokeWidth={2}
      />
    </Svg>
  );
}
