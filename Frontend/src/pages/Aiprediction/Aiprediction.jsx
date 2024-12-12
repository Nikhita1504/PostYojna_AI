import React, { useState, useEffect } from 'react';

const Aiprediction = () => {
  // Function to generate random scores between 50 and 100
  const generateRandomScore = () => {
    return (Math.random() * (100 - 50) + 50).toFixed(1); // Generates a score between 50 and 100 with 1 decimal place
  };

  const data = [
    {
      schemeName: 'Senior Citizens Savings Scheme (SCSS)',
      demographic: 'Senior Citizens',
      score: generateRandomScore(),
      action: 'Organize SCSS-specific melas',
      launchTime: 'April - June',
    },
    {
      schemeName: 'Sukanya Samriddhi Accounts (SSA)',
      demographic: 'Female Children below 10 years',
      score: generateRandomScore(),
      action: 'Host workshops',
      launchTime: 'June - July',
    },
    {
      schemeName: 'Public Provident Fund (PPF)',
      demographic: 'Working Professionals',
      score: generateRandomScore(),
      action: 'Increase awareness campaigns',
      launchTime: 'January - March',
    },
    {
      schemeName: 'Kisan Vikas Patra (KVP)',
      demographic: 'Farmers',
      score: generateRandomScore(),
      action: 'Set up booths at agricultural fairs',
      launchTime: 'November - December',
    },
    {
      schemeName: 'Mahila Samman Savings Certificate (MSSC)',
      demographic: 'Women',
      score: generateRandomScore(),
      action: 'Arrange financial literacy programs',
      launchTime: 'October - November',
    },
    {
      schemeName: 'Rural Postal Life Insurance',
      demographic: 'Rural residents, including farmers and general population',
      score: generateRandomScore(),
      action: 'Coordinate with local NGOs and community centers to promote RPLI benefits',
      launchTime: 'October - November',
    },
    {
      schemeName: 'PM CARES for Children Scheme, 2021',
      demographic: 'Children from affected families',
      score: generateRandomScore(),
      action: 'Coordinate with local NGOs',
      launchTime: 'October - November',
    },
    {
      schemeName: 'Postal Life Insurance',
      demographic: 'Postal employees and employees of telegraph department',
      score: generateRandomScore(),
      action: 'Organize specialized life insurance enrollment drives',
      launchTime: 'October - November',
    },
  ];

  // Sort the data by score in descending order
  const sortedData = [...data].sort((a, b) => parseFloat(b.score) - parseFloat(a.score));

  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#0b1e39',
      color: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      marginLeft: '300px',
      marginTop: '100px',
      maxWidth: '1200px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
    },
    th: {
      backgroundColor: '#1a2b52',
      color: '#fff',
      padding: '12px 15px',
      textAlign: 'center',
      fontSize: '16px',
      borderBottom: '2px solid #4a6fa5',
    },
    td: {
      padding: '10px 15px',
      textAlign: 'center',
      fontSize: '14px',
      borderBottom: '1px solid #4a6fa5',
    },
    addEventButton: {
      padding: '8px 15px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    addEventButtonHover: {
      backgroundColor: '#0056b3',
    },
    scoreCircle: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto',
      backgroundColor: '#ffa500',
      color: '#fff',
      fontSize: '14px',
      fontWeight: 'bold',
    },
    topScoreCircle: {
      backgroundColor: '#28a745', // Green color for the top score
    },
  };

  const AnimatedScore = ({ targetScore, isTopScore }) => {
    const [score, setScore] = useState(0);

    useEffect(() => {
      let currentScore = 0;
      const increment = targetScore / 100; // Increment by a small fraction
      const interval = setInterval(() => {
        currentScore += increment;
        if (currentScore >= targetScore) {
          setScore(targetScore);
          clearInterval(interval);
        } else {
          setScore(Math.round(currentScore));
        }
      }, 30); // Speed of the counting animation (in ms)

      return () => clearInterval(interval);
    }, [targetScore]);

    return <div style={{ ...styles.scoreCircle, ...(isTopScore ? styles.topScoreCircle : {}) }}>{score}%</div>;
  };

  return (
    <div style={styles.container}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Scheme Recommendations </h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Scheme Name</th>
            <th style={styles.th}>Target Demographic</th>
            <th style={styles.th}>Recommendation Score</th>
            <th style={styles.th}>Suggested Action</th>
            <th style={styles.th}>Best Time to Launch</th>
            <th style={styles.th}>Schedule</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => {
            const isTopScore = parseFloat(item.score) === parseFloat(sortedData[0].score); // Check if this is the top score
            return (
              <tr key={index}>
                <td style={styles.td}>{item.schemeName}</td>
                <td style={styles.td}>{item.demographic}</td>
                <td style={styles.td}>
                  <AnimatedScore targetScore={parseFloat(item.score)} isTopScore={isTopScore} />
                </td>
                <td style={styles.td}>{item.action}</td>
                <td style={styles.td}>{item.launchTime}</td>
                <td style={styles.td}>
                  <button
                    style={styles.addEventButton}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = styles.addEventButtonHover.backgroundColor)
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = styles.addEventButton.backgroundColor)
                    }
                  >
                    Add Event
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Aiprediction;
