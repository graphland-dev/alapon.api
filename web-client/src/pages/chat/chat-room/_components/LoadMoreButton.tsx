import Spinner from '@/common/components/Spinner';
import { UnstyledButton } from '@mantine/core';

interface Props {
  onClick: () => void;
  loading: boolean;
}

const LoadMoreButton: React.FC<Props> = ({ onClick, loading }) => {
  if (loading) {
    return <Spinner color="hsl(var(--primary))" size={55} />;
  }

  return (
    <UnstyledButton onClick={onClick} className="my-2 text-sm text-center link">
      Load More
    </UnstyledButton>
  );
};

export default LoadMoreButton;
