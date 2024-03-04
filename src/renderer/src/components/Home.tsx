import { FileWithPath } from '@mantine/dropzone'
import { useEffect, useState } from 'react'
import { StatusType } from 'src/shared-types'

import Process from './Process'
import ZipDropzone from './ZipDropzone'
import { notifications } from '@mantine/notifications'

function Home(): JSX.Element {
  const [processing, setProcessing] = useState(false)
  const [processStatus, setProcessStatus] = useState<StatusType>()
  const [files, setFiles] = useState<FileWithPath[]>([])

  const reset = (): void => {
    setProcessing(false)
    setProcessStatus(undefined)
    setFiles([])
  }

  useEffect(() => {
    if (files.length) {
      setProcessing(true)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.electron.ipcRenderer.invoke('upload-zip', files[0].path).catch((err: any) => {
        notifications.show({
          message: 'Error processing file' + err.message,
          color: 'red'
        })
      })
    }
  }, [files, setProcessing])

  useEffect(() => {
    window.electron.ipcRenderer.on('status', (_, status: StatusType): void => {
      setProcessStatus(status)
    })

    return () => {
      window.electron.ipcRenderer.removeAllListeners('status')
    }
  }, [window.electron.ipcRenderer, setProcessStatus])

  return (
    <div style={{ height: '100vh' }}>
      {!processing && <ZipDropzone h="100%" files={files} setFiles={setFiles} />}
      {processing && processStatus && (
        <Process filename={files[0].name} status={processStatus} handleReturn={reset} />
      )}
    </div>
  )
}

export default Home
