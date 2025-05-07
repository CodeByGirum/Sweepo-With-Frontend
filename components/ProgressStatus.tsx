/**
 * Progress Status Component
 * Purpose: Displays project progress status with visual indicators
 * Used in: Project cards, project details
 * Features:
 * - Progress-based status determination
 * - Visual status indicators
 * - Status text display
 */

import React from 'react'

/**
 * Progress status component that shows project status based on progress percentage
 * @param progress - Progress percentage (0-100)
 */
const ProgressStatus = ({progress}:{progress:number}) => {
    
    let progressStatus = '';
    let progressStyle = '';
    switch (true) {
        case progress <= 10:
            progressStatus = 'Planning';
            progressStyle = "planning";
            break;
        case progress > 10 && progress <= 90:
            progressStatus = 'In Progress';
            progressStyle = "inProgress";
            break;
        case progress > 90 && progress < 100:
            progressStatus = 'In Review';
            progressStyle = "inReview";
            break;
        case progress === 100:
            progressStatus = 'Completed';
            progressStyle = "completed";
            break;
        default:
            progressStatus = 'Unknown';
            break;
    }
  return (
        <button className={`text-black font-medium text-sm py-1 px-2 inProgress rounded-lg ${progressStyle}`}>
            {progressStatus}
        </button>
  )
}

export default ProgressStatus