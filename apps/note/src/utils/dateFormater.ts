import dayjs from 'dayjs';

const DATE_FORMAT = 'HH:mm DD-MM-YYYY';

export function dateFormat(s: string) {
  return dayjs(s).format(DATE_FORMAT);
}
