import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import '@mantine/core/styles/global.css'
import '@mantine/dropzone/styles.css'
import '@mantine/notifications/styles.css'
import { Notifications } from '@mantine/notifications'
import Home from './components/Home'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <MantineProvider defaultColorScheme="light">
      <Notifications position="top-center" zIndex={2077} />
      <Home />
    </MantineProvider>
  )
}

export default App
