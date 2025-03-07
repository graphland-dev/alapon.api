import { JoinUserInput, JoinUserResponse } from '@/common/api-models/graphql';
import { gql, gqlRequest } from '@/common/clients/api-client';
import { Button, Input, Paper } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import JoinForm from './~lib/components/JoinForm';

export const Route = createLazyFileRoute('/auth/join')({
  component: RouteComponent,
});

function RouteComponent() {
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [accountSecret, setAccountSecret] = useState('');

  const joinMutation = useMutation({
    mutationFn: (variables: { input: JoinUserInput }) =>
      gqlRequest<{ identity__join: JoinUserResponse }>({
        variables,
        query: JOIN_MUTATION,
        options: { passAccessToken: true },
      }),
    onSuccess: (data) => {
      console.log(data);
      setJoinSuccess(true);
      setAccountSecret(data.identity__join.secret);
    },
  });

  const handleDownloadAccountSecret = () => {
    const element = document.createElement('a');
    const file = new Blob([accountSecret], {
      type: 'text/plain',
    });
    element.href = URL.createObjectURL(file);
    element.download = 'account-secret.txt';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  useEffect(() => {
    if (joinSuccess) {
      handleDownloadAccountSecret();
    }
  }, [joinSuccess]);

  return (
    <div className="max-w-md mx-auto">
      {joinSuccess ? (
        <Paper withBorder p={'lg'}>
          <h2 className="text-2xl">Success</h2>
          <p className="my-3 text-md">
            Your account has been created. Please save your account secret
            below.
          </p>
          <div className="p-3 border-2 border-red-500 border-dashed">
            <p className="my-3 font-semibold text-red-500 text-md">
              Keep this account secret safe. You will need it to reset your pin
              or recover your account. This is the only way to recover your
              account. Without this secret, you will not be able to recover your
              account.
            </p>
            <p className="my-3 text-md">Your account secret is</p>
            <Input value={accountSecret} size="md" readOnly />
            <div className="flex flex-col gap-2">
              <Button
                rightSection={<IconDownload size={16} />}
                mt={'md'}
                onClick={handleDownloadAccountSecret}
              >
                Download Account Secret
              </Button>

              <Link to={'/auth/login'} className="link">
                Login now
              </Link>
            </div>
          </div>
        </Paper>
      ) : (
        <>
          <JoinForm
            onSubmit={(data) => joinMutation.mutate({ input: data })}
            loading={joinMutation.isPending}
            apiError={joinMutation?.error?.message}
          />
        </>
      )}
    </div>
  );
}

const JOIN_MUTATION = gql`
  mutation Identity__join($input: JoinUserInput!) {
    identity__join(input: $input) {
      secret
      handle
    }
  }
`;
