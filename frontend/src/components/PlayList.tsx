import { useEffect } from "react";
import Play from "./Play";
import axios from "axios";

export default function Top5() {

    async function musicas() {
        try {
            const response = await axios.get('http://localhost:8000/musicas');
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        musicas();
    }, [])

    return (
        <div className="rounded rounded-2 p-2" style={{ background: "#202127" }}>
            <div className="col-12">
                <h5>Top 5</h5>
                <Play />
            </div>
        </div>
    )
}
