import React from "react";
import { useState , useRef } from "react";
import styles from "./Voiceinput.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
const Voiceinput = () => {
  const [prompt, Setprompt] = useState({});
  const [text, setText] = useState("");
  const [location, setlocation] = useState("");
  const [scheme, setscheme] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [language, setLanguage] = useState("hi-IN");


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
      if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang =  language;
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
    if (!scheme) {
      alert("Please select a valid scheme");
      return;
    }

    const newPrompt = {
      location: location,
      scheme: scheme,
      text: text,
      myprompt:
        "You have been given feedback in the form of text regarding a scheme from a visitor at a mela. The feedback text is related to the scheme and can be in any language. Your task is to analyze the feedback and extract key points or a conclusion that can help improve the scheme. If the feedback contains no relevant information for improvement, return only the following JSON object with the field 'relevant' set to false: { location: <location>, scheme: <scheme>, relevant: false }. If there is relevant information, return only the following JSON object with the fields 'location' (same as provided), 'scheme' (same as provided), 'relevant' set to true, and a 'point' field containing the extracted key point or conclusion from the feedback: { location: <location>, scheme: <scheme>, relevant: true, point: <extracted key point> }. Do not include any other data in the response.",
    };

    Setprompt(newPrompt);
    try {
      const res = await axios.post(
        "http://localhost:3000/Gemini/listen",
        newPrompt
      );
    } catch (error) {
      console.log(error);
    }
  };

 
  
  return (
    <div className={styles.div}>
      <div>
        <input
          placeholder="Enter Location of feedback"
          value={location}
          onChange={(e) => {
            setlocation(e.target.value);
            console.log(location);
          }}
        ></input>
      </div>
      <div>
        <select
          class="form-select form-select-sm"
          aria-label="Select Post Office Scheme"
          onChange={(e) => {
            setscheme(e.target.options[e.target.selectedIndex].text);
          }}
        >
          <option selected>Choose a Post Office Scheme</option>

          <option value="1">Post Office Savings Account</option>
          <option value="2">Post Office Recurring Deposit (RD) Account</option>
          <option value="3">Post Office Time Deposit (TD) Account</option>
          <option value="4">Post Office Monthly Income Scheme (MIS)</option>
          <option value="5">Senior Citizen Savings Scheme (SCSS)</option>
          <option value="6">Public Provident Fund (PPF)</option>
          <option value="7">Sukanya Samriddhi Yojana (SSY)</option>

          <option value="8">Postal Life Insurance (PLI)</option>
          <option value="9">Rural Postal Life Insurance (RPLI)</option>

          <option value="10">National Savings Certificate (NSC)</option>
          <option value="11">Kisan Vikas Patra (KVP)</option>

          <option value="12">Fixed Deposits</option>
          <option value="13">Recurring Deposits</option>
        </select>
      </div>
      <button onClick={handleListening}>
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

      <div>
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


    </div>
  );
};

export default Voiceinput;
