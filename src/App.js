import { useEffect, useState } from 'react';
import './App.scss';

const API_URL = 'https://dog.ceo/api/';

const fetchAllBreeds = async () => {
  try {
    const allBreeds = await fetch (`${API_URL}breeds/list/all`);
    const data = await allBreeds.json();
    const breeds = Object.entries(data.message)
    return breeds
  } catch (error) {
    console.error(error.message)
  }
}

const fetchRandomBreedImg = async breed => {
  const randomImg = await fetch(`${API_URL}breed/${breed}/images/random`);
  const data = await randomImg.json();
  const { message } = data;
  return message
}

function Modal ({children, closeModal}) {
  return (
    <div className='Modal'>
      <div className='Modal-header'>
        <button onClick={closeModal} className='Close-btn'>✖️</button>
      </div>
      <div className='Modal-content'>
        {children}
      </div>
    </div>
  )
}

function Button ({value, handleClick}) {
  return <button onClick={handleClick} className='Btn'>{value}</button>
}

function Gallery ({selectedBreed}) {
  const [breedImg, setBreedImg] = useState('');
  useEffect(() => {
    const fetchData = async ()=> setBreedImg(await fetchRandomBreedImg(selectedBreed));
    fetchData();
  }, []);
  const changeImage = async selectedBreed => {
    const newImg = await fetchRandomBreedImg(selectedBreed);
    setBreedImg(newImg)
    console.log(newImg)
  }
  return (
    <div className='Gallery'>
      <div className="loader"></div>
      {breedImg 
      ? <><button className='Next-btn' onClick={()=> changeImage(selectedBreed) }>Next</button><img className='Image' src={breedImg} alt={selectedBreed}/> </>
      : null}
    </div>
  )
}

function App() {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState(null);
  useEffect(() => {
    const fetchData = async ()=> setBreeds(await fetchAllBreeds());
    fetchData();
  }, []);

  const closeModal = () => {
    setSelectedBreed(null)
  }

  return (
    <div className="App">
      <div className="App-header"><h1 className='h1'>Dog App</h1></div>
      <div className="Breeds-list">
        { breeds.map(el => {
            return <Button 
              key={el[0]} 
              value={el[0]} 
              handleClick={() => setSelectedBreed(el[0])}
            />
          })
        }
      </div>
      {selectedBreed 
        ? <Modal closeModal={closeModal} selectedBreed={selectedBreed}>
            <Gallery selectedBreed={selectedBreed}/>
          </Modal> 
        : null
      }
    </div>
  );
}

export default App;
