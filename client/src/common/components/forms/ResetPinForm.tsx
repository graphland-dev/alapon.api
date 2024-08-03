import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Input, PinInput, Text } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import React from 'react';
import * as yup from 'yup';

import { userAtom } from '@/common/states/user.atom';
import { getGqlServerError } from '@/common/utils/getGqlServerError';
import { gql, useMutation } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import {
  IconLockSquareRoundedFilled,
  IconSquareRoundedCheckFilled,
} from '@tabler/icons-react';
import { useAtomValue } from 'jotai';
import { SubmitHandler, useForm } from 'react-hook-form';

const UPDATE_PIN_MUTATION = gql`
  mutation Identity__resetPin($input: ResetPinInput!) {
    identity__resetPin(input: $input)
  }
`;

interface ResetPinFormProps {
  onComplete?: () => void;
}
const ResetPinForm: React.FC<ResetPinFormProps> = ({ onComplete }) => {
  const authUser = useAtomValue(userAtom);

  const [changePinMutation, changePinMutationState] = useMutation(
    UPDATE_PIN_MUTATION,
    {
      onCompleted: () => {
        onComplete?.();
      },
      onError: (error) => {
        console.log(error);
      },
    },
  );

  const form = useForm<IForm>({
    defaultValues: {
      handle: authUser?.handle,
    },
    resolver: yupResolver(validationSchema),
  });

  const handleOnSubmit: SubmitHandler<IForm> = (data) => {
    changePinMutation({ variables: { input: data } });
  };

  const handleReadSecretFromFile = (files: File[]) => {
    const file = files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      form.setValue('secret', reader.result as string);
    };
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col">
        <h2 className="mt-1 text-2xl">Reset Pin</h2>
        <p className="text-sm text-[#667781] my-3">
          You need your account secret to reset your pin code.
        </p>
      </div>

      {changePinMutationState.error && (
        <Alert color="red" title="Hands up" radius="md">
          {getGqlServerError(changePinMutationState.error!)}
        </Alert>
      )}

      {changePinMutationState.data && (
        <Alert color="green" title="Yahoo!" radius="md">
          Pin changed successfully
        </Alert>
      )}

      <form
        method="POST"
        onSubmit={form.handleSubmit(handleOnSubmit)}
        className="flex flex-col gap-4"
      >
        <Input.Wrapper
          label="Your handle"
          error={<ErrorMessage errors={form.formState.errors} name="handle" />}
        >
          <Input
            leftSection={<span className="text-gray-400">@</span>}
            placeholder="Type your handle"
            size="md"
            disabled={Boolean(authUser?.handle)}
            {...form.register('handle')}
          />
        </Input.Wrapper>

        <Input.Wrapper
          label="Account Secret"
          error={<ErrorMessage errors={form.formState.errors} name="secret" />}
        >
          <div>
            <Dropzone
              className="mt-2"
              onDrop={handleReadSecretFromFile}
              onReject={(files) => console.log('rejected files', files)}
              maxSize={5 * 1024 ** 2}
              accept={['text/plain']}
            >
              <div className="flex items-center gap-2">
                {form.watch('secret') ? (
                  <IconSquareRoundedCheckFilled
                    size={30}
                    className=" text-primary"
                  />
                ) : (
                  <IconLockSquareRoundedFilled
                    size={30}
                    className=" text-primary"
                  />
                )}

                {form.watch('secret') ? (
                  <Text size="md" inline c="green">
                    Secret uploaded
                  </Text>
                ) : (
                  <Text size="md" inline>
                    Drop Account secret here
                  </Text>
                )}
              </div>
            </Dropzone>
          </div>
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

        <Button loading={changePinMutationState.loading} type="submit">
          Change Pin
        </Button>
      </form>
    </div>
  );
};

export default ResetPinForm;

const validationSchema = yup.object({
  handle: yup.string().required().label('Handle'),
  secret: yup.string().required().label('Secret'),
  pin: yup.string().required('Your pin is required').min(6).max(6).label('Pin'),
});

type IForm = yup.InferType<typeof validationSchema>;
