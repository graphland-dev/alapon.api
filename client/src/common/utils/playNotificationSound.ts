const playNotificationSoundAndSetDocumentTitle = (
  title: string,
  timeout = 3000,
) => {
  const audio = new Audio('/chat.mp3');
  audio.play();
  document.title = `New Message - ${title}`;
  setTimeout(() => {
    document.title = `Blackout Chat`;
  }, timeout);
};

export default playNotificationSoundAndSetDocumentTitle;
