import {
  Badge,
  Box,
  Button,
  Popover,
  PopoverTrigger,
  Divider,
  PopoverContent,
  CheckboxIcon,
  useMultiStyleConfig,
  chakra,
  HStack,
  Link,
} from "@chakra-ui/react";
import { Filter } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandEmpty,
  CommandItem,
} from "../Command";
import { Predicate } from "@syncfusion/ej2-data";
import { DelimitedArrayParam, useQueryParam } from "use-query-params";
import { useEffect, useState } from "react";
import { isNumber } from "lodash";
import { List } from "react-virtualized";

interface DataTableFilterProps<T extends number | string = string> {
  field: string;
  title: string;
  options: {
    label: string;
    value: T;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  default?: T[] | null | undefined;
  onChange?(predicate: Predicate | null | undefined): void;
  isMulti?: boolean;
}

function DataTableFilter<T extends number | string = string>(props: DataTableFilterProps<T>) {
  const {
    field,
    title,
    options,
    onChange,
    default: defaultValues,
    isMulti = true,
  } = props;
  const [selected, setSelected] = useQueryParam(
    field.toLowerCase(),
    DelimitedArrayParam,
  );

  let selectedSet: Set<T>;

  if (isNumber(options[0]?.value)) {
    selectedSet = new Set(
      selected?.filter((s) => !!s).map((s) => parseInt(s as string)) as T[],
    );
  } else {
    selectedSet = new Set(selected?.filter((s) => !!s) as T[]);
  }

  const onSelect = (option: { label: string; value: T }) => {
    if (isMulti) {
      if (selectedSet.has(option.value)) selectedSet.delete(option.value);
      else selectedSet.add(option.value);
    } else selectedSet = new Set([option.value]);

    const updated = selectedSet.size ? Array.from(selectedSet) : [];
    setSelected(updated?.map((u) => u.toString()));

    if (!!updated && updated.length > 0) {
      const predicates: Predicate[] = [];
      updated?.forEach((value) => {
        return predicates.push(new Predicate(field, "equal", value));
      });
      onChange?.(Predicate.or(predicates));
    } else {
      onChange?.(null);
    }
  };

  useEffect(() => {
    const updated = selectedSet.size ? Array.from(selectedSet) : undefined;

    if (updated) {
      const predicates = updated.map(
        (value) => new Predicate(field, "equal", value),
      );
      onChange?.(Predicate.or(predicates));
    }
  }, []);

  useEffect(() => {
    if (selected == undefined) {
      setSelected(defaultValues?.map((d) => d?.toString()));
      if (defaultValues) {
        const predicates = defaultValues.map(
          (value) => new Predicate(field, "equal", value),
        );
        onChange?.(Predicate.or(predicates));
      } else {
        onChange?.(defaultValues);
      }
    }
  }, [defaultValues]);

  const onClear = () => {
    setSelected([]);
    onChange?.(null);
  };

  const onSelectAll = () => {
    const allValues = options.map((option) => option.value);
    setSelected(allValues.map((value) => value.toString()));

    const predicates = allValues.map(
      (value) => new Predicate(field, "equal", value),
    );
    onChange?.(Predicate.or(predicates));
  };

  const [filteredOptions, setFilteredOptions] = useState<
    {
      label: string;
      value: T;
      icon?: React.ComponentType<{ className?: string }>;
    }[]
  >([]);

  useEffect(() => {
    setFilteredOptions(options ?? []);
  }, [options]);

  const rowRenderer = ({
    key,
    index,
    style,
  }: {
    key: string;
    index: number;
    style: React.CSSProperties;
  }) => {
    const option = filteredOptions?.[index];
    if (!option) return null;

    return (
      <CommandItem
        key={key}
        onSelect={() => onSelect(option)}
        value={option.label}
        style={{ ...style, top: index * 33, height: 33 }}
      >
        {isMulti && <Checkbox isChecked={selectedSet.has(option.value)} />}
        <Box ml={2} flex="1" isTruncated>
          {option.label}
        </Box>
      </CommandItem>
    );
  };

  return (
    <Popover gutter={4} placement="bottom-start">
      <PopoverTrigger>
        <Button
          leftIcon={<Filter size="1rem" color="#42526E" strokeWidth="1.33" />}
          variant="outline"
        >
          {title}
          {selectedSet?.size > 0 && (
            <>
              <Divider mx={1} h="60%" orientation="vertical" />
              <Badge display={{ base: "block", lg: "none" }}>
                {selectedSet.size}
              </Badge>
              <Box display={{ base: "none", lg: "flex" }} gap={1}>
                {selectedSet.size > 2 ? (
                  <Badge>{selectedSet.size} selected</Badge>
                ) : (
                  options
                    .filter((o) => selectedSet.has(o.value))
                    .map((o) => <Badge key={o.value}>{o.label}</Badge>)
                )}
              </Box>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent w="auto">
        <Command shouldFilter={false}>
          <HStack m={1} gap={1}>
            <CommandInput
              placeholder={title}
              flex="1"
              onValueChange={(value) =>
                setFilteredOptions(
                  options.filter((o) =>
                    o.label.toLowerCase().includes(value.toLowerCase()),
                  ) ?? [],
                )
              }
            />
            {isMulti && (
              <HStack gap={4} px={2} fontSize="xs">
                <Link color="blue.700" onClick={onSelectAll}>
                  Select All
                </Link>
                <Link color="blue.700" onClick={onClear}>
                  Clear
                </Link>
              </HStack>
            )}
          </HStack>
          <CommandList style={{ scrollbarWidth: "none" }}>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <List
                rowCount={filteredOptions?.length ?? 0}
                rowHeight={33}
                width={350}
                height={Math.min(filteredOptions?.length * 33, 400)}
                rowRenderer={rowRenderer}
                overscanRowCount={0}
              />
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function Checkbox({ isChecked }: { isChecked: boolean }) {
  const styles = useMultiStyleConfig("Checkbox");

  return (
    <chakra.span
      __css={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        verticalAlign: "top",
        userSelect: "none",
        flexShrink: 0,
        ...styles.control,
      }}
      data-checked={isChecked ? "" : undefined}
      className="chakra-checkbox__control"
    >
      <CheckboxIcon __css={styles.icon} isChecked={isChecked} />
    </chakra.span>
  );
}

export type { DataTableFilterProps };
export default DataTableFilter;
