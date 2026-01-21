export const checkBusinessStatus = (schedules: any[]) => {
  if (!schedules || schedules.length === 0) return false;

  const now = new Date();
  // Ajustamos para obtener el día actual (0 = Domingo, 1 = Lunes, etc.)
  const currentDay = now.getDay(); 
  const currentTime = now.getHours() * 100 + now.getMinutes(); // Ejemplo: 01:30 -> 130

  // Buscamos el horario de HOY y también el de AYER (por si la jornada sigue abierta)
  const todaySchedule = schedules.find(s => s.day_of_week === currentDay);
  const yesterdayDay = currentDay === 0 ? 6 : currentDay - 1;
  const yesterdaySchedule = schedules.find(s => s.day_of_week === yesterdayDay);

  // Caso 1: Revisar si la jornada de HOY está abierta
  if (todaySchedule?.is_open) {
    const open = parseInt(todaySchedule.open_time.replace(':', ''));
    const close = parseInt(todaySchedule.close_time.replace(':', ''));

    if (close > open) {
      // Horario normal (ej: 09:00 a 18:00)
      if (currentTime >= open && currentTime <= close) return true;
    } else {
      // Horario nocturno (ej: 19:00 a 02:00)
      // Está abierto si es más tarde de la apertura O si es antes de la medianoche
      if (currentTime >= open) return true;
    }
  }

  // Caso 2: Revisar si la jornada de AYER sigue abierta (Post-medianoche)
  if (yesterdaySchedule?.is_open) {
    const openYesterday = parseInt(yesterdaySchedule.open_time.replace(':', ''));
    const closeYesterday = parseInt(yesterdaySchedule.close_time.replace(':', ''));

    if (closeYesterday < openYesterday) {
      // Si ayer cerraba después de la medianoche y ahora es antes de esa hora de cierre
      if (currentTime <= closeYesterday) return true;
    }
  }

  return false;
};