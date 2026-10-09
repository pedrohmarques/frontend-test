import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PostListPage from './pages/PostList/PostListPage';
import PostDetailPage from './pages/PostDetail/PostDetailPage';
import { ScrollToTop } from './components/ScrollToTop/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <Routes>
        <Route path="/" element={<PostListPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;