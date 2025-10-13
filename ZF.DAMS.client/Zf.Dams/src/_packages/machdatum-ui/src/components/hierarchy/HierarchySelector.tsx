import { useContext, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  chakra,
  useMultiStyleConfig,
} from "@chakra-ui/react";
import _ from "lodash";
import Select from "../../components/select/Select";
import {
  QueryParamConfig,
  encodeDelimitedArray,
  decodeDelimitedArray,
} from "use-query-params";
import { ActionMeta } from "chakra-react-select";
import { X } from "lucide-react";
import { HierarchyContext } from "./HierarchyProvider";
import { IHierarchyScheme } from "../../services/useHierarchyScheme";
import { IHierarchy } from "../../services/useHierarchy";

export const HierarchyParam: QueryParamConfig<string[]> = {
  encode: (value: string[]) => {
    return encodeDelimitedArray(value, ",");
  },
  decode: (value: string | (string | null)[] | null | undefined) => {
    return (decodeDelimitedArray(value, ",") as string[]) ?? [];
  },
};

// const getValidSelected = (selected: string[], hierarchies: any[]) => {
//   return selected.filter((s) => hierarchies.some((h) => h.id === s));
// };

interface IHierarchySelectorProps {
  direction?: "row" | "column";
  selected: string[];
  onChange: (selected: string[]) => void;
  scheme: IHierarchyScheme;
  hierarchies: any[];
  isInline?: boolean;
  isMulti?: boolean;
  isAssetRequired?: boolean;
  label?: string;
  options: IHierarchy[] | undefined;
  isError?: boolean;
  isDisabled?: boolean;
  view?: (displayPeriod: string) => React.ReactNode;
  isLast?: boolean;
  isClearable?: boolean;
}

