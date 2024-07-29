import { useMutation } from '@apollo/client';
import { Button, Input, Paper, PinInput } from '@mantine/core';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { JOIN_MUTATION } from './utils/query';
import JoinForm from './components/JoinForm';

const JoinPage = () => {
  const [joinMutation, { loading }] = useMutation(JOIN_MUTATION, {
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="max-w-md mx-auto">
      <JoinForm
        onSubmit={(data) => joinMutation({ variables: { input: data } })}
        loading={loading}
      />
    </div>
  );
};

export default JoinPage;
