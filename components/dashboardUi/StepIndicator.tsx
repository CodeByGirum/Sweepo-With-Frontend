import React from 'react'

const StepIndicator = ({step}:{step:number}) => {
  return (
    <header className="flex flex-col gap-2 items-center w-full sticky top-0 sectionBg p-6 z-30 border-b">
        <div className="flex w-full mx-auto items-center">
          <div className="flex flex-col gap-1 justify-center items-center">
              <h1 className="primaryBg p-1 text-base font-bold w-6 h-6 rounded-full flex justify-center items-center -mr-1 z-10">1</h1>
              <p className="para text-center font-medium text-nowrap text-sm">Upload File</p>

          </div>
          <div className={`w-full relative h-2 rounded-full ${(step === 2 || step === 3) ? "primaryBg" :"secondaryBg"}`}></div>
          <div className="flex flex-col gap-1 justify-center items-center transparent">
              <h1 className={`p-1 text-base font-bold w-6 h-6 rounded-full flex justify-center items-center -ml-1 z-10 ${(step === 2 || step === 3) ? "primaryBg" :"secondaryBg"}`}>2</h1>
              <p className="para text-center font-medium text-nowrap text-sm w-full">About the data</p>
          </div>
          <div className={`w-full h-2 rounded-full ${step === 3 ? "primaryBg" :"secondaryBg"}`}></div>
          <div className="flex flex-col gap-1 justify-center items-center">
              <h1 className={`p-1 text-base font-bold w-6 h-6 rounded-full flex justify-center items-center -ml-1 z-10 ${step === 3 ? "primaryBg" :"secondaryBg"}`}>3</h1>
              <p className="para text-center font-medium text-nowrap text-sm">Schema Definition</p>

          </div>
        </div>
        
        {/* <div className="flex justify-between w-full">
            <p className="para text-center font-medium text-nowrap text-sm">Upload File</p>
            <p className="para text-center font-medium text-nowrap text-sm">Schema Definition</p>
        </div> */}
        {step === 2 && <small className='para text-xs'>Schema definition is optional but recommended for better error detection and cleaning.</small>}
    </header>
  )
}

export default StepIndicator