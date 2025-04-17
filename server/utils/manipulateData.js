import { additionMultipleColumn, additionToColumn, deleteColumn, divideMultipleColumn, divisionColumn, fillMissing, multiplicationColumn, multiplicationMultipleColumn, renameColumn, replaceColumnValues, replaceNegativeValues, replaceValue, roundColumn, sortRowsAscending, sortRowsDescending, substractionMultipleColumn, subtractionFromColumn, transformText, standardizeTextFormat, replaceText, trimText, convertDataType, extractKeyword, generateUniqueId,tokenizeText, convertTextEncoding, removeSpecialCharacters, removeAllSpecialCharacters } from "../Actions/columnActions.js";
import { fillWithAverage, fillWithMean, fillWithMedian, fillWithMode, fillWithRandom, fillWithUpperOrLowerRow, removeRowsWithAnyIssue, removeRowsWithColumnIssues, removeRowsWithIssues, removeRowsWithSpecificColumnIssue, removeRowsWithSpecificIssue, replaceIssueWithValue, updateDateIssues } from "../Actions/issuesActions.js";
import { deleteDuplicateRow, deleteRowsWhereValueEquals, deleteRowsWhereValueGreaterThan, deleteRowsWhereValueLessThan, deleteRowsWhereValueNotInRange, deleteRowsWithNegativeValues, keepOnlyUniqueRows, limitRows, removeEmptyRows, removeRowsWithNulls, replaceRow } from "../Actions/rowActions.js";


