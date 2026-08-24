import React from "react";
import { Outlet } from "react-router-dom";
import { CreateRequestProvider } from "../context/CreateRequestContext";

export default function CreateRequestLayout() {
  return (
    <CreateRequestProvider>
      <Outlet />
    </CreateRequestProvider>
  );
}
