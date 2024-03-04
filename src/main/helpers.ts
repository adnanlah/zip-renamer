import { StatusType } from '../shared-types'
import { mainWindow } from '.'

export function sendStatus(status: StatusType): void {
  mainWindow?.webContents.send('status', status)
}
