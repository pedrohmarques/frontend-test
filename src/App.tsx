import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PostListPage from './pages/PostList/PostListPage';
import PostDetailPage from './pages/PostDetail/PostDetailPage';
import { ScrollToTop } from './components/ScrollToTop/ScrollToTop';
import NotFound from './components/NotFound/NotFound';
import Header from './components/Header/Header';
import { FiltersProvider } from './features/filters';

function App() {
  return (
    <BrowserRouter>
      
      <ScrollToTop />
      <FiltersProvider>
        <Header />
        <Routes>
          <Route path="/" element={<PostListPage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </FiltersProvider>
      
    </BrowserRouter>
  );
}

export default App;