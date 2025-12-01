export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const format = (date: Date, formatStr: string): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const months: { [key: string]: string } = {
    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
    'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthStr = monthNames[date.getMonth()];

  let result = formatStr;
  result = result.replace('MMM', monthStr);
  result = result.replace('MM', month);
  result = result.replace('dd', day);
  result = result.replace('yyyy', String(year));
  result = result.replace('hh', String(date.getHours() % 12 || 12).padStart(2, '0'));
  result = result.replace('mm', minutes);
  result = result.replace('ss', seconds);
  
  const meridiem = date.getHours() >= 12 ? 'PM' : 'AM';
  result = result.replace('a', meridiem);

  return result;
};

export const formatDistanceToNowStrict = (date: Date, options?: { addSuffix?: boolean }): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  let result = '';

  if (diffYears > 0) {
    result = `${diffYears} year${diffYears > 1 ? 's' : ''}`;
  } else if (diffMonths > 0) {
    result = `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
  } else if (diffWeeks > 0) {
    result = `${diffWeeks} week${diffWeeks > 1 ? 's' : ''}`;
  } else if (diffDays > 0) {
    result = `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  } else if (diffHours > 0) {
    result = `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  } else if (diffMins > 0) {
    result = `${diffMins} minute${diffMins > 1 ? 's' : ''}`;
  } else {
    result = 'just now';
  }

  if (options?.addSuffix && result !== 'just now') {
    result = `${result} ago`;
  }

  return result;
};
