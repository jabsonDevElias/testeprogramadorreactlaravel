import { faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../service/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {

    const [name, setName] = useState();
    const navigate = useNavigate();

    const Logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authNome");
        localStorage.removeItem("authId");
        navigate("/");
        window.location.reload();
    };

    async function InfoUserToken() {
        try {
            const response = await api.post("/token-info");
            setName(response.data.name);
        } catch (error) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("authNome");
            localStorage.removeItem("authId");
            // console.error(error);
        }
    }

    useEffect(() => {
        InfoUserToken();
    }, [])

    return (
        <nav className="navbar pt-3 pb-3">
            <div className="container">
                <div className="d-flex justify-content-between col-12">
                    <div className="col-2">
                        <h5><span className="fw-bold">tiao</span>.pardinho</h5>
                    </div>

                    <div className="d-flex col-10 justify-content-end align-items-center">
                        <h5 className="me-3">{name}</h5>
                        {(name) ?
                            <button className="btn btn-warning" onClick={() => Logout()}><span><FontAwesomeIcon icon={faSignOut} /></span></button>
                            :
                            <button className="btn btn-warning" onClick={() => navigate("/login")}><span><FontAwesomeIcon icon={faUser} /></span></button>}
                    </div>
                </div>
            </div>
        </nav>
    )
}
