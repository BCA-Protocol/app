export function formatTimestamp(timestamp) {
  if (timestamp === undefined || timestamp === null) return "-";
  // Convert Firestore Timestamp to JavaScript Date object
  // const date = timestamp.toDate();
  const date = new Date(timestamp);

  // Format the date to 'M/D/YYYY, h:mm A' format
  const formattedDate = date.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return formattedDate;
}
