import { useFormContext } from "react-hook-form";
import _ from "lodash";
import { useState } from "react";
import { IFieldProps } from "../../../hooks/defs";
import { IHierarchy } from "../../../services/useHierarchy";
import { IHierarchyScheme } from "../../../services/useHierarchyScheme";
import HierarchySelector, { HierarchyProvider } from "../../hierarchy";
import FormField from "../../forms/Field";

interface IProps {
  hierarchyScheme: IHierarchyScheme | undefined;
  options?: IHierarchy[];
  isClearable?: boolean;
}

export const HierarchySelectorField = ({
  field: { name, label },
  hierarchyScheme,
  isMulti,
  options,
  isClearable,
}: IFieldProps & IProps) => {
  const { watch, setValue } = useFormContext<any>();
  const [selectedParents, setSelectedParents] = useState<string[]>([]);
  const selected: { id: string }[] | undefined = watch(name);

  const handleChange = (
    parents: string[],
    _assets: string[],
    last: string | undefined,
  ) => {
    if (_.isEqual(parents, selected?.map((s: any) => s.id))) return;

    if (!_.isEqual(selectedParents, parents)) setSelectedParents(parents);
    if (!_.isEqual(last, selected?.some((s) => s.id)))
      setValue(name, last ? parents.map((v) => ({ id: v })) : undefined, {
        shouldDirty: true,
      });
  };

  return (
    <FormField name={name}>
      {() => (
        <HierarchyProvider id={hierarchyScheme?.id}>
          <HierarchySelector
            selected={selected ? selected.map((s) => s.id) : selectedParents}
            onChange={handleChange}
            isMulti={isMulti}
            isInline={true}
            label={label}
            isAssetRequired={false}
            options={options}
            isLast={true}
            isClearable={isClearable}
          />
        </HierarchyProvider>
      )}
    </FormField>
  );
};

export const HierarachyLastSelectorField = ({
  field: { name, label },
  hierarchyScheme,
  options,
  isEditable,
  isClearable,
}: IFieldProps & IProps) => {
  const { watch, setValue } = useFormContext<any>();

  const [selectedParents, setSelectedParents] = useState<string[]>([]);
  const selected: { id: string } | undefined = watch(name);

  const handleChange = (parents: any, _y: any, last: string | undefined) => {
    if (!_.isEqual(selectedParents, parents)) setSelectedParents(parents);
    if (!_.isEqual(last, selected?.id))
      setValue(name, last ? { id: last } : undefined, {
        shouldDirty: (selected && !last) || (!selected && last) ? false : true,
      });
  };

  return (
    <FormField name={name}>
      {({ error }) => (
        <HierarchyProvider id={hierarchyScheme?.id}>
          <HierarchySelector
            selected={selected ? [selected.id] : selectedParents}
            onChange={handleChange}
            isMulti={false}
            isInline={true}
            label={label}
            isAssetRequired={false}
            options={options}
            isLast={true}
            isError={!!error}
            isDisabled={!isEditable}
            isClearable={isClearable}
          />
        </HierarchyProvider>
      )}
    </FormField>
  );
};
