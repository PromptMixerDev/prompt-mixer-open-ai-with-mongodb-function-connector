import OpenAI from 'openai';
import { config } from './config.js';
import { ChatCompletion } from 'openai/resources';
import { MongoClient, ObjectId } from 'mongodb';

const OPENAI_API_KEY = 'OPENAI_API_KEY';
const CONNECTION_STRING = 'CONNECTION_STRING';

interface Message {
  role: string;
  content: string;
  tool_call_id?: string | null;
  name?: string | null;
}

interface Completion {
  Content: string | null;
  Error?: string | undefined;
  TokenUsage: number | undefined;
  ToolCalls?: any;
}

interface ConnectorResponse {
  Completions: Completion[];
  ModelType: string;
}

interface ErrorCompletion {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  error: string;
  model: string;
  usage: undefined;
}

const mapToResponse = (
  outputs: Array<ChatCompletion | ErrorCompletion>,
  model: string,
): ConnectorResponse => {
  return {
    Completions: outputs.map((output) => {
      if ('error' in output) {
        return {
          Content: null,
          TokenUsage: undefined,
          Error: output.error,
        };
      } else {
        return {
          Content: output.choices[0]?.message?.content,
          TokenUsage: output.usage?.total_tokens,
        };
      }
    }),
    ModelType: outputs[0].model || model,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapErrorToCompletion = (error: any, model: string): ErrorCompletion => {
  const errorMessage = error.message || JSON.stringify(error);
  return {
    choices: [],
    error: errorMessage,
    model,
    usage: undefined,
  };
};


async function testMongoDBQuery(query: any, connectionString: string) {
  console.log('Connecting to MongoDB');
  console.log(query);
  console.log(connectionString);

  // Create a new MongoClient instance using the connection string
  const client = new MongoClient(connectionString);

  try {
    console.log('Executing MongoDB query:', query);
    // Connect to the MongoDB server
    await client.connect();

    // Get the database and collection from the query object
    const database = client.db(query.database);
    const collection = database.collection(query.collection);

    // Execute the query based on the operation
    let result;
    switch (query.operation) {
      case 'find':
        result = await collection.find(query.filters).toArray();
        break;
      case 'insert':
        result = await collection.insertMany(query.documents);
        break;
      case 'insertOne':
        result = await collection.insertOne(query.document);
        break;
      case 'update':
        result = await collection.updateMany(query.filters, { $set: query.update });
        break;
      case 'delete':
        result = await collection.deleteMany(query.filters);
        break;
      default:
        throw new Error(`Unsupported operation: ${query.operation}`);
    }

    return result;
  } catch (error) {
    console.error('MongoDB query failed:', error);
    throw error; // Rethrow the error after logging
  } finally {
    await client.close(); // Close the MongoDB connection
  }
}

async function main(
  model: string,
  prompts: string[],
  properties: Record<string, unknown>,
  settings: Record<string, unknown>,
) {
  const openai = new OpenAI({
    apiKey: settings?.[OPENAI_API_KEY] as string,
  });

  const total = prompts.length;
  const { prompt, ...restProperties } = properties;
  const systemPrompt = (prompt ||
    config.properties.find((prop) => prop.id === 'prompt')?.value) as string;
  const messageHistory: Message[] = [{ role: 'system', content: systemPrompt }];
  const outputs: Array<ChatCompletion | ErrorCompletion> = [];

  const tools = [
    {
      type: 'function',
      function: {
        name: 'testMongoDBQuery',
        description: 'Execute a MongoDB query',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'object',
              properties: {
                database: {
                  type: 'string',
                  description: 'The name of the database',
                },
                collection: {
                  type: 'string',
                  description: 'The name of the collection',
                },
                operation: {
                  type: 'string',
                  description: 'The operation to perform (e.g., "find")',
                },
                filters: {
                  type: 'object',
                  description: 'The filters to apply to the query (optional)',
                },
              },
              required: ['database', 'collection', 'operation'],
            },
          },
          required: ['query'],
        },
      },
    },
  ];

  try {
    for (let index = 0; index < total; index++) {
      try {
        messageHistory.push({ role: 'user', content: prompts[index] });
        const chatCompletion = await openai.chat.completions.create({
          messages: messageHistory as unknown as [],
          model,
          tools: tools.map(tool => ({ type: "function", function: tool.function })),
          tool_choice: "auto",
          ...restProperties,
        });

        const assistantResponse = chatCompletion.choices[0].message.content || 'No response.';
        messageHistory.push({ role: 'assistant', content: assistantResponse });

        // Check if the assistant's response contains a tool call
        const toolCalls = chatCompletion.choices[0].message.tool_calls;
        if (toolCalls) {
          for (const toolCall of toolCalls) {
            if (toolCall.function.name === 'testMongoDBQuery') {
              const functionArgs = JSON.parse(toolCall.function.arguments);
              const connectionString = settings?.[CONNECTION_STRING] as string;
              const functionResponse = await testMongoDBQuery(functionArgs.query, connectionString);
              messageHistory.push({
                tool_call_id: toolCall.id,
                role: 'function',
                name: 'testMongoDBQuery',
                content: JSON.stringify(functionResponse),
              });
            }
          }
          const secondResponse = await openai.chat.completions.create({
            model: model,
            messages: messageHistory as unknown as [],
            ...restProperties,
          });
          const secondAssistantResponse = secondResponse.choices[0].message.content || 'No response.';
          outputs.push(secondResponse);
          messageHistory.push({ role: 'assistant', content: secondAssistantResponse });
        } else {
          outputs.push(chatCompletion);
        }
      } catch (error) {
        console.error('Error in main loop:', error);
        const completionWithError = mapErrorToCompletion(error, model);
        outputs.push(completionWithError);
      }
    }

    return mapToResponse(outputs, model);
  } catch (error) {
    console.error('Error in main function:', error);
    return { Error: error, ModelType: model };
  }
}

export { main, config };