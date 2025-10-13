import { useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { DateTime } from "luxon";
import {
  Box,
  chakra,
  HStack,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Select,
  useDisclosure,
  useMultiStyleConfig,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import DateTimePicker from "./DateTimePicker";
import { getRelative, timeOptions } from "./utils";
import { IPeriod, IShift, Range, TimeOption } from "./types";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface IProps {
  period: IPeriod | undefined;
  shifts: IShift[];
  offset?: number;
  loadDefault?: boolean;
  onChange: (period: IPeriod | undefined) => void;
  isDisabled?: boolean;
  view?: (displayPeriod: string) => React.ReactNode;
}

function PeriodSelector(props: IProps) {
  const {
    period,
    shifts,
    offset = 0,
    loadDefault = true,
    onChange,
    isDisabled,
    view,
  } = props;
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [range, setRange] = useState<Range>("daily");

  useEffect(() => {
    if (!period && loadDefault) {
      handlePeriodChange({
        start: DateTime.now().startOf("day"),
        end: DateTime.now().endOf("day"),
        name: "daily",
      });
    }
  }, []);

  useEffect(() => {
    if (!period) return;

    const timeOption = timeOptions.find(
      (option) => option.text === period.name,
    );

    if (timeOption) setRange("relative");
    else if (shifts.map((s) => s.name).includes(period.name ?? ""))
      setRange("shift");
    else if (period.name === "daily") setRange("daily");
    else if (period.name === "weekly") setRange("weekly");
    else if (period.name === "monthly") setRange("monthly");
    else if (period.name === "yearly") setRange("yearly");
    else setRange("custom");
  }, [period]);

  const handlePeriodChange = (period: IPeriod) => {
    let start = DateTime.fromMillis(period.start.toMillis());
    let end = DateTime.fromMillis(period.end.toMillis());

    if (range === "relative") {
      const timeOption = timeOptions.find(
        (option) => option.text === period.name,
      );

      if (timeOption) {
        start = start.plus({ minutes: offset });

        if (timeOption.to !== "now") {
          end = end.plus({ minutes: offset });
        }
      }
    } else if (range !== "shift" && range !== "custom") {
      start = start.plus({ minutes: offset });
      end = end.plus({ minutes: offset });
    }

    onChange({ start, end, name: period.name });
    onClose();
  };

  function handleRelative(option: TimeOption) {
    const relativePeriod = getRelative(option);
    if (!relativePeriod) return;
    setRange("relative");
    handlePeriodChange(relativePeriod);
  }

  const display = () => {
    if (!period) return "Select Date";

    switch (range) {
      case "shift":
        return `${period.name} - ${period.start.toFormat("dd MMM yyyy")}`;
      case "daily":
        return period.start.toFormat("dd MMM yyyy");
      case "weekly":
        return `${period.start.toFormat("dd MMM yyyy")} - ${period.end.toFormat(
          "dd MMM yyyy",
        )}`;
      case "monthly":
        return period.start.toFormat("MMM yyyy");
      case "yearly":
        return period.start.toFormat("yyyy");
      case "relative":
        return period.name;
      default:
        return `${period.start.toFormat(
          "dd MMM yyyy HH:mm",
        )} - ${period.end.toFormat("dd MMM yyyy HH:mm")}`;
    }
  };

  const sections = useMemo(() => _.groupBy(timeOptions, (v) => v.section), []);
  const styles = useMultiStyleConfig("Input");

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!period) return;
    if (range === "daily") {
      const start = period.start.minus({ days: 1 });
      const end = period.end.minus({ days: 1 });
      onChange({ start, end, name: "daily" });
    } else if (range === "weekly") {
      const start = period.start.minus({ weeks: 1 });
      const end = period.end.minus({ weeks: 1 });
      onChange({ start, end, name: "weekly" });
    } else if (range === "monthly") {
      const start = period.start.minus({ months: 1 });
      const end = period.end.minus({ months: 1 });
      onChange({ start, end, name: "monthly" });
    } else if (range === "yearly") {
      const start = period.start.minus({ years: 1 });
      const end = period.end.minus({ years: 1 });
      onChange({ start, end, name: "yearly" });
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!period) return;
    if (range === "daily") {
      const start = period.start.plus({ days: 1 });
      const end = period.end.plus({ days: 1 });
      onChange({ start, end, name: "daily" });
    } else if (range === "weekly") {
      const start = period.start.plus({ weeks: 1 });
      const end = period.end.plus({ weeks: 1 });
      onChange({ start, end, name: "weekly" });
    } else if (range === "monthly") {
      const start = period.start.plus({ months: 1 });
      const end = period.end.plus({ months: 1 });
      onChange({ start, end, name: "monthly" });
    } else if (range === "yearly") {
      const start = period.start.plus({ years: 1 });
      const end = period.end.plus({ years: 1 });
      onChange({ start, end, name: "yearly" });
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  const isMoveable =
    range === "shift" || range === "custom" || range === "relative"
      ? true
      : false;

  return (
    <Popover
      placement="auto-start"
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      closeOnBlur={true}
    >
      <PopoverTrigger>
        {view ? (
          view(display() || "Select Date")
        ) : (
          <Box w="3xs" position={"relative"}>
            <chakra.input
              __css={styles.field}
              w="3xs"
              pr={10}
              minW={"240px"}
              mt={1}
              value={display()}
              disabled={isDisabled}
              overflow={"hidden"}
              textOverflow={"ellipsis"}
            />
            <HStack gap={0} h="full" position={"absolute"} right={0} top={0}>
              <IconButton
                h="32px"
                px={2}
                mt={1}
                variant={"subtle"}
                aria-label="previous"
                onClick={handlePrevious}
                hidden={isMoveable}
                icon={
                  <ChevronLeft
                    size={"16px"}
                    color="#42526E"
                    strokeWidth="1.33"
                  />
                }
              />
              <IconButton
                h="32px"
                px={2}
                mt={1}
                variant={"subtle"}
                aria-label="next"
                onClick={handleNext}
                hidden={isMoveable}
                icon={
                  <ChevronRight
                    size={"16px"}
                    color="#42526E"
                    strokeWidth="1.33"
                  />
                }
              />
              <IconButton
                h="32px"
                px={2}
                mt={1}
                variant={"subtle"}
                aria-label="clear"
                onClick={handleClear}
                icon={<X size={"16px"} color="#42526E" />}
              />
            </HStack>
          </Box>
        )}
      </PopoverTrigger>
      <PopoverContent w="2xl">
        <PopoverBody>
          <HStack alignItems={"flex-start"}>
            <VStack w="12rem" alignItems={"flex-start"}>
              <Select
                value={range}
                onChange={(e) => setRange(e.target.value as Range)}
                placeholder="Select Range"
              >
                <option value="shift">Shift</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="custom">Custom</option>
              </Select>
              <DateTimePicker
                range={range as Range}
                period={period}
                shifts={shifts}
                onChange={handlePeriodChange}
              />
            </VStack>
            <HStack alignItems={"flex-start"} flex={"1 1 auto"}>
              {Object.values(sections).map((section, i) => (
                <Box
                  key={i}
                  px="4"
                  display="flex"
                  flexDirection={"column"}
                  flex="1 1 auto"
                >
                  {section.map((option, j) => (
                    <Link
                      fontSize={"sm"}
                      key={j}
                      onClick={() => handleRelative(option)}
                    >
                      {option.text}
                    </Link>
                  ))}
                </Box>
              ))}
            </HStack>
          </HStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default PeriodSelector;
