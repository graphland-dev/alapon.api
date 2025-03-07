import { LoginInput, LoginResponse } from '@/common/api-models/graphql';
import { gql, gqlRequest } from '@/common/clients/api-client';
import { TokenService } from '@/common/utils/TokenService';

import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Input, Paper, PinInput } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

export const Route = createLazyFileRoute('/auth/login')({
  component: RouteComponent,
});

const LOGIN_MUTATION = gql`
  mutation Identity__login($input: LoginInput!) {
    identity__login(input: $input) {
      token
    }
  }
`;

function RouteComponent() {
  const form = useForm<yup.InferType<typeof validationSchema>>({
    defaultValues: {},
    resolver: yupResolver(validationSchema),
  });

  const loginMutation = useMutation({
    mutationFn: (variables: { input: LoginInput }) =>
      gqlRequest<{ identity__login: LoginResponse }>({
        variables,
        query: LOGIN_MUTATION,
        options: { passAccessToken: true },
      }),
    onSuccess: (data) => {
      TokenService.setToken(data?.identity__login?.token);
    },
  });

  const handleOnSubmit: SubmitHandler<
    yup.InferType<typeof validationSchema>
  > = (data) => {
    loginMutation.mutate({ input: data });
  };

  return (
    <div className="max-w-md mx-auto">
      <Paper withBorder p={'lg'}>
        {/* Header */}
        <div className="flex flex-col">
          <h2 className="mt-1 text-2xl">Alapon Chat</h2>
          <p className="text-sm text-[#667781] my-3">
            Access your account by entering your handle and pin code.
          </p>
        </div>

        {loginMutation.isError && (
          <Alert color="red" title="Hands up" radius="md">
            {loginMutation?.error?.message}
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

          <Button type="submit" loading={loginMutation.isPending}>
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

          <p>
            Forgot your pin?{' '}
            <Link to="/auth/reset-pin" className="link">
              Reset it
            </Link>
          </p>
        </div>
      </Paper>

      <div className="my-4 text-xs text-center text-slate-500">
        <p>version 1.0.5</p>
      </div>
    </div>
  );
}

const validationSchema = yup.object({
  handle: yup.string().required().label('Handle'),
  pin: yup.string().required('Your pin is required').min(6).max(6).label('Pin'),
});
