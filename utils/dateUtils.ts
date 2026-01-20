export const checkBusinessStatus = (schedules: any[]): boolean => {
  if (!schedules || schedules.length === 0) return false;

  const now = new Date();
  const currentDay = now.getDay();
  
  const currentTime = now.getHours() * 100 + now.getMinutes();

  const todaySchedule = schedules.find((s) => s.day_of_week === currentDay);

  if (!todaySchedule) return false;

  const open = parseInt(todaySchedule.open_time.replace(/:/g, '').substring(0, 4));
  const close = parseInt(todaySchedule.close_time.replace(/:/g, '').substring(0, 4));

  return currentTime >= open && currentTime <= close;
};