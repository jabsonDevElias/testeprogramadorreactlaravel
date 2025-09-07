import Carousel from 'react-bootstrap/Carousel';

export default function Banner() {
    return (
        <>
            <Carousel>
                <Carousel.Item>
                    <img className="d-block w-100 rounded rounded-2" src="galeria/banner.png" alt="First slide" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100 rounded rounded-2" src="galeria/banner2.jpg" alt="Second slide" />
                </Carousel.Item>
            </Carousel>

        </>
    )
}
