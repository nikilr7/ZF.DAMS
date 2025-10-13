import { Children, ReactElement, cloneElement, useEffect, useRef } from "react";
import { HStack } from "@chakra-ui/react";
import { Predicate } from "@syncfusion/ej2-data";
import DataTableFilter, { DataTableFilterProps } from "./DataTableFilter";
import DataTableDateTimeFilter, {
  DataTableDateTimeFilterProps,
} from "./DataTableDateTimeFilter";
import DataTableHierarchyFilter from "./DataTableHierarchyFilter";

interface IProps {
  onChange(predicates: Predicate[], isLoaded?: boolean): void;
}

function DataTableToolbar(props: React.PropsWithChildren<IProps>) {
  const { onChange } = props;

  const predicates = useRef<{ [key: string]: Predicate | undefined | null }>(
    {},
  );

  const children = Children.toArray(props.children) as ReactElement<
    DataTableFilterProps | DataTableDateTimeFilterProps
  >[];

  useEffect(() => {
    if (!children || children.length === 0) {
      onChange([], true);
      return;
    }
    children.forEach((child) => {
      if (predicates.current[child.props.field]) return;
      if (child.props.default === undefined || child.props.default === null)
        predicates.current[child.props.field] = child.props.default;
    });
  }, []);

  const handleChange = (predicate: Predicate, field: string) => {
    predicates.current[field] = predicate;
    onChange(
      [
        ...Object.values(predicates.current)
          .filter((p) => !!p)
          .map((p) => p as Predicate),
      ],
      Object.values(predicates.current).filter((p) => p === undefined)
        .length === 0,
    );
  };

  //TODO: cloneElement is not a appreciated way of building components,
  //however, the other methods increases complexity on the parent
  return (
    <HStack id="data-table-toolbar">
      {children.map((child) =>
        child.type === DataTableFilter ||
        child.type === DataTableDateTimeFilter ||
        child.type === DataTableHierarchyFilter
          ? cloneElement(child, {
              onChange: (predicate: Predicate) =>
                handleChange(predicate, child.props.field),
            })
          : null,
      )}
    </HStack>
  );
}

export default DataTableToolbar;
