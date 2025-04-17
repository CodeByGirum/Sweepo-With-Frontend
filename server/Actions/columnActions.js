export const deleteColumn = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        delete record[action.column];
        return record;
    });

    return modifiedData;
}

export const fillMissing = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        if (record[action.column] === null || record[action.column] === "") {
            record[action.column] = action.defaultValue;
        }
        return record;
    });

    return modifiedData;
}

export const replaceValue = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        if (record[action.column] === action.oldValue) {
            record[action.column] = action.newValue;
        }
        return record;
    });

    return modifiedData;
}
                    
export const replaceNegativeValues = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        const currentValue = Number(record[action.column])
        if (typeof currentValue === "number" && currentValue < 0) {
            record[action.column] = action.newValue;
        }
        return record;
    });

    return modifiedData;
}

export const replaceColumnValues = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        record[action.column] = action.newValue;
        return record;
    });

    return modifiedData;
}

export const sortRowsAscending = (modifiedData, action) => {
    modifiedData.sort((a, b) => (a[action.column] > b[action.column] ? 1 : -1));

    return modifiedData;
}
    
export const sortRowsDescending = (modifiedData, action) => {
    modifiedData.sort((a, b) => (a[action.column] < b[action.column] ? 1 : -1));

    return modifiedData;
}

export const additionToColumn = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        const value = Number(record[action.column]);
        const additionAmount = Number(action.by);
        if (!isNaN(value) && !isNaN(additionAmount)) {
            record[action.column] = value + additionAmount;
        }
        return record;
    });

    return modifiedData;
}

export const subtractionFromColumn = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        const value = Number(record[action.column]);
        const subtractionAmount = Number(action.by);
        if (!isNaN(value) && !isNaN(subtractionAmount)) {
            record[action.column] = value - subtractionAmount;
        }
        return record;
    });

    return modifiedData;
}

export const multiplicationColumn = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        const value = Number(record[action.column]);
        const multiplicationAmount = Number(action.by);
        if (!isNaN(value) && !isNaN(multiplicationAmount)) {
            record[action.column] = value * multiplicationAmount;
        }
        return record;
    });

    return modifiedData;
}

export const divisionColumn = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        const value = Number(record[action.column]);
        const divisionAmount = Number(action.by);
        if (!isNaN(value) && !isNaN(divisionAmount) && divisionAmount !== 0) {
            record[action.column] = value / divisionAmount;
        }
        return record;
    });

    return modifiedData;
}

export const additionMultipleColumn = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        const sum = action.targetColumn.reduce((acc, col) => {
            const value = Number(record[col]);
            return !isNaN(value) ? acc + value : acc;
        }, 0);
        return { ...record, [action.update]: sum };
    });

    return modifiedData;
}

export const substractionMultipleColumn = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        const difference = action.targetColumn.reduce((acc, col, index) => {
            const value = Number(record[col]);
            return !isNaN(value) ? (index === 0 ? value : acc - value) : acc;
        }, 0);
        return { ...record, [action.update]: difference };
    });

    return modifiedData;
}

export const multiplicationMultipleColumn = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        const product = action.targetColumn.reduce((acc, col) => {
            const value = Number(record[col]);
            return !isNaN(value) ? acc * value : acc;
        }, 1);
        return { ...record, [action.update]: product };
    });

    return modifiedData;
}


export const divideMultipleColumn = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        const quotient = action.targetColumn.reduce((acc, col, index) => {
            const value = Number(record[col]);
            return (!isNaN(value) && value !== 0) 
                ? (index === 0 ? value : acc / value) 
                : acc;
        }, null);
        return { ...record, [action.update]: quotient };
    });

    return modifiedData;
}

export const renameColumn = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        if (record.hasOwnProperty(action.from)) {
            return {
                ...record,
                [action.to]: record[action.from],
                ...((({ [action.from]: _, ...rest }) => rest)(record))
            };
        }
        return record;
    });

    return modifiedData;
}

