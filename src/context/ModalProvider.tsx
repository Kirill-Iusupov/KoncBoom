"use client";
import clsx from "clsx";
import React, { createContext, useContext, useState } from "react";

type ModalContextType = {
  openModal: (content: any, search?: boolean) => void;
  closeModal: () => void;
};

type ModalProviderProps = {
  children: React.ReactNode;
};

const SnackbarContext = createContext<ModalContextType | undefined>(undefined);

const initialState = {
  isOpen: false,
  content: null,
};

const ModalProvider = (props: ModalProviderProps) => {
  const [state, setState] = useState<any>(initialState);

  const openModal = (content: any) => {
    setState({ isOpen: true, content });
  };

  const closeModal = () => {
    setState((prev: any) => ({ ...prev, isOpen: false }));
  };

  return (
    <SnackbarContext.Provider value={{ openModal, closeModal }}>
      <div
        style={ { zIndex: 60 , backdropFilter: "blur(10px)"}}
        className={clsx(
          `z-40 w-full fixed inset-0 items-center justify-center flex `,
          { " hidden ": !state.isOpen }
        )}
      >
        <div className="relative inset-0 container items-center justify-center flex">
          {state.content}
        </div>
      </div>
      {props.children}
    </SnackbarContext.Provider>
  );
};

export default ModalProvider;

export const useModal = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a ModalProvider");
  }
  return context;
};
