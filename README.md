# Prompt Mixer OpenAI with MongoDb Function Calling Connector

This connector for Prompt Mixer allows you to access the OpenAI API from within Prompt Mixer. It now includes a function that can execute any query in MongoDB. 

## Features

- Connect to the OpenAI API and use various models to generate text, code, and more
- Pass prompts and settings to the OpenAI API with just a few clicks
- Output is displayed directly in Prompt Mixer
- Execute MongoDB queries through a callable function in the connector

## Installation

To install:

1. In Prompt Mixer, navigate to **Connectors** > **All Connectors**.
2. Locate **OpenAI with Function Calling** and install it.
3. After installation, go to **Connectors** > **Installed** > **OpenAI with Function Calling** to configure your API key and database connection string.

## Usage

After installing and configuring your API key and database connection string, you can start using any OpenAI model through the assistant panel in Prompt Mixer.

### Function Calling

During an API call, you can specify functions which the model will use to intelligently generate a JSON object. This object contains the necessary arguments for calling one or several functions. Note that the Chat Completions API will not execute these functions; it merely creates the JSON for you to use in your function calls within your own code.

For more details on how this works, consult the [OpenAI documentation](https://platform.openai.com/docs/guides/function-calling).

To test your functions, please fork this repository, then add and describe your functions.

## Connecting to MongoDB

To connect to your MongoDB database, add your connection string in the connector settings.

## Contributing

Pull requests and issues are welcome! Let me know if you have any problems using the connector or ideas for improvements.

For guidance on building your own connector, refer to this [documentation](https://docs.promptmixer.dev/tutorial-extras/create-a-custom-connector).

## License

MIT
