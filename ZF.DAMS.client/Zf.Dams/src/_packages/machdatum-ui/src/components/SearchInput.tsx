import { useEffect, useState } from "react";
import { Info, Search, X } from "lucide-react";
import {
  Box,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import { StringParam, useQueryParam } from "use-query-params";
import { useDebounce } from "use-debounce";

export default function SearchInput({
  onSearch,
  id,
  searchHint,
}: {
  onSearch(value: string | undefined): void;
  id?: string;
  searchHint?: string;
}) {
  const [search, setSearch] = useQueryParam<string | null | undefined>(
    "search" + (id ?? ""),
    StringParam,
  );
  console.log(search);

  const [debouncedSearch] = useDebounce<string | null | undefined>(search, 500);

  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setIsPending(search !== debouncedSearch);
  }, [search, debouncedSearch]);

  useEffect(() => {
    onSearch(
      debouncedSearch && debouncedSearch.trim().length > 0
        ? debouncedSearch
        : undefined,
    );
  }, [debouncedSearch]);

  return (
    <Box>
      <InputGroup size="compact">
        <InputLeftElement pointerEvents="none">
          {isPending ? (
            <Spinner size="xs" color="gray.500" thickness="2px" speed="0.6s" />
          ) : (
            <Search size="1rem" color="#42526E" strokeWidth="1.33" />
          )}
        </InputLeftElement>
        <Input
          placeholder="Search"
          aria-label="Search"
          value={search ?? ""}
          onChange={(event) => setSearch(event.target.value || null)}
          onKeyUp={(event) => {
            if (event.key === "Enter") {
              const value = event.currentTarget.value;
              setSearch(value || null);
              onSearch(value || undefined);
            }
          }}
        />
        <InputRightElement width="fit-content">
          <HStack spacing="1" alignItems={"center"}>
            {search && (
              <Box cursor="pointer" px={searchHint ? "1" : "2"}>
                <X
                  size={"16px"}
                  color="#626F86"
                  strokeWidth="1.33"
                  cursor={"pointer"}
                  onClick={() => {
                    setSearch(null);
                  }}
                />
              </Box>
            )}
            {searchHint && (
              <Tooltip
                label={searchHint}
                top={"-5px"}
                right={"5px"}
                bg={"#44546f"}
                hasArrow
                placement="top"
                fontSize={"xs"}
              >
                <Box cursor="pointer" pr="2">
                  <Info size="16px" color="#626F86" strokeWidth="1.25" />
                </Box>
              </Tooltip>
            )}
          </HStack>
        </InputRightElement>
      </InputGroup>
    </Box>
  );
}
