import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Input, Switch, Text, Title } from '@mantine/core';
import { gql, useMutation } from '@apollo/client';
import { getGqlServerError } from '@/common/utils/getGqlServerError';
import { ErrorMessage } from '@hookform/error-message';
import { useDebouncedCallback } from '@mantine/hooks';

const CREATE_GROUP_MUTATION = gql`
  mutation Chat__createChatGroup($input: CreateChatGroupInput!) {
    chat__createChatGroup(input: $input) {
      _id
    }
  }
`;

interface Props {
  onComplete?: () => void;
}
const CreateGroupForm: React.FC<Props> = ({ onComplete }) => {
  const form = useForm<IForm>({
    resolver: yupResolver(validationSchema),
  });

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

  const [createGroupMutation, createGroupMutationState] = useMutation(
    CREATE_GROUP_MUTATION,
  );

  const handleOnSubmit: SubmitHandler<IForm> = (data) => {
    createGroupMutation({
      variables: {
        input: {
          handle: data.handle,
          isNsfw: data.isNsfw,
        },
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
      <Title size="lg">Create Group</Title>

      {createGroupMutationState.error && (
        <Alert color="red">
          {getGqlServerError(createGroupMutationState.error!)}
        </Alert>
      )}

      <Input.Wrapper
        label="Group Handle"
        error={<ErrorMessage name={'handle'} errors={form.formState.errors} />}
      >
        <Input
          size="lg"
          {...form.register('handle')}
          placeholder="Type group Handle"
        />
      </Input.Wrapper>

      <div className="flex items-center gap-2">
        <Text>NSFW allowd?</Text>
        <Switch onChange={console.log} />
      </div>

      <Button
        type="submit"
        size="lg"
        loading={createGroupMutationState.loading}
      >
        Create Group
      </Button>
    </form>
  );
};

export default CreateGroupForm;

const validationSchema = yup.object({
  handle: yup.string().required().label('Group handle'),
  isNsfw: yup.boolean().optional().label('NSFW'),
});
type IForm = yup.InferType<typeof validationSchema>;
