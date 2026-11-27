module.exports = {
  preset: 'jest-expo',
  // O primeiro teste de cada arquivo paga a carga fria do jest-expo e do router; com a CPU
  // disputada (varias suites em paralelo, CI lento) isso passa dos 5000 ms padrao e o teste cai
  // por tempo, nao por defeito (F45, LAC-10).
  testTimeout: 30000,
};
