import React, { useState, useEffect } from 'react';
import './styles/Home.css';
import './styles/Mobile.css';
import LogoutButton from './LogoutButton';

function Home() {
  const [rating1, setRating1] = useState(0);
  const [rating2, setRating2] = useState(0);
  const [rating3, setRating3] = useState(0);
  const [rating4, setRating4] = useState(0);
  const [phrase, setPhrase] = useState('');
  const [canSubmit, setCanSubmit] = useState(true);
  const [feelings, setFeelings] = useState(["", "", "", ""]);

  const handleRatingChange = (setter) => (newRating) => setter(newRating);
  const handlePhraseChange = (event) => setPhrase(event.target.value);

  const handleClear = () => {
    setRating1(0);
    setRating2(0);
    setRating3(0);
    setRating4(0);
    setPhrase('');
    const checkbox = document.getElementById("regle");
    if (checkbox) {
      checkbox.checked = false;
    }
  };

  const handleSubmit = async () => {
    console.log("Données envoyées :");
    console.log({
      feeling1: rating1,
      feeling2: rating2,
      feeling3: rating3,
      feeling4: rating4,
      phraseGratitude: phrase,
      regle: document.getElementById("regle").checked
    });

    const userData = {
      feeling1: rating1,
      feeling2: rating2,
      feeling3: rating3,
      feeling4: rating4,
      phraseGratitude: phrase,
      regle: document.getElementById("regle").checked
    };

    try {
      const API_URL =
        window.location.hostname === "localhost"
          ? "http://localhost:4000"
          : "https://myday-back.onrender.com";

      console.log("Envoi de la requête à l'URL : ", `${API_URL}/`);

      const response = await fetch(`${API_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: 'include'
      });

      const data = await response.json();
      console.log("Réponse du serveur :", data);

      if (data) {
        handleClear();
        const currentDate = new Date();
        const currentDateWithoutTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        localStorage.setItem('lastSubmissionDate', currentDateWithoutTime.toISOString());
        setCanSubmit(false);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
    }
  };

  useEffect(() => {
    const lastSubmission = localStorage.getItem('lastSubmissionDate');
    const currentDate = new Date();
    const currentDateWithoutTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    if (lastSubmission) {
      const lastDate = new Date(lastSubmission);
      if (currentDateWithoutTime > lastDate) {
        setCanSubmit(true);
      } else {
        setCanSubmit(false);
      }
    }

    // Récupérer les émotions du localStorage
    const storedFeelings = localStorage.getItem('userFeelings');
    if (storedFeelings) {
      setFeelings(JSON.parse(storedFeelings));
    }
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h1>
          <span>M</span><span>y</span><span>D</span><span>a</span><span>y</span>
        </h1>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        {feelings.map((feeling, index) => (
          <div key={index}>
            <h2>{feeling}</h2>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star >= (index === 0 ? rating1 : index === 1 ? rating2 : index === 2 ? rating3 : rating4) ? 'active' : ''}
                  onClick={() => handleRatingChange(index === 0 ? setRating1 : index === 1 ? setRating2 : index === 2 ? setRating3 : setRating4)(star)}
                >
                  &#9733;
                </span>
              ))}
            </div>
          </div>
        ))}

        <hr className="hr" />
        <h3>Ma gratitude du jour</h3>
        <textarea
          className="phrase-input"
          placeholder="Ajoutez une phrase ou une réflexion..."
          value={phrase}
          id="phraseGratitude"
          onChange={handlePhraseChange}
        ></textarea>

        <div className="regles">
          <label htmlFor="regles">Règles :</label>
          <input
            className="checkBox-regles"
            type="checkbox"
            id="regle"
            name="regle"
          />
        </div>

        <div className="boutton-clear-submit-index">
          <button
            type="button"
            className="submit-button-clear"
            onClick={handleClear}>
            Effacer
          </button>
          <button
            type="submit"
            className="submit-button"
            onClick={handleSubmit}
          >
            Soumettre
          </button>
        </div>
        <hr className="hr" />

        <button type="button" className="submit-button">
          Historique
        </button>

        <div className='button-container'>
          <LogoutButton />
        </div>
      </form>
    </div>
  );
}

export default Home;
