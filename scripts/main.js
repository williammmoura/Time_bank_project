//main.js

// Importação das funções de lógica e UI para serem usadas no script principal
import { timeToMinutes, minutesToHours, normalizeTimes } from './logic.js';
import { renderResults } from './ui.js';

// Seleção do formulário e dos elementos do DOM onde os resultados serão exibidos
const form = document.getElementById('time_form');

// Elementos do DOM para exibir os resultados
const elements = {
    totalWorkedEl: document.getElementById('total_worked'),
    expectedWorkEl: document.getElementById('expected_work'),
    balanceEl: document.getElementById('balance'),
    overtimeEl: document.getElementById('overtime')
};

// Adiciona um ouvinte de evento para o envio do formulário, chamando a função handleSubmit quando o formulário for enviado
form.addEventListener("submit", handleSubmit);

// A função handleSubmit é responsável por processar os dados do formulário, validar os horários e calcular o total de horas trabalhadas. Ela é executada quando o usuário envia o formulário, e inclui várias etapas de validação para garantir que os horários inseridos sejam válidos e estejam em uma sequência lógica. Se os dados forem válidos, a função calcula o total de horas trabalhadas e pode exibir o resultado para o usuário.
function handleSubmit(event) {
    event.preventDefault(); //Prevenção do comportamento padrão do formulário, impedindo que a página seja recarregada ao enviar o formulário

    // Validação do formulário antes de prosseguir com o cálculo dos horários. A função checkValidity é uma função nativa do HTML5 que verifica se os campos do formulário estão preenchidos corretamente de acordo com as regras de validação definidas (como tipo de entrada, formato, etc.).
    if(!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Captura dos valores dos campos de inputs (tudo isso é string) e conversão dos horários para minutos. Dentro da função timeToMinutes há "const parts = time.split(':');" que divide o horário em horas e minutos, e depois "const [hours, minutes] = parts.map(Number)" converte ambos para números usando "map(Number)". A função também inclui validações para garantir que os horários estejam no formato correto e dentro dos limites permitidos.
    const expectedDailyMinutes = timeToMinutes(document.getElementById('daily_hours').value);
    const start = timeToMinutes(document.getElementById('start_time').value);
    const breakStart = timeToMinutes(document.getElementById('break_start').value);
    const breakEnd = timeToMinutes(document.getElementById('break_end').value);
    const end = timeToMinutes(document.getElementById('end_time').value);

    // Validação dos horários, ou seja, verifica se algum dos horários é inválido (null) e exibe um alerta para o usuário caso isso ocorra. Essa validação é importante para garantir que os cálculos posteriores sejam feitos apenas com horários válidos.
    if(!expectedDailyMinutes || !start || !breakStart || !breakEnd || !end) {
        alert("Horários inválidos");
        return;
    }

    // Normalização dos horários para considerar a virada de dia. A função normalizeTimes é responsável por ajustar os horários para garantir que eles sejam comparáveis, mesmo que alguns deles possam ocorrer após a meia-noite. Isso é feito adicionando 24 horas (em minutos) aos horários que ocorrem após a meia-noite, permitindo que a sequência lógica dos horários seja mantida.
    const normalized = normalizeTimes([start, breakStart, breakEnd, end]);
    // Ex: 22:00 → 1320
    //     02:00 → 120
    // Solução: 02:00 + 24:00 → 120 + 1440 = 1560, mantendo a sequência lógica dos horários
    const [normStart, normBreakS, normBreakE, normEnd] = normalized;// Desestruturação dos horários normalizados (Divide o array em variáveis separadas)

    // Cálculo do total de horas trabalhadas, considerando o tempo de trabalho pela manhã (normBreakS - normStart) e o tempo de trabalho à tarde (normEnd - normBreakE). O total é a soma desses dois períodos de trabalho.
    const morningWork = normBreakS - normStart;
    const afternoonWork = normEnd - normBreakE;
    const total = morningWork + afternoonWork;

    // Cálculo do saldo de horas em minutos, subtraindo o total de horas trabalhadas do total de horas esperadas (dailyHours convertido para minutos). O saldo de horas indica se o trabalhador cumpriu a jornada esperada, trabalhou a mais (saldo positivo) ou a menos (saldo negativo).
    const dailyBalanceMinutes = total - expectedDailyMinutes;

    
    renderResults( //Chama a função renderResults para exibir os resultados na interface do usuário, passando um objeto com os dados calculados (total, expectedDailyMinutes, dailyBalanceMinutes), os elementos do DOM onde os resultados serão exibidos e a função auxiliar minutesToHours para formatar os resultados de forma legível para o usuário.
        {
            total,
            expectedDailyMinutes,
            dailyBalanceMinutes
        },
        elements,
        { minutesToHours }
    );
}