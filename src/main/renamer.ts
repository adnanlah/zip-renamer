import fs from 'fs-extra'
import path from 'path'
import { ContentsType, TableType } from './types'
import AdmZip from 'adm-zip'
import { sendStatus } from './helpers'

// const cl = console.log

async function unzipFile(zipPath: string, outputPath: string): Promise<void> {
  const zip = new AdmZip(zipPath)
  zip.extractAllTo(outputPath)
}

async function rezipFile(outputZipPath: string, inputPath: string): Promise<void> {
  const zip = new AdmZip()
  zip.addLocalFolder(inputPath)
  await zip.writeZipPromise(outputZipPath)
}

async function buildRenameTable(dirPath: string): Promise<TableType> {
  let table: TableType = []
  const entries = await fs.readdir(dirPath, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      // Recursively build the table without renaming the directory here
      const subTable = await buildRenameTable(fullPath)
      table = table.concat(subTable)
    }
  }

  // Look for contents.json after processing subdirectories to prevent renaming issues
  const contentsPath = path.join(dirPath, 'contents.json')
  // cl({ contentsPath })
  if (await fs.pathExists(contentsPath)) {
    const contents: ContentsType = await fs.readJson(contentsPath)
    // cl({ contents })
    contents.files.forEach(async (file) => {
      if (file.title) {
        // cl({ title: file.title })
        const oldPath = path.join(dirPath, file.filename)
        // if (!(await fs.pathExists(oldPath))) return
        // cl({ oldPath })
        let newPath: string
        // Append the extension for files; rename directories directly
        // cl('!endsWith', !file.filename.endsWith('/'), 'isDir', !fs.lstatSync(oldPath).isDirectory())
        if (!file.filename.endsWith('/') && !fs.lstatSync(oldPath).isDirectory()) {
          // More explicit file check
          const extension = path.extname(file.filename)
          const newFileName = file.title + extension
          newPath = path.join(dirPath, newFileName.replace(/[<>:"/\\|?*]+/g, ''))
        } else {
          // Direct renaming for directories
          const parentDir = path.dirname(oldPath)
          newPath = path.join(parentDir, file.title.replace(/[<>:"/\\|?*]+/g, ''))
        }
        table.push({ oldPath, newPath })
      }
    })
  }

  return table
}

async function renameFiles(table: TableType): Promise<void> {
  for (const { oldPath, newPath } of table) {
    if (oldPath !== newPath && (await fs.pathExists(oldPath))) {
      console.log(`RENAME:\n${oldPath} \n---> ${newPath}`)
      await fs.move(oldPath, newPath, { overwrite: true })
    } else if (!(await fs.pathExists(oldPath))) {
      console.error(`File not found and cannot be renamed: ${oldPath}`)
      throw new Error(`File not found and cannot be renamed: ${oldPath}`)
    }
  }
}

export async function processZip(originalZipPath: string): Promise<void> {
  sendStatus({
    progress: 10,
    step: '1'
  })

  const tempUnzipDir = path.join(__dirname, 'temp-extract')
  await fs.ensureDir(tempUnzipDir)

  sendStatus({
    progress: 30,
    step: '2'
  })

  await unzipFile(originalZipPath, tempUnzipDir)

  sendStatus({
    progress: 40,
    step: '3'
  })

  const renameTable = await buildRenameTable(tempUnzipDir)

  sendStatus({
    progress: 50,
    step: '4'
  })

  await renameFiles(renameTable)

  sendStatus({
    progress: 70,
    step: '5'
  })

  // Generate the new output ZIP filename by appending '_renamed' before the extension
  const originalFileName = path.basename(originalZipPath, '.zip')
  const outputZipName = `${originalFileName}_renamed.zip`
  const outputZipPath = path.join(path.dirname(originalZipPath), outputZipName)

  sendStatus({
    progress: 90,
    step: '6'
  })

  await rezipFile(outputZipPath, tempUnzipDir)

  if (await fs.pathExists(outputZipPath)) {
    console.log(`New ZIP file created at: ${outputZipPath}`)
  } else {
    console.error(`Failed to create new ZIP file at: ${outputZipPath}`)
  }

  sendStatus({
    progress: 100,
    step: '7'
  })

  // Improved Cleanup
  try {
    await fs.emptyDir(tempUnzipDir)
    await fs.remove(tempUnzipDir)
    console.log('Temporary extraction directory successfully removed.')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (cleanupError: any) {
    console.error(`Cleanup error: ${cleanupError.message}`)
  }
}
