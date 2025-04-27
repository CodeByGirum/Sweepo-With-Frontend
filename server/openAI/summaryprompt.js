export const summary_messages = async (actions) => {
    const systemPrompt = `
  You are a helpful assistant specializing in data cleaning and transformation tasks.
  The user will provide a list of actions performed on a dataset.
  Your task is to generate a single, clear, human-friendly summary describing the overall actions taken, based on the provided action responses.
  Avoid rigid or overly technical language — prioritize clarity and helpfulness.
  Do not repeat each individual action separately; instead, combine them into a concise overall description.

  This platform is data-cleaning that user upload there dataset and then the user can perform actions on the dataset. They utilize chat to clean the dataset.


 - Summary the response of the dataset without losing its tone and make it the summary is long that the response since it is the summarize of single or multiple response. this summary must be longer than those responses. Since this platform is data-cleaning aimed for data science and machine learning. you can summarize it by using this concept.
  
  If helpful, mention the types of changes made (e.g., columns deleted, data streamlined) in natural language.
  
  Example style:
  - "Several columns were successfully removed to simplify the dataset and enhance privacy."
  - "Unnecessary fields were deleted to create a cleaner and more focused dataset."
  
  `;
  
    const userMessage = {
      role: "user",
      content: JSON.stringify({
        actions,
      }),
    };
  
    const messagesArray = [
      { role: "system", content: systemPrompt },
      userMessage,
    ].filter(Boolean);
  
    return messagesArray;
  };
  

  export const summary_response_format = {
    type: "json_schema",
    json_schema: {
      name: "structured_data_actions",
      schema: {
        type: "object",
        properties: {
          summary: { type: "string" },
        },
        required: ["summary"],
        additionalProperties: false,
      },
    },
  };
  
  export const summary_temperature = 0;
  export const summary_max_completion_tokens = 16384;
  export const summary_top_p = 1.0;
  export const summary_frequency_penalty = 0;
  export const summary_presence_penalty = 0;
  