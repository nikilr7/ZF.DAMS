import {
  Card,
  CardHeader,
  Tab,
  TabList,
  Tabs,
  Heading,
  CardBody,
  CardFooter,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Configuration = (props: { items: string[]; children: any }) => {
  const { items, children } = props;
  const [tabIndex, setTabIndex] = useState(0);

  const navigate = useNavigate();
  const { key } = useParams();

  const handleChange = (index: number) => {
    setTabIndex(index);
    navigate(`/Settings/${items[index]}`);
  };

  useEffect(() => {
    if (!!key) setTabIndex(items.indexOf(key));
  }, [key, items]);

  return (
    <Tabs
      index={tabIndex}
      onChange={handleChange}
      h="full"
      orientation="vertical"
      isLazy
    >
      <TabList w="240px" h="fit-content">
        {items.map((item, index) => (
          <Tab key={index} justifyContent="start">
            {item}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {children.map((child: any, index: number) => (
          <TabPanel key={index}>{child}</TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

const Container = (props: React.PropsWithChildren) => {
  return (
    <Card size={"sm"} borderRadius={"base"} minH={"3xs"} variant={"outline"}>
      {props.children}
    </Card>
  );
};

const Header = (props: React.PropsWithChildren) => {
  return (
    <CardHeader px={4} py={2}>
      <Heading variant={"H400"}>{props.children}</Heading>
    </CardHeader>
  );
};

const Body = (props: React.PropsWithChildren) => {
  return <CardBody>{props.children}</CardBody>;
};

const Footer = (props: React.PropsWithChildren) => {
  return <CardFooter>{props.children}</CardFooter>;
};

Configuration.Card = Container;
Configuration.Header = Header;
Configuration.Body = Body;
Configuration.Footer = Footer;

export default Configuration;
