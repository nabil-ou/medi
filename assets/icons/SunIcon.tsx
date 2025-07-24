import Svg, { Path, SvgProps } from "react-native-svg";

export default function SunIcon(props: SvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 1v2m0 18v2m11-11h-2M3 12H1m18.778-7.778l-1.414 1.414M5.636 18.364l-1.414 1.414m15.556 0l-1.414-1.414M5.636 5.636L4.222 4.222M18 12a6 6 0 11-12 0 6 6 0 0112 0z"
        stroke={props.color || "#222222"}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}
