export function clockTimeToSeconds(clockTime: string) {
  const [_hours, _minutes] = clockTime.split(':');
  const hours = Number(_hours);
  const minutes = Number(_minutes);
  if (isNaN(hours) || isNaN(minutes)) {
    throw new Error(`Invalid clock time: ${clockTime}`);
  }
  const totalSeconds = Number(hours) * 3600 + Number(minutes) * 60;
  if (totalSeconds < 0 || totalSeconds >= 86400) {
    throw new Error(`Invalid clock time range: ${clockTime}`);
  }
  if (Number(hours) > 23 || Number(minutes) > 59) {
    throw new Error(`Invalid hour or minute value: ${clockTime}`);
  }
  return totalSeconds;
}

export function secondsToClockTime(totalSeconds: number): string {
  if (isNaN(totalSeconds)) {
    throw new Error(`Invalid input: ${totalSeconds}`);
  }
  if (totalSeconds < 0 || totalSeconds >= 86400) {
    throw new Error(`Invalid input range: ${totalSeconds}`);
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const paddedHours = hours.toString().padStart(2, '0');
  const paddedMinutes = minutes.toString().padStart(2, '0');
  return `${paddedHours}:${paddedMinutes}`;
}
