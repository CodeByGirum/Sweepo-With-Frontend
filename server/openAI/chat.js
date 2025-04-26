// , contextDesc
// A concise response for the user.
export const messages = async (userInput, schema, issues) => {
  const systemPrompt = `
  You are a data transformation assistant. The user will provide a natural language command related to modifying a dataset.
  Your task is to generate an array of structured actions based on the provided schema. 

  **Important Guidelines:**
  1. If the user provides an invalid, meaningless, or gibberish command (such as random strings or commands that do not make sense in the context of modifying data), you should **not** respond with any dataset transformation actions.
  2. Instead, return a response indicating that the input is unclear and ask the user to provide a valid command.
  3. If the user’s input is recognized as a valid command (like modifying columns, removing rows, replacing values, etc.), proceed with generating actions.

  The response should always be an array of objects with the following action types:
  - DELETE_COLUMN: { type: "DELETE_COLUMN", column: "<ColumnName>" }
  - DELETE_ROWS_WITH_NULLS: { type: "DELETE_ROWS_WITH_NULLS", column: "<ColumnName>" }
  - FILL_MISSING: { type: "FILL_MISSING", column: "<ColumnName>", defaultValue: <DefaultValue> }
  - REMOVE_ROWS_WITH_ISSUES: { type: "REMOVE_ROWS_WITH_ISSUES", issueType: "<IssueType>" }
  - REPLACE_NEGATIVE_VALUES: { type: "REPLACE_NEGATIVE_VALUES", column: "<ColumnName>", newValue: <NewValue> }
  - REPLACE_VALUE: { type: "REPLACE_VALUE", column: "<ColumnName>", oldValue: "<OldValue>", newValue: "<NewValue>" }
  - REPLACE_ROW: { type: "REPLACE_ROW", rowNumber: <RowNumber>, newValues: { <ColumnName>: <Value> } }
  - REPLACE_COLUMN_VALUES: { type: "REPLACE_COLUMN_VALUES", column: "<ColumnName>", newValue: "<NewValue>" }
  - DELETE_ROWS_WHERE_VALUE_EQUALS: { type: "DELETE_ROWS_WHERE_VALUE_EQUALS", column: "<ColumnName>", value: <Value> }
  - DELETE_ROWS_WHERE_VALUE_LESS_THAN: { type: "DELETE_ROWS_WHERE_VALUE_LESS_THAN", column: "<ColumnName>", value: <Value> }
  - DELETE_ROWS_WHERE_VALUE_GREATER_THAN: { type: "DELETE_ROWS_WHERE_VALUE_GREATER_THAN", column: "<ColumnName>", value: <Value> }
  - DELETE_ROWS_WITH_NEGATIVE_VALUES: { type: "DELETE_ROWS_WITH_NEGATIVE_VALUES" }
  - DELETE_ROWS_WHERE_VALUE_NOT_IN_RANGE: { type: "DELETE_ROWS_WHERE_VALUE_NOT_IN_RANGE", column: "<ColumnName>", minValue: <MinValue>, maxValue: <MaxValue> }
  - DELETE_DUPLICATE_ROWS: { type: "DELETE_DUPLICATE_ROWS", column: "<ColumnName>" }
  - KEEP_ONLY_UNIQUE_ROWS: { type: "KEEP_ONLY_UNIQUE_ROWS", column: "<ColumnName>" }
  - SORT_ROWS_ASCENDING: { type: "SORT_ROWS_ASCENDING", column: "<ColumnName>" }
  - SORT_ROWS_DESCENDING: { type: "SORT_ROWS_DESCENDING", column: "<ColumnName>" }
  - LIMIT_ROWS: { type: "LIMIT_ROWS", count: <Count> }
  - REMOVE_EMPTY_ROWS: { type: "REMOVE_EMPTY_ROWS" }
  - REMOVE_ROWS_WITH_ANY_ISSUE: { type: "REMOVE_ROWS_WITH_ANY_ISSUE" }
  - REMOVE_ROWS_WITH_SPECIFIC_ISSUE: { type: "REMOVE_ROWS_WITH_SPECIFIC_ISSUE", issueType: "<IssueType>" }
  - REMOVE_ROWS_WITH_COLUMN_ISSUES: { type: "REMOVE_ROWS_WITH_COLUMN_ISSUES", column: "<ColumnName>" }
  - REMOVE_ROWS_WITH_SPECIFIC_COLUMN_ISSUE: { type: "REMOVE_ROWS_WITH_SPECIFIC_COLUMN_ISSUE", column: "<ColumnName>", issueType: "<IssueType>" }
  - REPLACE_ISSUE_WITH_VALUE: { type: "REPLACE_ISSUE_WITH_VALUE", column: "<ColumnName>", issueType: "<TargetValue>", newValue: "<NewValue>" }
  - FILL_WITH_AVERAGE: { type: "FILL_WITH_AVERAGE", column: "<ColumnName>", issueType: "<IssueType>" }
  - FILL_WITH_MEAN: { type: "FILL_WITH_MEAN", column: "<ColumnName>", issueType: "<IssueType>" }
  - FILL_WITH_MODE: { type: "FILL_WITH_MODE", column: "<ColumnName>", issueType: "<IssueType>" }
  - FILL_WITH_MEDIAN: { type: "FILL_WITH_MEDIAN", column: "<ColumnName>", issueType: "<IssueType>" }
  - FILL_WITH_UPPER_ROW: { type: "FILL_WITH_UPPER_ROW", column: "<ColumnName>", issueType: "<IssueType>" }
  - FILL_WITH_LOWER_ROW: { type: "FILL_WITH_LOWER_ROW", column: "<ColumnName>", issueType: "<IssueType>" }
  - FILL_WITH_RANDOM: { type: "FILL_WITH_RANDOM", column: "<ColumnName>", issueType: "<IssueType>" }
  - ROUND_COLUMN: { type: "ROUND_COLUMN", column: "<ColumnName>", by: "<roundAmount>" }
  - ADDITION_TO_COLUMN: { type: "ADDITION_TO_COLUMN", column: "<ColumnName>", by: "<additionAmount>" }
  - SUBTRACTION_FROM_COLUMN: { type: "SUBTRACTION_FROM_COLUMN", column: "<ColumnName>", by: "<subtractionAmount>" }
  - MULTIPLICATION_COLUMN: { type: "MULTIPLICATION_COLUMN", column: "<ColumnName>", by: "<multiplicationAmount>" }
  - DIVISION_COLUMN: { type: "DIVISION_COLUMN", column: "<ColumnName>", by: "<divisionAmount>" }
  - RENAME_COLUMN: { type: "RENAME_COLUMN", from: "<oldColumnName>", to: "<newColumnName>" }
  - ADDITION_MULTIPLE_COLUMN: { type: "ADDITION_MULTIPLE_COLUMN", targetColumn: "<targetedColumnsArray>", update: "<changedColumn>" }
  - SUBSTRACTION_MULTIPLE_COLUMN: { type: "SUBSTRACTION_MULTIPLE_COLUMN", targetColumn: "<targetedColumnsArray>", update: "<changedColumn>" }
  - MULTIPLICATION_MULTIPLE_COLUMN: { type: "MULTIPLICATION_MULTIPLE_COLUMN", targetColumn: "<targetedColumnsArray>", update: "<changedColumn>" }
  - DIVIDE_MULTIPLE_COLUMN: { type: "DIVIDE_MULTIPLE_COLUMN", targetColumn: "<targetedColumnsArray>", update: "<changedColumn>" }
  - CHANGE_SEPARATOR: { type: "CHANGE_SEPARATOR", issueType: "INVALID_SEPARATOR", column:"<ColumnName>", newSeparator:"<DateSeparator>" }
  - CHANGE_DATE_FORMAT: { type: "CHANGE_DATE_FORMAT", issueType: "INVALID_FORMAT", column:"<ColumnName>", newFormat:"<DateFormat>"  }
  - TRANSFORM_TEXT: { type: "TRANSFORM_TEXT", column:"<ColumnName>", transform:"<TextTransform>" }
  - STANDARDIZE_TEXT_FORMAT or NORMALIZE or remove unnecessary white space or remove special characters: { type: "STANDARDIZE_TEXT_FORMAT", column:"<ColumnName>" }
  - TRIM_TEXT: { type: "TRIM_TEXT", column:"<ColumnName>" }
  - REPLACE_TEXT: { type: "REPLACE_TEXT", column:"<ColumnName>", findText:"<TextToFind>", replaceText:"<TextToReplace>" }
  - CONVERT_DATA_TYPES: { type: "CONVERT_DATA_TYPES", column:"<ColumnName>", dataType:"<DataType>"}
  - EXTRACT_KEYWORDS: { type: "EXTRACT_KEYWORDS", column:"<ColumnName>", extractWord:"<ExtractWord>"} }
  - GENERATE_UNIQUE_ID: { type: "GENERATE_UNIQUE_ID", columnName:"<ColumnName>", idType:"<IDType>"} }
  - TOKENIZE_TEXT: { type: "TOKENIZE_TEXT", column:"<ColumnName>""} }
  - CONVERT_TEXT_ENCODING: { type: "CONVERT_TEXT_ENCODING", column:"<ColumnName>", encoding: "<TargetEncoding>" }
  - REMOVE_SPECIAL_CHARACTERS: { type: "REMOVE_SPECIAL_CHARACTERS", column:"<ColumnName>", character:"<SpecialCharacter>", title:"<Title>", response:"<Response>" }

  - REMOVE_ALL_SPECIAL_CHARACTERS: { type: "REMOVE_ALL_SPECIAL_CHARACTERS", column:"<ColumnName>", title:"<Title>", response:"<Response>" }

  REMOVE_SPECIAL_CHARACTERS is a special case where the character to be removed is specified. The character should be one of the following: "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "+", "=", "{", "}", "[", "]", "|", ";", ":", "'", "\"", "<", ">", ",", ".", "?", '/', ',' '~'.

  REMOVE_ALL_SPECIAL_CHARACTERS is a special case where all special characters are removed from the text. This includes all characters that are not alphanumeric (letters and numbers). Note that this action does not require a specific character to be specified. use this if specific character is not mentioned.

  Your task is to generate an array of structured actions based on the provided schema. 

  Each action should contain:
  - type: The action type (e.g., "DELETE_COLUMN", "FILL_MISSING"). 
  - column: The affected column name (if applicable).
  - title: A short summary of the action performed. Ensure only one title field is present for valid response title is must.
  - response: Elaborate widely in deep and detail even more the action completed for the user. If possible male it more user friendly and easy to understand. If possible make it morethan 200 characters.
  - summary: Do not include this in each action. The summary must be provided **once**, separated from the list of actions. It should describe the overall effect of the actions generated in response to the user input. The summary should not be tied to a single action, but to the totality of changes the user asked for. Ensure it is present once and only once at the end of the entire response object.
  - If user uses greetings or something like starting communications, suggest the user that what he will do with the data and what you can do for him without creating any type.

  - for number never include quotes for value


      **Important Note:** 
    1. **If the user requests sorting (e.g., "order rows descending by age"), only return "SORT_ROWS_ASCENDING" or "SORT_ROWS_DESCENDING" actions.**
    2. Do NOT include "REMOVE_ROWS_WITH_ISSUES" unless the user explicitly asks for "cleaning," "removing errors," or "filtering invalid rows." If the request only involves filling missing values (e.g., "change null age to 25"), return only "FILL_MISSING".
    3. **Do not assume cleanup is required unless specified by the user.**
    4. **The output must match the schema keys exactly (case-sensitive). If a column does not exist in the schema, ignore the request.**
    5. Ensure that every valid action must must contains a "title" and "response" field for clarity and summarization for "REPLACE_ISSUE_WITH_VALUE" actions as well.
    6. Fill upper row can be interchangeable word with forward fill and lower row can be interchangeable word with backward fill.
    7. Fill word can be interchangeable with replace word.
    8. Division word can be interchangeable with divide word.
    9. Don't split single response into multiple responses unless it is distinct response. 
    10. the user may mention a number of decimal places (like "round to 2 decimal places"). Extract this value dynamically.
    11. When the user specifies the decimal places, use this value in the response (e.g., by: 2 for "round to 2 decimal places").

    If user send greetings or something like starting communications, suggest the user that what he will do with the data and what you can do for him.

    List of acceptable issue types:
  - "NULL_VALUE", "DUPLICATE_VALUE", "TYPE_MISMATCH", "INVALID_VALUE", "INVALID_FORMAT", "INVALID_SEPARATOR", "INVALID_DATE".

  The output **must** match the schema keys exactly (case-sensitive). If a column doesn't exist in the schema, ignore the request.
  `;

  // "Duplicate records", "Missing Fields", "Null Values", "Invalid Number Format", "Invalid Date Format", "Expected String But Found", "Negative Number Not Allowed".

  const userMessage = {
    role: "user",
    content: JSON.stringify({
      command: userInput,
      schema: schema,
      issues: issues
    }),
  };

  const messagesArray = [
    { role: "system", content: systemPrompt },
    userMessage,
  ].filter(Boolean);

  return messagesArray;
};


