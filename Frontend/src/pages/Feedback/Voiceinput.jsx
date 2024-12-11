import React, { useEffect } from "react";
import { useState, useRef } from "react";
import styles from "./Voiceinput.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import ReactStars from "react-rating-stars-component";
import { handleError, handleSucess } from "../../utils/utils";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Voiceinput = () => {
  const [prompt, Setprompt] = useState({});
  const [text, setText] = useState("");
  const [location, setlocation] = useState("");
  const [scheme, setscheme] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [language, setLanguage] = useState("hi-IN");

  const [rating, setRating] = useState(0);
  const [Data, SetData] = useState([]);
  const [selectedState, setSelectedState] = useState(''); // To track selected state
  const [loading, setLoading] = useState(false); // For loading state
  const [districts, setDistricts] = useState([]);

  const handleRating = (newRating) => {
    setRating(newRating);
    console.log("Selected rating:", newRating); // You can send this to the backend
  };
  // const [feedbackType, setFeedbackType] = useState("");
  const [userCategory, setUserCategory] = useState("");
  const [dis, Setdis] = useState('');
  // const feedbackTypes = ["Suggestion", "Complaint", "Inquiry", "Appreciation"];
  const userCategories = ["Visitor", "Official", "Stakeholder", "Other"];

  const indianLanguages = [
    { code: "hi-IN", name: "Hindi" },
    { code: "en-IN", name: "English" },
    { code: "bn-IN", name: "Bengali" },
    { code: "ta-IN", name: "Tamil" },
    { code: "te-IN", name: "Telugu" },
    { code: "ml-IN", name: "Malayalam" },
    { code: "mr-IN", name: "Marathi" },
    { code: "gu-IN", name: "Gujarati" },
    { code: "kn-IN", name: "Kannada" },
    { code: "pa-IN", name: "Punjabi" },
    { code: "or-IN", name: "Odia" },
    { code: "as-IN", name: "Assamese" },
    { code: "ur-IN", name: "Urdu" },
    { code: "ks-IN", name: "Kashmiri" },
    { code: "ma-IN", name: "Maithili" },
  ];

  const initializeRecognition = () => {
    if (!recognitionRef.current) {
      if (
        "SpeechRecognition" in window ||
        "webkitSpeechRecognition" in window
      ) {
        const recognition = new (window.SpeechRecognition ||
          window.webkitSpeechRecognition)();
        recognition.lang = language;
        recognition.continuous = true;

        recognition.onresult = (event) => {
          const currentTranscript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("");
          setText(currentTranscript);
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error: ", event.error);
        };

        recognitionRef.current = recognition;
      } else {
        alert("Speech Recognition API not supported in your browser.");
      }
    }
  };

  const handleListening = () => {
    initializeRecognition();
    const recognition = recognitionRef.current;

    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      console.log("Stopped listening");
    } else {
      recognition.start();
      console.log("Started listening");
    }

    setIsListening(!isListening);

    recognition.onaudiostart = () => console.log("Audio capturing started.");
    recognition.onspeechstart = () => console.log("Speech detected.");
    recognition.onspeechend = () => console.log("Speech ended.");
    recognition.onend = () => console.log("Recognition stopped.");
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage; // Update the language dynamically
    }
  };

  const handlesubmit = async () => {
    if (!scheme || !userCategory) {
      alert("Please fill all the fields before submitting feedback.");
      return;
    }

    const newPrompt = {
      location: `${dis - selectedState}`,
      scheme: scheme,
      text: text,
      rating: rating,
      userCategory: userCategory,
      myprompt:
        "You have been given feedback in the form of text regarding a scheme from a visitor at a mela. The feedback text is related to the scheme and can be in any language. Your task is to analyze the feedback and extract key points or a conclusion that can help improve the scheme. If the feedback contains no relevant information for improvement, return only the following JSON object with the field 'relevant' set to false: { location: <location>, scheme: <scheme>, relevant: false }. If there is relevant information, return only the following JSON object with the fields 'location' (same as provided), 'scheme' (same as provided), 'relevant' set to true, and a 'point' field containing the extracted key point or conclusion from the feedback: { location: <location>, scheme: <scheme>, relevant: true, point: <extracted key point> }. Do not include any other data in the response.",
    };

    Setprompt(newPrompt);
    try {
      const res = await axios.post(
        "http://localhost:3000/Gemini/listen",
        newPrompt
      );
      console.log(res.data);
      if (res.data.success) {
        handleSucess(res.data.message);
      } else {
        handleError(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchActiveDistrict = async (selectedScheme) => {
    SetData([]);
    try {
      const response = await axios.get(`http://localhost:3000/ActiveScheme/${selectedScheme}`);
      if (response.data.success == true) {
        SetData(response.data.data)
      }

    } catch (error) {
      console.log("error in fetching active scheme district", error)
    }
    finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchActiveDistrict()
  }, [scheme])

  // Handle state selection change
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    console.log(e.target.value);
    const selectedStateData = Data.find(item => item.state === e.target.value); // Find the selected state's data
    if (selectedStateData) {
      setDistricts(selectedStateData.districts); // Update districts based on selected state
    }
  };
  return (
    <div className={styles.bigContainer}>
      <div className={styles.voiceInputContainer}>
      <h2>Record FeedBack</h2>
      <div className={styles.feedbackform}>
        <select
          class="form-select form-select-sm"
          aria-label="Select Post Office Scheme"
          onChange={(e) => {
            setSelectedState('');
            SetData([]);
            setDistricts([]);
            setscheme(e.target.options[e.target.selectedIndex].text);

            fetchActiveDistrict(e.target.options[e.target.selectedIndex].text);
          }}
        >
          <option selected>Choose a Post Office Scheme</option>

          <option value="1">Post Office Savings Account</option>
          <option value="2">Post Office Recurring Deposit Account</option>
          <option value="3">Post Office Time Deposit Account</option>
          <option value="4">Post Office Monthly Income Scheme</option>
          <option value="5">Senior Citizen Savings Scheme</option>
          <option value="6">Public Provident Fund</option>
          <option value="7">Sukanya Samriddhi Yojana</option>

          <option value="8">Postal Life Insurance</option>
          <option value="9">Rural Postal Life Insurance</option>

          <option value="10">National Savings Certificate</option>
          <option value="11">Kisan Vikas Patra</option>

          <option value="12">Fixed Deposits</option>
          <option value="13">Recurring Deposits</option>
          <option value="14"> Mahila Samman Savings Certificate</option>
        </select>
      </div>




      <div className={styles.selectState}>
        <h2>Select State</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <select value={selectedState} onChange={handleStateChange}>
            <option value="" disabled>Select a state</option>
            {Data.map((scheme, index) => (
              <option key={index} value={scheme.state}>
                {scheme.state}
              </option>
            ))}
          </select>
        )}
      </div>


      <div className={styles.selectDistrict}>
        <h3>Districts in {selectedState}:</h3>
        <select value={dis} onChange={(e) => {
          Setdis(e.target.value);
        }}>
          <option value="" disabled>Select a district</option>
          {districts.map((district, index) => (
            <option key={index} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>

      {/* <div>
        <select
          className="form-select"
          aria-label="Select Feedback Type"
          value={feedbackType}
          onChange={(e) => setFeedbackType(e.target.value)}
        >
          <option selected>Choose Feedback Type</option>
          {feedbackTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div> */}
      <div className={styles.chooseCategory}> 
        <select
          className="form-select"
          aria-label="Select User Category"
          value={userCategory}
          onChange={(e) => setUserCategory(e.target.value)}
        >
          <option selected>Choose User Category</option>
          {userCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <button className={styles.button} onClick={handleListening}>
        {isListening ? "Stop Listening" : "Start Listening"}
      </button>
      <p>Transcribed Text: {text}</p>
      <button
        onClick={() => {
          setText("");
        }}
        style={{ marginLeft: "10px" }}
      >
        Reset
      </button>
      <button type="button" class="btn btn-success" onClick={handlesubmit}>
        submit
      </button>

      <div className={styles.selectLanguage}>
        <select
          className="form-select"
          value={language}
          onChange={handleLanguageChange}
        >
          {indianLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.ratingContainer}>
        <h2>Rate Us</h2>
        <ReactStars
          count={5}
          size={30}
          isHalf={true}
          value={rating}
          onChange={handleRating}
          activeColor="#ffd700"
        />
        <p>Your rating: {rating}</p>
      </div>
      <ToastContainer />
    </div>
    </div>

  );
};

export default Voiceinput;






// const schemes = [
//   "Post Office Savings Account",
//   "Post Office Recurring Deposit Account",
//   "Post Office Time Deposit Account",
//   "Post Office Monthly Income Scheme",
//   "Senior Citizen Savings Scheme",
//   "Public Provident Fund",
//   "Sukanya Samriddhi Yojana",
//   "Postal Life Insurance",
//   "Rural Postal Life Insurance",
//   "National Savings Certificate",
//   "Kisan Vikas Patra",
//   "Fixed Deposits",
//   "Recurring Deposits",
//   "Mahila Samman Savings Certificate"
// ];