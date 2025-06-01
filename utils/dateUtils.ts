export interface WeekOption {
    value: string
    label: string
  }
  
  export function generateWeekOptions(startDate: string, endDate: string): WeekOption[] {
    if (!startDate || !endDate) {
      return []
    }
  
    const weeks: WeekOption[] = []
    const start = new Date(startDate)
    const end = new Date(endDate)
  
    // Find the Monday of the first week
    const firstMonday = new Date(start)
    const dayOfWeek = start.getDay()
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    firstMonday.setDate(start.getDate() - daysToMonday)
  
    const currentWeekStart = new Date(firstMonday)
    let weekNumber = 1
  
    while (currentWeekStart <= end) {
      const weekEnd = new Date(currentWeekStart)
      weekEnd.setDate(currentWeekStart.getDate() + 6) // Saturday
  
      // Format dates as DD/MM/YYYY
      const startFormatted = formatDate(currentWeekStart)
      const endFormatted = formatDate(weekEnd)
  
      weeks.push({
        value: `Week ${weekNumber}`,
        label: `Week - ${weekNumber} (${startFormatted} - ${endFormatted})`,
      })
  
      // Move to next week
      currentWeekStart.setDate(currentWeekStart.getDate() + 7)
      weekNumber++
  
      // Safety check to prevent infinite loop
      if (weekNumber > 52) break
    }
  
    return weeks
  }
  
  function formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }
  
  export function parseDate(dateString: string): Date | null {
    if (!dateString) return null
  
    // Handle different date formats
    if (dateString.includes("/")) {
      // DD/MM/YYYY format
      const [day, month, year] = dateString.split("/")
      return new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
    } else if (dateString.includes("-")) {
      return new Date(dateString)
    }
  
    return new Date(dateString)
  }
  
 
  export function getSubjectType(subject: any): "theory" | "practical" | "both" | "unknown" {
    if (!subject) return "unknown"
  
    if (isSubjectBoth(subject)) return "both"
    if (isSubjectTheoryOnly(subject)) return "theory"
    if (isSubjectPracticalOnly(subject)) return "practical"
  
    return "unknown"
  }
  
  export function shouldShowUnitPlanning(subject: any): boolean {
    return !isSubjectPracticalOnly(subject)
  }
  
  export function shouldShowPracticalPlanning(subject: any): boolean {
    return !isSubjectTheoryOnly(subject)
  }
  
export function isSubjectTheoryOnly(subject: any): boolean {
    return subject?.is_theory === true && subject?.is_practical === false
  }
  
  export function isSubjectPracticalOnly(subject: any): boolean {
    return subject?.is_theory === false && subject?.is_practical === true
  }
  
  export function isSubjectBoth(subject: any): boolean {
    return subject?.is_theory === true && subject?.is_practical === true
  }
  

  
  export function calculateWeeksBetween(startDate: string, endDate: string): number {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.ceil(diffDays / 7)
  }
  
  export function validateDateRange(startDate: string, endDate: string): boolean {
    const start = new Date(startDate)
    const end = new Date(endDate)
    return start < end
  }
  
  export function isDateWithinRange(date: string, startDate: string, endDate: string): boolean {
    const checkDate = new Date(date)
    const start = new Date(startDate)
    const end = new Date(endDate)
    return checkDate >= start && checkDate <= end
  }
  
  export function addDays(date: string, days: number): string {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result.toISOString().split("T")[0]
  }
  
  export function getDaysDifference(date1: string, date2: string): number {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    const diffTime = Math.abs(d2.getTime() - d1.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
  