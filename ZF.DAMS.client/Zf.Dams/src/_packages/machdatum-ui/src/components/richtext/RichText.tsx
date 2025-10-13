import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Italic from "@tiptap/extension-italic";
import { Text as ChakraText } from "@chakra-ui/react";
import { generateHTML } from "@tiptap/core";
import { useMemo } from "react";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Color from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import HardBreak from "@tiptap/extension-hard-break";

export const generateRichText = (content: any) => {
  return generateHTML(JSON.parse(content), [
    Document,
    Paragraph,
    Text,
    Bold,
    Italic,
    Link,
    Underline,
    Strike,
    TextStyle,
    Color,
    OrderedList,
    ListItem,
    BulletList,
    HardBreak,
  ]);
};

const RichText = ({ content }: any) => {
  const output = useMemo(() => {
    try {
      if (!content) {
        return "";
      }
      return generateHTML(JSON.parse(content), [
        Document,
        Paragraph,
        Text,
        Bold,
        Italic,
        Link,
        Underline,
        Strike,
        TextStyle,
        Color,
        OrderedList,
        ListItem,
        BulletList,
        HardBreak,
      ]);
    } catch (error) {
      console.error("Error parsing JSON content:", error);
      return "";
    }
  }, [content]);

  return (
    <ChakraText
      dangerouslySetInnerHTML={{ __html: output }}
      sx={{
        "& ul, & ol": {
          paddingLeft: "1rem",
        },
        "& a": {
          color: "#000000",
          fontWeight: "bold",
          cursor: "pointer",
          textDecoration: "underline",
          backgroundColor: "#f0f4f6",
        },
        "& a:hover": {
          backgroundColor: "#e7eaed",
        },
      }}
    />
  );
};

export default RichText;
