import { calculateAverage, calculateMean, calculateMedian, calculateMode, getRandomValue } from "../Actions/compute.js";
import {BadRequestError} from "../errors/index.js";

export const removeRowsWithIssues = (modifiedData, issuesMap, action) => {
    modifiedData = modifiedData.filter((_, index) => {
        const originalRowIndex = index + 1; 
        if (!issuesMap[originalRowIndex]) return true;

        if (action.issueType) {
            return !issuesMap[originalRowIndex].includes(action.issueType); 
        } else {
            return false; 
        }
    });

    return modifiedData;
}

export const removeRowsWithAnyIssue = (modifiedData, issuesMap) => {
    modifiedData = modifiedData.filter((_, index) => !issuesMap[index + 1]);

    return modifiedData;
}

export const removeRowsWithSpecificIssue = (modifiedData, issuesMap, action) => {
    modifiedData = modifiedData.filter((_, index) => {
        const rowIssues = issuesMap[index + 1] || [];
        return !rowIssues.some(err => err.issueType === action.issueType);
    });

    return modifiedData;
}

export const removeRowsWithColumnIssues = (modifiedData, issuesMap, action) => {
    modifiedData = modifiedData.filter((_, index) => {
        const rowIssues = issuesMap[index + 1] || [];
        return !rowIssues.some(err => err.column === action.column);
    });

    return modifiedData;
}

export const removeRowsWithSpecificColumnIssue = (modifiedData, issuesMap, action) => {
    modifiedData = modifiedData.filter((_, index) => {
        const originalRowIndex = index + 1;
        const rowIssues = issuesMap[originalRowIndex] || [];

        // Filter out rows that have the specified issue type in the 'SignupDate' column
        return !rowIssues.some(err => 
            err.column === action.column && err.issueType === action.issueType
        );
    });

    return modifiedData;
}

export const replaceIssueWithValue = (modifiedData, issuesMap , action) => {
    modifiedData = modifiedData.map((record, index) => {
        const originalRowIndex = index + 1;
        const rowIssues = issuesMap[originalRowIndex] || [];

        // Check if the issue exists in the specified column and matches the target value
        const hasTargetIssue = rowIssues.some(err =>
            err.column === action.column && err.issueType === action.issueType
        );

        if (hasTargetIssue) {
            // Replace the value directly without comparing to targetValue
            record[action.column] = action.newValue;
        }

        return record;
    });

    return modifiedData;
}

export const fillWithAverage = (modifiedData, action) => {
    const avg = calculateAverage(modifiedData, action.column);
    if(!avg) return;
    modifiedData = modifiedData.map(record => {
        const value = record[action.column];
        if (value === null || value === "" || isNaN(Number(value))) {
            record[action.column] = avg;
        }
        return record;
    });

    return modifiedData;
}

export const fillWithMean = (modifiedData, action) => {
    const mean = calculateMean(modifiedData, action.column);
    if(!mean) return;
    modifiedData = modifiedData.map(record => {
        const value = record[action.column];
        if (record[action.column] === null || record[action.column] === "" || isNaN(Number(value))) {
            record[action.column] = Number(mean);
        }
        return record;
    });

    return modifiedData;
}

export const fillWithMode = (modifiedData, action) => {
    const mode = calculateMode(modifiedData, action.column);
    if(!mode) return;
    modifiedData = modifiedData.map(record => {
        const value = record[action.column];
        if (record[action.column] === null || record[action.column] === "" || isNaN(Number(value))) {
            record[action.column] = Number(mode);
        }
        return record;
    });

    return modifiedData;
}

export const fillWithMedian = (modifiedData, action) => {
    const median = calculateMedian(modifiedData, action.column);
    if (!median) return;
    modifiedData = modifiedData.map(record => {
        const value = record[action.column];
        if (record[action.column] === null || record[action.column] === "" || isNaN(Number(value))) {
            record[action.column] = Number(median);
        }
        return record;
    });

    return modifiedData;
}

export const fillWithUpperOrLowerRow = (modifiedData, issuesMap ,action) => {
    console.log("action In function", action);
    
    modifiedData = modifiedData.map((record, index, arr) => {
        const originalRowIndex = index + 1;
        const rowIssues = issuesMap[originalRowIndex] || [];

        const hasTargetIssue = rowIssues.some(err => err.column === action.column && err.issueType === action.issueType);

        // Check for invalid values (using helpers for various column types)
        if (hasTargetIssue && (record[action.column] === null || record[action.column] === "")) {
            let adjacentIndex = (action.type === "FILL_WITH_UPPER_ROW") ? index - 1 : index + 1;

            while (adjacentIndex >= 0 && adjacentIndex < arr.length) {
                const adjacentValue = arr[adjacentIndex][action.column];

                if (adjacentValue !== null && adjacentValue !== "") {
                    record[action.column] = adjacentValue;
                    break;
                }

                adjacentIndex = (action.type === "FILL_WITH_UPPER_ROW") ? adjacentIndex - 1 : adjacentIndex + 1;
            }
        }

        return record;
    });

    return modifiedData;
}

