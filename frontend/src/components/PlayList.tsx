import { useEffect, useState } from "react";
import Play from "./Play";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";

interface Musica {
  titulo: string;
  visualizacoes: number;
  youtube_id: string;

}

interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
}

export default function PlayList() {
  const [musicas, setMusicas] = useState<Musica[]>([]);
  const [apiReady, setApiReady] = useState(false);
  const [activePlayer, setActivePlayer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [paginas, setPaginas] = useState(0);
  const [paginaAtual, setPaginaAtual] = useState(1);

  async function BuscaMusicas(page: number = 1) {
    try {
      setLoading(true)
      const response = await axios.get<PaginatedResponse<Musica>>(`http://localhost:8000/musicas?page=${page}`, {
        params: {
          aprovado: true
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
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      setApiReady(true);
      console.log("YouTube API pronta!");
    };

    BuscaMusicas();
  }, []);

  function musicasVazias() {
    return (
      <div className="col-12 rounded rounde-2 text-center p-2 d-flex align-items-center justify-content-center flex-wrap" style={{ background: "#202127", height: "330px" }}>
        <div className="col-12">
          <FontAwesomeIcon icon={faBoxOpen} className="fs-1" />
          <h3 className="col-12">Sem Musícas na PlayList</h3>
        </div>
      </div>
    )
  }


  if (loading) {
    return (
      <div className="col-12 d-flex align-items-center justify-content-center" style={{ height: "330px" }}>
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  } else {
    return (
      <div className="rounded rounded-2 p-2" style={{ background: "#202127" }}>
        <div className="col-12 d-flex justify-content-between">
          <h5>Top 5</h5>
        </div>
        <div className="col-12">
          {
            (musicas.length) ? musicas.map((musica) => (
              <div key={musica.youtube_id} className="mt-3">
                <Play
                  titulo={musica.titulo}
                  views={musica.visualizacoes}
                  id_youtube={musica.youtube_id}
                  apiReady={apiReady}
                  isActive={activePlayer === musica.youtube_id}
                  setActivePlayer={setActivePlayer}
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
      </div>
    );
  }
}
