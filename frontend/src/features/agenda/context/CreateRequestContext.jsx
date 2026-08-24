import React, { createContext, useContext, useState } from "react";

const CreateRequestContext = createContext();

export function CreateRequestProvider({ children }) {
  const [requestData, setRequestData] = useState({
    category: "",
    title: "",
    description: "",
    age: "",
    isEmergency: "",
    hasMaterials: "",
    date: "",
    time: "",
    address: "",
    apartment: "",
    zipCode: "",
    additionalDetails: "",
    photos: []
  });

  const updateRequestData = (newData) => {
    setRequestData((prev) => ({ ...prev, ...newData }));
  };

  const clearRequestData = () => {
    setRequestData({
      category: "",
      title: "",
      description: "",
      age: "",
      isEmergency: "",
      hasMaterials: "",
      date: "",
      time: "",
      address: "",
      apartment: "",
      zipCode: "",
      additionalDetails: "",
      photos: []
    });
  };

  return (
    <CreateRequestContext.Provider value={{ requestData, updateRequestData, clearRequestData }}>
      {children}
    </CreateRequestContext.Provider>
  );
}

export function useCreateRequest() {
  const context = useContext(CreateRequestContext);
  if (!context) {
    throw new Error("useCreateRequest must be used within a CreateRequestProvider");
  }
  return context;
}
