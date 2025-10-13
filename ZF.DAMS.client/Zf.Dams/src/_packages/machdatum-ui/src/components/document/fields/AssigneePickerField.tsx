import { useController } from "react-hook-form";
import FormField from "../../../components/forms/Field";
import { Box } from "@chakra-ui/react";
import { IAssignee, IDocumentAssignee } from "../../../hooks/defs";
import { useGroups } from "../../../services/useGroup";
import { useUsers } from "../../../services/useUser";
import { useUserRoles } from "../../../services/useUserRole";
import FormSelect from "../../select/FormSelect";
import { IInputField } from "../../../hooks/useDocument";
import { memo } from "react";

export interface IFieldProps {
  field: IInputField;
  root?: string;
  isEditable?: boolean;
  isMulti?: boolean;
  parentField?: IInputField;
  size?: "compact" | "default";
  isRequired?: boolean;
}

interface IFormProps {
  value: any;
  onChange: any;
  error: any;
}

export const AssigneePickerField = (props: IFieldProps) => {
  const { root } = props;

  const location = root ? `${root}.assignees` : "assignees";
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name: location as any });

  return (
    <MemoAssigneePickerField
      {...props}
      value={value}
      onChange={onChange}
      error={error}
    />
  );
};

const MemoAssigneePickerField = memo((props: IFieldProps & IFormProps) => {
  const { field, isEditable, value, onChange, error, isRequired } = props;
  const { label, name } = field;

  const { entities: groups } = useGroups();
  const { entities: userRoles } = useUserRoles();
  const { entities: users } = useUsers<any>();

  const assignee: IAssignee = value?.find(
    (x: IDocumentAssignee) => x.name === name,
  )?.assignee;

  const assigneeOptions = [
    {
      label: "Groups",
      options:
        groups.data?.map((group) => ({
          type: "group",
          label: group.label,
          value: group.id,
        })) || [],
    },
    {
      label: "User Roles",
      options:
        userRoles.data?.map((role) => ({
          type: "userRole",
          label: role.label,
          value: role.id,
        })) || [],
    },
    {
      label: "Users",
      options:
        users.data?.map((user) => ({
          type: "user",
          label:
            (user?.displayName ?? "") + (user?.email ? ` (${user.email})` : ""),
          value: user.id,
        })) || [],
    },
  ];

  let data: { label: string; value: string }[] = [];

  if (assignee) {
    if (assignee.groups)
      data = data.concat(
        assigneeOptions[0].options.filter((o) =>
          assignee.groups.find((g) => g.id === o.value),
        ) ?? [],
      );
    if (assignee.userRoles)
      data = data.concat(
        assigneeOptions[1].options.filter((o) =>
          assignee.userRoles.find((g) => g.id === o.value),
        ) ?? [],
      );
    if (assignee.users)
      data = data.concat(
        assigneeOptions[2].options.filter((o) =>
          assignee.users.find((g) => g.id === o.value),
        ) ?? [],
      );
  }

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

    const assignees: IDocumentAssignee[] = value ?? [];
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

    onChange(assignees);
  };

  return (
    <FormField
      name={name}
      label={label}
      defaultError={(error as any)?.fields?.[name.split(".")[1]]}
      isRequired={isRequired}
    >
      {(register) => (
        <FormSelect
          name={register.name}
          value={data as any} //TODO Define the correct type for value
          options={assigneeOptions}
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
});