export const manipulateData = (parsedData, actions, issues,schema) => {
    let modifiedData = [...parsedData];
    
    // Convert issues array to a row-based map for quick lookups
    const issuesArray = issues;  // Access the array inside the issues object
    const issuesMap = {};

    // Check if issuesArray is defined and an array
    if (Array.isArray(issuesArray)) {
        issuesArray.forEach(({ row, errors }) => {
            issuesMap[row] = errors;
        });
    } else {
        console.warn("No issues found or issues is not in the expected format:", issues);
    }

    actions.forEach(action => {
    
        switch (action.type) {
            
            case "DELETE_COLUMN":
                deleteColumn(modifiedData,action);
                break;

            case "FILL_MISSING":
                fillMissing(modifiedData,action);
                break;

            case "REMOVE_ROWS_WITH_ISSUES":
                removeRowsWithIssues(modifiedData, issuesMap, action)
                break;

            case "REPLACE_VALUE":
                replaceValue(modifiedData,action)
                break;
            
            case "REPLACE_NEGATIVE_VALUES":
                replaceNegativeValues(modifiedData, action)
                break;

            case "REPLACE_ROW":
                replaceRow(modifiedData,action)
                break;

            case "REPLACE_COLUMN_VALUES":
                replaceColumnValues(modifiedData, action)
                break;

            case "DELETE_ROWS_WHERE_VALUE_EQUALS":
                deleteRowsWhereValueEquals(modifiedData, action);
                break;
            
            case "DELETE_ROWS_WHERE_VALUE_LESS_THAN":
                deleteRowsWhereValueLessThan(modifiedData,action);
                break;

            case "DELETE_ROWS_WHERE_VALUE_GREATER_THAN":
                deleteRowsWhereValueGreaterThan(modifiedData,action)
                break;

            case "DELETE_ROWS_WITH_NEGATIVE_VALUES":
                deleteRowsWithNegativeValues(modifiedData);
                break;

            case "DELETE_ROWS_WHERE_VALUE_NOT_IN_RANGE":
                deleteRowsWhereValueNotInRange(modifiedData,action);
                break;

            case "DELETE_DUPLICATE_ROWS":
                deleteDuplicateRow(modifiedData, action);
                break;

            case "KEEP_ONLY_UNIQUE_ROWS":
                keepOnlyUniqueRows(modifiedData, action);
                break;

            case "SORT_ROWS_ASCENDING":
                sortRowsAscending(modifiedData, action);
                break;

            case "SORT_ROWS_DESCENDING":
                sortRowsDescending(modifiedData, action)
                break;
    
            case "LIMIT_ROWS":
                limitRows(modifiedData, action);
                break;

            case "REMOVE_EMPTY_ROWS":
                removeEmptyRows(modifiedData)
                break;

            case "REMOVE_ROWS_WITH_NULLS":
                removeRowsWithNulls(modifiedData)
                break;

            case "REMOVE_ROWS_WITH_ANY_ISSUE":
                removeRowsWithAnyIssue(modifiedData, issuesMap)
                break;

            case "REMOVE_ROWS_WITH_SPECIFIC_ISSUE":
                // removeRowsWithSpecificIssue(modifiedData, issuesMap ,action)
                removeEmptyRows(modifiedData ,action)
                break;

            case "REMOVE_ROWS_WITH_COLUMN_ISSUES":
                removeRowsWithColumnIssues(modifiedData, issuesMap, action);
                break;

            
            case "REMOVE_ROWS_WITH_SPECIFIC_COLUMN_ISSUE":
                removeRowsWithSpecificColumnIssue(modifiedData, issuesMap, action)
                break;

            case "REPLACE_ISSUE_WITH_VALUE":
                replaceIssueWithValue(modifiedData, issuesMap, action);
                break;
                
            case "FILL_WITH_AVERAGE":
                fillWithAverage(modifiedData, action)
                break;

            case "FILL_WITH_MEAN":
                fillWithMean(modifiedData, action)
                break;

            case "FILL_WITH_MODE":
                fillWithMode(modifiedData, action)
                break;
                
            case "FILL_WITH_MEDIAN":
                fillWithMedian(modifiedData, action)
                break;

            case "FILL_WITH_UPPER_ROW":
            case "FILL_WITH_LOWER_ROW":
                fillWithUpperOrLowerRow(modifiedData, issuesMap, action)
                break;

            case "FILL_WITH_RANDOM":
                fillWithRandom(modifiedData, issuesMap, action)
                break;

            case "ROUND_COLUMN":
                roundColumn(modifiedData, action)
                break;

            case "ADDITION_TO_COLUMN":
                additionToColumn(modifiedData, action)
                break;

            case "SUBTRACTION_FROM_COLUMN":
                subtractionFromColumn(modifiedData, action)
                break;

            case "MULTIPLICATION_COLUMN":
                multiplicationColumn(modifiedData, action);
                break;

            case "DIVISION_COLUMN":
                divisionColumn(modifiedData, action);
                break;

            case "ADDITION_MULTIPLE_COLUMN":
                additionMultipleColumn(modifiedData, action)
                break;

            case "SUBSTRACTION_MULTIPLE_COLUMN":
                substractionMultipleColumn(modifiedData, action)
                break;

            case "MULTIPLICATION_MULTIPLE_COLUMN":
                multiplicationMultipleColumn(modifiedData, action)
                break;

            case "DIVIDE_MULTIPLE_COLUMN":
                divideMultipleColumn(modifiedData,action)
                break;

            case "RENAME_COLUMN":
                renameColumn(modifiedData, action)
                break;
            
            // case "CHANGE_SEPARATOR":
            case "CHANGE_DATE_FORMAT":
                updateDateIssues(modifiedData, issuesMap, action,schema)
                break;

            case "CHANGE_SEPARATOR":
                updateDateIssues(modifiedData, issuesMap, action,schema)
                break;

            case "TRANSFORM_TEXT":
                transformText(modifiedData, action)
                    break;

            case "STANDARDIZE_TEXT_FORMAT":
                standardizeTextFormat(modifiedData, action)
                    break;

            case "REPLACE_TEXT":
                replaceText(modifiedData, action)
                    break;

            case "TRIM_TEXT":
                trimText(modifiedData, action)
                    break;

            case "CONVERT_DATA_TYPES":
                convertDataType(modifiedData, action)
                break;

            case "EXTRACT_KEYWORDS":
                extractKeyword(modifiedData, action)
                break;

            case "GENERATE_UNIQUE_ID":
                generateUniqueId(modifiedData, action)
                break;

            case "TOKENIZE_TEXT":
                tokenizeText(modifiedData, action)
                break;

            case "CONVERT_TEXT_ENCODING":
                convertTextEncoding(modifiedData, action)
                break;

            case "REMOVE_SPECIAL_CHARACTERS":
                removeSpecialCharacters(modifiedData, action)
                break;

            case "REMOVE_ALL_SPECIAL_CHARACTERS":
                removeAllSpecialCharacters(modifiedData, action)
                break;

            default:
                console.warn(`Unknown action: ${action.type}`);
                break;
        }
    });

    return modifiedData;
};






