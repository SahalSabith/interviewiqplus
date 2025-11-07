import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './redux/store';
import HomePage from './Pages/Home';
import LoginPage from './Pages/Login';
import RegisterPage from './Pages/Register';
import InterviewPage from './Pages/interviewPage';
import FaceVerifyPage from './Pages/FaceVerifyPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/verify-page" element={<FaceVerifyPage />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;