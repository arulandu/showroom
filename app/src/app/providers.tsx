"use client";

import { Provider as JotaiProvider } from "jotai";

type Props = {
  children?: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
  return (
    <JotaiProvider>
      {children}
    </JotaiProvider>
  );
};