// export const manipulateData = (parsedData, actions, issues) => {
//     const commonIssues = ["Duplicate records", "Missing fields", "Null values", "Invalid number format", "Invalid Date Format", "Expected string but found", "Negative number not allowed"]
//     let modifiedData = [...parsedData];
    
//     // Convert issues array to a row-based map for quick lookups
//     const issuesArray = issues;  // Access the array inside the issues object
//     const issuesMap = {};

//     // Check if issuesArray is defined and an array
//     if (Array.isArray(issuesArray)) {
//         issuesArray.forEach(({ row, errors }) => {
//             issuesMap[row] = errors;
//         });
//     } else {
//         console.warn("No issues found or issues is not in the expected format:", issues);
//     }
    
//     // Helper functions
//     const calculateAverage = (data, column) => {
//         const nums = data.map(record => parseFloat(record[column])).filter(val => !isNaN(val));
//         return nums.reduce((sum, val) => sum + val, 0) / nums.length;
//     };

//     const calculateMean = calculateAverage; // Same as average in this context

//     const calculateMode = (data, column) => {
//         const counts = {};
//         data.forEach(record => {
//             const val = record[column];
//             if (val !== null && val !== undefined) counts[val] = (counts[val] || 0) + 1;
//         });
//         return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
//     };

//     const calculateMedian = (data, column) => {
//         const numericValues = data
//             .map(record => Number(record[column]))
//             .filter(value => !isNaN(value))
//             .sort((a, b) => a - b);
    
//         const length = numericValues.length;
//         if (length === 0) return null;
    
//         const mid = Math.floor(length / 2);
//         return length % 2 === 0
//             ? (numericValues[mid - 1] + numericValues[mid]) / 2
//             : numericValues[mid];
//     };
    

//     // const getRandomValue = (data, column) => {
//     //     const validValues = data.map(record => record[column]).filter(val => val !== null && val !== undefined);
//     //     return validValues[Math.floor(Math.random() * validValues.length)];
//     // };
//     const getRandomValue = (data, column) => {
//         const validValues = data
//             .map(record => record[column])
//             .filter(val => val !== null && val !== undefined && val !== ""); // Exclude empty strings too
    
//         return validValues.length > 0
//             ? validValues[Math.floor(Math.random() * validValues.length)]
//             : null; // Or provide a default value
//     };
    

//     actions.forEach(action => {
//         switch (action.type) {
//             case "DELETE_COLUMN":
//                 modifiedData = modifiedData.map(record => {
//                     delete record[action.column];
//                     return record;
//                 });
//                 break;

//             case "FILL_MISSING":
//                 modifiedData = modifiedData.map(record => {
//                     if (record[action.column] === null || record[action.column] === "") {
//                         record[action.column] = action.defaultValue;
//                     }
//                     return record;
//                 });
//                 break;

//             case "REMOVE_ROWS_WITH_ISSUES":
//                 modifiedData = modifiedData.filter((_, index) => {
//                     const rowNumber = index + 1; // Match 1-based row index
//                     if (!issuesMap[rowNumber]) return true; // No issues, keep the row

