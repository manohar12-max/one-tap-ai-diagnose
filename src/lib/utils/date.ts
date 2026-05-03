export function combineDateTime(date: Date | string, timeStr: string | null) {
  if (!date || !timeStr) return null;
  
  try {
    const d = new Date(date);
    const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    
    if (!timeMatch) return d;
    
    let hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    const modifier = timeMatch[3].toUpperCase();
    
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    
    d.setHours(hours, minutes, 0, 0);
    return d;
  } catch (e) {
    return new Date(date);
  }
}
