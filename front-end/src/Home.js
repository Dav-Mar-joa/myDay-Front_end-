import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate
import './styles/Home.css';
import './styles/Mobile.css';
import LogoutButton from './LogoutButton'; // Importer le composant LogoutButton
import SettingsButton from './SettingsButton'; // Importer le composant LogoutButton
import { Link } from 'react-router-dom';
let feeling1=""
let feeling2=""
let feeling3=""
let feeling4=""
function Home() {
  const [rating1, setRating1] = useState(0);
  const [rating2, setRating2] = useState(0);
  const [rating3, setRating3] = useState(0);
  const [rating4, setRating4] = useState(0);
  const [phrase, setPhrase] = useState('');
  const [canSubmit, setCanSubmit] = useState(true); // Contrôle de la possibilité de soumettre
  const [feelings, setFeelings] = useState(["", "", "", ""]);
  const navigate = useNavigate(); // Initialisation de useNavigate
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

//   const handleSubmit = async () => {
//     // Cette fonction gère la soumission réelle
//     const userData = {
//       feeling1: rating1,
//       feeling2: rating2,
//       feeling3: rating3,
//       feeling4: rating4,
//       phraseGratitude: phrase,
//       regle: document.getElementById("regle").checked
//     };

//     try {
//       const API_URL =
//         window.location.hostname === "localhost"
//           ? "http://localhost:4000"
//           : "https://myday-back.onrender.com";

//       const response = await fetch(`${API_URL}/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(userData),
//         credentials: 'include'
//       });

//       const data = await response.json();
//       console.log("Réponse du serveur :", data);

//       if (data) {
//         handleClear();
//         const currentDate = new Date();
//         const currentDateWithoutTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
//         localStorage.setItem('lastSubmissionDate', currentDateWithoutTime.toISOString()); // Enregistrer la date sans l'heure
//         setCanSubmit(false); // Désactiver le bouton de soumission
//       }
//     } catch (error) {
//       console.error("Erreur lors de l'envoi :", error);
//     }
//   };

const handleSubmit = async () => {
    // Vérification des valeurs avant l'envoi
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
  
      // Ajout d'un log pour vérifier l'URL
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
        localStorage.setItem('lastSubmissionDate', currentDateWithoutTime.toISOString()); // Enregistrer la date sans l'heure
        setCanSubmit(false); // Désactiver le bouton de soumission
        navigate('/Historique');
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
    }
    const API_URL =
        window.location.hostname === "localhost"
          ? "http://localhost:4000"
          : "https://myday-back.onrender.com";
    const response = await fetch(`${API_URL}/user-feelings`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: 'include'
      });

      console.log("response",response)
  };
  

  useEffect(() => {

    const fetchUserFeelings = async () => {
        try {
          const API_URL =
            window.location.hostname === "localhost"
              ? "http://localhost:4000"
              : "https://myday-back.onrender.com";
  
          const response = await fetch(`${API_URL}/user-feelings`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: 'include'
          });
  
          const dataFeelings = await response.json();
          feeling1=dataFeelings.feelings[0]
          feeling2=dataFeelings.feelings[1]
          feeling3=dataFeelings.feelings[2]
          feeling4=dataFeelings.feelings[3]

          if (dataFeelings && dataFeelings.feelings) {
            setFeelings(dataFeelings.feelings);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des émotions :", error);
        }
      };
  
      fetchUserFeelings();
    // Vérifier si la date du jour est différente de celle enregistrée dans le localStorage
    const lastSubmission = localStorage.getItem('lastSubmissionDate');
    const currentDate = new Date();
    const currentDateWithoutTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    
    if (lastSubmission) {
      const lastDate = new Date(lastSubmission);
      if (currentDateWithoutTime > lastDate) {
        setCanSubmit(true); // Permettre la soumission si nous sommes sur un nouveau jour
      } else {
        setCanSubmit(false); // Empêcher la soumission sinon
      }
    }
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h1>
          <span>M</span><span>y</span><span>D</span><span>a</span><span>y</span>
        </h1>
      </div>

      <form onSubmit={(e) => e.preventDefault()}> {/* Prévenir la soumission automatique du formulaire */}
        {[ 
          { title: feeling1, rating: rating1, setRating: handleRatingChange(setRating1) },
          { title: feeling2, rating: rating2, setRating: handleRatingChange(setRating2) },
          { title: feeling3, rating: rating3, setRating: handleRatingChange(setRating3) },
          { title: feeling4, rating: rating4, setRating: handleRatingChange(setRating4) }
        ].map((feeling, index) => (
          <div key={index}>
            <h2>{feeling.title}</h2>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${feeling.rating >= star ? 'active' : ''}`}
                  onClick={() => feeling.setRating(star)}
                >
                  &#9733;
                </span>
              ))}
            </div>
          </div>
        ))}

        <hr className="hr" />
        <h3>Mon mantra du jour</h3>
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
            onClick={handleSubmit} // Appel de la fonction handleSubmit directement
            // disabled={!canSubmit} // Désactiver le bouton si on ne peut pas soumettre
          >
            Soumettre
          </button>
        </div>
        <hr className="hr" />

        {/* <Link to="/Historique">
            <button type="button" className="submit-button">
                Historique
            </button>
        </Link> */}
        
        {/* Utilisation du composant LogoutButton */}
        <div className="settings"> 
          {/* <div className='button-container'>
            <Link to="/Emotions">
                <button type="button" className="submit-button">
                    <img className="icon-settings" src="/logout.png"></img>
                </button>
            </Link>
          </div> */}
          <div className='button-container'>
              <SettingsButton />
          </div>
          <Link to="/Historique">
            <button type="button" className="submit-button">
                Historique
            </button>
        </Link>
          <div className='button-container'>
              <LogoutButton />
          </div>
        
        </div>
       
      </form>
      <p className ="droits">© 2025 myDay. Tous droits réservés.
      Cette application, ainsi que l’ensemble de son contenu, est protégée par les lois en vigueur relatives à la propriété intellectuelle. Les données qu’elle contient sont chiffrées afin d’en garantir la sécurité. </p>
    </div>
  );
}

export default Home;
