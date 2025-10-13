import { Text } from "@chakra-ui/react";
import { IHierarchy } from "../../services/useHierarchy";

export default function HierarchyView({
  hierarchy,
}: {
  hierarchy?: IHierarchy;
}) {
  const getHierarchyLevels = (hierarchy: IHierarchy): string => {
    const parentLevel = hierarchy?.parent
      ? getHierarchyLevels(hierarchy?.parent) + " / "
      : "";

    return parentLevel + hierarchy?.masterData?.data?.name;
  };

  const hierarchyLevels = hierarchy ? getHierarchyLevels(hierarchy) : "";

  return <Text>{hierarchyLevels}</Text>;
}
