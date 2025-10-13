import { memo, ReactNode, useEffect, useState } from "react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Skeleton,
  SpaceProps,
} from "@chakra-ui/react";
import {
  FieldError,
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  useFormContext,
  UseFormRegister,
} from "react-hook-form";

interface IFormProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

interface IProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  isRequired?: boolean;
  options?: RegisterOptions<T>;
  children: (register: any) => ReactNode | ReactNode;
  isLoading?: boolean;
  defaultError?: FieldError;
}

function FieldWrapper<T extends FieldValues>(props: IProps<T> & SpaceProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  return <MemoField {...props} register={register} errors={errors} />;
}

const MemoField = memo(Field) as typeof Field;

function Field<T extends FieldValues>(
  props: IProps<T> & IFormProps<T> & SpaceProps,
) {
  const {
    name,
    isRequired,
    label,
    options,
    children,
    isLoading,
    defaultError,
    register,
    errors,
  } = props;
  const [isLoaded, setIsLoaded] = useState(isLoading);

  useEffect(() => {
    setIsLoaded(!isLoading);
  }, [isLoading]);

  let error: any = undefined;
  name.split(".").forEach((n) => {
    if (n.startsWith("[") && n.endsWith("]")) {
      const i = parseInt(n.substring(1, n.length - 1));
      error = error ? error[i] : errors[i];
    } else {
      error = error ? error[n] : errors[n];
    }
  });

  error = error ?? defaultError;

  return (
    <FormControl id={name} isRequired={isRequired} isInvalid={!!error}>
      {label && <FormLabel>{label}</FormLabel>}
      <Skeleton isLoaded={isLoaded}>
        {children({
          ...register(name, { ...options }),
          "data-testid": `${name}-input`,
          error,
        })}
      </Skeleton>
      <FormErrorMessage data-testid={`${name}-error`}>
        {error && (error.message as string)}
      </FormErrorMessage>
    </FormControl>
  );
}

export default FieldWrapper;
