/**
 * Calculate estimated reading time in minutes based on word count.
 * Uses the industry standard average reading speed (~200 words per minute).
 *
 * @param {string} content - The text or markdown content of the article.
 * @param {number} [wordsPerMinute=200] - Average reading speed in words per minute.
 * @returns {string} Formatted reading time string (e.g. "1 min read", "4 min read").
 */
export const getReadTime = (content, wordsPerMinute = 200) => {
  if (!content || typeof content !== "string") {
    return "1 min read";
  }

  // Strip HTML tags and collapse whitespace
  const cleanText = content.replace(/<[^>]*>/g, " ").trim();
  if (!cleanText) {
    return "1 min read";
  }

  const words = cleanText.split(/\s+/).filter(Boolean).length;
  if (words === 0) {
    return "1 min read";
  }

  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

export default getReadTime;
