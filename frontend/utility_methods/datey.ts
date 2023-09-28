import moment from "moment";

export const dateInPast = function (firstDate: Date, secondDate: Date) {
  if (firstDate.setHours(0, 0, 0, 0) <= secondDate.setHours(0, 0, 0, 0)) {
    return true;
  }

  return false;
};

export const formatDate = (date: Date | string) => {
  if (date) {
    const dt = new Date(date);
    const month = dt.getMonth() + 1 < 10 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1;
    const day = dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate();

    return day + "/" + month + "/" + dt.getFullYear();
  }

  return "";
};

export const getYear = (date: Date) => moment(date).year();
