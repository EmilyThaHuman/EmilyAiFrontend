// testEndpoints.js

const axios = require('axios');
const readlineSync = require('readline-sync');
/**
 * axiosInstance instance for making API requests.
 *
 * @type {import("axiosInstance").axiosInstanceInstance}
 */
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 40000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
const REEDAI_ENDPOINT = 'http://localhost:3001';
const HOSTED_ENDPOINT = `${REEDAI_ENDPOINT}/api/chat/hosted`;
const GEN_TEXT_ENDPOINT = `${REEDAI_ENDPOINT}/api/chat/hosted/generate-text`;
const GEN_TEXT_STREAM_ENDPOINT = `${REEDAI_ENDPOINT}/api/chat/hosted/generate-text-stream`;
const GEN_CHAT_ENDPOINT = `${REEDAI_ENDPOINT}/api/chat/hosted/chat-completion`;
const GEN_CHAT_STREAM_ENDPOINT = `${REEDAI_ENDPOINT}/api/chat/hosted/chat-completion-stream`;
const RAG_ENDPOINT = `${REEDAI_ENDPOINT}/api/chat/hosted/rag`;

// Function to test Text Generation
const testTextGeneration = async () => {
  const prompt = readlineSync.question('Enter prompt for Text Generation: ');

  try {
    const response = await axiosInstance.post(GEN_TEXT_ENDPOINT, { prompt });
    console.log('Text Generation Response:', response.data.result);
  } catch (error) {
    console.error(
      'Error in Text Generation:',
      error.response?.data || error.message
    );
  }
};

// Function to test Streamed Text Generation
const testStreamTextGeneration = async () => {
  const prompt = readlineSync.question(
    'Enter prompt for Streamed Text Generation: '
  );

  try {
    const response = await axiosInstance.post(
      GEN_TEXT_STREAM_ENDPOINT,
      { prompt },
      { responseType: 'stream' }
    );
    console.log('Streamed Text Generation Response:');

    response.data.on('data', chunk => {
      process.stdout.write(chunk.toString());
    });

    response.data.on('end', () => {
      console.log('\nStream ended.');
    });
  } catch (error) {
    console.error(
      'Error in Streamed Text Generation:',
      error.response?.data || error.message
    );
  }
};

// Function to test Chat Completion
const testChatCompletion = async () => {
  const userMessage = readlineSync.question(
    'Enter your message for Chat Completion: '
  );

  const messages = [
    { role: 'user', content: userMessage },
    // Add more messages as needed for context
  ];

  try {
    const response = await axiosInstance.post(GEN_CHAT_ENDPOINT, { messages });
    console.log('Chat Completion Response:', response.data.result);
  } catch (error) {
    console.error(
      'Error in Chat Completion:',
      error.response?.data || error.message
    );
  }
};

// Function to test Streamed Chat Completion
const testStreamChatCompletion = async () => {
  const userMessage = readlineSync.question(
    'Enter your message for Streamed Chat Completion: '
  );

  const messages = [
    { role: 'user', content: userMessage },
    // Add more messages as needed for context
  ];

  try {
    const response = await axiosInstance.post(
      GEN_CHAT_STREAM_ENDPOINT,
      { messages },
      { responseType: 'stream' }
    );
    console.log('Streamed Chat Completion Response:');

    response.data.on('data', chunk => {
      process.stdout.write(chunk.toString());
    });

    response.data.on('end', () => {
      console.log('\nStream ended.');
    });
  } catch (error) {
    console.error(
      'Error in Streamed Chat Completion:',
      error.response?.data || error.message
    );
  }
};

// Function to test Retrieval-Augmented Generation (RAG)
const testRAG = async () => {
  const query = readlineSync.question('Enter your query for RAG: ');
  const vector = readlineSync.question(
    'Enter your vector for RAG (as JSON array): '
  );

  let parsedVector;
  try {
    parsedVector = JSON.parse(vector);
    if (!Array.isArray(parsedVector))
      throw new Error('Vector must be an array.');
  } catch (err) {
    console.error('Invalid vector format:', err.message);
    return;
  }

  try {
    const response = await axiosInstance.post(RAG_ENDPOINT, {
      query,
      vector: parsedVector,
    });
    console.log('RAG Response:', response.data.result);
  } catch (error) {
    console.error('Error in RAG:', error.response?.data || error.message);
  }
};

// Main Menu
const main = async () => {
  console.log('=== Chat API Endpoints Tester ===\n');
  console.log('Select an endpoint to test:');
  console.log('1. Text Generation');
  console.log('2. Streamed Text Generation');
  console.log('3. Chat Completion');
  console.log('4. Streamed Chat Completion');
  console.log('5. Retrieval-Augmented Generation (RAG)');
  console.log('6. Exit');

  const choice = readlineSync.question('\nEnter your choice (1-6): ');

  switch (choice) {
    case '1':
      await testTextGeneration();
      break;
    case '2':
      await testStreamTextGeneration();
      break;
    case '3':
      await testChatCompletion();
      break;
    case '4':
      await testStreamChatCompletion();
      break;
    case '5':
      await testRAG();
      break;
    case '6':
      console.log('Exiting...');
      process.exit(0);
      break;
    default:
      console.log('Invalid choice. Please try again.');
  }

  // After testing, return to main menu
  console.log('\n');
  main();
};

// Start the tester
main();
