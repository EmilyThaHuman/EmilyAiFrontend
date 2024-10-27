/* eslint-disable no-constant-condition */
const fetchData = async (url, body, accessToken) => {
  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    keepalive: true,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (response.status === 409) {
    const error = await response.json();
    throw new Error(error.detail);
  }

  return response.body?.getReader();
};

async function readStream(reader) {
  const result = await reader.read();
  return result.done ? null : new TextDecoder().decode(result.value);
}

async function processStream(reader, onStart, onText, shouldClose) {
  onStart();
  while (true) {
    if (shouldClose()) {
      await reader.cancel();
      return;
    }

    const text = await readStream(reader);
    if (text === null) break;
    onText(text);
  }
}

export const streamText = async (
  url,
  body,
  accessToken,
  onStart,
  onText,
  shouldClose
) => {
  const reader = await fetchData(url, body, accessToken);
  if (!reader) {
    console.error('Reader is undefined!');
    return;
  }

  await processStream(reader, onStart, onText, shouldClose);
};
