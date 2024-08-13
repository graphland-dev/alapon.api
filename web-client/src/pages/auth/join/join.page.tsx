import { useMutation } from '@apollo/client';
import { Button, Input, Paper } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { getGqlServerError } from '../../../common/utils/getGqlServerError';
import JoinForm from './components/JoinForm';
import { JOIN_MUTATION } from './utils/query';
import { Link } from 'react-router-dom';

const JoinPage = () => {
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [accountSecret, setAccountSecret] = useState('');
  const [joinMutation, { loading, error }] = useMutation(JOIN_MUTATION, {
    onCompleted: (data) => {
      console.log(data);
      setJoinSuccess(true);
      setAccountSecret(data.identity__join.secret);
    },
    onError: (error) => {
      console.log(error);
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
        <JoinForm
          onSubmit={(data) => joinMutation({ variables: { input: data } })}
          loading={loading}
          apiError={getGqlServerError(error!)}
        />
      )}
    </div>
  );
};

export default JoinPage;