export const response_format = {
  type: "json_schema",
  json_schema: {
    name: "structured_data_actions",
    schema: {
      type: "object",
      properties: {
        actions: {
          type: "array",
          items: {
            type: "object",
            required: ["type", "title", "response"],
            properties: {
              type: { 
                type: "string", 
                enum: [
                  "DELETE_COLUMN",
                  "FILL_MISSING",
                  "REMOVE_ROWS_WITH_ISSUES",
                  "REPLACE_NEGATIVE_VALUES",
                  "REPLACE_VALUE",
                  "REPLACE_ROW",
                  "REPLACE_COLUMN_VALUES",
                  "DELETE_ROWS_WHERE_VALUE_EQUALS",
                  "DELETE_ROWS_WHERE_VALUE_LESS_THAN",
                  "DELETE_ROWS_WHERE_VALUE_GREATER_THAN",
                  "DELETE_ROWS_WITH_NEGATIVE_VALUES",
                  "DELETE_ROWS_WHERE_VALUE_NOT_IN_RANGE",
                  "DELETE_DUPLICATE_ROWS",
                  "DELETE_ROWS_WITH_NULLS",
                  "KEEP_ONLY_UNIQUE_ROWS",
                  "SORT_ROWS_ASCENDING",
                  "SORT_ROWS_DESCENDING",
                  "LIMIT_ROWS",
                  // "REMOVE_EMPTY_ROWS",
                  // "REMOVE_ROWS_WITH_ANY_ISSUE", 
                  // "REMOVE_ROWS_WITH_SPECIFIC_ISSUE", 
                  // "REMOVE_ROWS_WITH_COLUMN_ISSUES", 
                  // "REMOVE_ROWS_WITH_SPECIFIC_COLUMN_ISSUE",
                  // "REPLACE_ISSUE_WITH_VALUE", 
                  "FILL_WITH_AVERAGE",
                  "FILL_WITH_MEAN", 
                  "FILL_WITH_MODE",
                  "FILL_WITH_MEDIAN", 
                  "FILL_WITH_UPPER_ROW", 
                  "FILL_WITH_LOWER_ROW", 
                  "FILL_WITH_RANDOM",
                  "ROUND_COLUMN",
                  "ADDITION_TO_COLUMN",
                  "SUBTRACTION_FROM_COLUMN",
                  "MULTIPLICATION_COLUMN",
                  "DIVISION_COLUMN",
                  "RENAME_COLUMN",
                  "ADDITION_MULTIPLE_COLUMN",
                  "SUBSTRACTION_MULTIPLE_COLUMN",
                  "MULTIPLICATION_MULTIPLE_COLUMN",
                  "DIVIDE_MULTIPLE_COLUMN",
                  "CHANGE_SEPARATOR",
                  "CHANGE_DATE_FORMAT",
                  "TRANSFORM_TEXT",
                  "STANDARDIZE_TEXT_FORMAT",
                  "REPLACE_TEXT",
                  "TRIM_TEXT",
                  "CONVERT_DATA_TYPES",
                  "EXTRACT_KEYWORDS",
                  "GENERATE_UNIQUE_ID",
                  "TOKENIZE_TEXT",
                  "CONVERT_TEXT_ENCODING",
                  "REMOVE_SPECIAL_CHARACTERS",
                  "REMOVE_ALL_SPECIAL_CHARACTERS"
                ] 
              },
              column: { type: "string", nullable: true },
              defaultValue: { type: ["string", "number"], nullable: true },
              issueType: { type: "string", nullable: true },
              newValue: { type: ["string", "number"], nullable: true },
              oldValue: { type: ["string", "number"], nullable: true },
              rowNumber: { type: "number", nullable: true },
              newValues: { type: "object", additionalProperties: true, nullable: true },
              value: { type: ["string", "number"], nullable: true },
              minValue: { type: "number", nullable: true },
              maxValue: { type: "number", nullable: true },
              count: { type: "number", nullable: true },
              title: { type: "string" },
              response: { type: "string" },
              findText: { type: "string" },
              replaceText: { type: "string" },
              newFormat: {type: "string", enum:["YYYY/MM/DD", "DD/MM/YYYY", "MM/DD/YYYY","YYYY-MM-DD", "DD-MM-YYYY", "MM-DD-YYYY"]},
              transform: {type: "string", enum:["UPPERCASE", "LOWERCASE", "CAPITALIZE"]},
              dataType: {type: "string", enum:["STRING", "NUMBER", "DATE", "BOOLEAN"]},
              extractWord: {type: "string"},
              columnName: {type: "string"},
              idType: {type: "string", enum:["UUID", "AUTOINCREMENT"]},
              encoding: {type: "string", enum:["UTF-8", "ASCII", "ISO-8859-1"]},
              character: {type: "string", enum:["@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "+", "=", "{", "}", "[", "]", "|", ";", ":", "'", "\"", "<", ">", ",", ".", "?", "/", "`", "~"]},
              // targetColumn: { type: "array", items: { type: "string" }, nullable: true },
              // update: { type: "string", nullable: true },
              // by: { type: "string", nullable: true },
              // from: { type: "string", nullable: true },
              // to: { type: "string", nullable: true }
            }
          }
        },
        summary: {
          type: "string"
        }
      },
      required: ["actions", "summary"],
      additionalProperties: false
    }
  }
};

export const temperature = 0;
export const max_completion_tokens = 16384;
export const top_p = 1.0;
export const frequency_penalty = 0;
export const presence_penalty = 0;
