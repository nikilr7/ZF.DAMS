import FormField from "../../forms/Field";
import { Input, InputGroup, InputRightAddon } from "@chakra-ui/react";
import _ from "lodash";
import { useController, useWatch } from "react-hook-form";

interface IProps {
  name: string;
  label?: string;
  min: number;
  max: number;
  nonConformanceRequirement?: "mandatory" | "optional" | "not-applicable";
  nonConformanceType?: string;
  isDisabled?: boolean;
}

const RangeScoringField = ({
  name,
  label,
  min,
  max,
  nonConformanceRequirement,
  nonConformanceType,
  isDisabled,
}: IProps) => {
  const {
    field: { value, onChange },
  } = useController({ name });

  const userNonConformanceRequirement = useWatch({
    name: `${name}.userNonConformanceRequirement`,
  });

  const handleChange = (input: number) => {
    const isNonConformance =
      nonConformanceRequirement === "not-applicable"
        ? false
        : input < min || input > max;
    onChange({
      value: _.isNaN(input) ? undefined : input,
      nonConformanceRequirement: nonConformanceRequirement ?? "not-applicable",
      nonConformanceType: _.isEmpty(nonConformanceType)
        ? "default"
        : nonConformanceType,
      isNonConformance,
      display: input,
      userNonConformanceRequirement,
    });
  };

  return (
    <FormField
      name={name}
      label={label}
      options={{
        valueAsNumber: true,
      }}
    >
      {() => (
        <InputGroup>
          <Input
            type="number"
            size={"sm"}
            value={value?.value ?? ""}
            onChange={(e) => handleChange(e.target.valueAsNumber)}
            isDisabled={isDisabled}
            onWheel={(e) => e.currentTarget.blur()}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown")
                e.preventDefault();
            }}
          />
          <InputRightAddon
            minW={14}
            justifyContent={"center"}
            fontSize={"11px"}
          >{`${min} - ${max}`}</InputRightAddon>
        </InputGroup>
      )}
    </FormField>
  );
};

export default RangeScoringField;
