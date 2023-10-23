import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: any) => void;
  onEndDateChange: (date: any) => void;
}

export const DateRangePickerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  gap: 16px;
  color: black;
`;

export const StyledDatePicker = styled(DatePicker)`
  border: 1px solid black;
  border-radius: 0.7rem;
  text-align: center;
  padding: 8px;
  font-size: 16px;
  outline: none;
  background-color: white;
  cursor: pointer;
  color: black;
  &:focus {
    border: 1px solid #00c8c594;
    border-color: #00000000;
    box-shadow: 0 0 10px white;
  }
`;

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <DateRangePickerWrapper>
      <StyledDatePicker
        selected={startDate}
        onChange={(date) => onStartDateChange(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        placeholderText="Pick-Up Date"
        dateFormat="dd/MM/yyyy"
        minDate={new Date()}
        maxDate={new Date(new Date().setDate(new Date().getDate() ))}
      />
      <StyledDatePicker
        selected={endDate}
        onChange={(date) => onEndDateChange(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        placeholderText="Return Date"
        dateFormat="dd/MM/yyyy"
        maxDate={new Date(new Date().setDate(new Date().getDate() + 10))}
        minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
      />
    </DateRangePickerWrapper>
  );
};

export default DateRangePicker;
