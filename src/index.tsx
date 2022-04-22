import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import reportWebVitals from './reportWebVitals';
import Home from './pages/home';
import Room from './pages/room';
import './styles/main.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const Element = () => <div>yo</div>;

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={Home} />
        <Route path="/rooms/:id" element={Room} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
