import Colors from "@/constants/Colors";
import { ReactNode } from "react";
import { styled, TabsContentProps, Tabs as TamaguiTabs, Text } from "tamagui";

type TabConfig<T> = {
  value: T;
  icon?: () => ReactNode;
  title: string;
  content: ReactNode;
};

type TabsProps<T> = {
  tabs: TabConfig<T>[];
  activeTab?: T;
  onChangeTab: (value: T) => void;
};

export default function Tabs<T extends string>({
  tabs,
  activeTab,
  onChangeTab,
}: TabsProps<T>) {
  // const [activeTab, setActiveTab] = useState<T>(defaultValue ?? tabs[0].value);

  return (
    <TamaguiTabs
      defaultValue={activeTab}
      orientation="horizontal"
      flexDirection="column"
      onValueChange={(value) => onChangeTab(value as T)}
    >
      <TamaguiTabs.List
        style={{
          padding: 4,
          borderRadius: 22,
          backgroundColor: Colors.lightGray,
          height: 44,
        }}
      >
        {tabs.map((tab) => (
          <TabsTab
            key={tab.value}
            value={tab.value}
            icon={tab.icon}
            title={tab.title}
            active={activeTab === tab.value}
          />
        ))}
      </TamaguiTabs.List>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          active={activeTab === tab.value}
        >
          {tab.content}
        </TabsContent>
      ))}
    </TamaguiTabs>
  );
}

const TabsTab = ({ value, active, icon, title }) => {
  const StyledTab = styled(TamaguiTabs.Tab, {
    flex: 1,
    height: 36,
    borderRadius: 18,
    padding: 8,
    gap: 8,
    backgroundColor: Colors.lightGray,

    pressStyle: {
      backgroundColor: Colors.lightGray,
    },

    variants: {
      active: {
        true: {
          backgroundColor: Colors.black,
          pressStyle: {
            backgroundColor: Colors.black,
          },
        },
      },
    } as const,
  });

  const TabText = styled(Text, {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 20,
    color: active ? Colors.white : Colors.black,
  });

  return (
    <StyledTab value={value} active={active}>
      {icon?.()}
      <TabText>{title}</TabText>
    </StyledTab>
  );
};

const TabsContent = (props: TabsContentProps & { active: boolean }) => (
  <TamaguiTabs.Content
    alignItems="center"
    marginHorizontal={-20}
    forceMount={true}
    display={props.active ? "flex" : "none"}
    {...props}
  >
    {props.children}
  </TamaguiTabs.Content>
);
