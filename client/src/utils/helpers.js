export function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export function truncateText(text, length = 30) {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}
