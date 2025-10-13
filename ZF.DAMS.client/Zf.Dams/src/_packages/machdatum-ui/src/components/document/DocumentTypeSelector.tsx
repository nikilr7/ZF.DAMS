import { Button, Flex } from "@chakra-ui/react";
import Form, { IFormProps, withForm } from "../../components/forms";
import { useFormContext } from "react-hook-form";
import { ZodType, z } from "zod";
import FormSelect from "../select/FormSelect";

type T = any;
const Field = Form.Field<T>;

const schema: ZodType<T> = z.object({
  type: z.string({
    required_error: "Type is required",
  }),
});

interface IProps {
  types: { name: string; label: string }[];
  label: string | undefined;
  onSubmit: (selectedType: string) => void;
}

function DocumentTypeSelector({
  label,
  types,
  Wrapper,
  onSubmit,
}: IFormProps & IProps) {
  const { watch } = useFormContext<T>();

  return (
    <Wrapper title={`Select ${label}`} footer={() => <></>}>
      <Form<T>>
        <Field name={"type"} isRequired>
          {(register) =>
            types.length <= 8 ? (
              <Flex wrap="wrap" justify="start" gap={4}>
                {types.map((type) => (
                  <Button
                    minWidth="120px"
                    size="md"
                    key={type.name}
                    onClick={() => {
                      onSubmit(type.name);
                    }}
                    variant={watch("type") === type.name ? "solid" : "outline"}
                  >
                    {type.label}
                  </Button>
                ))}
              </Flex>
            ) : (
              <FormSelect
                name={register.name}
                isClearable
                options={types}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.name}
                onChange={(selectedOption: any) =>
                  selectedOption && onSubmit(selectedOption.name)
                }
              />
            )
          }
        </Field>
      </Form>
    </Wrapper>
  );
}

export default withForm<T, IProps>(DocumentTypeSelector, schema);
