import { getGqlServerError } from '@/common/utils/getGqlServerError';
import { gql, useMutation } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Input, Textarea, Title } from '@mantine/core';
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
    defaultValues: {
      messageText: 'Hi 😍 I would like to chat with you 👏',
    },
  });

  const [joinInPersonMutation, joinInPersonMutationState] = useMutation(
    JOIN_IN_PERSION_MUTATION,
  );

  const handleOnSubmit: SubmitHandler<IForm> = (data) => {
    joinInPersonMutation({
      variables: {
        input: { userHandle: data.userHandle, messageText: data.messageText },
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
      <Title size="lg">Send private message</Title>

      {joinInPersonMutationState.error && (
        <Alert color="red">
          {getGqlServerError(joinInPersonMutationState.error!)}
        </Alert>
      )}

      <Input.Wrapper
        label="User handle"
        withAsterisk
        error={
          <ErrorMessage name={'userHandle'} errors={form.formState.errors} />
        }
      >
        <Input
          size="lg"
          leftSection={<IconAt size={16} />}
          placeholder="Type user handle"
          {...form.register('userHandle')}
        />
      </Input.Wrapper>

      <Input.Wrapper
        label="Your message"
        withAsterisk
        error={
          <ErrorMessage name={'messageText'} errors={form.formState.errors} />
        }
      >
        <Textarea
          size="lg"
          placeholder="Type initial message"
          {...form.register('messageText')}
        />
      </Input.Wrapper>

      <Button
        type="submit"
        size="lg"
        loading={joinInPersonMutationState.loading}
      >
        Send
      </Button>
    </form>
  );
};

export default JoinInPersonForm;

const validationSchema = yup.object({
  userHandle: yup.string().required().label('Group handle'),
  messageText: yup.string().required().label('Message text'),
});
type IForm = yup.InferType<typeof validationSchema>;
