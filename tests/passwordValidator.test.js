const { analyzePassword, generateSecurePassword } = require('../src/passwordValidator');

describe('passwordValidator', () => {
  test('password troppo corta → fallisce la regola di lunghezza', () => {
    const res = analyzePassword('Aa1!aaa'); // 7 char
    expect(res).toHaveProperty('rules');
    const lenRule = res.rules.find(r => /lunghezza|length/i.test(r.message));
    expect(lenRule?.satisfied).toBe(false);
  });

  test('password valida → passa le regole principali', () => {
    const res = analyzePassword('G00dPwd!234');
    const passed = res.rules.filter(r => r.satisfied).length;
    expect(passed).toBeGreaterThan(0);
  });

  test('generateSecurePassword(20) → lunghezza corretta e analisi ok', () => {
    const p = generateSecurePassword(20);
    expect(p).toHaveLength(20);
    const res = analyzePassword(p);
    expect(res.rules.every(r => r.satisfied)).toBe(true); // se il tuo validator lo consente
  });
});
