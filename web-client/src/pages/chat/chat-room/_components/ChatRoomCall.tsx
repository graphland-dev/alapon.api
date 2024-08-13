import { TokenService } from '@/common/utils/TokenService';
import {
  ControlBar,
  LiveKitRoom,
  useEnsureRoom,
  VideoConference,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { useEffect, useState } from 'react';

interface Props {
  roomId: string;
  joinWithAudio: boolean;
  joinWithVideo: boolean;
  onLeave?: () => void;
  onJoin?: () => void;
}

const LiveKitRoomInner = () => {
  const room = useEnsureRoom();

  useEffect(() => {
    room?.on('connected', () => {
      console.log('🔥🔥🔥 participantConnected');
    });

    room?.on('disconnected', () => {
      console.log('🔥🔥🔥 disconnected');
    });
  }, [room]);

  return null;
};

const ChatRoomCall: React.FC<Props> = ({
  roomId,
  joinWithAudio,
  joinWithVideo,
  onLeave,
  onJoin,
}) => {
  const [livekitToken, setLivekitToken] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      try {
        const api = await fetch(`/api/livekit/token?roomId=${roomId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${TokenService.getToken()}`,
          },
        });
        const data = await api.json();
        setLivekitToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  if (!livekitToken) return <div>Generating token...</div>;

  return (
    <LiveKitRoom
      video={joinWithVideo}
      audio={joinWithAudio}
      token={livekitToken}
      onConnected={() => {
        onJoin?.();
      }}
      onDisconnected={() => {
        onLeave?.();
      }}
      serverUrl={import.meta.env.VITE_LIKEKIT_WEB_SOCKET}
      data-lk-theme="default"
      style={{ height: '100dvh' }}
    >
      <VideoConference />
      <ControlBar />
      <LiveKitRoomInner />
    </LiveKitRoom>
  );
};

export default ChatRoomCall;
