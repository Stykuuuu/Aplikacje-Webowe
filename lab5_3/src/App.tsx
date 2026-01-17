import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Article from "./pages/Article";
import AddArticle from "./pages/AddArticle";
import NotFound from "./pages/NotFound";

export default function App() {
    return (
        <BrowserRouter>
            <NavBar />

            <div className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/article/:id" element={<Article />} />
                    <Route path="/dodaj" element={<AddArticle />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