export const fillWithRandom = (modifiedData, issuesMap , action) => {
    modifiedData = modifiedData.map((record) => {
        
        const originalRowIndex = record.originalRowIndex + 1;
        const rowIssues = issuesMap[originalRowIndex] || [];

        const hasTargetIssue = rowIssues.some(err => err.column === action.column && err.issueType === action.issueType);

        if (hasTargetIssue) {
            const randomValue = getRandomValue(modifiedData, action.column);
            record[action.column] = randomValue !== undefined ? randomValue : record[action.column];
        }

        return record;
    });

    return modifiedData;
}

export const updateDateIssues = (modifiedData, issuesMap, action,schema) => {
    let { type, issueType, column, newSeparator, newFormat } = action;
    
    if(!newSeparator){
        newSeparator = newFormat.match(/[^YMD]/)?.[0];
        console.log("newSeparator one ",newSeparator);
    }

    console.log("!newSeparator ", !newSeparator);
    console.log("newSeparator ", newSeparator);
    
    
    if (!schema[column] || schema[column].dataType !== "Date") {
        console.error(`Invalid column or column is not a date: ${column}`);
        throw new BadRequestError(`Invalid column or column is not a date: ${column}`);
    }

    modifiedData = modifiedData.map(record => {
        if (!record[column]) return record;
        
        let updatedDate = record[column];
        
        if (type === "CHANGE_SEPARATOR" && issueType === "INVALID_SEPARATOR") {
            // Replace any existing separator with the new one
            record[column] =  record[column].replace(/[-/.]/g, newSeparator);
            console.log(record[column]);
        }
        

        if (type === "CHANGE_DATE_FORMAT" && newFormat) {
            if (!record[column]) return record;
            // Convert to new date format (assuming standard YYYY-MM-DD input format)
            const parts = record[column].split(/[-/.]/);
            
            if (parts.length === 3) {
                // const [year, month, day] = parts;
                // console.log(parts);

                // switch (newFormat) {
                //     case "DD/MM/YYYY":
                //         console.log("newFormat", newFormat);
                //         record[column]  = `${day}${newSeparator}${month}${newSeparator}${year}`;
                //         console.log("DD/MM/YYYY", record[column]);

                //         break;
                //     case "MM/DD/YYYY":
                //         console.log("newFormat", newFormat);
                //         record[column]  = `${month}${newSeparator}${day}${newSeparator}${year}`;
                //         console.log("MM/DD/YYYY", record[column]);

                //         break;
                //     case "YYYY/MM/DD":
                //         console.log("newFormat", newFormat);

                //         record[column]  = `${year}${newSeparator}${month}${newSeparator}${day}`;
                //         console.log("YYYY/MM/DD", record[column]);
                        
                //         break;
                // }

                // Detect current format
                let year, month, day;

                if (/^\d{4}/.test(parts[0])) { 
                    // If the first part is a 4-digit year, assume YYYY-MM-DD or YYYY/DD/MM
                    [year, month, day] = parts;
                } else if (/^\d{2}/.test(parts[0]) && /^\d{2}/.test(parts[1])) { 
                    // If the first two parts are 2 digits, assume DD/MM/YYYY or MM/DD/YYYY
                    if (newFormat === "YYYY/MM/DD") {
                        [day, month, year] = parts;
                    } else {
                        [month, day, year] = parts;
                    }
                } else {
                    console.warn(`Unrecognized date format: ${dateStr}`);
                    return record; // Skip if format is unrecognized
                }

                if (newFormat === `DD${newSeparator}MM${newSeparator}YYYY`) {
                    record[column] = `${day}${newSeparator}${month}${newSeparator}${year}`;
                } else if (newFormat === `MM${newSeparator}DD${newSeparator}YYYY`) {
                    record[column] = `${month}${newSeparator}${day}${newSeparator}${year}`;
                } else if (newFormat === `YYYY${newSeparator}MM${newSeparator}DD`) {
                    record[column] = `${year}${newSeparator}${month}${newSeparator}${day}`;
                    console.log(record[column]);
                }
            }
        }
        
        // return { ...record, [column]: updatedDate };
        return record;
    });

    return modifiedData;
}

// Example usage:
// const updatedRecords = updateDateIssues(schema, records, {
//     type: "CHANGE_DATE_FORMAT",
//     issueType: "INVALID_FORMAT",
//     column: "SignupDate",
//     newSeparator: "/",
//     newFormat: "DD/MM/YYYY"
// });

// console.log(updatedRecords);
