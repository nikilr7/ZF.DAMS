import { Box, FormLabel, Switch } from "@chakra-ui/react";
import { useController, useWatch } from "react-hook-form";
import FormField from "../../forms/Field";
import _ from "lodash";

interface IProps {
  name: string;
  label?: string;
  onConfiguration: {
    color: string;
    text: string;
    score: number;
    nonConformanceRequirement?: "mandatory" | "optional" | "not-applicable";
    nonConformanceType?: string;
  };
  offConfiguration: {
    color: string;
    text: string;
    score: number;
    nonConformanceRequirement?: "mandatory" | "optional" | "not-applicable";
    nonConformanceType?: string;
  };
  isDisabled?: boolean;
}

const SwitchScoringField = (props: IProps) => {
  const { name, label, onConfiguration, offConfiguration, isDisabled } = props;
  const {
    field: { value, onChange },
  } = useController({ name });

  const userNonConformanceRequirement = useWatch({
    name: `${name}.userNonConformanceRequirement`,
  });

  const isChecked = value?.value !== undefined ? value?.value == 1 : undefined;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    const configuration = isChecked ? onConfiguration : offConfiguration;

    onChange({
      value: isChecked ? 1 : 0,
      nonConformanceRequirement:
        configuration.nonConformanceRequirement ?? "not-applicable",
      nonConformanceType: _.isEmpty(configuration.nonConformanceType)
        ? "default"
        : configuration.nonConformanceType,
      isNonConformance:
        (configuration.nonConformanceRequirement ?? "not-applicable") !==
        "not-applicable",
      display: configuration.text,
      color: configuration.color,
      userNonConformanceRequirement,
    });
  };

  return (
    <FormField name={name} label={label}>
      {() => (
        <Box display="flex" px={2} alignItems="center">
          <Switch
            isChecked={isChecked}
            onChange={handleChange}
            sx={{
              "--switch-color": isChecked
                ? onConfiguration.color || "#38A169"
                : offConfiguration.color || "#E53E3E",
              "& .chakra-switch__track": {
                backgroundColor:
                  isChecked !== undefined ? "var(--switch-color)" : "gray.400",
              },
              "& .chakra-switch__thumb": {
                backgroundColor: isChecked !== undefined ? "white" : "gray.300",
              },
            }}
            mr={2}
            isDisabled={isDisabled}
          />
          <FormLabel mt={1}>
            {isChecked !== undefined
              ? isChecked
                ? onConfiguration.text
                : offConfiguration.text
              : "Scoring is Required"}
          </FormLabel>
        </Box>
      )}
    </FormField>
  );
};

export default SwitchScoringField;
