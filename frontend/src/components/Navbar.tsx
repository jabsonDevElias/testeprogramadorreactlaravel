import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Navbar() {
    return (
        <nav className="navbar pt-3 pb-3">
            <div className="container-fluid">
                <div className="d-flex justify-content-end col-12">
                    <div className="d-flex col-2 justify-content-around">
                        <span><FontAwesomeIcon icon={faUser} /></span>
                    </div>
                </div>
            </div>
        </nav>
    )
}
