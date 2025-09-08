import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import api from "../service/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal } from "react-bootstrap";

interface MusicaData {
    titulo: string;
    visualizacoes: number;
}

export default function Musica() {
    const { id } = useParams();
    const [musica, setMusica] = useState<MusicaData>({
        titulo: "",
        visualizacoes: 0,
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [msg, setMsg] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    async function BuscaMusicas() {
        try {
            setLoading(true);

            const response = await api.get(`http://localhost:8000/musicas/${id}`, {
                params: {
                    aprovado: true
                }
            });



            setMusica(response.data.data[0]);


        } catch (error) {
            navigate("/");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function atualizarMusicas() {
        try {

            setLoading(true);

            const response = await api.put(`/atualiza-musicas/${id}`, {
                titulo: musica.titulo,
                visualizacoes: musica.visualizacoes
            });

            setMsg(response.data.message);
            handleShow();
            navigate("/");
        } catch (error) {
            navigate("/");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function excluirMusicas() {
        try {

            setLoading(true);

            const response = await api.delete(`/deletar-musicas/${id}`);
            setMsg(response.data.message);
            handleShow();
            navigate("/");
        } catch (error) {
            navigate("/");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        BuscaMusicas();
    }, [])

    console.log(musica.titulo);

    return (
        <>
            <div className="container mt-5">
                <h2 className="mb-4">Editar Música</h2>
                <div className="mb-3">
                    <label className="form-label" htmlFor="titulo">Título </label>
                    <input type="text" className="form-control" id="titulo" value={musica.titulo} onChange={(e) =>
                        setMusica({ ...musica, titulo: e.target.value })
                    } />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="visualizacoes">Visualizações</label>
                    <input type="number" className="form-control" value={musica.visualizacoes} onChange={(e) =>
                        setMusica({ ...musica, visualizacoes: Number(e.target.value) })
                    } />
                </div>
                <div className="col-2 d-flex">

                    <button className="btn btn-warning me-2" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="This top tooltip is themed via CSS variables.">
                        <FontAwesomeIcon icon={faRefresh} onClick={() => atualizarMusicas()} />
                    </button>
                    <button className="btn btn-danger">
                        <FontAwesomeIcon icon={faTrash} onClick={() => excluirMusicas()} />
                    </button>
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
