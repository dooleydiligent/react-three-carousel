import { Customers } from "./Customers";

export const App = (): React.JSX.Element | null => {
	const signOutRedirect = () => {
		console.log(`signoutRedirect in progress`);
	};

	return (
		<Customers
			signout={signOutRedirect}
			user={{ user: {} }}
			style={{ height: "95vh" }}
		/>
	);
};
