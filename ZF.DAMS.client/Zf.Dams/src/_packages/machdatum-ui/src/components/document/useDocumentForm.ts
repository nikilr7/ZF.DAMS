import { UseMutationResult } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { IDocument, IPartialDocument } from "../../hooks/defs";
import { IDocumentConfiguration, ITransition } from "../../hooks/useDocument";
import { IHierarchy } from "../../services/useHierarchy";
import { useACL } from "./DocumentACL";
import { useToast } from "@chakra-ui/react";

export default function useDocumentForm<
  T extends IPartialDocument | IDocument,
>({
  document,
  configuration,
  transitionMutation,
  hierarchy,
  data,
  id,
}: {
  document?: T;
  configuration?: IDocumentConfiguration;
  transitionMutation?: UseMutationResult;
  hierarchy?:
    | IHierarchy
    | { [key: string]: IHierarchy | undefined }
    | undefined;
  data?: { [key: string]: IPartialDocument | undefined };
  id?: string | null | undefined;
}) {
  const { getValues } = useFormContext<T>() || {};
  const [transition, setTransition] = useState<ITransition>();
  const { isPermitted } = useACL();
  const toast = useToast({
    position: "top",
    duration: 1000,
    isClosable: true,
    containerStyle: {
      width: "240px",
      position: "absolute",
      top: "25vh",
      left: "calc(50vw - 120px)",
    },
  });

  const isEditable = useMemo(() => {
    return (
      name: string | undefined = undefined,
      isDisabled: boolean = false,
    ) => {
      if (isDisabled) return false;
      if (!document) return true;
      if (!configuration) return false;
      if (!("status" in document)) return true;

      const status = configuration.statuses?.find(
        (s) => s.name === document?.status,
      );
      if (!status) return false;

      if (name) {
        const fieldPermission =
          status.fieldPermissions?.find(
            (p) => p.field.toLowerCase() === name.toLowerCase(),
          ) ?? status.fieldPermissions?.find((p) => p.field === "*");

        if (!fieldPermission) return false;
        if (fieldPermission.acl.includes("all")) return true;

        return isPermitted(fieldPermission.acl, document, hierarchy, data);
      } else {
        if (status.fieldPermissions?.length === 0) return false;
        if (status.fieldPermissions?.some((p) => p.acl.includes("all")))
          return true;
        return status.fieldPermissions?.some((p) =>
          isPermitted(p.acl, document, hierarchy, data),
        );
      }
    };
  }, [document, configuration, hierarchy, data]);

  const isRequired = useMemo(
    () => (name: string, screenName?: string, isDisplayView?: boolean) => {
      if (!configuration) return false;

      const screen = configuration.screens?.find(({ name }) =>
        name === screenName
          ? screenName
          : id
          ? name === "edit"
          : name === "create",
      );

      return (
        screen?.fields[name]?.required ??
        configuration.fields?.find(
          (f) => f.name === name && (isDisplayView || f.view !== "display"),
        )?.required ??
        false
      );
    },
    [configuration, id],
  );

  const transitions = configuration?.transitions?.filter((t) => {
    if (!document || !("status" in document)) return false;

    if (t.from !== document?.status) return false;
    if (t.acl.includes("all")) return true;

    return isPermitted(t.acl, document, hierarchy, data);
  });

  const handleTransition = (
    transition: ITransition | undefined,
    meta?: { [key: string]: any },
    data?: any,
    params?:
      | {
          onSuccess?: () => void;
          onError?: (error: any) => void;
        }
      | undefined,
  ) => {
    if (!transition) {
      setTransition(undefined);
      return;
    }

    const screen = configuration?.screens?.find(
      (s) => s.name === transition.screen,
    );

    if (
      transition.remarks === "none" &&
      Object.entries(screen?.fields ?? {}).length === 0
    ) {
      transitionMutation?.mutate(
        {
          id: document?.id,
          name: transition.name,
          data: data ?? getValues(),
          remarks: "",
          fields: meta,
        },
        {
          onSuccess: () => {
            toast({
              title: transition.label + " - Successful",
              status: "success",
            });

            setTransition(undefined);
            params?.onSuccess?.();
          },
          onError: () => {
            toast({
              title: transition.label + " - Error",
              status: "error",
            });
          },
        },
      );
    } else {
      setTransition(transition);
    }
  };

  const isDeleteAllowed =
    configuration?.statuses?.find(
      (status) => status.name === (document as any)?.status,
    )?.category === "todo";

  return {
    isEditable,
    transitions,
    transition,
    handleTransition,
    isRequired,
    isDeleteAllowed,
  };
}
