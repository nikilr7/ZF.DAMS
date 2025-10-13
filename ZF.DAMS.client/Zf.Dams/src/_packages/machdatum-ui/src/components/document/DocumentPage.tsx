import { StringParam, useQueryParam } from "use-query-params";
import { Box, Button, ButtonGroup, Flex, HStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import DocumentTable, { IDocumentTableProps } from "./DocumentTable";
import { useDocumentContext } from "../../context/DocumentConfigurationContext";
import { IDocument, IPartialDocument } from "../../hooks/defs";
import Page from "../Page";
import DocumentViewSelector from "./DocumentViewSelector";
import DocumentCalendar, { IDocumentCalendarProps } from "./DocumentCalendar";
import DocumentChart from "./DocumentChart";
import SearchInput from "../SearchInput";

interface IProps<T> extends IDocumentTableProps<T>, IDocumentCalendarProps<T> {
  onAdd?: (id?: string) => void;
  isPartialDocument?: boolean;
  isCalenderView?: boolean;
  actions?: React.ReactNode;
  onRenderOfflineData?: React.ReactNode;
  addActionLabel?: string;
  isChartView?: boolean;
  chartLabel?: string;
  isOfflineMode?: boolean;
  isDisplayViewHidden?: boolean;
  searchHint?: string;
}

function DocumentPage<T extends IPartialDocument | IDocument>(
  props: IProps<T>,
) {
  const {
    type,
    onAdd,
    isCalenderView,
    actions,
    onRenderOfflineData,
    addActionLabel,
    isChartView,
    chartLabel,
    isOfflineMode = false,
    isDisplayViewHidden = false,
    searchHint,
  } = props;

  const configuration = useDocumentContext().get(type);

  const [view, setView] = useQueryParam("view", StringParam);
  const [display, setDisplay] = useQueryParam("display", StringParam);
  const [search, setSearch] = useState<string | undefined>();

  useEffect(() => {
    if (!view) setView(configuration?.tableViews?.[0]?.name);
  }, [view, configuration?.tableViews, display]);

  useEffect(() => {
    if (display !== "calendar" && display !== "chart") {
      setDisplay("table");
    }
  }, [display]);

  return (
    <Page
      title={
        <DocumentViewSelector
          view={view}
          configuration={configuration}
          isCalendarDisplay={display === "calendar" || display === "chart"}
        />
      }
      breadcrumbs={[configuration?.label]}
      tos={[configuration ? configuration.label.replace(/\s+/g, "") : ""]}
      actions={
        isOfflineMode ? null : (
          <HStack id="document-page-actions">
            {!isDisplayViewHidden && (isCalenderView || isChartView) && (
              <ButtonGroup size="sm" isAttached>
                <Button
                  variant={display === "table" ? "solid" : "outline"}
                  onClick={() => setDisplay("table")}
                >
                  Table
                </Button>
                {isCalenderView && (
                  <Button
                    variant={display === "calendar" ? "solid" : "outline"}
                    onClick={() => setDisplay("calendar")}
                  >
                    Calendar
                  </Button>
                )}
                {isChartView && (
                  <Button
                    variant={display === "chart" ? "solid" : "outline"}
                    onClick={() => setDisplay("chart")}
                  >
                    {chartLabel ?? "Chart"}
                  </Button>
                )}
              </ButtonGroup>
            )}
            {display !== "chart" && (
              <SearchInput onSearch={setSearch} searchHint={searchHint} />
            )}
            {onAdd && (
              <Button
                leftIcon={<Plus size={"1.125rem"} />}
                onClick={() => onAdd(undefined)}
              >
                {addActionLabel ?? "Add"}
              </Button>
            )}
            {actions}
          </HStack>
        )
      }
    >
      <Flex
        gap={4}
        display={"flex"}
        h={"full"}
        alignItems={"flex-start"}
        direction="column"
        overflow={"hidden"}
      >
        {display === "calendar" ? (
          <DocumentCalendar<T> {...props} />
        ) : display === "chart" ? (
          <DocumentChart<T> {...props} />
        ) : (
          <Box
            display={"flex"}
            flexDirection={"column"}
            w={"full"}
            h={"full"}
            gap={2}
          >
            <DocumentTable<T> {...props} search={search} />
            {onRenderOfflineData}
          </Box>
        )}
      </Flex>
    </Page>
  );
}

export default DocumentPage;
