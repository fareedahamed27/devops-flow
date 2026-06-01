// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import { ThemeProvider } from './context/ThemeContext';
// import { Layout } from './components/Layout';
// import { Landing } from './pages/Landing';
// import { Login } from './pages/auth/Login';
// import { Register } from './pages/auth/Register';
// import { Dashboard } from './pages/Dashboard';
// import { Questionnaire } from './pages/Questionnaire';
// import { Report } from './pages/Report';
// import { CoupleReport } from './pages/CoupleReport';
// import { Pair } from './pages/Pair';
// import { Profile } from './pages/Profile';

// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { user, isLoading } = useAuth();
  
//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
//         <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }
  
//   return user ? <>{children}</> : <Navigate to="/login" />;
// };

// const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { user, isLoading } = useAuth();
  
//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
//         <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }
  
//   return user ? <Navigate to="/dashboard" /> : <>{children}</>;
// };

// function App() {
//   return (
//     <ThemeProvider>
//       <AuthProvider>
//         <Router>
//           <Routes>
//             <Route path="/" element={<Layout />}>
//               <Route index element={<Landing />} />
//               <Route 
//                 path="login" 
//                 element={
//                   <PublicRoute>
//                     <Login />
//                   </PublicRoute>
//                 } 
//               />
//               <Route 
//                 path="register" 
//                 element={
//                   <PublicRoute>
//                     <Register />
//                   </PublicRoute>
//                 } 
//               />
//               <Route
//                 path="dashboard"
//                 element={
//                   <ProtectedRoute>
//                     <Dashboard />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="questionnaire"
//                 element={
//                   <ProtectedRoute>
//                     <Questionnaire />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="report"
//                 element={
//                   <ProtectedRoute>
//                     <Report />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="couple-report"
//                 element={
//                   <ProtectedRoute>
//                     <CoupleReport />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="pair"
//                 element={
//                   <ProtectedRoute>
//                     <Pair />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="profile"
//                 element={
//                   <ProtectedRoute>
//                     <Profile />
//                   </ProtectedRoute>
//                 }
//               />
//             </Route>
//           </Routes>
//         </Router>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/Dashboard';
import { Questionnaire } from './pages/Questionnaire';
import { Report } from './pages/Report';
import { CoupleReport } from './pages/CoupleReport';
import { Pair } from './pages/Pair';
import { Profile } from './pages/Profile';
import { Chatbot } from './pages/chatbot';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" /> : <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Landing />} />
              <Route 
                path="login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="questionnaire"
                element={
                  <ProtectedRoute>
                    <Questionnaire />
                  </ProtectedRoute>
                }
              />
              <Route
                path="report"
                element={
                  <ProtectedRoute>
                    <Report />
                  </ProtectedRoute>
                }
              />
              <Route
                path="couple-report"
                element={
                  <ProtectedRoute>
                    <CoupleReport />
                  </ProtectedRoute>
                }
              />
              <Route
                path="pair"
                element={
                  <ProtectedRoute>
                    <Pair />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="chatbot"
                element={
                  <ProtectedRoute>
                    <Chatbot />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;