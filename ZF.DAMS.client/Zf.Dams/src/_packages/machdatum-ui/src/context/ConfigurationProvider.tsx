import { ReactNode, createContext, useMemo } from "react";
import useConfiguration, {
  ITimeConfiguration,
} from "../services/useConfiguration";

interface IContextProps {
  time?: ITimeConfiguration;
}

export const ConfigurationContext = createContext<IContextProps>({});

function ConfigurationProvider(props: { children: ReactNode }) {
  const { configuration } = useConfiguration<ITimeConfiguration>("time");

  const value = useMemo(
    () => ({
      time: configuration.data,
    }),
    [configuration.data],
  );

  return (
    <ConfigurationContext.Provider value={value}>
      {props.children}
    </ConfigurationContext.Provider>
  );
}

export default ConfigurationProvider;
