export const config = {
  connectorName: 'OpenAI with MongoDB Functions Connector',
  connectorVersion: '1.0.0',
  models: [
    'gpt-4o',
    'gpt-4-turbo',
    'gpt-4',
    'gpt-3.5-turbo',
  ],
  description:
    'This connector for Prompt Mixer allows you to access the OpenAI API from within Prompt Mixer. It now includes a function that can execute any query in MongoDB.',
  author: 'Prompt Mixer',
  properties: [
    {
      id: 'prompt',
      name: 'System Prompt',
      value: 'You are a helpful assistant.',
      type: 'string',
    },
    {
      id: 'max_tokens',
      name: 'Max Tokens',
      value: 4096,
      type: 'number',
    },
    {
      id: 'temperature',
      name: 'Temperature',
      value: 0.7,
      type: 'number',
    },
    {
      id: 'top_p',
      name: 'Top P',
      value: 1,
      type: 'number',
    },
    {
      id: 'frequency_penalty',
      name: 'Frequency Penalty',
      value: 0.5,
      type: 'number',
    },
    {
      id: 'presence_penalty',
      name: 'Presence Penalty',
      value: 0.5,
      type: 'number',
    },
    {
      id: 'stop',
      name: 'Stop Sequences',
      value: ['\n'],
      type: 'array',
    },
    {
      id: 'echo',
      name: 'Echo',
      value: false,
      type: 'boolean',
    },
    {
      id: 'best_of',
      name: 'Best Of',
      value: 1,
      type: 'number',
    },
    {
      id: 'logprobs',
      name: 'LogProbs',
      value: false,
      type: 'boolean',
    },
  ],
  settings: [
    {
      id: 'OPENAI_API_KEY',
      name: 'API Key',
      value: '',
      type: 'string',
    },
    {
      id: 'CONNECTION_STRING',
      name: 'Connection String',
      value: '',
      type: 'string',
    },
  ],
  iconBase64:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAILSURBVHgB1ZPNceJAEIX5O8BNIUAEy0aAHIHZCCwisLgBF8yFv4tFBJYzsCNARLA4grUjMCcKqAL2e1s9WzLCrvLNVtXUTP/odb83PbncV//y7wU6nU41n8/fsvzj8ejhWu73+8F0On3IfRbQwOYAPWJGm81mValUAs63+BLlsD+RE43H4+cPAcMw9Pj5juTVcDhsWQEf+47jC0CxYpybrAb2RRr0DWC32w1J7ouiEnEpUeBV7BY/JioYRZEAc71e7wZ/YzQaXWQA6SIwsJbRreEOWB5AodMUu260B+oM0NfD4fDTdVlwgIVC4ZpEJSXprklOAOsD9of4TJ2T+yJbfkur/sdxBxLrbG/A9BWLRXW1YP0SAwo00VZUa9g1m4DnDKAJXXU2I+JZoX/aodODGFDgEq3nhHx8Afs9/jADSGXRuXQgpVJJM9g47ZjYAn9b3ZodI8GVi5fcoVwuR9vt9hVd1NmA6rG7dV2I0RLIguIr/O5X+b0MIMPribYEp6oEl073hJZ26zP2mWmd/nzlZCjToTT01ut15AQXkG6fXWMR4v+RRtLAE9frmTnf6WDPobOcTCZt2W6I0y+FPTTtfouRLgp5orOAqTecAPxIdWlzZS9FMxpbXp9YHTYt92rOAjpQkgMAfHM1GKH2breLkUU6X+Nrnr7hdwHPFBDdGwEbxSdWcA7se3x/AeZhVUbFkV5NAAAAAElFTkSuQmCC',
};