//                     if (action.issueType) {
//                         return !issuesMap[rowNumber].includes(action.issueType); // Remove only specific issue type
//                     } else {
//                         return false; // Remove any row with issues
//                     }
//                 });
//                 break;

//             case "REPLACE_VALUE":
//                 modifiedData = modifiedData.map(record => {
//                     if (record[action.column] === action.oldValue) {
//                         record[action.column] = action.newValue;
//                     }
//                     return record;
//                 });
//                 break;
            
//             case "REPLACE_NEGATIVE_VALUES":
//                 modifiedData = modifiedData.map(record => {
//                     const currentValue = Number(record[action.column])
//                     if (typeof currentValue === "number" && currentValue < 0) {
//                         record[action.column] = action.newValue;
//                     }
//                     return record;
//                 });
//                 break;

//             case "REPLACE_ROW":
//                 modifiedData = modifiedData.map((record, index) => {
//                     if (index + 1 === action.rowNumber) {  // Match row number (1-based index)
//                         return { ...record, ...action.newValues }; // Replace entire row with new values
//                     }
//                     return record;
//                 });
//                 break;

//             case "REPLACE_COLUMN_VALUES":
//                 modifiedData = modifiedData.map(record => {
//                     record[action.column] = action.newValue;
//                     return record;
//                 });
//                 break;

//             case "DELETE_ROWS_WHERE_VALUE_EQUALS":
//                 modifiedData = modifiedData.filter(record => record[action.column] !== action.value);
//                 break;
            
//             case "DELETE_ROWS_WHERE_VALUE_LESS_THAN":
//                 modifiedData = modifiedData.filter(record => Number(record[action.column]) >= action.value);
//                 break;

//             // Delete rows where a column value is GREATER THAN a specific number
//             case "DELETE_ROWS_WHERE_VALUE_GREATER_THAN":
//                 modifiedData = modifiedData.filter(record => Number(record[action.column]) <= action.value);
//                 break;

//             // Delete rows where ANY column has a negative value
//             case "DELETE_ROWS_WITH_NEGATIVE_VALUES":
//                 modifiedData = modifiedData.filter(record =>
//                     Object.values(record).every(value => Number(value) >= 0 || isNaN(Number(value)))
//                 );
//                 break;

//             // Delete rows where a column's value is OUTSIDE a specific range (less than min OR greater than max)
//             case "DELETE_ROWS_WHERE_VALUE_NOT_IN_RANGE":
//                 modifiedData = modifiedData.filter(record =>
//                     Number(record[action.column]) >= action.minValue &&
//                     Number(record[action.column]) <= action.maxValue
//                 );
//                 break;

//                 case "DELETE_DUPLICATE_ROWS":
//                     const seen = new Set();
//                     modifiedData = modifiedData.filter(record => {
//                         const key = record[action.column];
//                         if (seen.has(key)) return false;
//                         seen.add(key);
//                         return true;
//                     });
//                     break;
    
//                 case "KEEP_ONLY_UNIQUE_ROWS":
//                     const countMap = {};
//                     modifiedData.forEach(record => {
//                         countMap[record[action.column]] = (countMap[record[action.column]] || 0) + 1;
//                     });
//                     modifiedData = modifiedData.filter(record => countMap[record[action.column]] === 1);
//                     break;
    
//                 case "SORT_ROWS_ASCENDING":
//                     modifiedData.sort((a, b) => (a[action.column] > b[action.column] ? 1 : -1));
//                     break;
    
//                 case "SORT_ROWS_DESCENDING":
//                     modifiedData.sort((a, b) => (a[action.column] < b[action.column] ? 1 : -1));
//                     break;
    
//                 case "LIMIT_ROWS":
//                     modifiedData = modifiedData.slice(0, action.count);
//                     break;
    
//                 case "REMOVE_EMPTY_ROWS":
//                     modifiedData = modifiedData.filter(record => Object.values(record).some(value => value !== "" && value !== null));
//                     break;
    
