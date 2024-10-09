/* eslint-disable no-case-declarations */
import path from 'path';
import { Typography } from '@mui/material';
import { getFileExtension } from '@/lib/fileUtils';
export function detectLanguage(fileName) {
  const extension = getFileExtension(fileName.toLowerCase());
  const languageMap = {
    '.js': 'JavaScript',
    '.jsx': 'JavaScript (React)',
    '.ts': 'TypeScript',
    '.tsx': 'TypeScript (React)',
    '.py': 'Python',
    '.rb': 'Ruby',
    '.java': 'Java',
    '.cs': 'C#',
    '.go': 'Go',
    '.php': 'PHP',
    '.swift': 'Swift',
    '.kt': 'Kotlin',
    '.rs': 'Rust',
    '.html': 'HTML',
    '.css': 'CSS',
    '.scss': 'SCSS',
    '.less': 'LESS',
  };
  return languageMap[extension] || 'Unknown';
}
export function convertToMarkdown(content) {
  if (!content.includes('<')) {
    return content;
  }

  // Split the content into code blocks and non-code blocks
  const blocks = content.split(/(<pre><code>[\s\S]*?<\/code><\/pre>)/);

  const convertedBlocks = blocks.map((block, index) => {
    // If it's an odd index, it's a code block, so we leave it as is
    if (index % 2 !== 0) {
      return block.replace(
        /<pre><code>([\s\S]*?)<\/code><\/pre>/g,
        '```jsx\n$1\n```\n\n'
      );
    }

    // For non-code blocks, apply the conversions
    return block
      .replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n')
      .replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n')
      .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
      .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
      .replace(/<em>(.*?)<\/em>/g, '*$1*')
      .replace(/<code>(.*?)<\/code>/g, '`$1`')
      .replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)')
      .replace(/<ul>([\s\S]*?)<\/ul>/g, (match, p1) => {
        return p1.replace(/<li>(.*?)<\/li>/g, '- $1\n');
      })
      .replace(/<ol>([\s\S]*?)<\/ol>/g, (match, p1) => {
        let counter = 1;
        return p1.replace(/<li>(.*?)<\/li>/g, () => `${counter++}. $1\n`);
      })
      .replace(/<[^>]+>/g, ''); // Remove any remaining HTML tags
  });

  // Join the blocks back together
  let markdown = convertedBlocks.join('');

  // Trim extra whitespace and newlines
  markdown = markdown.trim().replace(/\n{3,}/g, '\n\n');

  return markdown;
}

export function convertHtmlToMarkdown(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  let markdown = '';

  const traverse = node => {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        const element = node;
        switch (element.tagName.toLowerCase()) {
          case 'b':
          case 'strong':
            markdown += '**';
            break;
          case 'i':
          case 'em':
            markdown += '_';
            break;
          case 'code':
            markdown += '`';
            break;
          case 'pre':
            markdown += '```';
            break;
        }
        for (const child of element.childNodes) {
          traverse(child);
        }
        switch (element.tagName.toLowerCase()) {
          case 'b':
          case 'strong':
            markdown += '**';
            break;
          case 'i':
          case 'em':
            markdown += '_';
            break;
          case 'code':
            markdown += '`';
            break;
          case 'pre':
            markdown += '```';
            break;
        }
        break;
      case Node.TEXT_NODE:
        markdown += element.nodeValue.replace(/\n/g, ' ');
        break;
    }
  };

  for (const child of doc.body.childNodes) {
    traverse(child);
  }

  return markdown.trim();
}
export function extractCodeSnippets(data) {
  const codeRegex = /`([^`]+)`/g;
  const snippets = [];
  let match;

  while ((match = codeRegex.exec(data)) !== null) {
    let snippet = match[1];
    // Unescape newlines and quotes
    snippet = snippet.replace(/\\n/g, '\n').replace(/\\"/g, '"');
    snippets.push(snippet);
  }

  return snippets;
}
export function extractMarkdown(data) {
  const markdownRegex =
    /\[.*?\]\(.*?\)|\*\*.*?\*\*|__.*?__|\*.*?\*|_.*?_|`.*?`/g;
  return data.match(markdownRegex) || [];
}
export function processContent(content) {
  // Unescape special characters
  content = content.replace(/\\"/g, '"').replace(/\\n/g, '\n');
  console.log('Received content chunk:', content);
  // Here you can update the UI or perform any other processing
  // updateUI(content);
}
/**
 * Escape HTML characters
 * @param source
 */
export function encodeHTML(source) {
  return source
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const preprocessMarkdown = markdownContent => {
  return markdownContent
    .replace(/^jsx\\n/, '') // Remove leading "jsx\n"
    .replace(/\\n/g, '\n') // Replace "\n" with actual newlines
    .trim(); // Remove any leading/trailing whitespace
};

/**
 * Check if the text includes code
 * @param text
 */
export function includeCode(text) {
  const regexp = /^(?:\s{4}|\t).+/m;
  return text?.includes(' = ') || regexp.test(text);
}

/**
 * Formats the given text by replacing certain patterns with HTML tags.
 *
 * @param {string} text - The text to be formatted.
 * @returns {React.ReactNode} - The formatted text wrapped in a Typography component.
 */
export const formatText = text => {
  const formattedText = text
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Bold
    .replace(/\*(.*?)\*/g, '<i>$1</i>') // Italic
    .replace(/`(.*?)`/g, '<code>$1</code>'); // Code

  return <Typography dangerouslySetInnerHTML={{ __html: formattedText }} />;
};

/**
 * Removes code wrapping from a string.
 *
 * @param {string} str - The string to remove code wrapping from.
 * @returns {string} - The string without code wrapping.
 */
export function removeCodeWrapping(str) {
  if (str.startsWith('```') && str.endsWith('```')) {
    return str.slice(3, -3);
  } else {
    return str.replace('```', '');
  }
}

