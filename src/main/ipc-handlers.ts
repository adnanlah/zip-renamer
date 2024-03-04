import { ipcMain } from 'electron'
import { processZip } from './renamer'

ipcMain.handle('upload-zip', async (_ev, path: string) => {
  if (!(typeof path === 'string')) {
    throw new Error('Path is not a string')
  }

  await processZip(path)
})
