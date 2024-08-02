import ResetPinForm from '@/common/components/forms/ResetPinForm';
import { Paper } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const ResetPinPage = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-md mx-auto">
      <Paper withBorder p={'lg'}>
        <ResetPinForm
          onComplete={() => {
            setTimeout(() => {
              navigate('/auth/login');
            }, 3000);
          }}
        />
      </Paper>
    </div>
  );
};

export default ResetPinPage;
