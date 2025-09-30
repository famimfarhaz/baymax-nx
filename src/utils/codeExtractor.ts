/**
 * Utility functions to extract clean HTML/CSS/JS code from AI responses
 * Removes explanatory text and returns only the executable code
 */

/**
 * Extracts HTML code blocks from AI response text
 * Looks for HTML content between code blocks or HTML tags
 */
export function extractHtmlCode(aiResponse: string): string {
  // Remove any explanatory text before code blocks
  let cleanedCode = aiResponse;

  // Try to find HTML code within markdown code blocks
  const codeBlockRegex = /```(?:html|HTML)?\s*([\s\S]*?)```/gi;
  const codeBlockMatches = aiResponse.match(codeBlockRegex);
  
  if (codeBlockMatches && codeBlockMatches.length > 0) {
    // Extract code from the first/largest code block
    const largestBlock = codeBlockMatches.reduce((prev, current) => 
      current.length > prev.length ? current : prev
    );
    cleanedCode = largestBlock.replace(/```(?:html|HTML)?\s*/, '').replace(/```\s*$/, '');
  } else {
    // If no code blocks found, look for HTML content directly
    const htmlStartRegex = /<!DOCTYPE html>|<html[^>]*>/i;
    const htmlStartMatch = cleanedCode.search(htmlStartRegex);
    
    if (htmlStartMatch !== -1) {
      // Extract from first HTML tag to end of HTML
      cleanedCode = cleanedCode.substring(htmlStartMatch);
      
      // Try to find the end of HTML content
      const htmlEndRegex = /<\/html>\s*$/i;
      const htmlEndMatch = cleanedCode.search(htmlEndRegex);
      
      if (htmlEndMatch !== -1) {
        cleanedCode = cleanedCode.substring(0, htmlEndMatch + 7); // Include </html>
      }
    } else {
      // Look for any HTML-like content
      const htmlTagRegex = /<[^>]+>/;
      const htmlTagMatch = cleanedCode.search(htmlTagRegex);
      
      if (htmlTagMatch !== -1) {
        cleanedCode = cleanedCode.substring(htmlTagMatch);
      }
    }
  }

  // Clean up any remaining explanatory text patterns
  cleanedCode = cleanedCode
    // Remove lines that look like explanations or instructions
    .replace(/^.*(?:understood|here is|here's|i've created|this is|let me create).*$/gmi, '')
    // Remove lines that mention AI assistant or Baymax
    .replace(/^.*(?:baymax|assistant|ai).*$/gmi, '')
    // Remove lines with just explanatory text
    .replace(/^.*(?:complete|modern|dark-themed|calculator|design|featuring).*(?:html|css|javascript).*$/gmi, '')
    // Remove excessive whitespace
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();

  // If the result doesn't look like HTML, try a different approach
  if (!cleanedCode.includes('<') || !cleanedCode.includes('>')) {
    // Last resort: return original response if no HTML found
    return aiResponse;
  }

  return cleanedCode;
}

/**
 * Validates if the extracted code looks like valid HTML
 */
export function isValidHtml(code: string): boolean {
  // Basic checks for HTML structure
  const hasHtmlTags = code.includes('<') && code.includes('>');
  const hasDoctype = code.toLowerCase().includes('<!doctype') || code.toLowerCase().includes('<html');
  const hasBodyOrContent = code.toLowerCase().includes('<body') || code.toLowerCase().includes('<div') || code.toLowerCase().includes('<main');
  
  return hasHtmlTags && (hasDoctype || hasBodyOrContent);
}

/**
 * Extracts and cleans code from AI response with multiple fallback strategies
 */
export function extractAndCleanCode(aiResponse: string): string {
  // Strategy 1: Try to extract from code blocks
  let cleanedCode = extractHtmlCode(aiResponse);
  
  // Strategy 2: If extracted code is not valid, try different patterns
  if (!isValidHtml(cleanedCode)) {
    // Look for the largest chunk of text that contains HTML
    const lines = aiResponse.split('\n');
    let htmlLines: string[] = [];
    let inHtmlSection = false;
    
    for (const line of lines) {
      // Skip obvious explanation lines
      if (line.toLowerCase().includes('understood') || 
          line.toLowerCase().includes('here is') ||
          line.toLowerCase().includes('baymax') ||
          (line.toLowerCase().includes('complete') && line.toLowerCase().includes('design'))) {
        continue;
      }
      
      // Start collecting when we see HTML
      if (line.includes('<') || inHtmlSection) {
        inHtmlSection = true;
        htmlLines.push(line);
      }
      
      // Stop if we hit another explanation line after HTML started
      if (inHtmlSection && line.trim() && !line.includes('<') && !line.includes('>') && 
          (line.toLowerCase().includes('this') || line.toLowerCase().includes('the above'))) {
        break;
      }
    }
    
    if (htmlLines.length > 0) {
      cleanedCode = htmlLines.join('\n').trim();
    }
  }
  
  // Final validation
  if (!isValidHtml(cleanedCode)) {
    console.warn('Could not extract valid HTML from AI response');
    // Return a basic HTML structure if nothing else works
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Content</title>
</head>
<body>
    <div style="padding: 20px; text-align: center;">
        <h1>Content Generated</h1>
        <p>The AI response could not be processed into HTML. Please try again.</p>
    </div>
</body>
</html>`;
  }
  
  return cleanedCode;
}