import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Joke from './Joke';
import './JokeList.css';

function JokeList({ numJokesToGet = 5 }) {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getJokes();
  }, []);

  async function getJokes() {
    try {
      let jokes = [];
      let seenJokes = new Set();

      while (jokes.length < numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { id, joke } = res.data;

        if (!seenJokes.has(id)) {
          seenJokes.add(id);
          jokes.push({ id, joke, votes: 0 });
        }
      }

      setJokes(jokes);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  function vote(id, delta) {
    setJokes(jokes.map(j =>
      j.id === id ? { ...j, votes: j.votes + delta } : j
    ));
  }

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

  return (
    <div className="JokeList">
      <button onClick={ () => getJokes() } className="JokeList-getmore">
        Get New Jokes
      </button>
      { jokes.sort((a, b) => b.votes - a.votes).map(j => (
        <Joke text={ j.joke } key={ j.id } id={ j.id } votes={ j.votes } vote={ vote } />
      )) }
    </div>
  );
}

export default JokeList;
