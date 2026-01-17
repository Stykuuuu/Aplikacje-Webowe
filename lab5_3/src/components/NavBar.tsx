import { NavLink } from "react-router-dom";

export default function NavBar() {
    return (
        <div className="nav">
            <div className="navInner">
                <div className="brand">
                    <div className="brandBadge">B</div>
                    <div>Blog</div>
                </div>

                <div className="navLinks">
                    <NavLink to="/" className="navlink">Home</NavLink>
                    <NavLink to="/blog" className="navlink">Blog</NavLink>
                    <NavLink to="/dodaj" className="navlink">Dodaj</NavLink>
                </div>
            </div>
        </div>
    );
}

