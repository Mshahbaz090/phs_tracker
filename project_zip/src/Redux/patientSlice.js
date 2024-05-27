import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    addPatient: (state, action) => {
      // Add a new patient to the state
      return [...state, action.payload];
    },
    removePatient: () => {
      // Clear all patients from the state
      return initialState;
    },
  },
});

export const { addPatient, removePatient } = patientSlice.actions;
export default patientSlice.reducer;
