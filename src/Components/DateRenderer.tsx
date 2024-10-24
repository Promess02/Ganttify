import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDateToYYYYMMDD } from '../Util/UtilFunctions.tsx';
import DatePickerModal from './DatePickerModal.tsx';

const DateCellRenderer = ({ row, column, onDateChange, updateRowData }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const givenDate = new Date(row[column.key]);
    const initialDate = isNaN(new Date(row[column.key]?.toString()).getTime()) ? new Date() : givenDate; // check if string can be parsed to date else assign current system date
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(initialDate);

  const handleButtonClick = () => {
    setShowDatePicker(true);
    setIsModalOpen(true);
  };

  const handleDateChange = (date) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
    const formattedDate = formatDateToYYYYMMDD(date);
    setSelectedDate(date);
    setIsModalOpen(false);
    setShowDatePicker(false);
    onDateChange(row, column, formattedDate, updateRowData);
    } else {
      const currentDate = new Date();
      const formattedDate = formatDateToYYYYMMDD(currentDate);
      onDateChange(row, column, formattedDate, updateRowData);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ marginRight: '2px' }}>{formatDateToYYYYMMDD(selectedDate)}</span>
      <button onClick={handleButtonClick} style={{ marginLeft: '2px' }}>^</button>
      {showDatePicker && (
        <DatePickerModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          onClickOutside={() => setShowDatePicker(false)}
        />
      )}
    </div>
  );
};

export default DateCellRenderer;