function HierarchySelector(props: Readonly<IHierarchySelectorProps>) {
  const {
    scheme,
    hierarchies,
    selected,
    onChange: onChangeProp,
    isInline = true,
    direction = isInline ? "row" : "column",
    isMulti,
    isAssetRequired = true,
    label,
    options: defaultOptions,
    isError = false,
    isDisabled = false,
    view,
    isLast,
    isClearable = false,
  } = props;

  const styles = useMultiStyleConfig("Input");

  const getDropdowns = (selected: string[]) => {
    const levels = _.sortBy(scheme?.levels, (l) => l.order);

    const groups: any[] = levels.map((level) => {
      const options = hierarchies
        .filter((h) => {
          if (h.level?.order !== level.order) return false;

          const selectedParents = hierarchies
            .filter((h) => h.level?.order === level.order - 1)
            .filter((h) => selected.findIndex((s) => s === h.id) >= 0)
            .map((h) => (isLast ? h.id : h.masterData?.id));

          if (!selectedParents || selectedParents.length === 0) return true;

          if (isLast)
            return selectedParents.some((s: any) => s === h.parent?.id);
          else
            return selectedParents.some(
              (s: any) => s === h.parent?.masterData?.id,
            );
        })
        .map((h) => {
          return {
            id: h.id,
            label: h.label,
            master: h.data.id,
          };
        })
        .filter((o) =>
          defaultOptions
            ? defaultOptions.map((d) => d.id).includes(o.id)
            : true,
        );

      const uniqueOptions = Object.values(_.groupBy(options, "master"))
        .map((o: any) => {
          return {
            id: o[0].id,
            label: o[0].label,
            siblings: o.map((s: any) => s.id),
          };
        })
        .sort((a, b) => a.label.localeCompare(b.label));

      return {
        label: level.master.label ?? "",
        options: uniqueOptions,
      };
    });

    const selectedParents = hierarchies
      .filter((h) => h.level?.order === levels[levels.length - 1].order)
      .filter((h) => selected.findIndex((s) => s === h.id) >= 0)
      .map((h) => h.id);

    const parentOptions = groups[groups.length - 1].options;
    const options = hierarchies
      .filter((h) => !!h.asset)
      .filter((h) => {
        if (!selectedParents || selectedParents.length === 0)
          return parentOptions.some((p: any) => p.id === h.parent?.id);
        return selectedParents.some((s: any) => s === h.parent?.id);
      })
      .map((h) => ({
        id: h.id,
        label: h.label,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    isAssetRequired &&
      groups.push({
        label: "Assets",
        options,
      });

    return groups;
  };

  const handleSelected = (selected: string[]) => {
    const dropdowns = getDropdowns(selected);
    const options = dropdowns.map((dropdown) => dropdown.options).flat();

    let updated = [...selected];
    selected.forEach((s) => {
      const siblings =
        options.find((o) => o.siblings.includes(s))?.siblings ?? [];
      updated = [
        ...updated,
        ...siblings.filter((s: string) => !updated.includes(s)),
      ];
    });
    onChangeProp(
      updated.filter((s) =>
        options
          .map((o) => o.siblings)
          .flat()
          .includes(s),
      ),
    );
  };

  const handleChange = (
    option: any,
    meta: ActionMeta<any>,
    dropdownOptions: any[],
  ) => {
    if (isMulti) {
      if (meta.action === "select-option") {
        const newOptions = meta.option
          ? meta.option.siblings
          : (Array.isArray(option) ? option : [option]).flatMap(
              (opt) => opt.siblings,
            );
        handleSelected([...selected, ...newOptions]);
      } else if (meta.action === "deselect-option") {
        handleSelected(
          selected.filter((s) => !meta?.option?.siblings.includes(s)),
        );
      } else if (meta.action === "clear")
        handleSelected(
          selected.filter(
            (s) =>
              !meta.removedValues
                .flatMap((option) => option.siblings)
                .includes(s),
          ),
        );
    } else {
      if (meta.action === "select-option") {
        const newSelected = selected.filter(
          (s) => !dropdownOptions.map((o) => o.id).includes(s),
        );
        newSelected.push(option.id);
        handleSelected(newSelected);
      } else if (meta.action === "clear") {
        handleSelected([]);
      }
    }
  };

  const hiererchySelector = () => (
    <Stack direction={direction}>
      {getDropdowns(selected).map((dropdown) => (
        <FormControl w={"full"} key={dropdown.label}>
          <FormLabel>{dropdown.label}</FormLabel>
          <Select
            value={dropdown.options.filter((o: any) => selected.includes(o.id))}
            options={dropdown.options}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.id}
            isMulti={isMulti}
            onChange={(option, meta) =>
              handleChange(option, meta, dropdown.options)
            }
            isDisabled={isDisabled}
          />
        </FormControl>
      ))}
      {isClearable && (
        <IconButton
          px={1}
          mt={6}
          h={25}
          variant={"subtle"}
          aria-label="clear"
          onClick={() => onChangeProp([])}
          icon={<X size={"16px"} color="#42526E" />}
        />
      )}
    </Stack>
  );

  const hierarchySelectorInput = () => {
    const dropdowns = getDropdowns(selected);

    for (let i = dropdowns.length - 1; i >= 0; i--) {
      const currentDropdown = dropdowns[i];
      const selectedItems = currentDropdown.options
        .filter((item: any) => selected.includes(item.id))
        .map((item: any) => item.label);

      if (selectedItems.length > 0) {
        return selectedItems.join(", ");
      }
    }

    return `Select ${label ?? "Assets"}`;
  };

  // const validSelected = getValidSelected(selected, hierarchies);
  // if (validSelected.length !== selected.length) onChangeProp(validSelected);

  return (
    <>
      {isInline ? (
        hiererchySelector()
      ) : (
        <Popover closeOnBlur={true} placement="bottom-start">
          <PopoverTrigger>
            {view ? (
              view(hierarchySelectorInput())
            ) : (
              <Box>
                <FormLabel>{label ?? "Assets"}</FormLabel>
                <chakra.input
                  __css={styles.field}
                  pr={8}
                  minW={"60px"}
                  value={hierarchySelectorInput()}
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
                  aria-invalid={isError}
                />
                <IconButton
                  px={2}
                  py={5}
                  ml={-8}
                  mt={-1}
                  variant={"subtle"}
                  aria-label="clear"
                  onClick={() => onChangeProp([])}
                  icon={<X size={"16px"} color="#42526E" />}
                />
              </Box>
            )}
          </PopoverTrigger>
          <PopoverContent>
            <PopoverBody>{hiererchySelector()}</PopoverBody>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}

//TODO share props between HierarchySelector
interface IProps {
  direction?: "row" | "column";
  selected: string[];
  onChange: (
    selected: string[],
    assets: string[],
    last: string | undefined,
    ends: string[] | undefined,
  ) => void;
  isInline?: boolean;
  isMulti?: boolean;
  isAssetRequired?: boolean;
  label?: string;
  options: IHierarchy[] | undefined;
  isLast?: boolean;
  isError?: boolean;
  isDisabled?: boolean;
  view?: (displayPeriod: string) => React.ReactNode;
  isClearable?: boolean;
}

function withHierarchyData(
  Component: React.ComponentType<IHierarchySelectorProps>,
) {
  return (props: IProps) => {
    const { scheme, hierarchies, getAssets, getLast, getEnds, isAssetsOnly } =
      useContext(HierarchyContext);

    useEffect(() => {
      props.onChange(
        props.selected,
        isAssetsOnly ? props.selected : getAssets(props.selected),
        getLast(props.selected),
        getEnds(props.selected),
      );
    }, [scheme, hierarchies, props.selected]);

    let selected = props.selected;

    if (props.isLast) {
      let hierarchy = hierarchies?.find((h) => h.id === props.selected[0]);
      while (true) {
        if (!hierarchy?.parent) break;
        selected = [...selected, hierarchy.parent.id];
        hierarchy = hierarchies?.find((h) => h.id === hierarchy?.parent?.id);
      }
    }

    if (scheme && hierarchies)
      return (
        <Component
          {...props}
          selected={selected}
          onChange={(selected) => {
            props.onChange(
              selected,
              getAssets(selected),
              getLast(selected),
              getEnds(selected),
            );
          }}
          scheme={scheme}
          hierarchies={hierarchies}
          isMulti={props.isMulti}
          isError={props.isError}
        />
      );
    else
      return props.view ? (
        <>{props.view("Assets")}</>
      ) : (
        <Box>
          <FormLabel>{props.label ?? "Assets"}</FormLabel>
          <Input isDisabled />
        </Box>
      );
  };
}

export default withHierarchyData(HierarchySelector);
