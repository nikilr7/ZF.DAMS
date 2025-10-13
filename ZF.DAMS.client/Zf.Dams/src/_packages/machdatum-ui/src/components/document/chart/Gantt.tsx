import {
  Box,
  Link,
  IconButton,
  Stack,
  Text,
  Flex,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  VStack,
  Button,
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import { useState } from "react";
import { IPeriod } from "../../datetime";
import { DateTime } from "luxon";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon, InfoIcon } from "lucide-react";
import { getStatusStyles } from "../DocumentStatusTag";
import DataTable from "../../datatable";
import { IDocumentConfiguration } from "../../../hooks/useDocument";

interface IChartProps<T> {
  configuration: IDocumentConfiguration;
  documents: T[];
  onPeriodChange: (period: IPeriod) => void;
  isLoading?: boolean;
  isError?: boolean;
}

const getFiscalYear = (year: number): IPeriod =>
  ({
    start: DateTime.local(year, 4, 1).toISO(),
    end: DateTime.local(year + 1, 3, 31).toISO(),
    name: `${year}-${year + 1}`,
  }) as unknown as IPeriod;

const getMonth = (fields: any, key: string) =>
  fields?.[key] ? DateTime.fromJSDate(fields[key]).toFormat("MMMM") : null;

const renderTag = (bg: string, color: string, text: string) => (
  <Box
    bg={bg}
    color={color}
    h={6}
    borderRadius="base"
    fontSize="13px"
    fontWeight="semibold"
    display="flex"
    justifyContent="center"
    alignItems="center"
    w="full"
    cursor="default"
    isTruncated
  >
    {text}
  </Box>
);

function Gantt<T>({
  configuration,
  documents,
  onPeriodChange,
  isLoading,
  isError,
}: IChartProps<T>) {
  const [year, setYear] = useState(getFiscalYear(new Date().getFullYear() - 1));

  const handleUpdateYear = (offset: number) => {
    setYear((prev) => {
      const newYear = getFiscalYear(
        DateTime.fromISO(prev.start.toString()).year + offset,
      );
      onPeriodChange(newYear);
      return newYear;
    });
  };

  const helper = createColumnHelper<any>();
  const columns: ColumnDef<any, any>[] = [
    helper.display({
      header: "S.No",
      cell: (row) => row.row.index + 1,
      minSize: 3,
      maxSize: 3,
      size: 3,
    }),
    helper.accessor("uniqueNumber", {
      header: "Audit ID",
      cell: (row) => (
        <Link
          as={ReactRouterLink}
          fontSize="sm"
          color="blue.700"
          to={`/Audits/${row.row.id}?documentType=${row.row.original.auditTemplate.type}`}
        >
          {row.getValue()}
        </Link>
      ),
      size: 6,
    }),
    helper.accessor("auditArea", {
      header: "Plant / Area",
      cell: (row) => row.getValue().label,
      size: 17,
    }),
    helper.display({
      header: "Audit Cycle",
      cell: (row) =>
        row.row.original.masterData.find(
          (f: any) => f.name === "fields.audit-cycle",
        )?.masterData?.label,
      size: 8,
    }),
    helper.display({
      header: "Process Activity",
      cell: (row) =>
        row.row.original.masterData.find(
          (f: any) => f.name === "fields.process-activity",
        )?.masterData?.label,
      size: 17,
    }),
    helper.display({
      header: "Team Co-ordination",
      cell: (row) =>
        row.row.original.masterData.find(
          (f: any) => f.name === "fields.team-coordination",
        )?.masterData?.label,
      size: 10,
    }),
    ...[
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
      "January",
      "February",
      "March",
    ].map((month) =>
      helper.accessor(month.toLowerCase(), {
        header: month,
        cell: (row) => {
          const { fields, status } = row.row.original;
          const showScheduleTag = ["schedule-start", "schedule-end"].some(
            (key) => getMonth(fields, key) === month,
          );
          const showAuditTag = [
            "audit-start-time",
            "audit-end-time",
            "schedule-start",
            "schedule-end",
          ].some((key) => getMonth(fields, key) === month);
          return (
            <Flex h="full" flexDirection="column" gap={1}>
              {showScheduleTag && renderTag("blue.400", "white", "Plan")}
              {showAuditTag && status !== "draft"
                ? renderTag(
                    getStatusStyles(status, configuration).bg,
                    getStatusStyles(status, configuration).color,
                    "Actual",
                  )
                : showScheduleTag &&
                  renderTag("neutrals.300", "black.200", "Actual")}
            </Flex>
          );
        },
        size: 4,
      }),
    ),
  ];

  return (
    <Stack w="full" overflowX="auto" h="full">
      <Flex w="full" alignItems="center" justifyContent="space-between">
        <HStack mx="auto" align="center">
          <IconButton
            variant="subtle"
            aria-label="Previous Year"
            icon={<ChevronLeftIcon />}
            onClick={() => handleUpdateYear(-1)}
            color="#626F86"
          />
          <Text fontSize="lg" fontWeight="semibold">{`FY ${year.name}`}</Text>
          <IconButton
            variant="subtle"
            aria-label="Next Year"
            icon={<ChevronRightIcon />}
            onClick={() => handleUpdateYear(1)}
            color="#626F86"
          />
        </HStack>
        <Box id="gantt-info-button">
          <Popover placement="bottom-start" trigger="hover">
            <PopoverTrigger>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<InfoIcon size={14} />}
                fontWeight="normal"
                px={2}
                height="28px"
                aria-label="Show Status Legends"
              >
                Info
              </Button>
            </PopoverTrigger>
            <PopoverContent w="fit-content">
              <PopoverArrow />
              <PopoverBody>
                <VStack align="start" spacing={2}>
                  {configuration?.statuses?.map((status) => (
                    <HStack key={status.name} spacing={2}>
                      <Box
                        w="14px"
                        h="14px"
                        bg={status.color}
                        border="1px solid"
                        borderColor="gray.300"
                      />
                      <Text fontSize="sm">{status.label}</Text>
                    </HStack>
                  ))}
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Box>
      </Flex>
      <Box h="93%">
        <DataTable<any>
          isLoading={isLoading}
          isError={isError}
          data={documents}
          columns={columns}
          stickyCount={3}
          stickyColumnsDirection={"left"}
        />
      </Box>
    </Stack>
  );
}

export default Gantt;
