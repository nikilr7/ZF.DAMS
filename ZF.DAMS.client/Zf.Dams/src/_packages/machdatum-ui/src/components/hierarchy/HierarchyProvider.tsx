import _ from "lodash";
import { createContext, useMemo } from "react";
import { IHierarchy, useHierarchies } from "../../services/useHierarchy";
import {
  IHierarchySchemeLevel,
  useHierarchyScheme,
  IHierarchyScheme,
} from "../../services/useHierarchyScheme";
import { IMasterData, useBulkMastersData } from "../../services/useMasterData";

export interface IHierarchyData extends IHierarchy {
  level: IHierarchySchemeLevel | undefined;
  data: IMasterData | undefined;
  label: string;
}

const useHierarchyToAssets = (id: string | undefined) => {
  const { entity: scheme } = useHierarchyScheme(id);
  const { entities } = useHierarchies(id);

  const masterIds = useMemo<string[]>(() => {
    if (!scheme.data) return [];
    return scheme.data.levels.map((l) => l.master.id);
  }, [scheme.data]);

  const mastersData = useBulkMastersData(masterIds);
  const hierarchies: IHierarchyData[] | undefined = useMemo(() => {
    if (!scheme.data || !entities.data || !mastersData.data) return undefined;

    return entities.data.map((h) => {
      const level = scheme.data.levels.find(
        (l) => l.master.id === h.masterData?.master?.id,
      );

      let data = undefined;

      if (h.masterData) {
        data = mastersData.data[h.masterData.master?.id ?? ""]?.find(
          (masterData: any) => masterData.id === h.masterData?.id,
        );

        if (!data)
          console.error(
            `Master data ${h.masterData?.id} is not in the master data`,
          );
        if (!level)
          console.error(
            `Hierarchy ${h.masterData?.master?.id} is not in the scheme`,
          );
      }

      return {
        ...h,
        level,
        data,
        label:
          data?.[h.masterData?.master?.displayField ?? ""] ??
          (h.asset?.name as string),
      };
    });
  }, [scheme.data && entities.data && mastersData.data]);

  const getEnds = useMemo(
    () => (selected: string[]) => {
      const selectedHierarchies = hierarchies?.filter((h) =>
        selected.includes(h.id),
      );

      const endLevel = _.max(scheme.data?.levels.map((l) => l.order));
      const selectedLevel = _.max(
        selectedHierarchies?.map((h) => h.level?.order),
      );

      if (selectedLevel === endLevel)
        return (
          selectedHierarchies
            ?.filter((h) => h.level?.order === endLevel)
            .map((h) => h.id) ?? []
        );

      const isSelected = (hierarchy: IHierarchy): boolean => {
        if (selected.includes(hierarchy.id)) return true;
        if (hierarchy.parent) return isSelected(hierarchy.parent);
        return false;
      };

      return (
        hierarchies
          ?.filter((h) => h.level?.order === endLevel)
          .filter((h) => isSelected(h))
          .map((h) => h.id) ?? []
      );
    },
    [hierarchies, scheme.data],
  );

  const getAssets = useMemo(
    () => (selected: string[]) => {
      const selectedHierarchies = hierarchies?.filter((h) =>
        selected.includes(h.id),
      );

      const selectedAssets = selectedHierarchies?.filter((h) => !!h.asset);

      if (!!selectedAssets && selectedAssets.length > 0)
        return selectedAssets?.map((a) => a.asset?.id ?? "");

      const parentLevel = _.max(
        selectedHierarchies?.map((h) => h.level?.order),
      );
      const parents = selectedHierarchies
        ?.filter((h) => h.level?.order === parentLevel)
        .map((h) => h.id);
      const assets = hierarchies?.filter((h) => !!h.asset);

      const result = assets?.filter((asset) => {
        let hierarchy = asset.parent;

        while (true) {
          if (parents?.includes(hierarchy?.id ?? "")) return true;
          hierarchy = hierarchy?.parent;
          if (!hierarchy) break;
        }

        return false;
      });

      const output =
        result && result.length > 0
          ? result.map((r) => r.asset?.id ?? "")
          : assets?.map((a) => a.asset?.id ?? "") ?? [];

      return output;
    },
    [hierarchies],
  );

  return {
    scheme: scheme.data,
    hierarchies,
    getAssets,
    getEnds,
  };
};

export const HierarchyContext = createContext<{
  scheme: IHierarchyScheme | undefined;
  hierarchies: IHierarchyData[] | undefined;
  getAssets: (selected: string[]) => string[];
  isAssetsOnly?: boolean;
  getLast: (selected: string[]) => string | undefined;
  getEnds: (selected: string[]) => string[] | undefined;
}>({
  scheme: undefined,
  hierarchies: undefined,
  getAssets: () => [],
  isAssetsOnly: false,
  getLast: (_selected: string[]) => undefined,
  getEnds: (_selected: string[]) => undefined,
});

export function HierarchyProvider(props: {
  id?: string;
  children: React.ReactNode;
}) {
  const { id, children } = props;
  const { scheme, hierarchies, getAssets, getEnds } = useHierarchyToAssets(id);

  const getLast = useMemo(
    () => (selected: string[]) => {
      const lastLevel = scheme?.levels.find(
        (l) => l.order === _.max(hierarchies?.map((h) => h.level?.order)),
      );
      const lastHierarchies =
        hierarchies?.filter((h) => h.level?.order === lastLevel?.order) ?? [];
      const lastSelected = lastHierarchies?.filter((h) =>
        selected.includes(h.id),
      );
      return lastSelected[0]?.id;
    },
    [hierarchies],
  );

  return (
    <HierarchyContext.Provider
      value={{
        scheme,
        hierarchies,
        getAssets,
        getLast,
        getEnds,
        isAssetsOnly: !id,
      }}
    >
      {children}
    </HierarchyContext.Provider>
  );
}
