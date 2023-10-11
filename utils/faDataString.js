const faDataString = dateString => {
  const date = new Date(dateString);
  const options = {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  };

  return date.toLocaleString("fa-IR", options);
};

export default faDataString;
