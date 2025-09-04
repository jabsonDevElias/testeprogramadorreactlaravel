import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import PlayList from "../components/PlayList";
export default function Home() {
    return (
        <div className="container">
            <Navbar />

            <div className="col-12 d-flex flex-wrap justify-content-between">
                <div className="col-6">
                    <Banner />
                </div>
                <div className="col-5">
                     <PlayList/>
                </div>
            </div>

        </div>
    )
}
