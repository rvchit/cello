import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import FileUpload from "./components/FileUpload";
import ImageViewer from "./components/OSDviewer";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ViewerPage from "./components/ViewerPage";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Track login status
  const [selectedImageId, setSelectedImageId] = useState<string | undefined>(); // Track selected image

  // Private route to protect access to viewer page
  const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <div className="APP">
        <Routes>
          {/* Login Page */}
          <Route
            path="/login"
            element={<LoginPage onLogin={() => setIsLoggedIn(true)} />}
          />

          {/* Register Page */}
          <Route path="/register" element={<RegisterPage />} />

          {/* Viewer Page (Protected by PrivateRoute) */}
          <Route
            path="/viewer"
            element={
              <PrivateRoute>
                <ViewerPage
                  selectedImageId={selectedImageId}
                  setSelectedImageId={setSelectedImageId}
                />
              </PrivateRoute>
            }
          />

          {/* Redirect unknown routes to Login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
