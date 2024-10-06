import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

const mockFetchImages = (count) => {
  // Simulating an API call with dummy data
  return new Promise((resolve) => {
    const images = Array.from({ length: count }, (_, index) => ({
      id: index,
      url: `https://picsum.photos/seed/${index}/800/400`,
      thumbnail: `https://picsum.photos/seed/${index}/100/100`,
    }));
    setTimeout(() => resolve(images), 1000);
  });
};

const Carousel = ({ imageCount = 15 }) => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      const images = await mockFetchImages(imageCount);
      setImages(images);
    };
    fetchImages();
  }, [imageCount]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imageCount - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <Box>
      <CarouselProvider
        naturalSlideWidth={50}
        naturalSlideHeight={50}
        totalSlides={images.length}
        currentSlide={currentIndex}
      >
        <Slider style={{ Width: "300px", height: "350px" }}>
          {images?.map((image, index) => (
            <Slide key={index} index={index}>
              <img
                src={images[currentIndex].url}
                alt="carousel"
                style={{
                  width: "50%",
                  marginLeft: "95px",
                  borderRadius: "15px",
                  border: "4px solid yellow",
                }}
              />
            </Slide>
          ))}
        </Slider>

        <ButtonBack onClick={handlePrev}>Back</ButtonBack>
        <ButtonNext onClick={handleNext}>Next</ButtonNext>
        <Box display="flex" justifyContent="center" mt={2}>
          {images?.map((image, index) => (
            <img
              key={image.id}
              src={image.thumbnail}
              alt="thumbnail"
              style={{
                width: 50,
                height: 50,
                borderRadius: "4px",
                margin: "0 5px",
              }}
              className={`thumbnail ${currentIndex === index ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </Box>
      </CarouselProvider>
    </Box>
  );
};

export default Carousel;
