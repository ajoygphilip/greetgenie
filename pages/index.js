import Head from 'next/head';
import { useState } from 'react';
import styles from './index.module.css';

export default function Home() {
  const [name, setNameInput] = useState('');
  const [result, setResult] = useState();
  const [occasion, setOccasion] = useState('birthday');
  const [number, setNumber] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [traitOne, setTraitOne] = useState('');
  const [traitTwo, setTraitTwo] = useState('');
  const [like, setLike] = useState('');
  const [genieImg, setGenieImg] = useState('/genie-2.gif');
  const [temperature, setTemperature] = useState(8);

  async function onSubmit(event) {
    event.preventDefault(); //prevent submit on click
    const input_data = {
      name,
      number,
      company,
      occasion,
      role,
      traitOne,
      traitTwo,
      like,
      temperature,
    };

    try {
      setGenieImg('/genie-3.gif'); // switching genie image for loading time
      setResult('');
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input_data),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setGenieImg('/genie-2.gif');
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  const ordinalSuffix = (number) => {
    if (isNaN(number)) return '';
    if (number % 100 >= 11 && number % 100 <= 13) {
      return 'th';
    }
    switch (number % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  return (
    <div>
      <Head>
        <title>Wisher</title>
        <link rel="icon" href="/genie.jpg" />
      </Head>

      <main className={styles.main}>
        <img src={genieImg} className={styles.icon} />
        <h3>GreetGenie</h3>
        <form onSubmit={onSubmit}>
          <p>
            I want to wish{' '}
            <input
              type="text"
              placeholder="name"
              value={name}
              onChange={(e) =>
                setNameInput(
                  e.target.value.charAt(0).toUpperCase() +
                    e.target.value.slice(1)
                )
              }
            />{' '}
            on their{' '}
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
            >
              <option value="birthday">Birthday</option>
              <option value="work anniversary">Work Anniversary</option>
            </select>{' '}
            {occasion.toLowerCase().includes('work') ? (
              <span>
                {' '}
                as{' '}
                <input
                  type="text"
                  placeholder="eg:developer/designer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
                at{' '}
                <input
                  type="text"
                  placeholder="eg:FAYA"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
                for the{' '}
                <input
                  type="number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                />
                <sup>{ordinalSuffix(number)}</sup> year
              </span>
            ) : (
              ''
            )}
            . <br />
            {name != '' ? name : 'He/She'} is a{' '}
            <input
              type="text"
              placeholder="eg: creative"
              onChange={(e) => setTraitOne(e.target.value)}
            />{' '}
            and{' '}
            <input
              type="text"
              placeholder="eg: cheerful"
              onChange={(e) => setTraitTwo(e.target.value)}
            />{' '}
            person who loves to{' '}
            <input
              type="text"
              placeholder="eg:try new food"
              onChange={(e) => setLike(e.target.value)}
            />
            .
          </p>
          Genie Power Level
          <input
            type="range"
            min="1"
            max="10"
            onChange={(e) => setTemperature(e.target.value)}
          />
          <input type="submit" value="Make My Wish" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
