import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import History from './pages/History.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import TextToImage from './pages/Text_to_image.jsx';
import RemoveBackground from './pages/Remove_background.jsx';
import RemoveText from './pages/Remove_text_from_img.jsx';
import Upscale_img from './pages/Upscale_img.jsx';
import Uncrop_img from './pages/uncrop_image.jsx'
import Change_background from './pages/Change_background.jsx';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col bg-white text-black font-mono overflow-hidden">

        <Navbar />

        <main className="flex-1 min-h-0 flex flex-col bg-white overflow-hidden">
          <Routes>

            <Route path='*' element={<div className="flex-1 overflow-y-auto h-full w-full flex flex-col"><Home /></div>} />
            <Route path="/login" element={<div className="flex-1 overflow-y-auto h-full w-full flex flex-col"><Login /></div>} />
            <Route path="/register" element={<div className="flex-1 overflow-y-auto h-full w-full flex flex-col"><Register /></div>} />
            <Route path="/forgot-password" element={<div className="flex-1 overflow-y-auto h-full w-full flex flex-col"><ForgotPassword /></div>} />
            <Route path="/reset-password" element={<div className="flex-1 overflow-y-auto h-full w-full flex flex-col"><ResetPassword /></div>} />

            {/* Features layout routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/text-to-image" element={<TextToImage />} />
              <Route path="/remove-background" element={<RemoveBackground />} />
              <Route path="/replace-background" element={<Change_background />} />
              <Route path="/remove-text" element={<RemoveText />} />
              <Route path="/uncrop" element={<Uncrop_img />} />
              <Route path="/upscale" element={<Upscale_img />} />
              <Route path="/history" element={<History />} />

            </Route>

          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;