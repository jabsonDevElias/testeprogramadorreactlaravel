import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import axios from "axios";
import Sugestao from "./Sugestao";
import { Button, Modal } from "react-bootstrap";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons/faBoxOpen";

interface Musica {
    id: number;
    titulo: string;
    visualizacoes: number;
    youtube_id: string;
    created_at: string;
}

interface PaginatedResponse<T> {
    current_page: number;
    data: T[];
    last_page: number;
    per_page: number;
    total: number;
}

export default function Sugestoes() {

    const [musicas, setMusicas] = useState<Musica[]>([]);
    const [url, setUrl] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [paginas, setPaginas] = useState(0);
    const [paginaAtual, setPaginaAtual] = useState(1);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function extrairIdVideo(url: string) {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&][^#]*)?/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    async function SugerirMusicas() {

        const id_youtube = extrairIdVideo(url);


        if (!id_youtube) {
            handleShow();
            setMsg("URL invalida!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/cadastra-musicas", {
                youtube_id: id_youtube
            });
            setUrl("");
            handleShow();
            setMsg(response.data.message);

        } catch (error) {
            console.error(error);
        } finally {
            BuscaMusicas();
        }
    }


    async function BuscaMusicas(page: number = 1) {
        try {
            setLoading(true);
            const response = await axios.get<PaginatedResponse<Musica>>(`http://localhost:8000/musicas?page=${page}`, {
                params: {
                    aprovado: false
                }
            });

            setMusicas(response.data.data);
            setPaginaAtual(response.data.current_page);
            setPaginas(response.data.last_page);

            setMusicas(response.data.data);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        BuscaMusicas();
    }, [])

    function musicasVazias() {
        return (
            <div className="col-12 rounded rounde-2 text-center p-2" style={{ background: "#202127" }}>
                <FontAwesomeIcon icon={faBoxOpen} className="fs-1" />
                <h3>Sem Musícas Cadastradas</h3>
            </div>
        )
    }

    function carregar() {
        if (loading) {
            return (
                <div className="col-12 d-flex align-items-center justify-content-center" style={{ height: "200px" }}>
                    <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )
        }
    }


    return (
        <>

            <div className="input-group mb-3">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="form-control border border-warning text-white"
                    placeholder="Link Youtube"
                    aria-label="Link Youtube"
                    aria-describedby="button-addon2"
                    style={{ background: "#070607" }}
                />
                <button
                    onClick={() => SugerirMusicas()}
                    className="btn btn-outline-warning"
                    type="button"
                    id="button-addon2"
                >
                    <FontAwesomeIcon icon={faAdd} />
                </button>
            </div>

            {carregar()}

            <div className="col-12">
                <h3>Propostas</h3>

                {
                    (musicas.length) ?
                        musicas.map((musica) => (
                            <div key={musica.youtube_id} className="mt-3 rounded rounded-2" style={{ background: "#212026" }}>
                                <Sugestao
                                    id={musica.id}
                                    titulo={musica.titulo}
                                    views={musica.visualizacoes}
                                    id_youtube={musica.youtube_id}
                                    data={format(new Date(musica.created_at), "dd/MM/yyyy HH:mm:ss")}
                                />
                            </div>
                        )) : musicasVazias()}

                <div className="col-12 d-flex justify-content-center mt-3">
                    <ul className="pagination">
                        {/* Botão anterior */}
                        <li className={`page-item ${paginaAtual === 1 ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => BuscaMusicas(paginaAtual - 1)}
                                disabled={paginaAtual === 1}
                            >
                                &laquo;
                            </button>
                        </li>

                        {/* Números das páginas */}
                        {Array.from({ length: paginas }, (_, i) => i + 1).map((page) => (
                            <li
                                key={page}
                                className={`page-item ${paginaAtual === page ? "active" : ""}`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => BuscaMusicas(page)}
                                >
                                    {page}
                                </button>
                            </li>
                        ))}

                        {/* Botão próximo */}
                        <li className={`page-item ${paginaAtual === paginas ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => BuscaMusicas(paginaAtual + 1)}
                                disabled={paginaAtual === paginas}
                            >
                                &raquo;
                            </button>
                        </li>
                    </ul>
                </div>

            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Mensagem</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {msg}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>


        </>
    )
}
