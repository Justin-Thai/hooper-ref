import './App.css';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import { Home, Login, Registration, Suggest, Archive, Search, Profile, Mod, Missing } from './pages';

const ROLES = {
	"User": "user",
	"Mod": "mod",
	"Admin": "admin"
}

function App() {

	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Layout />}>
					{/* Public routes */}
					<Route exact path="/" element={<Home />} />
					<Route exact path="/login" element={<Login />} />
					<Route exact path="/signup" element={<Registration />} />
					<Route exact path="/archive" element={<Archive />} />
					<Route exact path="/search" element={<Search />} />

					{/* Protected routes */}
					<Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Mod, ROLES.Admin]} />}>
						<Route exact path="/profile" element={<Profile />} />
						<Route exact path="/suggest" element={<Suggest />} />
					</Route>

					<Route element={<RequireAuth allowedRoles={[ROLES.Mod, ROLES.Admin]} />}>
						<Route exact path="/mod" element={<Mod />} />
					</Route>

					{/* Missing page route */}
					<Route path="*" element={<Missing />} />
				</Route>
			</Routes>
		</div>
	);
}

export default App;
