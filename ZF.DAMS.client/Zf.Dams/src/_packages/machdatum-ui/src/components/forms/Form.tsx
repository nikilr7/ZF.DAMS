import React, { forwardRef, ReactNode, useEffect } from "react";
import { Box, useDisclosure } from "@chakra-ui/react";
import { ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldValues,
  FormProvider,
  useForm,
  useFormContext,
  useFormState,
} from "react-hook-form";
import Footer from "./Footer";
import Field from "./Field";
import { useBlocker } from "react-router-dom";
import Alert from "../Alert";
import Mousetrap from "mousetrap";

interface IProps<T> {
  data?: T;
  defaultValues?: Partial<T>;
  isLoading?: boolean;
  isNotBlockDirty?: boolean;
  children: ReactNode | ReactNode[];
}

function Form<T extends FieldValues>(props: IProps<T>) {
  const { data, isLoading, defaultValues, children, isNotBlockDirty } = props;
  const { reset, getValues } = useFormContext<T>();
  const { isDirty, dirtyFields, errors } = useFormState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (!isDirty) return false;
    if (isNotBlockDirty) return false;

    const currentLocationTokens = currentLocation.pathname.split("/");
    const nextLocationTokens = nextLocation.pathname.split("/");

    if (currentLocationTokens.length !== nextLocationTokens.length) return true;

    for (let i = 0; i < currentLocationTokens.length; i++) {
      if (currentLocationTokens[i] !== nextLocationTokens[i]) {
        if (currentLocationTokens[i] === "new") continue;
        return true;
      }
    }

    return false;
  });

  useEffect(() => {
    blocker.state === "blocked" && onOpen();
  }, [blocker.state, onOpen]);

  const onLeave = () => {
    onClose();
    blocker?.proceed?.();
  };

  const onCancel = () => {
    onClose();
    blocker?.reset?.();
  };

  useEffect(() => {
    const handleUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) event.preventDefault();
    };

    if (isDirty) {
      window.addEventListener("beforeunload", handleUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [isDirty]);

  useEffect(() => {
    const values: T = {} as T;
    Object.keys(getValues()).forEach((key: keyof T) => {
      values[key] = null as any;
    });
    reset(data ?? { ...values, ...defaultValues });
  }, [data, defaultValues, getValues, reset]);

  useEffect(() => {
    Mousetrap.bind("f e", () => console.log(errors));
    Mousetrap.bind("f d", () => console.log(dirtyFields));
    Mousetrap.bind("f l", () => console.log(getValues()));

    return () => {
      Mousetrap.unbind("f e");
      Mousetrap.unbind("f d");
      Mousetrap.unbind("f l");
    };
  }, [dirtyFields, errors, getValues]);

  return (
    <Box
      w="full"
      as="form"
      role="form"
      data-status={isLoading ? "loading" : "loaded"}
      noValidate
      position={"relative"}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child))
          return React.cloneElement(child, { isLoading } as any);
        return child;
      })}
      <Alert
        isOpen={isOpen}
        onClose={onClose}
        onCancel={onCancel}
        onLeave={onLeave}
      />
    </Box>
  );
}

export function BasicForm<T extends FieldValues>(props: IProps<T>) {
  const { data, isLoading, defaultValues, children } = props;
  const { reset, getValues } = useFormContext<T>();

  useEffect(() => {
    const values: T = {} as T;
    Object.keys(getValues()).forEach((key: keyof T) => {
      values[key] = null as any;
    });
    reset(data ?? { ...values, ...defaultValues }, {
      keepErrors: true,
    });
  }, [data, defaultValues, getValues, reset]);

  return (
    <Box
      w="full"
      h="full"
      as="form"
      role="form"
      data-status={isLoading ? "loading" : "loaded"}
      noValidate
      position={"relative"}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child))
          return React.cloneElement(child, { isLoading } as any);
        return child;
      })}
    </Box>
  );
}

export function withForm<
  T extends FieldValues,
  U = any,
  V extends FieldValues = Omit<T, "id">,
>(Component: React.ComponentType<IFormProps & U>, schema?: ZodType<V>) {
  const Wrapped = forwardRef<any, U>((props, ref) => {
    const methods = useForm<V>({
      resolver: schema ? zodResolver(schema) : undefined,
    });

    return (
      <FormProvider {...methods}>
        <Component {...(props as any)} ref={ref} />
      </FormProvider>
    );
  });

  Wrapped.displayName = `withForm(${Component.displayName || Component.name})`;

  return Wrapped;
}

export type IFormProps<T = unknown> = T & {
  Wrapper: React.ComponentType<IFormWrapper>;
  isOpen?: boolean;
  onClose?(state?: any): void;
};

export interface IFormWrapper {
  title: string | React.ReactNode;
  description?: string;
  footer(direction: "rtl" | "ltr"): ReactNode;
  children: ReactNode;
  isLoading?: boolean;
  checkDirty?: boolean;
}

Form.Field = Field;
Form.Footer = Footer;

export default Form;
