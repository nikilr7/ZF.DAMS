import { DateTime } from "luxon";
import RichText from "../richtext/RichText";
import { FormControl, FormLabel, HStack, Text } from "@chakra-ui/react";
import { IInputField } from "../../hooks/useDocument";
import { IAssignee, IPartialDocument } from "../../hooks/defs";
import ImageViewer from "./ImageViewer";
import DocumentViewer from "./DocumentViewer";
import AssigneeViewer from "../AssigneeViewer";
import { get } from "lodash";

interface IProps {
  field: IInputField;
  document?: IPartialDocument;
  hasLabel?: boolean;
  actions?: React.ReactNode;
  root?: string;
  prefix?: string;
}

export function DocumentFieldView(props: IProps) {
  const { hasLabel, field, document, actions, root, prefix } = props;

  let name = prefix ? `${prefix}.${field.name}` : field.name;
  name = root ? `${root}.${name}` : name;

  const content = get(document?.fields, name);

  const view = () => {
    switch (field.type) {
      case "rich-text":
        return <RichText content={content} />;
      case "text":
      case "number":
        return <Text>{content}</Text>;
      case "date-time":
        return (
          <Text>
            {content
              ? DateTime.fromJSDate(new Date(content)).toFormat(
                  "dd MMM yy HH:mm",
                )
              : null}
          </Text>
        );
      case "date":
        return (
          <Text>
            {content
              ? DateTime.fromJSDate(new Date(content)).toFormat("dd MMM yy")
              : null}
          </Text>
        );
      case "enum":
        return <Text>{content?.label ?? content}</Text>;
      case "master-single":
      case "master-multi":
        const values = document?.masterData
          ?.filter((x) => x.name === `fields.${name}`)
          ?.map((x) => x.masterData.label ?? "");
        return <Text>{values?.join(", ")}</Text>;
      case "single-select":
        return <Text>{content?.name ?? content}</Text>;
      case "image-single":
      case "image-multi":
        return <ImageViewer attachments={document?.attachments} name={name} />;
      case "assignee": {
        const assignee = document?.assignees?.find(
          (x: any) => x.name === `fields.${name}`,
        )?.assignee as IAssignee;

        return <AssigneeViewer assignee={assignee} />;
      }
      case "attachment":
        return (
          <DocumentViewer attachments={document?.attachments} name={name} />
        );
      case "switch":
        return <Text>{content ? "True" : "False"}</Text>;
    }
  };

  return hasLabel ? (
    <FormControl mt={2}>
      <HStack>
        <FormLabel>{field.label}</FormLabel>
        {actions}
      </HStack>
      {view()}
    </FormControl>
  ) : (
    <>{view()}</>
  );
}
