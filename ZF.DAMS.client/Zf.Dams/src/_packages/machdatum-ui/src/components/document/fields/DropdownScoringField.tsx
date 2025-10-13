import FormSelect from "../../select/FormSelect";
import FormField from "../../forms/Field";
import { useController, useWatch } from "react-hook-form";

interface IProps {
  name: string;
  label?: string;
  options: IOption[];
  isDisabled?: boolean;
}

interface IOption {
  label: string;
  score: number;
  nonConformanceRequirement?: string;
  nonConformanceType?: string;
  color: string;
}

const DropdownScoringField = ({ name, label, options, isDisabled }: IProps) => {
  const {
    field: { value, onChange },
  } = useController({ name });

  const userNonConformanceRequirement = useWatch({
    name: `${name}.userNonConformanceRequirement`,
  });

  const handleChange = (option: IOption | null) => {
    onChange(
      option && {
        value: Number(option.score),
        nonConformanceRequirement: option.nonConformanceRequirement,
        nonConformanceType: option.nonConformanceType,
        isNonConformance:
          option.nonConformanceRequirement === "not-applicable" ? false : true,
        display: option?.label,
        color: option.color,
        userNonConformanceRequirement,
      },
    );
  };

  return (
    <FormField name={name} label={label}>
      {() => (
        <FormSelect
          name={name}
          options={options}
          value={
            value?.value !== undefined
              ? options.find((o) => o.score == value.value)
              : null
          }
          onChange={handleChange as any}
          getOptionLabel={(option) =>
            options.find((o) => o.score == option.score)?.label ?? ""
          }
          getOptionValue={(option) =>
            options.find((o) => o.score == option.score)?.score?.toString() ??
            ""
          }
          isClearable
          isMulti={false}
          isDisabled={isDisabled}
        />
      )}
    </FormField>
  );
};

export default DropdownScoringField;
