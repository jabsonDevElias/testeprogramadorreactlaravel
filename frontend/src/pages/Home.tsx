import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import PlayList from "../components/PlayList";
import Sugestoes from "../components/Sugestoes";

export default function Home() {
    return (
        <>
            <Navbar />
            <div className="container p-0">


                <div className="col-12 d-flex justify-content-between flex-wrap">
                    <div className="col-12 mt-3 d-flex justify-content-between flex-wrap">
                        <div className="col-12 col-md-6 p-1">
                            <Banner />
                        </div>

                        <div className="col-12 col-md-6 p-1">
                            <PlayList />
                        </div>
                    </div>
                    <div className="col-12 mt-2">
                        <Sugestoes />
                    </div>
                </div>

            </div>
        </>

    )
}
