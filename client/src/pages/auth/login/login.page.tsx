import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Input, Paper, PinInput } from '@mantine/core';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { LOGIN_MUTATION } from './utils/query';
import { useMutation } from '@apollo/client';
import { TokenService } from '@/common/utils/TokenService';
import { getGqlServerError } from '@/common/utils/getGqlServerError';

const LoginPage = () => {
  const [loginMutation, loginMutationState] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      TokenService.setToken(data?.identity__login?.token);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const form = useForm<IForm>({
    defaultValues: {},
    resolver: yupResolver(validationSchema),
  });

  const handleOnSubmit: SubmitHandler<IForm> = (data) => {
    loginMutation({ variables: { input: data } });
  };

  return (
    <div className="max-w-md mx-auto">
      <Paper withBorder p={'lg'}>
        {/* Header */}
        <div className="flex flex-col">
          <h2 className="mt-1 text-2xl">Blackout Chat</h2>
          <p className="text-sm text-[#667781] my-3">
            Access your account by entering your handle and pin code.
          </p>
        </div>

        {loginMutationState.error && (
          <Alert color="red" title="Hands up" radius="md">
            {getGqlServerError(loginMutationState.error!)}
          </Alert>
        )}

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
              {...form.register('handle')}
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

          <Button type="submit" loading={loginMutationState.loading}>
            Login
          </Button>
        </form>

        <div className="mt-2">
          <p>
            Don't have an account?{' '}
            <Link to="/auth/join" className="link">
              Join now
            </Link>
          </p>
        </div>
      </Paper>
    </div>
  );
};

export default LoginPage;

const validationSchema = yup.object({
  handle: yup.string().required().label('Handle'),
  pin: yup.string().required('Your pin is required').min(6).max(6).label('Pin'),
});

type IForm = yup.InferType<typeof validationSchema>;
