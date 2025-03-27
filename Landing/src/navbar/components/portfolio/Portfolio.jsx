import "./portfolio.scss";
import {motion,useScroll,useSpring, useTransform} from "framer-motion";
import { useRef } from "react";

const items = [
    {
        id :1,
        title:"Voice-Based Feedback Analysis",
        img:  "https://www.semiconductor-digest.com/wp-content/uploads/2019/07/Voice-tech-2-1024x623.png",
       desc:"NLP-based feedback feature to process voice and text feedback from users, enabling real-time improvements. Sentiment analysis to measure the effectiveness of campaigns and identify areas for improvement."

    },
    {
        id :2,
        title:"Adaptive Recommendations Model",
        img: "https://i.imgur.com/DUlhkOs.jpeg",
       desc:"The AI model is designed to adapt to new data, ensuring accurate predictions even when new schemes are introduced.It maintains efficiency and reliability, making it a robust tool for forecasting the success rates of financial and insurance schemes."

    },
    {
        id :3,
        title:"Generative AI-Powered Recommendations",
        img: "https://pub-e93d5c9fdf134c89830082377f6df465.r2.dev/2024/07/Generative-AI.webp",
       desc:"PostYojna AI leverages Generative AI to not only predict the most suitable financial and insurance schemes but also provide the reasoning and context behind these recommendations."
    },
    
];

const Single = ({item}) =>{

    const ref = useRef();

    const{scrollYProgress} = useScroll({
        target:ref,
        // offset:["start start","end start"]
    });

    const y = useTransform(scrollYProgress ,[0,1],[-300,300]);
    return(
      <section ref = {ref}>
        <div className="container">
            <div className="wrapper">
                <div className="imageContainer">
                  <img src={item.img} alt="" />
                </div>
                <motion.div className="textContainer" style={{y}}>
                  <h2>{item.title}</h2>
                  <p>{item.desc}</p>

                </motion.div>
            </div>
        </div>
    </section>
    );
};
const Portfolio = () => {

    const ref = useRef();
    const{scrollYProgress} = useScroll({target:ref,offset:["end end" , "start start"]
    }); 

    const scaleX = useSpring(scrollYProgress,{
        stiffness: 100,
        damping: 30,
    });
   
    return (
        <div className="portfolio" ref={ref} >
            <div className="progress">
                <h1>How we are different</h1>
                <motion.div style={{scaleX}} className="progressBar"></motion.div>
            </div>
            {items.map((item) => (
                <Single item={item} key={item.id}/>
            ))}

        </div>
    );
    
};

export default Portfolio;