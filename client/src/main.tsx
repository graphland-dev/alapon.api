import ReactDOM from 'react-dom/client';
import RootApp from './RootApp.tsx';
import './styles/app.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(<RootApp />);

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// );
