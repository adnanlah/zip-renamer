import { Box, Button, Flex, Progress, Stack, Text, TextProps, Title } from '@mantine/core'
import { IconChevronLeft } from '@tabler/icons-react'
import { StatusType, StepStatusType } from 'src/shared-types'

type Props = {
  filename: string
  status: StatusType
  handleReturn: () => void
}

function Process({ filename, status, handleReturn }: Props): JSX.Element {
  const step = parseInt(status.step)
  return (
    <Box bg="green.9" h="100%" p="md">
      <Button
        variant="subtle"
        color="white"
        leftSection={<IconChevronLeft size={14} />}
        style={{ position: 'absolute', left: '.5rem', top: '.5rem' }}
        onClick={handleReturn}
      >
        Back
      </Button>
      <Flex direction="column" justify={'space-between'} align={'center'} h="100%">
        <Flex direction="column" justify={'center'} style={{ flex: 1 }}>
          <div>
            <Title order={2} ta="center" c="gray.1">
              Processing Jury Book archive
            </Title>
            <Text size="xs" ta="center" c="gray.1" mt="xs">
              {filename}
            </Text>
            <Progress value={status.progress} striped animated color="green" my="xl" />
            <Stack gap="xs">
              <Step state={step === 1 ? 'current' : step > 1 ? 'done' : 'not-done'}>
                Extracting Jury Book archive Zip file
              </Step>
              <Step state={step === 2 ? 'current' : step > 2 ? 'done' : 'not-done'}>
                Reading all contents.json files
              </Step>
              <Step state={step === 3 ? 'current' : step > 3 ? 'done' : 'not-done'}>
                Building rename table
              </Step>
              <Step state={step === 4 ? 'current' : step > 4 ? 'done' : 'not-done'}>
                Renaming files and folder names
              </Step>
              <Step state={step === 5 ? 'current' : step > 5 ? 'done' : 'not-done'}>
                Compiling the new archive
              </Step>
              <Step state={step === 6 ? 'current' : step > 6 ? 'done' : 'not-done'}>
                Zipping up the renamed archive file
              </Step>
              <Step state={step === 7 ? 'done' : 'not-done'}>Completed renaming</Step>
            </Stack>
          </div>
        </Flex>
        <div>
          <Text size="xs" c="gray.4" ta="center">
            Mark Battistella &copy; 2013-2024
          </Text>
        </div>
      </Flex>
    </Box>
  )
}

type StepProps = Partial<TextProps> & {
  children: React.ReactNode
  state: StepStatusType
}

function Step({ children, state, ...restProps }: StepProps): JSX.Element {
  const color = state === 'current' ? 'white' : state === 'done' ? 'green.3' : 'dimmed'
  const size = state === 'current' ? 'lg' : 'md'
  return (
    <Text ta="center" fz={size} c={color} fw={500} {...restProps}>
      {children}
    </Text>
  )
}

export default Process
