import Svg, { Path, SvgProps } from "react-native-svg";

export default function PlusIcon(props: SvgProps) {
  return (
    <Svg
      width={props.width || 24}
      height={props.height || 24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.999 2a2 2 0 10-4 0v7a1 1 0 01-1 1h-7a2 2 0 100 4h7a1 1 0 011 1v7a2 2 0 004 0v-7a1 1 0 011-1h7a2 2 0 100-4h-7a1 1 0 01-1-1V2z"
        fill={props.color || "#fff"}
      />
    </Svg>
  );
}
