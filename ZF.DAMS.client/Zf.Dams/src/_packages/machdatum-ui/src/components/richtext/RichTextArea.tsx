import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Divider,
  Flex,
  IconButton,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import MenuBar from "./MenuBar";
import "./styles.scss";
import { UseControllerProps, useController } from "react-hook-form";
import { useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface IProps {
  error: any;
  isDisabled: boolean;
  defaultValue?: string;
  size?: "default" | "compact";
}

const RichTextArea = (props: UseControllerProps & IProps) => {
  const { error, isDisabled = false, defaultValue, size = "default" } = props;
  const { field } = useController(props as UseControllerProps);

  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: false,
  });

  const lastContentRef = useRef<string>();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: true,
      }),
      Placeholder.configure({
        placeholder: "Start typing...",
      }),
    ],
    content: field.value ? JSON.parse(field.value) : null,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      const contentStr = JSON.stringify(json);

      if (lastContentRef.current !== contentStr) {
        lastContentRef.current = contentStr;
        field.onChange(contentStr);
      }
    },
    editable: !isDisabled,
  });

  useEffect(() => {
    if (editor) {
      editor.setOptions({
        editable: !isDisabled,
      });
    }
  }, [isDisabled]);

  const handleEditorClick = () => {
    if (editor) {
      editor.commands.focus();
    }
  };

  useEffect(() => {
    if (!editor) return;

    const incoming = field.value ?? defaultValue;
    if (!incoming) return;

    try {
      const parsed = JSON.parse(incoming);
      editor.commands.setContent(parsed);
      lastContentRef.current = incoming;
    } catch (e) {
      console.warn("Invalid content JSON", e);
    }
  }, [editor, field.value, defaultValue]);

  return (
    <Flex
      p={2}
      pt={isOpen ? 0.5 : 2}
      borderWidth={size === "compact" ? "0px" : error ? "1.5px" : "1px"}
      borderColor={error ? "#e34935" : "gray.200"}
      borderRadius={"base"}
      flexDirection="column"
      onClick={handleEditorClick}
      w={"full"}
      boxShadow={error ? "0 0 1 1px #e34935" : "none"}
      fontSize={"sm"}
      minH={isOpen ? "70px" : "46px"}
      position={"relative"}
    >
      <VStack
        gap={0}
        flex={"1 1 auto"}
        alignItems="stretch"
        justifyContent="stretch"
      >
        {isOpen ? (
          <>
            <MenuBar editor={editor} />
            <Divider mb={2} />
          </>
        ) : null}
        <IconButton
          position={"absolute"}
          onClick={onToggle}
          right={2}
          top={0.5}
          p={2}
          variant={"subtle"}
          size={"compact"}
          aria-label={""}
          icon={
            isOpen ? (
              <ChevronUp size="1rem" color="#42526E" strokeWidth="1.33" />
            ) : (
              <ChevronDown size="1rem" color="#42526E" strokeWidth="1.33" />
            )
          }
        />
        <EditorContent editor={editor} style={{ paddingRight: "40px" }} />
      </VStack>
    </Flex>
  );
};

export default RichTextArea;
