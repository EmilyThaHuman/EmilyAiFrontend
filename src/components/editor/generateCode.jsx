// generateCode.js
import toast from 'react-hot-toast';
import { request } from './lib/request';
import { map } from 'lodash';

const textDecoder = new TextDecoder('utf-8');
const ERROR_MESSAGE =
  'Error generating code. Check the Developer Console AND the backend logs for details. Feel free to open a Github issue.';

const STOP_MESSAGE = 'Code generation stopped';

export function generateCode(
  wsRef,
  params,
  onChange,
  onSetCode,
  onStatusUpdate,
  onComplete,
  onError
) {
  const handleError = error => {
    if (error.name === 'AbortError') {
      // Handle abort error
      console.error('Fetch aborted:', error);
    } else {
      // Handle other errors
      console.error('Fetch error:', error);
    }
    toast.error(ERROR_MESSAGE);
  };

  if (
    params.slug &&
    params.slug !== 'create' &&
    params.generationType === 'create'
  ) {
    let tempData = '';
    request
      .post(
        '/getTemplate',
        {
          data: {
            event: 'getTemplate',
            id: params.slug,
          },
        },
        {
          responseType: 'stream',
          fetch: (...args) => {
            return fetch(...args);
          },
        }
      )
      .then(data => {
        const reader = data.data.getReader();
        const push = () => {
          reader.read().then(({ done, value }) => {
            if (done) {
              handleMessage({
                data: tempData,
              });
              onComplete();
              return;
            }
            tempData += textDecoder.decode(value);
            push();
          });
        };
        push();
      }, handleError)
      .catch(error => {
        if (error.name === 'AbortError') {
          console.error('Fetch aborted:', error);
        } else {
          console.error('Fetch error:', error);
        }
      });
    return;
  }

  wsRef.current = new AbortController();

  async function handleMessage(event) {
    try {
      const response = JSON.parse(event.data);
      if (response.type === 'chunk') {
        onChange(response.value);
      } else if (response.type === 'status') {
        onStatusUpdate(response.value);
      } else if (response.type === 'setCode') {
        onSetCode(response.value.replace('```jsx', '').replace('```', ''));
      } else if (response.type === 'error') {
        console.error('Error generating code', response.value);
        onError(response.value);
        toast.error(response.value);
      }
    } catch (e) {
      console.log(event, e);
    }
  }

  wsRef.current.signal.addEventListener('abort', () => {
    toast.success(STOP_MESSAGE);
    onComplete();
  });

  try {
    request
      .post(
        '/generateCode',
        {
          event: 'generatecode',
          data: params,
        },
        {
          responseType: 'stream',
          fetch: (...args) => {
            return fetch(...args);
          },
        }
      )
      .then(data => {
        const reader = data.data.getReader();
        const push = () => {
          reader.read().then(({ done, value }) => {
            if (done) {
              console.log('done', done);
              onComplete();
              return;
            }
            map(textDecoder.decode(value).split('\n'), v => {
              v &&
                handleMessage({
                  data: v,
                });
            });
            push();
          });
        };
        push();
      }, handleError)
      .catch(error => {
        if (error.name === 'AbortError') {
          console.error('Fetch aborted:', error);
        } else {
          console.error('Fetch error:', error);
        }
      });
  } catch (e) {}
}
