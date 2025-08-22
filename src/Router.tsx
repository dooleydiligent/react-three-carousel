import { Route, Routes } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';

import { Customers } from './Customers';
function common(): JSX.Element {
    return (
        <Fragment>
            <Route path="/" element={<Customers />} />
        </Fragment>
    );
}

export function Router(): JSX.Element {
    return <Routes>{common()}</Routes>;
}
