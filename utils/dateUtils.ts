// export interface WeekOption {
//   value: string
//   label: string
// }
// // Date validation utilities
// export const isValidDDMMYYYY = (dateString: string): boolean => {
//   if (!dateString) return false
//   const regex = /^\d{2}-\d{2}-\d{4}$/
//   if (!regex.test(dateString)) return false

//   const [day, month, year] = dateString.split("-").map(Number)
//   const date = new Date(year, month - 1, day)
//   return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year
// }

// export const isDateBefore = (startDate: string, endDate: string): boolean => {
//   if (!startDate || !endDate) return true

//   const [startDay, startMonth, startYear] = startDate.split("-").map(Number)
//   const [endDay, endMonth, endYear] = endDate.split("-").map(Number)

//   const start = new Date(startYear, startMonth - 1, startDay)
//   const end = new Date(endYear, endMonth - 1, endDay)

//   return start < end
// }


// /**
//  * Checks if first date is before second date (both in DD-MM-YYYY format)
//  */



// export function generateWeekOptions(startDate: string | Date, endDate: string | Date): WeekOption[] {
//   if (!startDate || !endDate) {
//     return []
//   }

//   const weeks: WeekOption[] = []

//   // Convert to Date objects if they're not already
//   const start = startDate instanceof Date ? startDate : new Date(startDate)
//   const end = endDate instanceof Date ? endDate : new Date(endDate)

//   if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//     return []
//   }

//   // Find the Monday of the first week
//   const firstMonday = new Date(start)
//   const dayOfWeek = start.getDay()
//   const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
//   firstMonday.setDate(start.getDate() - daysToMonday)

//   const currentWeekStart = new Date(firstMonday)
//   let weekNumber = 1

//   while (currentWeekStart <= end) {
//     const weekEnd = new Date(currentWeekStart)
//     weekEnd.setDate(currentWeekStart.getDate() + 6) // Saturday

//     // Format dates as DD/MM/YYYY
//     const startFormatted = formatDateForDisplay(currentWeekStart)
//     const endFormatted = formatDateForDisplay(weekEnd)

//     weeks.push({
//       value: `Week ${weekNumber}`,
//       label: `Week - ${weekNumber} (${startFormatted} - ${endFormatted})`,
//     })

//     // Move to next week
//     currentWeekStart.setDate(currentWeekStart.getDate() + 7)
//     weekNumber++

//     // Safety check to prevent infinite loop
//     if (weekNumber > 52) break
//   }

//   return weeks
// }

// export function formatDateForDisplay(date: Date): string {
//   const day = date.getDate().toString().padStart(2, "0")
//   const month = (date.getMonth() + 1).toString().padStart(2, "0")
//   const year = date.getFullYear()
//   return `${day}/${month}/${year}`
// }

// export function parseDate(dateString: string | Date): Date | null {
//   if (!dateString) return null

//   // If it's already a Date object
//   if (dateString instanceof Date) {
//     return dateString
//   }

//   // Handle string formats
//   try {
//     return new Date(dateString)
//   } catch (error) {
//     console.error("Error parsing date:", error)
//     return null
//   }
// }

// export function getSubjectType(subject: any): "theory" | "practical" | "both" | "unknown" {
//   if (!subject) return "unknown"

//   if (isSubjectBoth(subject)) return "both"
//   if (isSubjectTheoryOnly(subject)) return "theory"
//   if (isSubjectPracticalOnly(subject)) return "practical"

//   return "unknown"
// }

// export function shouldShowUnitPlanning(subject: any): boolean {
//   return !isSubjectPracticalOnly(subject)
// }

// export function shouldShowPracticalPlanning(subject: any): boolean {
//   return !isSubjectTheoryOnly(subject)
// }

// export function isSubjectTheoryOnly(subject: any): boolean {
//   return subject?.is_theory === true && subject?.is_practical === false
// }

// export function isSubjectPracticalOnly(subject: any): boolean {
//   return subject?.is_theory === false && subject?.is_practical === true
// }

// export function isSubjectBoth(subject: any): boolean {
//   return subject?.is_theory === true && subject?.is_practical === true
// }

// export function calculateWeeksBetween(startDate: string | Date, endDate: string | Date): number {
//   const start = parseDate(startDate)
//   const end = parseDate(endDate)

//   if (!start || !end) return 0

//   const diffTime = Math.abs(end.getTime() - start.getTime())
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
//   return Math.ceil(diffDays / 7)
// }

// export function validateDateRange(startDate: string | Date, endDate: string | Date): boolean {
//   const start = parseDate(startDate)
//   const end = parseDate(endDate)

//   if (!start || !end) return false

//   return start < end
// }

// export function isDateWithinRange(date: string | Date, startDate: string | Date, endDate: string | Date): boolean {
//   const checkDate = parseDate(date)
//   const start = parseDate(startDate)
//   const end = parseDate(endDate)

//   if (!checkDate || !start || !end) return false

//   return checkDate >= start && checkDate <= end
// }

// export function addDays(date: string | Date, days: number): Date {
//   const dateObj = parseDate(date)
//   if (!dateObj) return new Date()

//   const result = new Date(dateObj)
//   result.setDate(result.getDate() + days)
//   return result
// }

// export function getDaysDifference(date1: string | Date, date2: string | Date): number {
//   const d1 = parseDate(date1)
//   const d2 = parseDate(date2)

//   if (!d1 || !d2) return 0

//   const diffTime = Math.abs(d2.getTime() - d1.getTime())
//   return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
// }


export interface WeekOption {
  value: string
  label: string
}

