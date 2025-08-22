import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faCheckSquare, faCoffee } from '@fortawesome/free-solid-svg-icons';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from 'react-oidc-context';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';

import '@mantine/core/styles.css';
// ‼️ import dropzone styles after core package styles
import '@mantine/dropzone/styles.css';
import {
    COGNITO_AUTHORITY,
    COGNITO_CLIENT_ID,
    COGNITO_REDIRECT_URI,
    COGNITO_RESPONSE_TYPE,
    COGNITO_SCOPE,
} from './config';

library.add(fab, faCheckSquare, faCoffee);

const theme = createTheme({
    colors: {
        'vv-magenta': [
            '#f1eefc',
            '#ded8f3',
            '#baace8',
            '#947fdf',
            '#7558d7',
            '#613fd2',
            '#5733d1',
            '#4827b9',
            '#3f22a6',
            '#351c92',
        ],
    },
    primaryColor: 'vv-magenta',
    primaryShade: 5,
    fontSizes: {
        xs: '0.6875rem',
        sm: '0.875rem',
        md: '0.875rem',
        lg: '1rem',
        xl: '1.125rem',
    },
    components: {
        Container: {
            defaultProps: {
                size: 1900,
            },
        },
    },
});

const cognitoAuthConfig = {
    authority: COGNITO_AUTHORITY,
    client_id: COGNITO_CLIENT_ID,
    redirect_uri: COGNITO_REDIRECT_URI,
    response_type: COGNITO_RESPONSE_TYPE,
    scope: COGNITO_SCOPE,
};

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <StrictMode>
        <BrowserRouter>
            <MantineProvider theme={theme}>
                <Notifications />
                <AuthProvider {...cognitoAuthConfig}>
                    <App />
                </AuthProvider>
            </MantineProvider>
        </BrowserRouter>
    </StrictMode>
);
