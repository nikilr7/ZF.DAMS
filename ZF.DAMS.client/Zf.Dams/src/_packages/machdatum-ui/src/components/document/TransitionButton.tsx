import { Button, IconButton, Stack, Text, Tooltip } from "@chakra-ui/react";
import { icons } from "lucide-react";
import { ITransition } from "../../hooks/useDocument";

interface IProps {
  transition: ITransition;
  size?: "compact" | "default" | "icon";
  onClick(): void;
  isTableTransition?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  isInverse?: boolean;
}

const TransitionButton = (props: IProps) => {
  const {
    transition,
    onClick,
    isLoading,
    size = "default",
    isDisabled = false,
    isInverse = false,
  } = props;
  const { icon, label, color } = transition;
  const LucideIcon = (icons as any)[icon ?? ""];

  return (
    <>
      {size === "icon" ? (
        <Tooltip label={label} placement="left" bg={"#44546f"}>
          <IconButton
            variant={"outline"}
            size={"xs"}
            _hover={{ bg: color, color: "white" }}
            icon={
              LucideIcon ? <LucideIcon size="1rem" strokeWidth="2" /> : <></>
            }
            aria-label=""
            color="neutrals.1000"
            onClick={onClick}
            px={2}
            minW={"34px"}
            isLoading={isLoading}
            isDisabled={isDisabled}
          />
        </Tooltip>
      ) : (
        <Stack
          as={Button}
          borderColor={color}
          minH={size === "compact" ? "32px" : "60px"}
          minW={size === "compact" ? "fit-content" : "90px"}
          onClick={onClick}
          variant={"outline"}
          color={isInverse ? "white" : "neutrals.1000"}
          bg={isInverse ? color : "white"}
          display={"flex"}
          flexDirection={size === "compact" ? "row" : "column"}
          _hover={{
            bg: isInverse ? "white" : color,
            color: isInverse ? "neutrals.1000" : "white",
          }}
          isLoading={isLoading}
          isDisabled={isDisabled}
        >
          {LucideIcon && <LucideIcon size="1.25rem" strokeWidth="2" />}
          <Text fontSize={"sm"} fontWeight={"normal"}>
            {label}
          </Text>
        </Stack>
      )}
    </>
  );
};

export default TransitionButton;
