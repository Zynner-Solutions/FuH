"use client";

import { SnackbarProvider as NotistackProvider } from "notistack";

type Props = {
  children: React.ReactNode;
};

const SnackbarProvider = ({ children }: Props) => {
  return (
    <NotistackProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={3000}
    >
      {children}
    </NotistackProvider>
  );
};

export default SnackbarProvider;
