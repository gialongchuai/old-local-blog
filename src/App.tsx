import React from 'react';
import logo from './logo.svg';
import CreatePost from './page/blog/component/CreatePost/CreatePost';
import Blog from './page/blog';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
    <ToastContainer />
    <Blog />
    </>
  );
}

export default App;
