import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { chakra, useMultiStyleConfig } from "@chakra-ui/react";

const StyledCommand = chakra(CommandPrimitive);
const StyledInput = chakra(CommandPrimitive.Input);
const StyledList = chakra(CommandPrimitive.List);
const StyledEmpty = chakra(CommandPrimitive.Empty);
const StyledGroup = chakra(CommandPrimitive.Group);
const StyledSeparator = chakra(CommandPrimitive.Separator);
const StyledItem = chakra(CommandPrimitive.Item);

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, filter, ...props }, ref) => (
  <StyledCommand
    ref={ref}
    display={"flex"}
    h="full"
    w="full"
    flexDir={"column"}
    borderRadius={"base"}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

const CommandInput = React.forwardRef<
  React.ElementRef<typeof StyledInput>,
  React.ComponentPropsWithoutRef<typeof StyledInput>
>(({ className, ...props }, ref) => {
  const styles = useMultiStyleConfig("Input");
  return <StyledInput __css={styles.field} ref={ref} {...props} />;
});
CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <StyledList
    ref={ref}
    maxH={"300px"}
    overflowY={"auto"}
    overflowX={"hidden"}
    {...props}
  />
));

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof StyledEmpty>,
  React.ComponentPropsWithoutRef<typeof StyledEmpty>
>((props, ref) => (
  <StyledEmpty
    ref={ref}
    py={6}
    textAlign={"center"}
    className="py-6 text-center text-sm"
    {...props}
  />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof StyledGroup>,
  React.ComponentPropsWithoutRef<typeof StyledGroup>
>(({ className, ...props }, ref) => (
  <StyledGroup ref={ref} p={1} overflow={"hidden"} {...props} />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof StyledSeparator>,
  React.ComponentPropsWithoutRef<typeof StyledSeparator>
>(({ className, ...props }, ref) => (
  <StyledSeparator ref={ref} h={0.25} bg={"neutrals.200"} {...props} />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof StyledItem>,
  React.ComponentPropsWithoutRef<typeof StyledItem>
>(({ className, ...props }, ref) => (
  <StyledItem
    ref={ref}
    px="2"
    py="1.5"
    display={"flex"}
    alignItems={"center"}
    position={"relative"}
    cursor={"default"}
    userSelect={"none"}
    borderRadius={"base"}
    _hover={{ bg: "gray.100" }}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

export {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandSeparator,
  CommandEmpty,
};
