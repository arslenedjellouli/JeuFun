import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Users, Settings, Play, RotateCcw, Eye, EyeOff } from 'lucide-react';

export default function BullsAndCowsGame() {
  const [gameState, setGameState] = useState('setup');
  const [mode, setMode] = useState('shared');
  const [digits, setDigits] = useState(4);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [startingPlayer, setStartingPlayer] = useState(1);
  
  const [sharedSecret, setSharedSecret] = useState('');
  const [player1Secret, setPlayer1Secret] = useState('');
  const [player2Secret, setPlayer2Secret] = useState('');
  const [player1Guesses, setPlayer1Guesses] = useState([]);
  const [player2Guesses, setPlayer2Guesses] = useState([]);
  const [player3Guesses, setPlayer3Guesses] = useState([]);
  const [player4Guesses, setPlayer4Guesses] = useState([]);
  
  const [currentGuess, setCurrentGuess] = useState('');
  const [secretInput1, setSecretInput1] = useState('');
  const [secretInput2, setSecretInput2] = useState('');
  const [showSecret1, setShowSecret1] = useState(false);
  const [showSecret2, setShowSecret2] = useState(false);
  const [secretsSet, setSecretsSet] = useState(false);
  
  const [timer, setTimer] = useState(0);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timePerGuess, setTimePerGuess] = useState(60);
  
  const [player1Name, setPlayer1Name] = useState('Joueur 1');
  const [player2Name, setPlayer2Name] = useState('Joueur 2');
  const [player3Name, setPlayer3Name] = useState('Joueur 3');
  const [player4Name, setPlayer4Name] = useState('Joueur 4');
  const [winner, setWinner] = useState(null);
  const [numPlayers, setNumPlayers] = useState(2);


  useEffect(() => {
    if (gameState === 'playing' && timerEnabled && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState, timerEnabled, timer]);

  const handleTimeOut = () => {
    const nextPlayer = currentPlayer === numPlayers ? 1 : currentPlayer + 1;
    setCurrentPlayer(nextPlayer);
    setTimer(timePerGuess);
    setCurrentGuess('');
  };

  const generateRandomNumber = (length) => {
    const digits = [...Array(10).keys()];
    let number = '';
    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * digits.length);
      number += digits.splice(index, 1);
    }
    return number;
  };

  const hasUniqueDigits = (str) => {
    return new Set(str).size === str.length;
  };

  const compareGuess = (secret, guess) => {
    let B = 0, M = 0;
    const secretArr = secret.split('');
    const guessArr = guess.split('');
    
    // Count Bulls (correct digit in correct position)
    for (let i = 0; i < secretArr.length; i++) {
      if (guessArr[i] === secretArr[i]) {
        B++;
      }
    }
    
    // Count Cows (correct digit in wrong position)
    // We need to avoid double counting digits that are already counted as Bulls
    const secretCounts = {};
    const guessCounts = {};
    
    // Count occurrences of each digit in secret (excluding Bulls)
    for (let i = 0; i < secretArr.length; i++) {
      if (guessArr[i] !== secretArr[i]) {
        secretCounts[secretArr[i]] = (secretCounts[secretArr[i]] || 0) + 1;
      }
    }
    
    // Count occurrences of each digit in guess (excluding Bulls)
    for (let i = 0; i < guessArr.length; i++) {
      if (guessArr[i] !== secretArr[i]) {
        guessCounts[guessArr[i]] = (guessCounts[guessArr[i]] || 0) + 1;
      }
    }
    
    // Calculate Cows: minimum of each digit count between secret and guess
    for (const digit in secretCounts) {
      if (guessCounts[digit]) {
        M += Math.min(secretCounts[digit], guessCounts[digit]);
      }
    }
    
    return { B, M };
  };

  const startGame = () => {
    if (mode === 'shared') {
      const secret = generateRandomNumber(digits);
      setSharedSecret(secret);
      setGameState('playing');
      setCurrentPlayer(startingPlayer);
      if (timerEnabled) setTimer(timePerGuess);
    } else {
      setGameState('secrets');
    }
  };

  const setSecrets = () => {
    if (secretInput1.length !== digits || secretInput2.length !== digits) {
      alert('Both secrets must be ' + digits + ' digits long');
      return;
    }
    if (!hasUniqueDigits(secretInput1) || !hasUniqueDigits(secretInput2)) {
      alert('Secrets must have unique digits');
      return;
    }
    if (!/^\d+$/.test(secretInput1) || !/^\d+$/.test(secretInput2)) {
      alert('Secrets must contain only digits');
      return;
    }
    
    setPlayer1Secret(secretInput1);
    setPlayer2Secret(secretInput2);
    setSecretsSet(true);
    setGameState('playing');
    setCurrentPlayer(startingPlayer);
    if (timerEnabled) setTimer(timePerGuess);
  };

  const makeGuess = () => {
    if (currentGuess.length !== digits) {
      alert('Guess must be ' + digits + ' digits long');
      return;
    }
    if (!hasUniqueDigits(currentGuess)) {
      alert('Guess must have unique digits');
      return;
    }
    if (!/^\d+$/.test(currentGuess)) {
      alert('Guess must contain only digits');
      return;
    }

    const secret = mode === 'shared' 
      ? sharedSecret 
      : (currentPlayer === 1 ? player2Secret : player1Secret);
    
    const result = compareGuess(secret, currentGuess);
    const guessData = {
      guess: currentGuess,
      result: result,
      timestamp: new Date().toLocaleTimeString()
    };

    if (currentPlayer === 1) {
      setPlayer1Guesses([...player1Guesses, guessData]);
    } else if (currentPlayer === 2) {
      setPlayer2Guesses([...player2Guesses, guessData]);
    } else if (currentPlayer === 3) {
      setPlayer3Guesses([...player3Guesses, guessData]);
    } else {
      setPlayer4Guesses([...player4Guesses, guessData]);
    }

    if (result.B === digits) {
      setWinner(currentPlayer);
      setGameState('finished');
      return;
    }

    const nextPlayer = currentPlayer === numPlayers ? 1 : currentPlayer + 1;
    setCurrentPlayer(nextPlayer);
    setCurrentGuess('');
    if (timerEnabled) setTimer(timePerGuess);
  };

  const resetGame = () => {
    setGameState('setup');
    setSharedSecret('');
    setPlayer1Secret('');
    setPlayer2Secret('');
    setPlayer1Guesses([]);
    setPlayer2Guesses([]);
    setPlayer3Guesses([]);
    setPlayer4Guesses([]);
    setCurrentGuess('');
    setSecretInput1('');
    setSecretInput2('');
    setShowSecret1(false);
    setShowSecret2(false);
    setSecretsSet(false);
    setWinner(null);
    setTimer(0);
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  const getPlayerName = (playerNum) => {
    switch(playerNum) {
      case 1: return player1Name;
      case 2: return player2Name;
      case 3: return player3Name;
      case 4: return player4Name;
      default: return `Joueur ${playerNum}`;
    }
  };

  const getPlayerGuesses = (playerNum) => {
    switch(playerNum) {
      case 1: return player1Guesses;
      case 2: return player2Guesses;
      case 3: return player3Guesses;
      case 4: return player4Guesses;
      default: return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4 sm:mb-8 pt-4 sm:pt-8">
          <h1 className="text-3xl sm:text-5xl font-bold mb-2 flex items-center justify-center gap-2 sm:gap-3">
            <Trophy className="text-yellow-400" size={32} />
            <span className="text-2xl sm:text-5xl">ArsRiwAriAmi</span>
          </h1>
          <p className="text-purple-200 text-sm sm:text-lg">Le jeu officiel des golmons</p>
          <p className="text-purple-300 text-xs sm:text-base mt-1">Devinez le nombre secret !</p>
        </div>


        {gameState === 'setup' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-8 max-w-2xl mx-auto border border-white/20 shadow-2xl">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <Settings className="text-yellow-400" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold">Configuration du jeu</h2>
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block mb-2 font-semibold text-sm sm:text-base">Nombre de joueurs</label>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <button
                  onClick={() => setNumPlayers(2)}
                  className={`p-2 sm:p-3 rounded-lg border-2 transition-all text-sm sm:text-base ${
                    numPlayers === 2 ? 'bg-blue-600 border-blue-400' : 'bg-white/10 border-white/30 hover:bg-white/20'
                  }`}
                >
                  2 Joueurs
                </button>
                <button
                  onClick={() => setNumPlayers(4)}
                  className={`p-2 sm:p-3 rounded-lg border-2 transition-all text-sm sm:text-base ${
                    numPlayers === 4 ? 'bg-blue-600 border-blue-400' : 'bg-white/10 border-white/30 hover:bg-white/20'
                  }`}
                >
                  4 Joueurs
                </button>
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block mb-2 font-semibold text-sm sm:text-base">Noms des joueurs</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <input
                  type="text"
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                  className="bg-white/20 border border-white/30 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="Joueur 1"
                />
                <input
                  type="text"
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                  className="bg-white/20 border border-white/30 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="Joueur 2"
                />
                {numPlayers >= 3 && (
                  <>
                    <input
                      type="text"
                      value={player3Name}
                      onChange={(e) => setPlayer3Name(e.target.value)}
                      className="bg-white/20 border border-white/30 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-400"
                      placeholder="Joueur 3"
                    />
                    <input
                      type="text"
                      value={player4Name}
                      onChange={(e) => setPlayer4Name(e.target.value)}
                      className="bg-white/20 border border-white/30 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-400"
                      placeholder="Joueur 4"
                    />
                  </>
                )}
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block mb-2 font-semibold text-sm sm:text-base">Mode de jeu</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <button
                  onClick={() => setMode('shared')}
                  className={'p-3 sm:p-4 rounded-lg border-2 transition-all text-sm sm:text-base ' + (mode === 'shared' ? 'bg-purple-600 border-purple-400' : 'bg-white/10 border-white/30 hover:bg-white/20')}
                >
                  <div className="font-bold mb-1">Secret partagé</div>
                  <div className="text-xs sm:text-sm opacity-80">Tous devinent le même nombre</div>
                </button>
                <button
                  onClick={() => setMode('individual')}
                  className={'p-3 sm:p-4 rounded-lg border-2 transition-all text-sm sm:text-base ' + (mode === 'individual' ? 'bg-purple-600 border-purple-400' : 'bg-white/10 border-white/30 hover:bg-white/20')}
                >
                  <div className="font-bold mb-1">Secrets individuels</div>
                  <div className="text-xs sm:text-sm opacity-80">Chacun choisit un nombre</div>
                </button>
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block mb-2 font-semibold text-sm sm:text-base">Nombre de chiffres: {digits}</label>
              <input
                type="range"
                min="3"
                max="8"
                value={digits}
                onChange={(e) => setDigits(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs sm:text-sm opacity-70 mt-1">
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block mb-2 font-semibold text-sm sm:text-base">Joueur qui commence</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                <button
                  onClick={() => setStartingPlayer(1)}
                  className={'p-2 sm:p-3 rounded-lg border-2 transition-all text-xs sm:text-sm ' + (startingPlayer === 1 ? 'bg-blue-600 border-blue-400' : 'bg-white/10 border-white/30 hover:bg-white/20')}
                >
                  {player1Name}
                </button>
                <button
                  onClick={() => setStartingPlayer(2)}
                  className={'p-2 sm:p-3 rounded-lg border-2 transition-all text-xs sm:text-sm ' + (startingPlayer === 2 ? 'bg-blue-600 border-blue-400' : 'bg-white/10 border-white/30 hover:bg-white/20')}
                >
                  {player2Name}
                </button>
                {numPlayers >= 3 && (
                  <>
                    <button
                      onClick={() => setStartingPlayer(3)}
                      className={'p-2 sm:p-3 rounded-lg border-2 transition-all text-xs sm:text-sm ' + (startingPlayer === 3 ? 'bg-blue-600 border-blue-400' : 'bg-white/10 border-white/30 hover:bg-white/20')}
                    >
                      {player3Name}
                    </button>
                    <button
                      onClick={() => setStartingPlayer(4)}
                      className={'p-2 sm:p-3 rounded-lg border-2 transition-all text-xs sm:text-sm ' + (startingPlayer === 4 ? 'bg-blue-600 border-blue-400' : 'bg-white/10 border-white/30 hover:bg-white/20')}
                    >
                      {player4Name}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="flex items-center gap-2 mb-2 text-sm sm:text-base">
                <input
                  type="checkbox"
                  checked={timerEnabled}
                  onChange={(e) => setTimerEnabled(e.target.checked)}
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
                <span className="font-semibold">Activer le minuteur</span>
              </label>
              {timerEnabled && (
                <div>
                  <label className="block mb-2 text-xs sm:text-sm">Temps par tentative: {timePerGuess}s</label>
                  <input
                    type="range"
                    min="15"
                    max="180"
                    step="15"
                    value={timePerGuess}
                    onChange={(e) => setTimePerGuess(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-lg flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <Play size={20} />
              Commencer le jeu
            </button>
          </div>
        )}

        {gameState === 'secrets' && !secretsSet && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-8 max-w-2xl mx-auto border border-white/20 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Définir vos nombres secrets</h2>
            <p className="text-center mb-6 sm:mb-8 text-purple-200 text-sm sm:text-base">
              Chaque joueur entre un nombre de {digits} chiffres avec des chiffres uniques
            </p>

            <div className="space-y-4 sm:space-y-6">
              <div className="bg-blue-500/20 p-4 sm:p-6 rounded-xl border border-blue-400/30">
                <label className="block mb-2 font-bold text-lg sm:text-xl">Secret de {player1Name}</label>
                <div className="relative">
                  <input
                    type={showSecret1 ? "text" : "password"}
                    value={secretInput1}
                    onChange={(e) => setSecretInput1(e.target.value.replace(/\D/g, '').slice(0, digits))}
                    onKeyPress={(e) => handleKeyPress(e, setSecrets)}
                    className="w-full bg-white/20 border border-white/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-lg sm:text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder={'•'.repeat(digits)}
                    maxLength={digits}
                  />
                  <button
                    onClick={() => setShowSecret1(!showSecret1)}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                  >
                    {showSecret1 ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="bg-pink-500/20 p-4 sm:p-6 rounded-xl border border-pink-400/30">
                <label className="block mb-2 font-bold text-lg sm:text-xl">Secret de {player2Name}</label>
                <div className="relative">
                  <input
                    type={showSecret2 ? "text" : "password"}
                    value={secretInput2}
                    onChange={(e) => setSecretInput2(e.target.value.replace(/\D/g, '').slice(0, digits))}
                    onKeyPress={(e) => handleKeyPress(e, setSecrets)}
                    className="w-full bg-white/20 border border-white/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-lg sm:text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-pink-400"
                    placeholder={'•'.repeat(digits)}
                    maxLength={digits}
                  />
                  <button
                    onClick={() => setShowSecret2(!showSecret2)}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                  >
                    {showSecret2 ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={setSecrets}
              className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-lg transition-all shadow-lg"
            >
              Commencer à jouer
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="space-y-4 sm:space-y-6">
            <div className={'bg-gradient-to-r rounded-2xl p-4 sm:p-6 text-center shadow-2xl ' + (currentPlayer === 1 ? 'from-blue-500 to-blue-600' : currentPlayer === 2 ? 'from-pink-500 to-pink-600' : currentPlayer === 3 ? 'from-green-500 to-green-600' : 'from-orange-500 to-orange-600')}>
              <div className="flex items-center justify-center gap-2 sm:gap-4">
                <Users size={24} />
                <div>
                  <div className="text-lg sm:text-2xl font-bold">
                    Tour de {getPlayerName(currentPlayer)}
                  </div>
                  {timerEnabled && (
                    <div className="flex items-center justify-center gap-2 mt-1 sm:mt-2">
                      <Clock size={16} />
                      <span className="text-lg sm:text-xl font-mono">{timer}s</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 shadow-2xl">
              <label className="block mb-3 font-bold text-lg sm:text-xl">Entrez votre supposition</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={currentGuess}
                  onChange={(e) => setCurrentGuess(e.target.value.replace(/\D/g, '').slice(0, digits))}
                  onKeyPress={(e) => handleKeyPress(e, makeGuess)}
                  className="flex-1 bg-white/20 border border-white/30 rounded-lg px-4 sm:px-6 py-3 sm:py-4 text-2xl sm:text-3xl tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder={'0'.repeat(digits)}
                  maxLength={digits}
                  autoFocus
                />
                <button
                  onClick={makeGuess}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-lg transition-all shadow-lg"
                >
                  Deviner
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].slice(0, numPlayers).map((playerNum) => {
                const colors = [
                  { bg: 'bg-blue-500/20', border: 'border-blue-400/30', dot: 'bg-blue-400' },
                  { bg: 'bg-pink-500/20', border: 'border-pink-400/30', dot: 'bg-pink-400' },
                  { bg: 'bg-green-500/20', border: 'border-green-400/30', dot: 'bg-green-400' },
                  { bg: 'bg-orange-500/20', border: 'border-orange-400/30', dot: 'bg-orange-400' }
                ];
                const color = colors[playerNum - 1];
                const guesses = getPlayerGuesses(playerNum);
                
                return (
                  <div key={playerNum} className={`${color.bg} backdrop-blur-lg rounded-2xl p-4 sm:p-6 border ${color.border}`}>
                    <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                      <div className={`w-2 h-2 sm:w-3 sm:h-3 ${color.dot} rounded-full`}></div>
                      <span className="text-sm sm:text-lg">{getPlayerName(playerNum)}</span>
                    </h3>
                    <div className="text-xs sm:text-sm opacity-70 mb-3">Tentatives: {guesses.length}</div>
                    <div className="space-y-2 max-h-64 sm:max-h-96 overflow-y-auto">
                      {guesses.map((g, i) => (
                        <div key={i} className="bg-white/10 rounded-lg p-2 sm:p-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-mono text-lg sm:text-xl font-bold">{g.guess}</span>
                            <span className="text-xs text-gray-400">{g.timestamp}</span>
                          </div>
                          <div className="flex gap-2 sm:gap-3 text-sm sm:text-lg font-bold justify-center">
                            <span className="text-green-400 bg-green-400/20 px-1 sm:px-2 py-1 rounded">{g.result.B}B</span>
                            <span className="text-yellow-400 bg-yellow-400/20 px-1 sm:px-2 py-1 rounded">{g.result.M}M</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-3 sm:p-4 border border-white/20 text-center text-xs sm:text-sm">
              <span className="text-green-400 font-bold">B = Bulls</span> (chiffre correct, position correcte) • 
              <span className="text-yellow-400 font-bold ml-1 sm:ml-2">M = Cows</span> (chiffre correct, mauvaise position)
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-12 max-w-2xl mx-auto border border-white/20 shadow-2xl text-center">
            <Trophy className="mx-auto mb-4 sm:mb-6 text-yellow-400" size={60} />
            <h2 className="text-3xl sm:text-5xl font-bold mb-3 sm:mb-4">
              {getPlayerName(winner)} gagne ! 🎉
            </h2>
            <p className="text-lg sm:text-2xl mb-4 sm:mb-6">
              Deviné en {getPlayerGuesses(winner).length} tentatives
            </p>
            
            {mode === 'shared' && (
              <div className="bg-purple-500/30 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="text-sm sm:text-lg mb-2">Nombre secret :</div>
                <div className="text-2xl sm:text-4xl font-mono font-bold tracking-widest">{sharedSecret}</div>
              </div>
            )}

            {mode === 'individual' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-blue-500/30 rounded-xl p-3 sm:p-4">
                  <div className="text-xs sm:text-sm mb-2">Secret de {player1Name} :</div>
                  <div className="text-lg sm:text-2xl font-mono font-bold">{player1Secret}</div>
                </div>
                <div className="bg-pink-500/30 rounded-xl p-3 sm:p-4">
                  <div className="text-xs sm:text-sm mb-2">Secret de {player2Name} :</div>
                  <div className="text-lg sm:text-2xl font-mono font-bold">{player2Secret}</div>
                </div>
              </div>
            )}

            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 py-3 sm:py-4 px-8 sm:px-12 rounded-xl font-bold text-sm sm:text-lg flex items-center justify-center gap-2 mx-auto transition-all shadow-lg"
            >
              <RotateCcw size={20} />
              Rejouer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}