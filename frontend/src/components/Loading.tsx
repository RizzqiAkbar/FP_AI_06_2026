import { useState, useEffect } from 'react';

export default function Loading() {
  const steps = [
    "Uploading Image...",
    "Reading Nutrition Facts...",
    "Analyzing Ingredients...",
    "Generating Recommendations..."
  ];
  
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2500); // Change step every 2.5 seconds
    
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-green-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute top-2 left-2 w-20 h-20 border-4 border-emerald-100 rounded-full"></div>
        <div className="absolute top-2 left-2 w-20 h-20 border-4 border-emerald-400 rounded-full border-b-transparent animate-spin-reverse" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 mb-2">AI is Processing</h3>
      
      <div className="h-8 flex items-center justify-center overflow-hidden">
        <p key={currentStep} className="text-green-600 font-medium text-lg animate-fade-in-up">
          {steps[currentStep]}
        </p>
      </div>
      
      <div className="w-64 bg-gray-100 rounded-full h-2 mt-6 overflow-hidden">
        <div 
          className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