// Date validation utilities - All dates in DD-MM-YYYY format
export const isValidDDMMYYYY = (dateString: string): boolean => {
  if (!dateString) return false

  // Only accept DD-MM-YYYY format
  const regex = /^\d{2}-\d{2}-\d{4}$/
  if (!regex.test(dateString)) return false

  const [day, month, year] = dateString.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year
}

export const isDateBefore = (startDate: string, endDate: string): boolean => {
  if (!startDate || !endDate) return true

  const startParsed = parseDDMMYYYYToDate(startDate)
  const endParsed = parseDDMMYYYYToDate(endDate)

  if (!startParsed || !endParsed) return true

  return startParsed < endParsed
}

/**
 * Convert any date format to DD-MM-YYYY format
 */
export const convertToStandardDateFormat = (dateInput: string | Date): string => {
  if (!dateInput) return ""

  let date: Date

  if (dateInput instanceof Date) {
    date = dateInput
  } else if (typeof dateInput === "string") {
    // Handle different input formats and convert to Date
    if (dateInput.match(/^\d{2}-\d{2}-\d{4}$/)) {
      // Already in DD-MM-YYYY format
      return dateInput
    } else if (dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // YYYY-MM-DD format
      date = new Date(dateInput)
    } else if (dateInput.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      // DD/MM/YYYY format
      const [day, month, year] = dateInput.split("/").map(Number)
      date = new Date(year, month - 1, day)
    } else if (dateInput.includes("T")) {
      // ISO format with time
      date = new Date(dateInput)
    } else {
      // Try to parse as is
      date = new Date(dateInput)
    }
  } else {
    return ""
  }

  if (isNaN(date.getTime())) {
    return ""
  }

  // Convert to DD-MM-YYYY format
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()

  return `${day}-${month}-${year}`
}

/**
 * Parse DD-MM-YYYY string to Date object
 */
export const parseDDMMYYYYToDate = (dateString: string): Date | null => {
  if (!dateString) return null

  // Convert to standard format first
  const standardDate = convertToStandardDateFormat(dateString)
  if (!standardDate) return null

  if (!isValidDDMMYYYY(standardDate)) return null

  const [day, month, year] = standardDate.split("-").map(Number)
  return new Date(year, month - 1, day)
}

/**
 * Convert Date object to DD-MM-YYYY format
 */
export const formatDateToDDMMYYYY = (date: Date): string => {
  if (!date || isNaN(date.getTime())) return ""

  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()

  return `${day}-${month}-${year}`
}

export function generateWeekOptions(startDate: string | Date, endDate: string | Date): WeekOption[] {
  if (!startDate || !endDate) {
    return []
  }

  const weeks: WeekOption[] = []

  // Convert to Date objects
  const start = typeof startDate === "string" ? parseDDMMYYYYToDate(startDate) : startDate
  const end = typeof endDate === "string" ? parseDDMMYYYYToDate(endDate) : endDate

  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
    return []
  }

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

    // Format dates as DD-MM-YYYY
    const startFormatted = formatDateToDDMMYYYY(currentWeekStart)
    const endFormatted = formatDateToDDMMYYYY(weekEnd)

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

export function formatDateForDisplay(date: Date): string {
  return formatDateToDDMMYYYY(date)
}

export function parseDate(dateString: string | Date): Date | null {
  if (!dateString) return null

  // If it's already a Date object
  if (dateString instanceof Date) {
    return dateString
  }

  // Convert any format to our standard DD-MM-YYYY and then parse
  return parseDDMMYYYYToDate(dateString)
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

export function calculateWeeksBetween(startDate: string | Date, endDate: string | Date): number {
  const start = parseDate(startDate)
  const end = parseDate(endDate)

  if (!start || !end) return 0

  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.ceil(diffDays / 7)
}

export function validateDateRange(startDate: string | Date, endDate: string | Date): boolean {
  const start = parseDate(startDate)
  const end = parseDate(endDate)

  if (!start || !end) return false

  return start < end
}

export function isDateWithinRange(date: string | Date, startDate: string | Date, endDate: string | Date): boolean {
  const checkDate = parseDate(date)
  const start = parseDate(startDate)
  const end = parseDate(endDate)

  if (!checkDate || !start || !end) return false

  return checkDate >= start && checkDate <= end
}

export function addDays(date: string | Date, days: number): Date {
  const dateObj = parseDate(date)
  if (!dateObj) return new Date()

  const result = new Date(dateObj)
  result.setDate(result.getDate() + days)
  return result
}

export function getDaysDifference(date1: string | Date, date2: string | Date): number {
  const d1 = parseDate(date1)
  const d2 = parseDate(date2)

  if (!d1 || !d2) return 0

  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Get current date in DD-MM-YYYY format
 */
export function getCurrentDateDDMMYYYY(): string {
  return formatDateToDDMMYYYY(new Date())
}

/**
 * Check if date1 is after date2 (both in DD-MM-YYYY format)
 */
export function isDateAfter(date1: string, date2: string): boolean {
  const d1 = parseDDMMYYYYToDate(date1)
  const d2 = parseDDMMYYYYToDate(date2)

  if (!d1 || !d2) return false

  return d1 > d2
}

/**
 * Check if two dates are equal (both in DD-MM-YYYY format)
 */
export function isDateEqual(date1: string, date2: string): boolean {
  const d1 = parseDDMMYYYYToDate(date1)
  const d2 = parseDDMMYYYYToDate(date2)

  if (!d1 || !d2) return false

  return d1.getTime() === d2.getTime()
}

/**
 * Add days to a DD-MM-YYYY date string and return in DD-MM-YYYY format
 */
export function addDaysToDDMMYYYY(dateString: string, days: number): string {
  const date = parseDDMMYYYYToDate(dateString)
  if (!date) return ""

  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days)

  return formatDateToDDMMYYYY(newDate)
}
