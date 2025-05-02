// Creating a fake OpenAI client for local development
const openai = {
  chat: {
    completions: {
      create: async () => {
        return {
          choices: [
            {
              message: {
                content: "This is a mock response from the OpenAI API. The actual API key is required for production use."
              }
            }
          ]
        };
      }
    }
  }
};

export default openai;