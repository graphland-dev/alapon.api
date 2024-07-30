import { getGqlServerError } from '@/common/utils/getGqlServerError';
import { gql, useMutation } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Input, Title } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconAt } from '@tabler/icons-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

const JOIN_IN_PERSION_MUTATION = gql`
  mutation Chat__joinInPerson($input: JoinInPersonInput!) {
    chat__joinInPerson(input: $input) {
      _id
    }
  }
`;

interface Props {
  onComplete?: () => void;
}
const JoinInPersonForm: React.FC<Props> = ({ onComplete }) => {
  const form = useForm<IForm>({
    resolver: yupResolver(validationSchema),
  });

  const [joinInPersonMutation, joinInPersonMutationState] = useMutation(
    JOIN_IN_PERSION_MUTATION,
  );

  const handleOnSubmit: SubmitHandler<IForm> = (data) => {
    joinInPersonMutation({
      variables: {
        input: { handle: data.handle },
      },
      onCompleted: () => {
        onComplete?.();
      },
    });
  };

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={form.handleSubmit(handleOnSubmit)}
    >
      <Title size="lg">Connect to user in person</Title>

      {joinInPersonMutationState.error && (
        <Alert color="red">
          {getGqlServerError(joinInPersonMutationState.error!)}
        </Alert>
      )}

      <Input.Wrapper
        label="User handle"
        error={<ErrorMessage name={'handle'} errors={form.formState.errors} />}
      >
        <Input
          size="lg"
          leftSection={<IconAt size={16} />}
          placeholder="Type user handle"
          {...form.register('handle')}
        />
      </Input.Wrapper>

      <Button
        type="submit"
        size="lg"
        loading={joinInPersonMutationState.loading}
      >
        Connect
      </Button>
    </form>
  );
};

export default JoinInPersonForm;

const validationSchema = yup.object({
  handle: yup.string().required().label('Group handle'),
});
type IForm = yup.InferType<typeof validationSchema>;