//                 case "REMOVE_ROWS_WITH_NULLS":
//                     modifiedData = modifiedData.filter(record => !Object.values(record).includes(null));
//                     break;

//                 // COMPUTING ACTIONS
//                 case "REMOVE_ROWS_WITH_ANY_ISSUE":
//                     modifiedData = modifiedData.filter((_, index) => !issuesMap[index + 1]);
//                     break;
    
//                 case "REMOVE_ROWS_WITH_SPECIFIC_ISSUE":
//                     modifiedData = modifiedData.filter((_, index) => {
//                         const rowIssues = issuesMap[index + 1] || [];
                        
//                         // err.issueType === action.issueType
//                         return !rowIssues.some(err => err.issueType === action.issueType);
//                     });
//                     break;
    
//                 case "REMOVE_ROWS_WITH_COLUMN_ISSUES":
//                     modifiedData = modifiedData.filter((_, index) => {
//                         const rowIssues = issuesMap[index + 1] || [];
//                         return !rowIssues.some(err => err.column === action.column);
//                     });
//                     break;

                
//                 case "REMOVE_ROWS_WITH_SPECIFIC_COLUMN_ISSUE":
    
//                     modifiedData = modifiedData.filter((_, index) => {
//                         const rowNumber = index + 1; 
//                         const rowIssues = issuesMap[rowNumber] || [];

//                         // Filter out rows that have the specified issue type in the 'SignupDate' column
//                         return !rowIssues.some(err => 
//                             err.column === action.column && err.issueType === action.issueType
//                         );
//                     });
//                     break;

//                 case "REPLACE_ISSUE_WITH_VALUE":
//                     modifiedData = modifiedData.map((record, index) => {
//                         const rowNumber = index + 1;
//                         const rowIssues = issuesMap[rowNumber] || [];

//                         // Check if the issue exists in the specified column and matches the target value
//                         const hasTargetIssue = rowIssues.some(err =>
//                             err.column === action.column && err.issueType === action.issueType
//                         );

//                         if (hasTargetIssue) {
//                             // Replace the value directly without comparing to targetValue
//                             record[action.column] = action.newValue;
//                         }

//                         return record;
//                     });
//                     break;
                    
//                 case "FILL_WITH_AVERAGE":
//                     const avg = calculateAverage(modifiedData, action.column);
//                     if(!avg){
//                         break;
//                     }
//                     modifiedData = modifiedData.map(record => {
//                         const value = record[action.column];
//                         if (value === null || value === "" || isNaN(Number(value))) {
//                             record[action.column] = avg;
//                         }
//                         return record;
//                     });
//                     break;
    
//                 case "FILL_WITH_MEAN":
//                     const mean = calculateMean(modifiedData, action.column);
//                     if(!mean){
//                         break;
//                     }
//                     modifiedData = modifiedData.map(record => {
//                         const value = record[action.column];
//                         if (record[action.column] === null || record[action.column] === "" || isNaN(Number(value))) {
//                             record[action.column] = Number(mean);
//                         }
//                         return record;
//                     });
//                     break;
    
//                 case "FILL_WITH_MODE":
//                     const mode = calculateMode(modifiedData, action.column);
//                     if(!mode){
//                         break;
//                     }
//                     modifiedData = modifiedData.map(record => {
//                     const value = record[action.column];
//                         if (record[action.column] === null || record[action.column] === "" || isNaN(Number(value))) {
//                             record[action.column] = Number(mode);
//                         }
//                         return record;
//                     });
//                     break;
                
//                     case "FILL_WITH_MEDIAN":
//                         const median = calculateMedian(modifiedData, action.column);
//                         if (!median) {
//                             break;
//                         }
//                         modifiedData = modifiedData.map(record => {
//                             const value = record[action.column];
//                             if (record[action.column] === null || record[action.column] === "" || isNaN(Number(value))) {
//                                 record[action.column] = Number(median);
//                             }
//                             return record;
//                         });
//                         break;

