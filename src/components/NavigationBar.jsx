import {Link, NavLink} from "react-router-dom";
import "./NavigationBar.css";

function NavigationBar () {
    return (
        <nav className="navigation-bar">
            <NavLink className="navigation-bar__brand" to="/">
              Focus Timer
            </NavLink>

            <div className="navigation-bar__links">
              <Link className="navigation-bar__link" to="/">
                Timer
              </Link>
              <Link className="navigation-bar__link" to="/History">
                History
              </Link>
              <Link className="navigation-bar__link" to="/Dashboard">
                Dashboard
              </Link>
            </div>
        </nav>
    );
}

export default NavigationBar;