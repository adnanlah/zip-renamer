export type StepNumberType = '1' | '2' | '3' | '4' | '5' | '6' | '7'

export type StepStatusType = 'done' | 'current' | 'not-done'

export type StatusType = {
  progress: number
  status: 'processing' | 'done'
  step: StepNumberType
}
