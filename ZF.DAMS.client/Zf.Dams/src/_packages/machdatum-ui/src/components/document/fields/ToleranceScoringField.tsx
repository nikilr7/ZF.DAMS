import { Input, InputGroup, InputRightAddon } from "@chakra-ui/react";
import FormField from "../../forms/Field";
import { useController, useWatch } from "react-hook-form";
import _ from "lodash";

interface IProps {
  name: string;
  label?: string;
  actualValue: number;
  plus: number;
  minus: number;
  nonConformanceRequirement?: string;
  nonConformanceType?: string;
  isDisabled?: boolean;
}

const ToleranceScoringField = (props: IProps) => {
  const {
    name,
    label,
    plus,
    minus,
    actualValue,
    nonConformanceRequirement,
    nonConformanceType,
    isDisabled,
  } = props;
  const {
    field: { value, onChange },
  } = useController({ name });

  const userNonConformanceRequirement = useWatch({
    name: `${name}.userNonConformanceRequirement`,
  });

  const min = Number(actualValue) - Number(minus);
  const max = Number(actualValue) + Number(plus);

  const displayValue =
    plus === minus
      ? `${actualValue}±${plus}`
      : `${actualValue} (+${plus} -${minus})`;

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
            value={value?.value ?? ""}
            size={"sm"}
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
          >
            {displayValue}
          </InputRightAddon>
        </InputGroup>
      )}
    </FormField>
  );
};

export default ToleranceScoringField;
