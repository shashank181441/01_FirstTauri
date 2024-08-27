import { Delete } from 'lucide-react';
import React from 'react';

function KeypadModal({ inputValue, onInputChange, onClose, className }) {
  const handleButtonClick = (number) => {
    if (number === '') return;
    onInputChange(inputValue + number);
  };

  const handleDelete = () => {
    onInputChange(inputValue.slice(0, -1));
  };

  return (
    <div
      id="keypadModal"
      className={`fixed inset-x-0 bottom-0 bg-white p-6 rounded-t-lg shadow-lg transform transition-transform duration-300 ${
        className
      }`}
      style={{ transform: className === 'show' ? 'translateY(0)' : 'translateY(100%)' }}
    >
      <div className="w-80 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Keypad</h3>
          <div id="closeKeypad" className="text-red-500 cursor-pointer" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <input
          id="inputBar"
          type="text"
          value={inputValue}
          readOnly
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div id="keypadContainer" className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0].map((num) =>
            num !== '' ? (
              <button
                key={num}
                className="bg-blue-500 text-white py-2 px-4 rounded-full text-xl h-16 w-16 flex items-center justify-center"
                onClick={() => handleButtonClick(num.toString())}
              >
                {num}
              </button>
            ) : (
              <div key={num} className="invisible"></div>
            )
          )}
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-full text-xl h-16 w-16 flex items-center justify-center"
            onClick={handleDelete}
          >
            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7H5M12 7v10M9 10h6M12 10v10M9 10h6" />
            </svg> */}
            <Delete/>
          </button>
        </div>
      </div>
    </div>
  );
}

export default KeypadModal;
