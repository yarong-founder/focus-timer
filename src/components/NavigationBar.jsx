import {Link} from "react-router-dom";

function NavigationBar () {
    return (
        <div>
            <div>
                <Link to="/">Timer</Link>
            </div>
            <div>
                <Link to="/History">History</Link>
            </div>
            <div>
                <Link to="/Dashboard">Dashboard</Link>
            </div>
        </div>
    );
}

export default NavigationBar;