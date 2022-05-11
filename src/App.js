import Navigation from "./components/Navigation";
import './App.scss';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from './components/RequireAuth'
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import CreateAlbumPage from "./pages/CreateAlbumPage";
import AlbumsPage from "./pages/AlbumsPage";
import AlbumPage from "./pages/AlbumPage";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navigation
       />
        <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/album/:uid" element={<AlbumPage />} />

      <Route path="/albums" element={
						<RequireAuth redirectTo="/login">
							<AlbumsPage />
						</RequireAuth>
					} />



      <Route path="/newalbum" element={
						<RequireAuth redirectTo="/login">
							<CreateAlbumPage />
						</RequireAuth>
					} />
         
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
