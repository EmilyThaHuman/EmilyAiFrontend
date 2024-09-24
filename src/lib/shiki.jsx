import { renderToHtml, createHighlighter } from 'shiki';

let highlighter;

export async function highlight(code, theme, lang) {
  if (!highlighter) {
    highlighter = await createHighlighter({
      langs: [lang],
      theme: theme,
    });
  }

  const tokens = highlighter.codeToThemedTokens(code, lang, theme, {
    includeExplanation: false,
  });
  const html = renderToHtml(tokens, { bg: 'transparent' });

  return html;
};

export default highlight;