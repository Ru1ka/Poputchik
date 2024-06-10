import React from 'react';

const App = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to My Website</h1>
      <p style={styles.paragraph}>This is a simple React application.</p>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0'
  },
  title: {
    fontSize: '2.5em',
    color: '#333'
  },
  paragraph: {
    fontSize: '1.2em',
    color: '#666'
  }
};

export default App;
