import {Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import { useAuthStore } from './stores/useAuthStore';
import { useEffect } from 'react';
import DashboardLayout from './pages/DashBoardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import Notifications from './pages/dashboard/Notifications';
import Projects from './pages/dashboard/Projects';
import Tasks from './pages/dashboard/Tasks';
import Team from './pages/dashboard/Team';
import {Toaster} from 'react-hot-toast'
import AcceptInvitation from "./pages/AcceptInvitation";

function App() {

  const {authUser, checkAuth, isCheckingAuth, init} = useAuthStore()

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

if (isCheckingAuth) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0f0b] font-mono">
      <div className="w-[90%] max-w-md border border-[#4c5b34] bg-[#10140f] p-8 shadow-[0_0_40px_rgba(143,166,83,0.08)]">

        <p className="mb-5 text-lg font-bold tracking-[0.2em] text-[#b9d06d]">
          KAIRO SYSTEM
        </p>

        <p className="mb-4 text-sm text-[#8fa653]">
          &gt; INITIALIZING...
        </p>

        {/* Loading bar */}
        <div className="h-2 w-full overflow-hidden border border-[#39442a] bg-[#0c0f0b]">
          <div
            className="
              h-full
              w-1/3
              bg-[#b9d06d]
              shadow-[0_0_10px_rgba(185,208,109,0.4)]
              animate-[loader_1.5s_ease-in-out_infinite]
            "
          />
        </div>

        <p className="mt-3 text-[11px] tracking-wider text-[#596544]">
          CHECKING AUTHENTICATION...
        </p>

      </div>
    </div>
  );
}


  return(
    <div>
      <Routes>

        <Route
        path='/'
        element={!authUser ? <Home/> : <Navigate to={"/dashboard"}/>}
        />

        <Route
        path='/login'
        element={!authUser ? <Login/> : <Navigate to={"/dashboard"}/>}
        />

        <Route
        path='signup'
        element={!authUser ? <Signup/> : <Navigate to={"/dashboard"}/>}
        />

        <Route path="/dashboard" element={authUser ? <DashboardLayout/> : <Navigate to="/"/>}>
          <Route index element={<DashboardOverview />} />
          <Route path="projects" element={<Projects />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="team" element={<Team />} />
        </Route>

        <Route
        path='/profile'
        element={authUser ? <Profile/> : <Navigate to={"/"}/>}
        />

        <Route
        path="/invite/:token"
        element={authUser ? <AcceptInvitation /> : <Navigate to="/login" />}
        />

      </Routes>

      <Toaster/>
    </div>
  )
}

export default App
