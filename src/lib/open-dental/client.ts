import type {
  ODProvider,
  ODOperatory,
  ODAppointmentType,
  ODAppointmentSlot,
  ODPatient,
  ODAppointment,
  ODCommLog,
} from './types'

const OD_BASE_URL = 'https://api.opendental.com/api/v1'

export class OpenDentalClient {
  private developerKey: string
  private customerKey: string

  constructor(customerKey: string) {
    const devKey = process.env.OPEN_DENTAL_DEVELOPER_KEY
    if (!devKey) {
      throw new Error('OPEN_DENTAL_DEVELOPER_KEY environment variable is not set')
    }
    this.developerKey = devKey
    this.customerKey = customerKey
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT',
    path: string,
    body?: Record<string, unknown>,
    params?: Record<string, string>
  ): Promise<T> {
    const url = new URL(`${OD_BASE_URL}${path}`)
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value)
      }
    }

    const response = await fetch(url.toString(), {
      method,
      headers: {
        'Authorization': `ODFHIR ${this.developerKey}/${this.customerKey}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new OpenDentalApiError(
        response.status,
        `Open Dental API error (${response.status}): ${errorText}`
      )
    }

    return response.json() as Promise<T>
  }

  /** Test the connection by fetching a single patient. */
  async testConnection(): Promise<boolean> {
    try {
      await this.request<ODPatient[]>('GET', '/patients', undefined, { limit: '1' })
      return true
    } catch {
      return false
    }
  }

  /** Get all providers. */
  async getProviders(): Promise<ODProvider[]> {
    return this.request<ODProvider[]>('GET', '/providers')
  }

  /** Get all operatories. */
  async getOperatories(): Promise<ODOperatory[]> {
    return this.request<ODOperatory[]>('GET', '/operatories')
  }

  /** Get all appointment types. */
  async getAppointmentTypes(): Promise<ODAppointmentType[]> {
    return this.request<ODAppointmentType[]>('GET', '/appointmenttypes')
  }

  /** Get available appointment slots for a date range. */
  async getAvailableSlots(
    startDate: string,
    endDate: string,
    provNum?: number
  ): Promise<ODAppointmentSlot[]> {
    const params: Record<string, string> = {
      DateStart: startDate,
      DateEnd: endDate,
    }
    if (provNum) params.ProvNum = String(provNum)
    return this.request<ODAppointmentSlot[]>('GET', '/appointments/Slots', undefined, params)
  }

  /** Search for a patient by name and optional DOB. */
  async findPatient(lastName: string, firstName: string, birthdate?: string): Promise<ODPatient[]> {
    const params: Record<string, string> = {
      LName: lastName,
      FName: firstName,
    }
    if (birthdate) params.Birthdate = birthdate
    return this.request<ODPatient[]>('GET', '/patients/Simple', undefined, params)
  }

  /** Create a new patient record. */
  async createPatient(patient: {
    LName: string
    FName: string
    Birthdate?: string
    Email?: string
    WirelessPhone?: string
  }): Promise<ODPatient> {
    return this.request<ODPatient>('POST', '/patients', patient as Record<string, unknown>)
  }

  /** Create an appointment. */
  async createAppointment(appointment: {
    PatNum: number
    AptDateTime: string
    ProvNum: number
    Op: number
    Pattern?: string
    Note?: string
  }): Promise<ODAppointment> {
    return this.request<ODAppointment>('POST', '/appointments', appointment as Record<string, unknown>)
  }

  /** Log a communication entry. */
  async createCommLog(commLog: {
    PatNum: number
    CommDateTime: string
    Note: string
  }): Promise<ODCommLog> {
    return this.request<ODCommLog>('POST', '/commlogs', commLog as Record<string, unknown>)
  }
}

export class OpenDentalApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message)
    this.name = 'OpenDentalApiError'
  }
}
