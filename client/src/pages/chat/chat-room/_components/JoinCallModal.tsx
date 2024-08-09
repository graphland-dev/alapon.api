import { Text } from '@mantine/core';
import { Mic, Video } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  roomId: string;
}

const JoinCallModal: React.FC<Props> = ({ roomId }) => {
  return (
    <div>
      <Text size="lg">Join call</Text>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <Link
          to={`/chat/${roomId!}/video-call`}
          className="flex items-center gap-2 p-4 border-2 rounded-md border-zinc-200 hover:border-zinc-500"
        >
          <Video />
          <Text>With Video</Text>
        </Link>
        <Link
          to={`/chat/${roomId!}/audio-call`}
          className="flex items-center gap-2 p-4 border-2 rounded-md border-zinc-200 hover:border-zinc-500"
        >
          <Mic />
          <Text>With Audio Only</Text>
        </Link>
      </div>
    </div>
  );
};

export default JoinCallModal;
