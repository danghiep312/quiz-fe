import moment from "moment";

export function formatDateTime(dateTime) {
  if (dateTime) {
    return moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
  }
  return null;
}

export function formatDate(date) {
  if (date) {
    return moment(date).format("YYYY-MM-DD HH:mm");
  }
  return null;
}
