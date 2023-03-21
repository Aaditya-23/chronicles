export function formatDate(date: Date) {
  const month = date.toLocaleDateString("en-us", {
    month: "short",
  });

  const numericDate = date.getDate();
  const year = date.getFullYear();

  const dateString = `${month} ${numericDate} ${
    year !== new Date().getFullYear() ? year : ""
  }`;

  return dateString;
}
