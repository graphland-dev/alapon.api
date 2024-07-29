import { Button, Input, Paper, PinInput } from '@mantine/core';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from '@hookform/error-message';
import { useLazyQuery } from '@apollo/client';
import { UNIQUE_HANDLE_QUERY } from '../utils/query';
import { useDebouncedCallback } from '@mantine/hooks';

interface Props {
  onSubmit: (data: IForm) => void;
  loading?: boolean;
}
const JoinForm: React.FC<Props> = ({ onSubmit, loading }) => {
  const [uniqueHandleQuery] = useLazyQuery(UNIQUE_HANDLE_QUERY);

  const form = useForm<IForm>({
    defaultValues: {},
    resolver: yupResolver(validationSchema),
  });

  const handleOnSubmit: SubmitHandler<IForm> = (data) => {
    onSubmit(data);
  };

  const debouncedState__handle = useDebouncedCallback(
    async (handle: string) => {
      uniqueHandleQuery({ variables: { handle } }).then((data) => {
        if (data.data?.identity__getUniqueHandle) {
          form.setValue('handle', data?.data?.identity__getUniqueHandle);
        }
      });
    },
    1000,
  );

  return (
    <div className="max-w-md mx-auto">
      <Paper withBorder p={'lg'}>
        {/* Header */}
        <div className="flex flex-col">
          <h2 className="mt-1 text-2xl">Blackout Chat</h2>
          <p className="text-sm text-[#667781] my-3">
            Blackout chat is an invitation only platform. You must be invited by
            a reference handle to join.
          </p>
        </div>

        <form
          method="POST"
          onSubmit={form.handleSubmit(handleOnSubmit)}
          className="flex flex-col gap-4"
        >
          <Input.Wrapper
            label="Your handle"
            error={
              <ErrorMessage errors={form.formState.errors} name="handle" />
            }
          >
            <Input
              leftSection={<span className="text-gray-400">@</span>}
              placeholder="Type your handle"
              size="md"
              onChange={(e) => {
                form.setValue('handle', e.target.value);
                debouncedState__handle(e.target.value);
              }}
              value={form.watch('handle')}
            />
          </Input.Wrapper>

          <Input.Wrapper
            label="Referer handle"
            error={
              <ErrorMessage
                errors={form.formState.errors}
                name="referenceHandle"
              />
            }
            description="This is an invitation only platform. You must be invited by a reference handle to join."
          >
            <Input
              leftSection={<span className="text-gray-400">@</span>}
              placeholder="Your referer handle"
              size="md"
              {...form.register('referenceHandle')}
            />
          </Input.Wrapper>

          <Input.Wrapper
            label="Pin"
            error={<ErrorMessage errors={form.formState.errors} name="pin" />}
            description="The 6 digit pin code for your account login"
          >
            <PinInput
              length={6}
              size="md"
              type={'number'}
              onChange={(pin) => form.setValue('pin', pin)}
            />
          </Input.Wrapper>

          <Button type="submit" loading={loading}>
            Join
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default JoinForm;

const validationSchema = yup.object({
  handle: yup.string().required().label('Handle'),
  referenceHandle: yup.string().required().label('Reference Handle'),
  pin: yup.string().required('Your pin is required').label('Pin'),
});

type IForm = yup.InferType<typeof validationSchema>;
