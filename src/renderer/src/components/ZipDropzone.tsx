import { Flex, Group, rem, Text } from '@mantine/core'
import { Dropzone, DropzoneProps, FileWithPath } from '@mantine/dropzone'
import { IconFileZip, IconUpload, IconX } from '@tabler/icons-react'

type Props = Partial<DropzoneProps> & {
  files: FileWithPath[]
  setFiles: React.Dispatch<React.SetStateAction<FileWithPath[]>>
}

function ZipDropzone({ files, setFiles, ...props }: Props): JSX.Element {
  console.log(`files[0]`, files[0])

  return (
    <Dropzone
      activateOnClick={false}
      // getFilesFromEvent={(event): Promise<(File | DataTransferItem)[]> => {
      //   console.log(event)
      // }}
      onDrop={(files) => {
        setFiles(files)
      }}
      onReject={(files) => console.log('rejected files', files)}
      accept={[
        'application/octet-stream',
        'application/zip',
        'application/x-zip',
        'application/x-zip-compressed'
      ]}
      styles={{
        inner: {
          height: '100%'
        }
      }}
      useFsAccessApi={true}
      multiple={false}
      maxFiles={1}
      {...props}
    >
      <Flex direction="column" justify="center" h="100%">
        <Group justify="center" gap="xl" style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload
              style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconFileZip
              style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
            />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag your zip file here
            </Text>
          </div>
        </Group>
      </Flex>
    </Dropzone>
  )
}

export default ZipDropzone
