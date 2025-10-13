import { Predicate } from "@syncfusion/ej2-data";
import { IHierarchy } from "../../services/useHierarchy";
import HierarchySelector, { HierarchyProvider } from "../hierarchy";
import { Button } from "@chakra-ui/react";
import { Filter } from "lucide-react";
import { IHierarchyScheme } from "../../services/useHierarchyScheme";
import { useEffect, useState } from "react";
import _ from "lodash";

interface IProps {
  field: string;
  title: string;
  default?: IHierarchy | null | undefined;
  onChange?: (predicate: Predicate | null | undefined) => void;
  hierarchyScheme?: IHierarchyScheme;
  isMulti?: boolean;
}

function DataTableHierarchyFilter(props: IProps) {
  const { field, title, hierarchyScheme, onChange, isMulti = true } = props;

  const [selectedParents, setSelectedParents] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[] | undefined>([]);

  const view = () => {
    return (
      <Button
        leftIcon={<Filter size="1rem" color="#42526E" strokeWidth="1.33" />}
        variant="outline"
      >
        {title}
      </Button>
    );
  };

  const handleChange = (
    parents: string[],
    _assets: string[],
    _last: string | undefined,
    ends: string[] | undefined,
  ) => {
    if (_.isEqual(parents, selected?.map((s: any) => s.id))) return;

    if (!_.isEqual(selectedParents, parents)) setSelectedParents(parents);
    if (!_.isEqual(ends, selected)) setSelected(ends);
  };

  useEffect(() => {
    if (selected && selected.length > 0) {
      const predicates = selected.map(
        (value) => new Predicate(field, "equal", value),
      );
      onChange?.(Predicate.or(predicates));
    } else {
      onChange?.(null);
    }
  }, [selected]);

  return (
    <HierarchyProvider id={hierarchyScheme?.id}>
      <HierarchySelector
        selected={selectedParents}
        onChange={handleChange}
        isMulti={isMulti}
        options={undefined}
        view={view}
        isInline={false}
        isAssetRequired={false}
      />
    </HierarchyProvider>
  );
}

export default DataTableHierarchyFilter;
