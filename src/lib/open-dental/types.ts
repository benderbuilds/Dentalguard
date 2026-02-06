/** Open Dental API response types */

export interface ODProvider {
  ProvNum: number
  Abbr: string
  FName: string
  LName: string
  IsHygienist: boolean
  IsHidden: boolean
}

export interface ODOperatory {
  OperatoryNum: number
  OpName: string
  ProvDentist: number
  ProvHygienist: number
  IsHidden: boolean
}

export interface ODAppointmentType {
  AppointmentTypeNum: number
  AppointmentTypeName: string
  Pattern: string
}

export interface ODAppointmentSlot {
  DateTimeStart: string
  DateTimeEnd: string
  ProvNum: number
  OpNum: number
}

export interface ODPatient {
  PatNum: number
  LName: string
  FName: string
  Birthdate: string
  Email: string
  HmPhone: string
  WirelessPhone: string
}

export interface ODAppointment {
  AptNum: number
  PatNum: number
  AptDateTime: string
  ProvNum: number
  Op: number
  AptStatus: number
  Pattern: string
  Note: string
}

export interface ODCommLog {
  CommlogNum: number
  PatNum: number
  CommDateTime: string
  CommType: number
  Note: string
}

export interface ODApiError {
  HttpStatusCode: number
  ErrorMessage: string
}
