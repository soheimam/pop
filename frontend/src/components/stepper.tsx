import React from "react";
import Step from "./Step";

type StepperProps = {
  currentStep: number;
};

const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  const widthPercentage = `${(currentStep / 3) * 100}%`;
  return (
    <div>
      <h2 className="sr-only">Steps</h2>
      <div className="flex ">
        <Step text="Register Car" isComplete={currentStep > 0} />
        <Step text="Add details" isComplete={currentStep > 1} />
        <Step text="Review" isComplete={currentStep > 2} />
      </div>
    </div>
  );
};

export default Stepper;
