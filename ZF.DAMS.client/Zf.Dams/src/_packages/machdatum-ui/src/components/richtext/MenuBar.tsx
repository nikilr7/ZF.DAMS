import {
  Box,
  IconButton,
  Flex,
  HStack,
  Menu,
  MenuItem,
  MenuList,
  VStack,
  MenuButton,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Square,
  Text,
} from "@chakra-ui/react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Ellipsis,
  ChevronDown,
  Unlink2,
} from "lucide-react";
import { useCallback, useState } from "react";
import "./styles.scss";

interface IProps {
  editor: any;
}

const MenuBar = ({ editor }: IProps) => {
  const [textColor, setTextColor] = useState<string>("black");
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <HStack mb={0.5} spacing={1}>
      <IconButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        variant={editor.isActive("bold") ? "solid" : "none"}
        icon={<Bold size={"14px"} color="#42526E" strokeWidth="2" />}
        aria-label="bold"
        p={1}
        h={6}
      ></IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        variant={editor.isActive("italic") ? "solid" : "none"}
        icon={<Italic size={"14px"} color="#42526E" strokeWidth="2" />}
        aria-label="italic"
        p={1}
        h={6}
      ></IconButton>
      <Menu
        variant={
          editor.isActive("underline") || editor.isActive("strike")
            ? "solid"
            : "none"
        }
      >
        <MenuButton
          as={IconButton}
          icon={<Ellipsis size={"14px"} color="#42526E" strokeWidth="2" />}
          variant={"none"}
          p={1}
          h={6}
        ></MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            Underline
          </MenuItem>
          <MenuItem onClick={() => editor.chain().focus().toggleStrike().run()}>
            Strikethrough
          </MenuItem>
        </MenuList>
      </Menu>
      <Box h="20px" borderLeft="1px solid" borderLeftColor={"gray.200"} />
      <Popover placement="bottom-end">
        <PopoverTrigger>
          <Button
            rightIcon={
              <ChevronDown size={"14px"} color="#42526E" strokeWidth="2" />
            }
            variant={"none"}
            iconSpacing={1}
            fontWeight={"md"}
            p={1}
            h={6}
          >
            <VStack gap={0}>
              <Text fontWeight={"medium"} color={textColor}>
                A
              </Text>
            </VStack>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverBody>
            <Flex wrap="wrap" gap={1}>
              {colors.map((c) => (
                <Square
                  key={c}
                  border="1px solid neutrals.300"
                  borderRadius={"base"}
                  size="24px"
                  bg={c}
                  cursor={"pointer"}
                  onClick={() => {
                    setTextColor(c);
                    editor.chain().focus().setColor(c).run();
                  }}
                />
              ))}
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <Box h="20px" borderLeft="1px solid" borderLeftColor={"gray.200"} />
      <IconButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        variant={editor.isActive("bulletList") ? "solid" : "none"}
        icon={<List size={"14px"} color="#42526E" strokeWidth="2" />}
        aria-label="bullety-list"
        p={1}
        h={6}
      ></IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        variant={editor.isActive("orderedList") ? "solid" : "none"}
        icon={<ListOrdered size={"14px"} color="#42526E" strokeWidth="2" />}
        aria-label="list"
        p={1}
        h={6}
      ></IconButton>
      <Box h="20px" borderLeft="1px solid" borderLeftColor={"gray.200"} />
      <IconButton
        onClick={() => setLink()}
        variant={editor.isActive("link") ? "solid" : "none"}
        icon={<Unlink2 size={"14px"} color="#42526E" strokeWidth="2" />}
        aria-label="Unlink2"
        p={1}
        h={6}
      ></IconButton>
    </HStack>
  );
};

export default MenuBar;

const colors = [
  "#172B4D",
  "#6554C0",
  "#403294",
  "#006644",
  "#0747A6",
  "#008DA6",
  "#36B37E",
  "#4C9AFF",
  "#00B8D9",
  "#97A0AF",
  "#FF9914",
  "#FF991F",
  "#BF2600",
  "#FF5630",
  "#FFBDAD",
  "#FFF0B3",
  "#EAE6FF",
  "#B3D4FF",
  "#B3F5FF",
  "#ABF5D1",
];
