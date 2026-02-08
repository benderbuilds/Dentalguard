/**
 * Extracts patient information from the conversation history.
 * Scans both user messages (where patients volunteer info) and
 * assistant messages (where the bot may confirm/repeat info).
 */

export interface ExtractedPatientInfo {
  patient_name: string | null
  patient_phone: string | null
  patient_email: string | null
  patient_dob: string | null
  insurance_carrier: string | null
  reason_for_visit: string | null
  is_new_patient: boolean | null
}

interface ConversationMessage {
  role: string
  content: string
}

/**
 * Extract patient info by scanning conversation messages for common patterns.
 * Returns partial info — only fields that were detected.
 */
export function extractPatientInfo(messages: ConversationMessage[]): ExtractedPatientInfo {
  const info: ExtractedPatientInfo = {
    patient_name: null,
    patient_phone: null,
    patient_email: null,
    patient_dob: null,
    insurance_carrier: null,
    reason_for_visit: null,
    is_new_patient: null,
  }

  // Combine all user messages for scanning
  const userText = messages
    .filter((m) => m.role === 'user')
    .map((m) => m.content)
    .join('\n')

  // Phone: US formats (xxx) xxx-xxxx, xxx-xxx-xxxx, xxxxxxxxxx, xxx.xxx.xxxx
  const phoneMatch = userText.match(/\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}/)
  if (phoneMatch) {
    info.patient_phone = phoneMatch[0]
  }

  // Email
  const emailMatch = userText.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/)
  if (emailMatch) {
    info.patient_email = emailMatch[0].toLowerCase()
  }

  // DOB: MM/DD/YYYY, MM-DD-YYYY, Month DD YYYY patterns
  const dobMatch = userText.match(
    /\b(?:0?[1-9]|1[0-2])[\/\-](?:0?[1-9]|[12]\d|3[01])[\/\-](?:19|20)\d{2}\b/
  )
  if (dobMatch) {
    info.patient_dob = dobMatch[0]
  }

  // New patient detection
  const newPatientRegex = /\b(?:new patient|first time|never been|first visit|haven'?t been here)\b/i
  const existingPatientRegex = /\b(?:existing patient|been here before|current patient|returning)\b/i
  if (newPatientRegex.test(userText)) {
    info.is_new_patient = true
  } else if (existingPatientRegex.test(userText)) {
    info.is_new_patient = false
  }

  // Name: look for patterns like "my name is X", "I'm X", "this is X"
  const namePatterns = [
    /(?:my name is|i'm|i am|this is|name'?s)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    /(?:it'?s|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
  ]
  for (const pattern of namePatterns) {
    const match = userText.match(pattern)
    if (match?.[1]) {
      // Filter out common false positives
      const candidate = match[1].trim()
      const falsePositives = ['fine', 'good', 'great', 'ok', 'okay', 'here', 'back', 'calling', 'looking', 'wondering', 'hoping', 'trying']
      if (!falsePositives.includes(candidate.toLowerCase())) {
        info.patient_name = candidate
        break
      }
    }
  }

  // Reason for visit: look for dental procedure mentions
  const reasonPatterns = [
    /(?:need|want|schedule|book|looking for|here for|coming in for)\s+(?:a|an|my)?\s*(cleaning|checkup|check-?up|filling|crown|root canal|extraction|whitening|braces|invisalign|implant|dentures?|bridge|veneer|emergency|exam|consultation|x-?ray)/i,
    /(?:tooth|teeth|gum|jaw|mouth)\s*(?:ache|pain|hurts?|sore|swollen|broken|chipped|cracked|sensitive)/i,
  ]
  for (const pattern of reasonPatterns) {
    const match = userText.match(pattern)
    if (match) {
      info.reason_for_visit = match[0]
      break
    }
  }

  // Insurance carrier: look for common dental insurance names
  const insurancePatterns = [
    /(?:insurance is|i have|covered by|my insurance|carrier is)\s+([A-Z][\w\s]+?)(?:\.|,|$|\n)/im,
    /\b(delta dental|cigna|metlife|aetna|united ?healthcare|guardian|humana|blue cross|bcbs|anthem|principal|sun life|ameritas|lincoln financial)\b/i,
  ]
  for (const pattern of insurancePatterns) {
    const match = userText.match(pattern)
    if (match) {
      info.insurance_carrier = (match[1] || match[0]).trim()
      break
    }
  }

  return info
}

/**
 * Merge newly extracted info into existing conversation data.
 * Only overwrites null/empty fields — never removes previously captured data.
 */
export function mergePatientInfo(
  existing: Partial<ExtractedPatientInfo>,
  extracted: ExtractedPatientInfo
): Partial<ExtractedPatientInfo> {
  const merged: Partial<ExtractedPatientInfo> = { ...existing }

  for (const key of Object.keys(extracted) as (keyof ExtractedPatientInfo)[]) {
    const newVal = extracted[key]
    if (newVal !== null && newVal !== undefined && (merged[key] === null || merged[key] === undefined)) {
      ;(merged as Record<string, unknown>)[key] = newVal
    }
  }

  return merged
}
