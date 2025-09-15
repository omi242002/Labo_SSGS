const { analyzePassword, generateSecurePassword } = require('./src/passwordValidator');

// Estrae il comando e gli argomenti successivi
const [,, command, ...args] = process.argv;

// Funzione di utility per stampare l'aiuto
function printHelp() {
  console.log('--- Password Strength Toolkit ---');
  console.log('Uso:');
  console.log('  node index.js analyze "<password>"   - Analizza la robustezza di una password.');
  console.log('  node index.js generate [lunghezza]    - Genera una password sicura (lunghezza predefinita: 12).');
  console.log('-------------------------------');
}

// Router dei comandi
switch (command) {
  case 'analyze':
    const [passwordToAnalyze] = args;
    if (!passwordToAnalyze) {
      console.error('Errore: Devi fornire una password da analizzare.');
      printHelp();
      process.exit(1);
    }
    
    const analysis = analyzePassword(passwordToAnalyze);
    console.log('--- Analisi Robustezza Password ---');
    console.log(`Password Analizzata: ${'*'.repeat(passwordToAnalyze.length)}`);
    console.log(`Punteggio di robustezza: ${analysis.score}/100`);
    console.log(`Verdetto: ${analysis.verdict}`);
    console.log('\nCriteri Soddisfatti:');
    analysis.rules.forEach(rule => {
      console.log(`- ${rule.message}: ${rule.satisfied ? 'PASSED' : 'FAILED'}`);
    });
    console.log('---------------------------------');
    break;

  case 'generate':
    const [lengthStr] = args;
    const length = lengthStr ? parseInt(lengthStr, 10) : undefined; // Usa la lunghezza fornita o lascia undefined per il default

    try {
      const newPassword = generateSecurePassword(length);
      console.log('--- Password Sicura Generata ---');
      console.log(`Password: ${newPassword}`);
      console.log('--------------------------------');
    } catch (error) {
      console.error(`Errore: ${error.message}`);
      process.exit(1);
    }
    break;

  default:
    console.error(`Errore: Comando "${command || 'nessuno'}" non riconosciuto.`);
    printHelp();
    process.exit(1);
}
