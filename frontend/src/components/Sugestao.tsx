import { faCheck, faTrash, faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../service/api";


interface SugestaoProps {
    titulo: string;
    views: number;
    id_youtube: string;
    data: string;
    id: number;

}

const Sugestao: React.FC<SugestaoProps> = ({ titulo, views, id_youtube, data, id }) => {

    const token = localStorage.getItem("authToken");
    


    async function AprovarMusica(id: number) {
        try {
            await api.put(`/autorizar-musicas/${id}`);
            window.location.reload();

        } catch (error) {
            console.error(error);
        }
    }

    async function reprovarMusica(id: number) {
        try {
            await api.delete(`/deletar-musicas/${id}`);
            window.location.reload();

        } catch (error) {
            console.error(error);
        }
    }


    return (
        <>
            <div className={`d-flex rounded rounded-2 justify-content-around align-items-center flex-wrap p-2`}>
                <div className="col-1 ms-2">
                    <div
                        className="p-0 d-flex align-items-center justify-content-center img-fluid rounded rounded-2"
                        style={{
                            backgroundImage: `url('https://img.youtube.com/vi/${id_youtube}/hqdefault.jpg')`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            width: "100%",
                            height: "50px"
                        }}
                    ></div>
                </div>
                <div className="col-4 ms-2">
                    <h6 className="m-0">{titulo}</h6>
                    <p className="m-0">Views {views}</p>
                </div>
                <div className="col-2 ms-2">
                    <p className="m-0">{data}</p>
                </div>
                {(token) ? <div className="d-flex justify-content-end col-12 col-md-2">
                    <button className="btn bg-success" onClick={() => AprovarMusica(id)} aria-label="aprovar música">
                        <FontAwesomeIcon icon={faCheck} />
                    </button>
                    <button className="btn bg-danger ms-1" onClick={() => reprovarMusica(id)} aria-label="reprovar música">
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <a href={`https://www.youtube.com/watch?v=${id_youtube}`} target="_blank" aria-label="ver vídeo" className="btn bg-warning ms-1">
                        <FontAwesomeIcon icon={faVideo} />
                    </a>
                </div> : <div className="d-flex justify-content-end col-12 col-md-2">
                    <a href={`https://www.youtube.com/watch?v=${id_youtube}`} target="_blank" aria-label="ver vídeo" className="btn bg-warning ms-1">
                        <FontAwesomeIcon icon={faVideo} />
                    </a></div>}

            </div>


        </>
    )
}

export default Sugestao;
