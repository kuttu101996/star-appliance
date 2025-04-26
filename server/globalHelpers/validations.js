function isValidDateOnly(dateString) {
  // Ensure the format is strictly YYYY-MM-DD using regex
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }

  // Convert to a Date object and check validity
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return false;
  }

  // Ensure no time information (hours, minutes, seconds should be zero)
  const formattedDate = date.toISOString().split("T")[0]; // Extract YYYY-MM-DD
  return dateString === formattedDate;
}

module.exports = { isValidDateOnly };
