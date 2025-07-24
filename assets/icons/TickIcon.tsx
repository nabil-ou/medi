import Svg, { Path, SvgProps } from "react-native-svg";

export default function TickIcon(props: SvgProps) {
  return (
    <Svg width={17} height={16} viewBox="0 0 17 16" fill="none" {...props}>
      <Path
        d="M13.967 4.987a.5.5 0 00-.768-.64L9.605 8.659c-.722.866-1.23 1.474-1.67 1.872-.43.388-.727.512-1.018.512-.292 0-.589-.124-1.02-.512-.44-.398-.947-1.006-1.67-1.872l-.926-1.112a.5.5 0 00-.769.64l.953 1.143c.69.829 1.243 1.492 1.743 1.943.516.466 1.043.77 1.689.77.645 0 1.172-.304 1.688-.77.5-.451 1.053-1.114 1.743-1.943l3.62-4.343z"
        fill="#24B500"
        stroke="#24B500"
        strokeLinecap="round"
      />
    </Svg>
  );
}
