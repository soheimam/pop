import React from "react";

interface StepProps {
  icon: React.ReactNode;
  text: string;
  isComplete: boolean;
}

const Step: React.FC<StepProps> = ({ icon, text, isComplete }) => (
  <li
    className={`relative flex ${
      isComplete ? "text-blue-600" : "text-gray-600"
    }`}
  >
    <span
      className={`absolute -bottom-[1.75rem] ${
        isComplete ? "bg-blue-600" : "bg-gray-600"
      } text-white rounded-full`}
    >
      {icon}
    </span>
    <span
      className={` ${
        isComplete ? "text-blue-600" : "text-gray-600"
      }  hidden sm:block`}
    >
      {text}
    </span>
  </li>
);
export default Step;
