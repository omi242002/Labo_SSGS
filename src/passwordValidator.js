// Costanti e Helper Interni
const RULES = {
  minLength: (pwd) => pwd.length >= 8,
  hasUppercase: (pwd) => /[A-Z]/.test(pwd),
  hasNumber: (pwd) => /[0-9]/.test(pwd),
  hasSpecialChar: (pwd) => /[!@#$%^&*]/.test(pwd),
};

const RULE_DEFINITIONS = [
  { key: 'minLength', message: 'Almeno 8 caratteri', score: 25 },
  { key: 'hasUppercase', message: 'Contiene almeno una lettera maiuscola', score: 25 },
  { key: 'hasNumber', message: 'Contiene almeno un numero', score: 25 },
  { key: 'hasSpecialChar', message: 'Contiene almeno un carattere speciale (!@#$%^&*)', score: 25 },
];

// Funzioni Pubbliche da Esportare

/**
 * Verifica se una password soddisfa una regola specifica.
 * @param {string} ruleName - Il nome della regola (es. 'minLength').
 * @param {string} password - La password da controllare.
 * @returns {boolean} True se la regola è soddisfatta, altrimenti false.
 */
function checkPasswordRule(ruleName, password) {
  if (!RULES[ruleName]) {
    throw new Error(`Regola non valida: ${ruleName}`);
  }
  return RULES[ruleName](password);
}

/**
 * Analizza la robustezza complessiva di una password.
 * @param {string} password - La password da analizzare.
 * @returns {object} Un oggetto con punteggio, verdetto e dettagli delle regole.
 */
function analyzePassword(password) {
  if (typeof password !== 'string') {
    throw new Error('Input must be a string.');
  }

  const results = RULE_DEFINITIONS.map(def => ({
    ...def,
    satisfied: checkPasswordRule(def.key, password),
  }));

  const totalScore = results.reduce((acc, rule) => acc + (rule.satisfied ? rule.score : 0), 0);

  let verdict = 'Molto Debole';
  if (totalScore >= 100) verdict = 'Molto Forte';
  else if (totalScore >= 75) verdict = 'Forte';
  else if (totalScore >= 50) verdict = 'Media';

  return {
    score: totalScore,
    verdict: verdict,
    rules: results.map(({ message, satisfied }) => ({ message, satisfied })),
  };
}

/**
 * Genera una password casuale che soddisfa tutte le regole di base.
 * @param {number} length - La lunghezza desiderata per la password (min 8).
 * @returns {string} Una password sicura generata casualmente.
 */
function generateSecurePassword(length = 12) {
  if (length < 8) {
    throw new Error('La lunghezza non può essere inferiore a 8 caratteri.');
  }
  const chars = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    number: '0123456789',
    special: '!@#$%^&*',
  };
  
  // Garantisce che la password contenga almeno un carattere per tipo
  let password = '';
  password += chars.upper[Math.floor(Math.random() * chars.upper.length)];
  password += chars.lower[Math.floor(Math.random() * chars.lower.length)];
  password += chars.number[Math.floor(Math.random() * chars.number.length)];
  password += chars.special[Math.floor(Math.random() * chars.special.length)];

  const allChars = Object.values(chars).join('');
  while (password.length < length) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Mescola i caratteri per randomizzare la posizione dei primi inseriti
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}


module.exports = {
  analyzePassword,
  checkPasswordRule,
  generateSecurePassword,
};