/**
 * Copy text to clipboard
 * @param options
 */
export function copyText(options) {
  const props = { origin: true, ...options };

  let input;

  if (props.origin) input = document.createElement('textarea');
  else input = document.createElement('input');

  input.setAttribute('readonly', 'readonly');
  input.value = props.text;
  document.body.appendChild(input);
  input.select();
  if (document.execCommand('copy')) document.execCommand('copy');
  document.body.removeChild(input);
}

/**
 * Safely parses a JSON string into an object.
 * @param {string} jsonString - The JSON string to parse.
 * @param {any} defaultValue - The value to return if parsing fails (default is null).
 * @returns {any} - The parsed object or the default value.
 */
export const safeParse = (jsonString, defaultValue = null) => {
  try {
    console.log(`Type: ${typeof jsonString}, Value: ${jsonString}`);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to parse JSON string:', error);
    return defaultValue;
  }
};

export function cleanUpText(text) {
  // Remove unnecessary characters
  return text
    .replace(/""/g, '') // Remove all double double quotes
    .replace(/\\n/g, '\n') // Replace escaped new lines with actual new lines
    .replace(/\\"/g, '"') // Replace escaped quotes with regular quotes
    .replace(/\\t/g, '\t') // Replace escaped tabs with actual tabs if needed
    .replace(/#""/g, '#') // Remove escaped hash symbols if present
    .replace(/"{2,}/g, ' ') // Replace multiple double quotes with a space
    .replace(/\s{2,}/g, ' ') // Replace extra spaces
    .trim(); // Trim any leading or trailing whitespace
}
/**
 * Formats the response based on the type of data received.
 *
 * @param {Object} json - The JSON object containing the response data.
 * @returns {string} - The formatted response.
 */
export const formatResponse = json => {
  let formatted = '';
  console.log(`Type: ${typeof json}, Value: ${json}`);
  switch (json.type) {
    case 'code':
      formatted = `### Code\n\n\`\`\`${json.data.language}\n${json.data.content}\n\`\`\`\n\n`;
      break;
    case 'markdown':
      formatted = `### Markdown\n\n${json.data.content}\n\n`;
      break;
    case 'text':
      formatted = `### Text\n\n${json.data.content}\n\n`;
      break;
    default:
      // formatted = formatTextResponse(json.data);
      formatted = '```json\n' + JSON.stringify(json, null, 2) + '\n```\n\n';
  }

  return formatted;
};

/**
 * Extracts code blocks from a string.
 *
 * @param {string} message - The input string containing code blocks.
 * @returns {string[]} - An array of code blocks extracted from the input string.
 */
export const extractCodeFromString = message => {
  if (message.includes('```')) {
    const blocks = message.split('```');
    return blocks;
  }
};

/**
 * Checks if a string contains any code block indicators.
 *
 * @param {string} str - The string to check.
 * @returns {boolean} - Returns true if the string contains any code block indicators, otherwise returns false.
 */
export const isCodeBlock = str => {
  if (
    str.includes('=') ||
    str.includes(';') ||
    str.includes('[') ||
    str.includes(']') ||
    str.includes('{') ||
    str.includes('}') ||
    str.includes('#') ||
    str.includes('//')
  ) {
    return true;
  }
  return false;
};

export function extractHTMLContent(data) {
  const sections = data.sections;
  let htmlContent = '';

  for (const key in sections) {
    const content = sections[key];
    if (content.type) {
      switch (content.type) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'p':
        case 'blockquote':
          htmlContent += `<${content.type}>${content.content}</${content.type}>\n`;
          break;
        case 'a':
          htmlContent += `<a href="${content.href}">${content.content}</a>\n`;
          break;
        case 'img':
          htmlContent += `<img src="${content.src}" alt="${content.alt}" />\n`;
          break;
        case 'ul':
        case 'ol':
          const listItems = content.content
            .map(item => `<li>${item}</li>`)
            .join('\n');
          htmlContent += `<${content.type}>\n${listItems}\n</${content.type}>\n`;
          break;
        case 'pre':
          htmlContent += `<pre>${content.content}</pre>\n`;
          break;
        case 'code':
          htmlContent += `<code>${content.content}</code>\n`;
          break;
        case 'table':
          const headerRow = content.content[0]
            .map(item => `<th>${item}</th>`)
            .join('');
          const bodyRows = content.content
            .slice(1)
            .map(row => {
              return `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
            })
            .join('\n');
          htmlContent += `<table>\n<thead><tr>${headerRow}</tr></thead>\n<tbody>\n${bodyRows}\n</tbody>\n</table>\n`;
          break;
        default:
          break;
      }
    }
  }

  return htmlContent;
}

export function extractMarkdownContent(messageContent) {
  try {
    if (
      typeof messageContent === 'string' &&
      messageContent.startsWith('{') &&
      messageContent.endsWith('}')
    ) {
      const parsedContent = JSON.parse(messageContent?.data);
      if (parsedContent.pageLayout) {
        return parsedContent.pageLayout;
      }
      return JSON.stringify(parsedContent, null, 2);
    }
  } catch (error) {
    console.error('Error parsing JSON content:', error);
  }

  return messageContent;
}

export function parseJsonString(jsonString) {
  if (typeof jsonString !== 'string') {
    return null;
  }

  // First, unescape the double quotes
  const correctedString = jsonString.replace(/\\"/g, '"');
  // Remove any backslashes that are not part of the JSON structure
  const cleanedString = correctedString.replace(/\\(?!["\\/])/g, '');

  try {
    // Attempt to parse the cleaned JSON string
    return JSON.parse(cleanedString);
  } catch (error) {
    console.error('Failed to parse JSON string:', error);
    return null;
  }
}

/**
 * Organizes an array of messages by role.
 *
 * @param {Array} messages - The array of messages to be organized.
 * @returns {Array} - The organized array of messages.
 * @example organizeMessages([
 *  { role: 'author', content: 'Hello, this is a message from the author.' },
 * { role: 'author', content: 'This is a second message from the author.' },
 * { role: 'user', content: 'Hi, this is a message from the user.' },
 * { role: 'user', content: 'This is a third message from the user.' }
 * ]) => [
 * { type:'start', role: 'author' },
 * { role: 'author', content: 'Hello, this is a message from the author.' },
 * { type:'start', role: 'user' },
 * { role: 'user', content: 'Hi, this is a message from the user.' },
 * { role: 'user', content : 'This is a second message from the author.' },
 */
export const organizeMessages = messages => {
  const organizedMessages = [];
  let currentRole = null;

  messages.forEach((message, index) => {
    if (message.role !== currentRole) {
      if (currentRole !== null) {
        organizedMessages.push({ type: 'end', role: currentRole });
      }
      organizedMessages.push({ type: 'start', role: message.role });
      currentRole = message.role;
    }
    organizedMessages.push(message);
    if (index === messages.length - 1) {
      organizedMessages.push({ type: 'end', role: message.role });
    }
  });

  return organizedMessages;
};

/**
 * Filters an array of messages, removing duplicates and messages with specific types.
 * @param {Array} messages - The array of messages to filter.
 * @returns {Array} - The filtered array of messages.
 */
export const filterMessagesWithContent = messages => {
  const seen = new Set();
  return messages.filter(message => {
    if (
      message.content &&
      !seen.has(message.content) &&
      message.type !== 'start' &&
      message.type !== 'end'
    ) {
      seen.add(message.content);
      return true;
    }
    return false;
  });
};
