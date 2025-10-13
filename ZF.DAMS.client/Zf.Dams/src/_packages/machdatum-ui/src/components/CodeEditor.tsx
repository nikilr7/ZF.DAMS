import { Box } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import { useEffect, useRef } from "react";

//TODO The validation for YAML is not supported and will required monaco-yaml to be installed
//we can't enable that with Webpack 5 but we can do that with Vita which will be used in later stages
interface IProps {
  language: "javascript" | "sql" | "python" | "yaml" | "json";
  defaultValue?: string;
  value: string;
  onChange(value: string | undefined): void;
  readOnly?: boolean;
  path?: string;
}

function CodeEditor(props: IProps) {
  const {
    language,
    value,
    defaultValue,
    onChange,
    path = "configuration",
    readOnly = false,
  } = props;
  const editorRef = useRef<any>(null);

  useEffect(() => {
    editorRef.current?.focus();
  }, [value]);

  return (
    <Box h="full">
      <Editor
        height={"100%"}
        defaultValue={defaultValue}
        value={value}
        path={path}
        onChange={onChange}
        language={language}
        options={{
          scrollBeyondLastLine: false,
          scrollBeyondLastColumn: 0,
          minimap: { enabled: false },
          fontSize: 13,
          wordWrap: "bounded",
          readOnly: readOnly,
        }}
        onMount={(editor) => {
          editor.setValue((value || defaultValue) ?? "");
          editorRef.current = editor;
        }}
      />
    </Box>
  );
}

export default CodeEditor;
