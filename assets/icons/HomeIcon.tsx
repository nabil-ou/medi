import Svg, { ClipPath, Defs, G, Path, SvgProps } from "react-native-svg";

export default function HomeIcon(props: SvgProps) {
  return (
    <Svg
      width={props.width || 24}
      height={props.height || 24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <G
        clipPath="url(#clip0_2074_1848)"
        stroke={props.color}
        strokeWidth={1.71415}
        strokeLinejoin="round"
      >
        <Path
          d="M1.286 14.52L10.7 3.6a1.714 1.714 0 012.596 0l9.415 10.921"
          strokeLinecap="round"
        />
        <Path d="M4.582 10.705l6.116-7.125a1.714 1.714 0 012.601 0l6.117 7.125.35 2.493a23.26 23.26 0 01-.047 6.767 2.325 2.325 0 01-2.298 1.971H6.576a2.325 2.325 0 01-2.298-1.971 23.254 23.254 0 01-.046-6.767l.35-2.493z" />
        <Path
          d="M12 13.867a2.859 2.859 0 012.858 2.858v5.21H9.14v-5.21a2.859 2.859 0 012.858-2.859z"
          strokeLinecap="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_2074_1848">
          <Path
            fill="#fff"
            transform="translate(0 .001)"
            d="M0 0H23.998V23.998H0z"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
