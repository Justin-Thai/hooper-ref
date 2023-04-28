import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home, Login, Registration, Suggest, Archive, Search } from './pages';
import NavBar from './components/NavBar/NavBar';

function App() {
	
	return (
		<Router>
			<div className="App">
				<NavBar />
				
				<Routes>
					<Route exact path="/" element={<Home />} />
					<Route exact path="/login" element={<Login />} />
					<Route exact path="/registration" element={<Registration />} />
					<Route exact path="/suggest" element={<Suggest />} />
					<Route exact path="/archive" element={<Archive />} />
					<Route exact path="/search" element={<Search />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
