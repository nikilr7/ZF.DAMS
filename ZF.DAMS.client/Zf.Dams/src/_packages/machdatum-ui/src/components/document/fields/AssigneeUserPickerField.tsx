import { useFormContext, useWatch } from "react-hook-form";
import FormField from "../../../components/forms/Field";
import { Box } from "@chakra-ui/react";
import { IFieldProps, IAssignee, IDocumentAssignee } from "../../../hooks/defs";
import FormSelect from "../../select/FormSelect";
import { IHierarchy } from "../../../services/useHierarchy";
import { getHierarchyUserRoleUsers } from "../DocumentACL";
import { uniqBy } from "lodash";
import { useUsers } from "../../../services/useUser";

interface IProps {
  hierarchy: IHierarchy | undefined;
  assignee: IAssignee | undefined;
}

export function AssigneeUserPickerField({
  field,
  isEditable,
  hierarchy,
  assignee: assigneeOptions,
}: IFieldProps & IProps) {
  const { name, label } = field;

  const { entities: users } = useUsers<any>();
  const { setValue, getValues } = useFormContext();
  const assignee: IAssignee = useWatch({ name: "assignees" })?.find(
    (x: IDocumentAssignee) => x.name === name,
  )?.assignee;

  let value: { label: string; value: string }[] = [];

  const options = [
    {
      label: "Users",
      options:
        users.data?.map((user) => ({
          type: "user",
          label: user.displayName ?? "",
          value: user.id,
        })) || [],
    },
  ];

  if (assignee) {
    if (assignee.users)
      value = value.concat(
        options[0].options.filter((o) =>
          assignee.users.find((g) => g.id === o.value),
        ) ?? [],
      );
  }

  const groupUsers =
    assigneeOptions?.groups?.flatMap((g) => g?.members as any[]) ?? [];

  const userRolesUsers =
    assigneeOptions?.userRoles?.reduce((users: any[], ur) => {
      if (!hierarchy) return [];
      users = getHierarchyUserRoleUsers(hierarchy, ur);
      return [...users];
    }, []) ?? [];

  const usersAssignee: IAssignee = {
    id: assigneeOptions?.id ?? "",
    users: uniqBy(
      [...groupUsers, ...userRolesUsers, ...(assigneeOptions?.users ?? [])],
      "id",
    ),
    groups: [],
    userRoles: [],
  };
  const auditTemplateAssignee: IAssignee = {
    id: usersAssignee?.id || "",
    userRoles: usersAssignee?.userRoles || [],
    users: usersAssignee?.users || [],
    groups: usersAssignee?.groups || [],
  };

  const AuditTemplateAssigneeOptions = [
    {
      label: "Users",
      options:
        (auditTemplateAssignee?.users?.length > 0 &&
          auditTemplateAssignee.users?.map((user) => ({
            type: "user",
            label:
              (user?.displayName ?? "") +
              (user?.email ? ` (${user.email})` : ""),
            value: user?.id,
          }))) ||
        [],
    },
  ];

  const handleChange = (selected: any) => {
    const groups = selected
      .filter((x: any) => x.type === "group")
      .map((x: any) => ({ id: x.value }));
    const userRoles = selected
      .filter((x: any) => x.type === "userRole")
      .map((x: any) => ({ id: x.value }));
    const users = selected
      .filter((x: any) => x.type === "user")
      .map((x: any) => ({ id: x.value }));

    const assignees: IDocumentAssignee[] = getValues("assignees") ?? [];
    const assignee = assignees.find((x: IDocumentAssignee) => x.name === name)
      ?.assignee;

    if (assignee) {
      assignee.groups = groups;
      assignee.userRoles = userRoles;
      assignee.users = users;
    } else {
      assignees.push({
        name,
        assignee: {
          groups,
          userRoles,
          users,
        } as any,
      });
    }

    setValue("assignees", assignees);
  };

  return (
    <FormField name={name} label={label}>
      {(register) => (
        <FormSelect
          name={register.name}
          value={value}
          options={AuditTemplateAssigneeOptions}
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
          isDisabled={!isEditable}
          onChange={handleChange}
          formatGroupLabel={(data) => (
            <Box
              style={{
                paddingLeft: "5px",
                paddingTop: "5px",
                color: "#8590A2",
              }}
            >
              {data.label}
            </Box>
          )}
          isMulti
        />
      )}
    </FormField>
  );
}
