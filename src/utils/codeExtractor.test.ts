/**
 * Test file for codeExtractor utility
 * Run this to verify the code extraction works correctly
 */

import { extractAndCleanCode, isValidHtml } from './codeExtractor';

// Test cases that mimic real AI responses
const testCases = [
  {
    name: 'AI response with explanatory text before HTML',
    input: `Understood, Baymax-NX. Here is a complete, modern, dark-themed calculator design, featuring responsive CSS and interactive JavaScript, all within a single HTML file as requested.

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Calculator</title>
    <style>
        body { background: #1a1a1a; color: white; }
        .calculator { max-width: 300px; margin: 50px auto; }
    </style>
</head>
<body>
    <div class="calculator">
        <h1>Calculator</h1>
        <input type="text" id="display" readonly>
    </div>
</body>
</html>`,
    shouldContainExplanation: false,
    shouldBeValidHtml: true
  },
  {
    name: 'AI response with HTML in code blocks',
    input: `Here's your calculator:

\`\`\`html
<!DOCTYPE html>
<html>
<head><title>Calculator</title></head>
<body><h1>Calculator</h1></body>
</html>
\`\`\`

This creates a simple calculator interface.`,
    shouldContainExplanation: false,
    shouldBeValidHtml: true
  },
  {
    name: 'AI response with mixed content',
    input: `I'll create a modern calculator for you. 

The calculator will have a dark theme and modern design.

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Calculator</title>
</head>
<body>
    <div>Calculator content</div>
</body>
</html>

This design features responsive layout and interactive elements.`,
    shouldContainExplanation: false,
    shouldBeValidHtml: true
  }
];

// Run tests
console.log('Testing codeExtractor utility...\n');

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);
  
  const result = extractAndCleanCode(testCase.input);
  const isValid = isValidHtml(result);
  
  console.log('Input length:', testCase.input.length);
  console.log('Output length:', result.length);
  console.log('Is valid HTML:', isValid);
  
  // Check if explanatory text was removed
  const hasExplanation = result.toLowerCase().includes('understood') || 
                        result.toLowerCase().includes('here is') ||
                        result.toLowerCase().includes('baymax') ||
                        result.toLowerCase().includes('i\'ll create');
  
  console.log('Contains explanatory text:', hasExplanation);
  console.log('Expected valid HTML:', testCase.shouldBeValidHtml, '| Actual:', isValid);
  console.log('Expected no explanation:', !testCase.shouldContainExplanation, '| Actual:', !hasExplanation);
  
  if (result.length > 200) {
    console.log('Output preview:', result.substring(0, 200) + '...');
  } else {
    console.log('Full output:', result);
  }
  
  console.log('---');
});

console.log('Tests completed. Check the results above to verify the extraction works correctly.');