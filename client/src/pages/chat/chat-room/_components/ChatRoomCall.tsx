import { TokenService } from '@/common/utils/TokenService';
import {
  ControlBar,
  LiveKitRoom,
  RoomAudioRenderer,
  VideoConference,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { useEffect, useState } from 'react';

interface Props {
  roomId: string;
}

const ChatRoomCall: React.FC<Props> = ({ roomId }) => {
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
      video={true}
      audio={true}
      token={livekitToken}
      serverUrl={'wss://blackout-yn0q8mza.livekit.cloud'}
      data-lk-theme="default"
      style={{ height: '100dvh' }}
    >
      <VideoConference />
      <ControlBar />
    </LiveKitRoom>
  );
};

export default ChatRoomCall;
