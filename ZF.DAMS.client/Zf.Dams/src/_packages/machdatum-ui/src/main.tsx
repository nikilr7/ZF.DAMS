import { ChakraProvider, VStack } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import theme from "./theme";
import PeriodSelector from "./components/datetime/PeriodSelector";
import { PeriodParam } from "./components/datetime/utils";
import queryString from "query-string";
import { QueryParamProvider, useQueryParam } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { BrowserRouter } from "react-router-dom";
import { IPeriod } from "./components/datetime";

const shifts = [
  {
    name: "Shift 1",
    startTime: "07:00",
    endTime: "15:00",
  },
  {
    name: "Shift 2",
    startTime: "15:00",
    endTime: "23:00",
  },
  {
    name: "Shift 3",
    startTime: "23:00",
    endTime: "07:00",
  },
];

const App = () => {
  const [period, setPeriod] = useQueryParam<IPeriod | undefined>(
    "dashboard_period",
    PeriodParam,
  );

  return (
    <VStack p={4} height={"120px"}>
      <PeriodSelector
        period={period}
        offset={7 * 60}
        onChange={setPeriod}
        shifts={shifts}
      />
    </VStack>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <QueryParamProvider
          adapter={ReactRouter6Adapter}
          options={{
            searchStringToObject: queryString.parse,
            objectToSearchString: queryString.stringify,
          }}
        >
          <App />
        </QueryParamProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