//                 case "FILL_WITH_UPPER_ROW":
//                 case "FILL_WITH_LOWER_ROW":
//                     modifiedData = modifiedData.map((record, index, arr) => {
//                         const rowNumber = index + 1;
//                         const rowIssues = issuesMap[rowNumber] || [];

//                         const hasTargetIssue = rowIssues.some(err => err.column === action.column && err.issueType === action.issueType);

//                         // Utility function to check for invalid date
//                         const isInvalidDate = (value) => isNaN(Date.parse(value));

//                         // Utility function to check for invalid email
//                         const isInvalidEmail = (value) => value && !/\S+@\S+\.\S+/.test(value);

//                         // Utility function to check for invalid number
//                         const isInvalidNumber = (value) => isNaN(value);

//                         // Utility function to check for an empty or invalid string (for columns like 'Name')
//                         const isInvalidString = (value) => typeof value === 'string' && value.trim() === '';

//                         // Check if the column is a name-like column (this can be adjusted based on column names)
//                         const isNameColumn = action.column.toLowerCase() === "name";  // Adjust based on your column names

//                         // Fill with Upper Row or Lower Row depending on the action type
//                         if (hasTargetIssue && (
//                             record[action.column] === null || 
//                             record[action.column] === "" || 
//                             (typeof record[action.column] === 'string' && isInvalidEmail(record[action.column])) || 
//                             (typeof record[action.column] === 'number' && isInvalidNumber(record[action.column])) || 
//                             (typeof record[action.column] === 'string' && isInvalidDate(record[action.column])) || 
//                             (isNameColumn && isInvalidString(record[action.column])))) {

//                             let adjacentIndex = (action.type === "FILL_WITH_UPPER_ROW") ? index - 1 : index + 1;

//                             while (adjacentIndex >= 0 && adjacentIndex < arr.length) {
//                                 const adjacentValue = arr[adjacentIndex][action.column];

//                                 // Check if the adjacent value is valid (non-null, non-empty, and valid for its type)
//                                 if (
//                                     adjacentValue !== null &&
//                                     adjacentValue !== "" &&
//                                     ((typeof adjacentValue === 'string' && !isInvalidEmail(adjacentValue) && !isInvalidString(adjacentValue)) || 
//                                     (typeof adjacentValue === 'number' && !isInvalidNumber(adjacentValue)) || 
//                                     (typeof adjacentValue === 'string' && !isInvalidDate(adjacentValue)) ||
//                                     (isNameColumn && !isInvalidString(adjacentValue)))
//                                 ) {
//                                     // Set the value from the adjacent row
//                                     record[action.column] = adjacentValue;
//                                     break;
//                                 }

//                                 // Move to the next adjacent row based on action type
//                                 adjacentIndex = (action.type === "FILL_WITH_UPPER_ROW") ? adjacentIndex - 1 : adjacentIndex + 1;
//                             }
//                         }

//                         return record;
//                     });
//                     break;

//                 case "FILL_WITH_RANDOM":
//                     modifiedData = modifiedData.map((record, index) => {
//                         const rowNumber = index + 1;
//                         const rowIssues = issuesMap[rowNumber] || [];

//                         const hasTargetIssue = rowIssues.some(err => err.column === action.column && err.issueType === action.issueType);

//                         if (hasTargetIssue) {
//                             const randomValue = getRandomValue(modifiedData, action.column);
//                             console.log(randomValue);
//                             console.log(rowIssues);
                            
//                             record[action.column] = randomValue !== undefined ? randomValue : record[action.column];
//                         }

//                         return record;
//                     });
//                     break;

//                 case "ROUND_COLUMN":
//                     modifiedData = modifiedData.map(record => {
//                         const value = Number(record[action.column]);
//                         if (!isNaN(value)) {
//                             const roundAmount = action.by || 0;
//                             const factor = Math.pow(10, roundAmount);
//                             record[action.column] = Math.round(value * factor) / factor;
//                         }
//                         return record;
//                     });
//                     break;

