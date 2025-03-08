import ReactDOM from 'react-dom/client';

import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import 'jotai-devtools/styles.css';
import './styles/app.scss';

// Import the generated route tree
import { createHashHistory, createRouter } from '@tanstack/react-router';
import AppCommonProvider from './common/components/AppCommonProvider';
import Root from './Root';
import { routeTree } from './routeTree.gen';
import { QueryClientProvider } from '@tanstack/react-query';
import { tanstackQueryClient } from './common/configs/tanstack-query-client';

// Create a new router instance
export const router = createRouter({
  routeTree,
  defaultPreloadStaleTime: 0,
  context: {
    auth: undefined!,
  },
  history: createHashHistory(), // 👈 for enabling hash routing
  defaultNotFoundComponent: () => <h1>404</h1>,
  defaultPendingComponent: () => <h1>Loading...</h1>,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById('root')!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={tanstackQueryClient}>
      <AppCommonProvider>
        <Root />
      </AppCommonProvider>
    </QueryClientProvider>,
  );
}
