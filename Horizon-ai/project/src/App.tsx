import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthLayout } from './components/AuthLayout';
import { AuthPage } from './pages/AuthPage';
import { Chat } from './pages/Chat';
import { LogoutPage } from './pages/LogoutPage';

function App() {
  return (
    <BrowserRouter>
      <AuthLayout>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/" element={<Chat />} />
        </Routes>
      </AuthLayout>
    </BrowserRouter>
  );
}

export default App;