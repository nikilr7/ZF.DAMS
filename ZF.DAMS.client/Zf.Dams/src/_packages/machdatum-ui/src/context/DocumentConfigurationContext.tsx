import { createContext, useContext } from "react";
import { IDocumentConfiguration, IFeatureFlag } from "../hooks/useDocument";

interface IContextProps {
  get(type: string): IDocumentConfiguration;
  types(type: string): { name: string; label: string; color: string }[];
  featureFlags: IFeatureFlag;
  isOnline: boolean;
  isServerReachable: boolean;
  isOfflineMode: boolean;
}

export const ConfigurationContext = createContext<IContextProps>({
  get: () => ({}) as IDocumentConfiguration,
  types: () => [],
  featureFlags: {},
  isOnline: true,
  isServerReachable: false,
  isOfflineMode: false,
});

export const useDocumentContext = () => useContext(ConfigurationContext);
