const Command = require('../app/Command');
const Chat = require('./Chat');
const Payment = require('./Payment');
const Schedule = require('./Schedule');

// !desativar
new Command({
  command: '.ativar',
  help: 'Ativa o Bot no Grupo',
  action: Chat.activate,
  isGroup: true,
});

// !ativar
new Command({
  command: '.desativar',
  help: 'Desativa o Bot no grupo',
  action: Chat.deactivate,
  isGroup: true,
});

// !pagar
new Command({
  command: '.pagou',
  help: `Avisa que a Pessoa pagou
    Ex: !pagou [Mencione quem pagou] [Diga o(s) mês(es) que foi(foram) pago(s)]
    Meses disponíveis *JAN*, *FEV*, *MAR*, *ABR*, *MAI*, *JUN*, *JUL*, *AGO*, *SET*, *OUT*, *NOV*, *DEZ*`,
  action: Payment.makePayment,
  isGroup: true,
  permission: Chat.needBeActive,
});

// !horario
new Command({
  command: '.horario',
  help: 'Adiciona novo horario',
  action: Schedule.add,
  isGroup: true,
  permission: Chat.needBeActive,
});

new Command({
  command: '.listar',
  help: 'Mostra todos os horarios',
  action: Schedule.list,
  isGroup: true,
})

new Command({
  command: '.paguei',
  help: 'verifica se paguei o horario',
  action: Payment.checkPayment,
  isGroup: true,
  permission: Chat.needBeActive,
});