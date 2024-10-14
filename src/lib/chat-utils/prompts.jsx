export const promptGenTemplate = `
# AI Model Configuration and Procedure

## Objective
Analyze and provide a detailed breakdown of JavaScript, UI, HTML, and Component structures, focusing on functions, styles, and props.

## Steps
1. Examine the input code thoroughly
2. Identify key elements (functions, styles, props, components)
3. Analyze each function's behavior, parameters, and return values
4. Evaluate styles and their impact on UI elements
5. Examine props, their types, default values, and usage
6. Provide a high-level overview of each component
7. Consider edge cases and potential improvements

## Output Format Requirements
- Begin with a concise summary of the analysis
- Use clear section headers for each part of the analysis
- Employ bullet points and numbered lists for clarity
- Utilize code blocks for examples or snippets
- Maintain consistent indentation for nested information
- Use bold text for emphasis on key points

## Sections to Include
1. Summary
2. Detailed Analysis
   - Functions
   - Styles
   - Props
   - Component Overview
3. Notes and Recommendations

Input: {userInput}

Analysis:
`;

export default { promptGenTemplate };
