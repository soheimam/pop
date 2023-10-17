import React from "react";

interface StepProps {
  text: string;
  isComplete: boolean;
}

const Step: React.FC<StepProps> = ({ text, isComplete }) => (
  <div
    className={`flex-grow relative text-center ${
      isComplete ? "font-bold" : ""
    }`}
  >
    {text}
    <div
      className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-4/5 rounded-lg ${
        isComplete ? "bg-blue-600" : "bg-gray-200"
      }`}
    ></div>
  </div>
);
export default Step;
