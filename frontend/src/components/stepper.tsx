import React from "react";
import Step from "./Step";

type StepperProps = {
  currentStep: number;
};

const Stepper: React.FC<StepperProps> = ({ currentStep }) => (
  <div>
    <h2 className="sr-only">Steps</h2>
    <div className="after:mt-4 after:block after:h-1 after:w-full after:rounded-lg after:bg-gray-200">
      <ol className="grid grid-cols-3 text-sm font-medium">
        <Step
          icon={
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              ...
            </svg>
          }
          text="Mint"
          isComplete={currentStep > 1}
        />
        <Step
          icon={
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              ...
            </svg>
          }
          text="Details"
          isComplete={currentStep > 2}
        />
        <Step
          icon={
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              ...
            </svg>
          }
          text="Confirm"
          isComplete={currentStep > 3}
        />
      </ol>
    </div>
  </div>
);

export default Stepper;
