import { UseControllerProps, useController } from "react-hook-form";
import CodeEditor from "./CodeEditor";

interface IProps {
  language: "javascript" | "sql" | "python" | "yaml" | "json";
  defaultValue?: string;
}

function FormCodeEditor(props: UseControllerProps & IProps) {
  const { defaultValue, language } = props;
  const { field } = useController(props as UseControllerProps);

  return (
    <CodeEditor
      defaultValue={defaultValue}
      language={language}
      value={field.value}
      onChange={field.onChange}
    />
  );
}

export default FormCodeEditor;