export const roundColumn = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        const value = Number(record[action.column]);
        if (!isNaN(value)) {
            const roundAmount = action.by || 0;
            const factor = Math.pow(10, roundAmount);
            record[action.column] = Math.round(value * factor) / factor;
        }
        return record;
    });

    return modifiedData;
}

export const transformText = (modifiedData, action) => {
    const { column, transform } = action;
    console.log("Transforming column:", column, "with transform:", transform);

    const capitalize = (str) => {
        if (typeof str !== 'string') return str;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    modifiedData = modifiedData.map((record) => {
        const value = record[column];
        if (typeof value !== 'string') return record;

        switch (transform) {
            case 'UPPERCASE':
                record[column] = value.toUpperCase();
                break;
            case 'LOWERCASE':
                record[column] = value.toLowerCase();
                break;
            case 'CAPITALIZE':
                record[column] = capitalize(value);
                break;
            default:
                break;
        }

        return record;
    });

    return modifiedData;
};

export const standardizeTextFormat = (modifiedData, action) => {
    const { column } = action;
  
    // Function to capitalize the first letter and make the rest lowercase
    const capitalize = (str) => {
      if (typeof str !== 'string') return str;
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };
  
    // Function to remove special characters
    const removeSpecialCharacters = (str) => {
      return str.replace(/[^a-zA-Z0-9\s]/g, ''); // Remove all non-alphanumeric characters except spaces
    };
  
    // Normalize text and remove special characters
    modifiedData = modifiedData.map((row) => {
      const value = row[column];
      if (typeof value !== 'string') return row; // skip non-string values
  
      let standardizedValue = value;

        // Remove extra whitespace
        standardizedValue = standardizedValue.trim().replace(/\s+/g, ' ');
  
      // Normalize text to Capitalize each word (standardize text format)
      standardizedValue = standardizedValue
        .split(' ')
        .map(word => capitalize(word)) 
        .join(' '); 
  
      // Remove special characters
      standardizedValue = removeSpecialCharacters(standardizedValue);
  
      // Update the column in the row with the standardized value
      row[column] = standardizedValue;
  
      return row;
    });
  
    return modifiedData;
};

export const replaceText = (modifiedData, action) => {
const { column, findText, replaceText } = action;

if (!column || !findText || replaceText === undefined) return modifiedData;

const regex = new RegExp(findText, 'gi'); // case-insensitive global search

modifiedData = modifiedData.map(row => {
    const value = row[column];

    // Only process string values
    if (typeof value === 'string') {
    row[column] = value.replace(regex, match => {
        // Maintain original casing if needed (optional)
        if (match === match.toUpperCase()) return replaceText.toUpperCase();
        if (match === match.toLowerCase()) return replaceText.toLowerCase();
        return replaceText;
    });
    }

    return row;
});

return modifiedData;
};

export const trimText = (modifiedData, action) => {
    const { column } = action;
  
    if (!column) return modifiedData;
  
    modifiedData = modifiedData.map(row => {
      const value = row[column];
  
      if (typeof value === 'string') {
        row[column] = value
          .trim() // remove leading/trailing
          .replace(/\s*-\s*/g, '-') // remove spaces around hyphens
          .replace(/\s+/g, ' '); // collapse multiple spaces to one
      }
  
      return row;
    });
  
    return modifiedData;
};

export const convertDataType = (modifiedData, action) => {
    console.log("Converting data type for column:", action.column, "to type:", action.dataType);
    
    const { column, dataType } = action;

    if (!column || !dataType) return modifiedData;

    modifiedData = modifiedData.map(row => {
        const value = row[column];

        if (value === null || value === undefined) return row;

        switch (dataType.toUpperCase()) {
        case 'NUMBER':
            const numberVal = Number(value);
            row[column] = isNaN(numberVal) ? null : numberVal;
            break;

        case 'STRING':
            row[column] = String(value);
            break;

        case 'BOOLEAN':
            if (typeof value === 'string') {
            const lower = value.trim().toLowerCase();
            row[column] = lower === 'true' ? true : lower === 'false' ? false : null;
            } else {
            row[column] = Boolean(value);
            }
            break;

        case 'DATE':
            const dateVal = new Date(value);
            row[column] = isNaN(dateVal.getTime()) ? null : dateVal.toISOString().slice(0, 10);
            break;

        default:
            // If unknown type, leave value unchanged
            break;
        }

        return row;
    });

    return modifiedData;
};

export const extractKeyword = (modifiedData, action) => {
    const { column, extractWord } = action;

    if (!column || !extractWord) return modifiedData;

    const regex = new RegExp(extractWord, 'gi'); // case-insensitive

    modifiedData = modifiedData.map(row => {
    const value = row[column];

    if (typeof value === 'string') {
        const match = value.match(regex);
        if (match) {
          row[column] = match[0]; // Extract the keyword
        }
        // else leave the original value unchanged
    }

    return row;
    
});

    return modifiedData;
};

import { v4 as uuidv4 } from 'uuid';

export const generateUniqueId = (modifiedData, action) => {
  const { columnName, idType } = action;

  if (!columnName || !idType) return modifiedData;

  return modifiedData.map((row, index) => {
    if (idType === 'UUID') {
      row[columnName] = uuidv4();
    } else if (idType === 'AUTOINCREMENT') {
      row[columnName] = index + 1; // or any starting number you'd prefer
    }
    return row;
  });
};

export const tokenizeText = (modifiedData, action) => {
    const { column } = action;
  
    if (!column) return modifiedData;
  
    return modifiedData.map(row => {
      const value = row[column];
  
      // Only tokenize if it's a string
      if (typeof value === 'string') {
        // Split by whitespace and punctuation (excluding apostrophes in words like "don't")
        row[column] = value.match(/\b[\w']+\b/g) || [value]; 
      }
  
      return row;
    });
};

import iconv from 'iconv-lite';

export function convertTextEncoding(modifiedData, action) {
  const { column, encoding } = action;

  return modifiedData.map(row => {
    const value = row[column];

    if (typeof value === 'string') {
      try {
        const buffer = iconv.encode(value, encoding);
        const converted = iconv.decode(buffer, encoding);
        return { ...row, [column]: converted };
      } catch (error) {
        console.error(`Encoding conversion error for "${value}":`, error.message);
        return row;
      }
    }

    return row;
  });
}

export const removeSpecialCharacters = (modifiedData, action) => {
    const { column, character } = action;
  
    if (!column || character === undefined) return modifiedData;
  
    const escapedChar = character.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&'); // safely escape special characters
    const regex = new RegExp(escapedChar, 'g');
  
    return modifiedData.map(row => {
      const value = row[column];
  
      if (typeof value === 'string') {
        row[column] = value.replace(regex, '');
      } else if (typeof value === 'number') {
        const cleaned = String(value).replace(regex, '');
        const parsed = Number(cleaned);
        row[column] = isNaN(parsed) ? value : parsed;
      }
  
      return row;
    });
};

export const removeAllSpecialCharacters = (modifiedData, action) => {
    const { column } = action;
  
    if (!column) return modifiedData;
  
    // Regex: Keep letters, numbers, whitespace, and dots (you can tweak it)
    const regex = /[^a-zA-Z0-9.\s]/g;
  
    return modifiedData.map(row => {
      const value = row[column];
  
      if (typeof value === 'string') {
        row[column] = value.replace(regex, '');
      } else if (typeof value === 'number') {
        const cleaned = String(value).replace(regex, '');
        const parsed = Number(cleaned);
        row[column] = isNaN(parsed) ? value : parsed;
      }
  
      return row;
    });
};
