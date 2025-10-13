import {
  Box,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IDocumentConfiguration } from "../../hooks/useDocument";

interface IProps {
  view: string | null | undefined;
  configuration: IDocumentConfiguration | undefined;
  isCalendarDisplay: boolean;
}

export default function DocumentViewSelector(props: IProps) {
  const { view, configuration, isCalendarDisplay } = props;
  const navigate = useNavigate();

  const tableView =
    !isCalendarDisplay &&
    configuration?.tableViews?.find((tview) => tview.name === view);

  const calendarView = isCalendarDisplay && configuration?.calendarView;

  return (
    <Menu>
      {tableView ? (
        <>
          <MenuButton>
            <Heading variant={"H700"}>
              <Flex alignItems={"center"} gap={1}>
                <Box as={"label"}>{tableView?.label}</Box>
                <Box marginTop={2}>
                  <ChevronDown
                    size={"16px"}
                    color="#42526E"
                    strokeWidth="1.33"
                  />
                </Box>
              </Flex>
            </Heading>
          </MenuButton>
          <MenuList zIndex={2}>
            {configuration?.tableViews?.map((view) => (
              <MenuItem
                fontSize={"sm"}
                key={view.name}
                onClick={() => {
                  navigate(`?view=${view.name}`);
                }}
              >
                {view.label}
              </MenuItem>
            ))}
          </MenuList>
        </>
      ) : calendarView ? (
        <Heading variant={"H700"}>
          <Box as={"label"}>{calendarView?.label}</Box>
        </Heading>
      ) : (
        <Heading variant={"H700"}>
          <Box as={"label"}>{configuration?.label}</Box>
        </Heading>
      )}
    </Menu>
  );
}
