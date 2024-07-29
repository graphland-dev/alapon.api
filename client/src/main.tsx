import ReactDOM from 'react-dom/client';
import RootApp from './RootApp.tsx';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './styles/app.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(<RootApp />);

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// );
