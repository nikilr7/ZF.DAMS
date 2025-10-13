import FormField from "../../forms/Field";
import { NumberInput, NumberInputField } from "@chakra-ui/react";
import { useController } from "react-hook-form";

interface IProps {
  name: string;
  label?: string;
  nonConformance?: string;
  nonConformanceType?: string;
  isDisabled?: boolean;
}

const NumericScoringField = (props: IProps) => {
  const { name, label, nonConformance, nonConformanceType, isDisabled } = props;
  const {
    field: { value, onChange },
  } = useController({ name });

  const handleChange = (value: string) => {
    onChange({ value, nonConformance, nonConformanceType });
  };

  return (
    <FormField name={name} label={label}>
      {() => (
        <NumberInput
          onChange={handleChange}
          value={value?.value ?? 0}
          isDisabled={isDisabled}
        >
          <NumberInputField />
        </NumberInput>
      )}
    </FormField>
  );
};

export default NumericScoringField;