//                 case "ADDITION_TO_COLUMN":
//                     modifiedData = modifiedData.map(record => {
//                         const value = Number(record[action.column]);
//                         const additionAmount = Number(action.by);
//                         if (!isNaN(value) && !isNaN(additionAmount)) {
//                             record[action.column] = value + additionAmount;
//                         }
//                         return record;
//                     });
//                     break;

//                 case "SUBTRACTION_FROM_COLUMN":
//                     modifiedData = modifiedData.map(record => {
//                         const value = Number(record[action.column]);
//                         const subtractionAmount = Number(action.by);
//                         if (!isNaN(value) && !isNaN(subtractionAmount)) {
//                             record[action.column] = value - subtractionAmount;
//                         }
//                         return record;
//                     });
//                     break;

//                 case "MULTIPLICATION_COLUMN":
//                     modifiedData = modifiedData.map(record => {
//                         const value = Number(record[action.column]);
//                         const multiplicationAmount = Number(action.by);
//                         if (!isNaN(value) && !isNaN(multiplicationAmount)) {
//                             record[action.column] = value * multiplicationAmount;
//                         }
//                         return record;
//                     });
//                     break;

//                 case "DIVISION_COLUMN":
//                     modifiedData = modifiedData.map(record => {
//                         const value = Number(record[action.column]);
//                         const divisionAmount = Number(action.by);
//                         if (!isNaN(value) && !isNaN(divisionAmount) && divisionAmount !== 0) {
//                             record[action.column] = value / divisionAmount;
//                         }
//                         return record;
//                     });
//                     break;

//                     case "ADDITION_MULTIPLE_COLUMN":
//                     modifiedData = modifiedData.map(record => {
//                         const sum = action.targetColumn.reduce((acc, col) => {
//                             const value = Number(record[col]);
//                             return !isNaN(value) ? acc + value : acc;
//                         }, 0);
//                         return { ...record, [action.update]: sum };
//                     });
//                     break;

//                 case "SUBSTRACTION_MULTIPLE_COLUMN":
//                     modifiedData = modifiedData.map(record => {
//                         const difference = action.targetColumn.reduce((acc, col, index) => {
//                             const value = Number(record[col]);
//                             return !isNaN(value) ? (index === 0 ? value : acc - value) : acc;
//                         }, 0);
//                         return { ...record, [action.update]: difference };
//                     });
//                     break;

//                 case "MULTIPLICATION_MULTIPLE_COLUMN":
//                     modifiedData = modifiedData.map(record => {
//                         const product = action.targetColumn.reduce((acc, col) => {
//                             const value = Number(record[col]);
//                             return !isNaN(value) ? acc * value : acc;
//                         }, 1);
//                         return { ...record, [action.update]: product };
//                     });
//                     break;

//                 case "DIVIDE_MULTIPLE_COLUMN":
//                     modifiedData = modifiedData.map(record => {
//                         const quotient = action.targetColumn.reduce((acc, col, index) => {
//                             const value = Number(record[col]);
//                             return (!isNaN(value) && value !== 0) 
//                                 ? (index === 0 ? value : acc / value) 
//                                 : acc;
//                         }, null);
//                         return { ...record, [action.update]: quotient };
//                     });
//                     break;


//                 case "RENAME_COLUMN":
//                     modifiedData = modifiedData.map(record => {
//                         if (record.hasOwnProperty(action.from)) {
//                             return {
//                                 ...record,
//                                 [action.to]: record[action.from],
//                                 ...((({ [action.from]: _, ...rest }) => rest)(record))
//                             };
//                         }
//                         return record;
//                     });
//                     break;
                    

//             default:
//                 console.warn(`Unknown action: ${action.type}`);
//                 break;
//         }
//     });

//     return modifiedData;
// };
