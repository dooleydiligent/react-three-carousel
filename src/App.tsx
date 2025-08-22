import { Customers } from './Customers';

export function App(): JSX.Element | null {
        return (
            <div style={{ height: '95vh' }}>
                <Customers />
            </div>
        );
}

const popOutRoot = document.createElement('div');
document.body.appendChild(popOutRoot);
