import { getGqlServerError } from '@/common/utils/getGqlServerError';
import { gql, useMutation } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Input, Title } from '@mantine/core';
import { IconAt } from '@tabler/icons-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

const JOIN_IN_GROUP_MUTATION = gql`
  mutation Chat__joinGroup($input: JoinOrLeaveGroupInput!) {
    chat__joinGroup(input: $input)
  }
`;

interface Props {
  onComplete?: () => void;
}
const JoinInGroupForm: React.FC<Props> = ({ onComplete }) => {
  const form = useForm<IForm>({
    resolver: yupResolver(validationSchema),
  });

  const [joinInGroupMutation, joinInGroupMutationState] = useMutation(
    JOIN_IN_GROUP_MUTATION,
  );

  const handleOnSubmit: SubmitHandler<IForm> = (data) => {
    joinInGroupMutation({
      variables: {
        input: { groupHandle: data.groupHandle },
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
      <Title size="lg">Join group chat</Title>

      {joinInGroupMutationState.error && (
        <Alert color="red">
          {getGqlServerError(joinInGroupMutationState.error!)}
        </Alert>
      )}

      <Input.Wrapper
        label="Group handle"
        withAsterisk
        error={
          <ErrorMessage name={'groupHandle'} errors={form.formState.errors} />
        }
      >
        <Input
          size="lg"
          leftSection={<IconAt size={16} />}
          placeholder="Type user handle"
          {...form.register('groupHandle')}
        />
      </Input.Wrapper>

      <Button
        type="submit"
        size="lg"
        loading={joinInGroupMutationState.loading}
      >
        Join
      </Button>
    </form>
  );
};

export default JoinInGroupForm;

const validationSchema = yup.object({
  groupHandle: yup.string().required().label('Group handle'),
});
type IForm = yup.InferType<typeof validationSchema>;
