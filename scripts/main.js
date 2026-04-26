//main.js

// Importação das funções de lógica e UI para serem usadas no script principal
import { time_to_minutes, minutes_to_hours, normalize_times } from './logic.js';
import { render_results } from './ui.js';

// Seleção do formulário e dos elementos do DOM onde os resultados serão exibidos
const form = document.getElementById('time_form');

// Elementos do DOM para exibir os resultados
const ui_elements = {
    total_worked_display: document.getElementById('total_worked'),
    expected_work_display: document.getElementById('expected_work'),
    balance_display: document.getElementById('balance'),
    overtime_display: document.getElementById('overtime')
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

    //=====================================================================
    // ENTRADAS (conversão dos horários para minutos)
    //=====================================================================
    const expected_daily_work_minutes = time_to_minutes(document.getElementById('expected_daily_hours').value);
    const work_start_minutes = time_to_minutes(document.getElementById('work_start_time').value);
    const break_start_minutes = time_to_minutes(document.getElementById('break_start_time').value);
    const break_end_minutes = time_to_minutes(document.getElementById('break_end_time').value);
    const work_end_minutes = time_to_minutes(document.getElementById('work_end_time').value);

    //=====================================================================
    // ! VALIDAÇÃO DOS HORÁRIOS
    //=====================================================================
    if(
        expected_daily_work_minutes === null ||
        work_start_minutes === null ||
        break_start_minutes === null ||
        break_end_minutes === null ||
        work_end_minutes === null
    ){
        alert("Horários inválidos");
        return;
    }

    //=====================================================================
    // NORMALIZAÇÃO DOS HORÁRIOS
    //=====================================================================
    // Normalização dos horários para considerar a virada de dia. A função normalizeTimes é responsável por ajustar os horários para garantir que eles sejam comparáveis, mesmo que alguns deles possam ocorrer após a meia-noite. Isso é feito adicionando 24 horas (em minutos) aos horários que ocorrem após a meia-noite, permitindo que a sequência lógica dos horários seja mantida.
    const normalized = normalize_times([work_start_minutes, break_start_minutes, break_end_minutes, work_end_minutes]);
    // Ex: 22:00 → 1320
    //     02:00 → 120
    // Solução: 02:00 + 24:00 → 120 + 1440 = 1560, mantendo a sequência lógica dos horários
    const [
        normalized_work_start, 
        normalized_break_start, 
        normalized_break_end, 
        normalized_work_end
    ] = normalized;// Desestruturação dos horários normalizados (Divide o array em variáveis separadas)

    //=====================================================================
    // CÁLCULO DO TOTAL DE HORAS TRABALHADAS
    //=====================================================================
    const first_work_period_minutes = normalized_break_start - normalized_work_start;
    const second_work_period_minutes = normalized_work_end - normalized_break_end;
    const total_worked_minutes = first_work_period_minutes + second_work_period_minutes;

    // Cálculo do saldo de horas em minutos, subtraindo o total de horas trabalhadas do total de horas esperadas (dailyHours convertido para minutos). O saldo de horas indica se o trabalhador cumpriu a jornada esperada, trabalhou a mais (saldo positivo) ou a menos (saldo negativo).
    const daily_work_balance_minutes = total_worked_minutes - expected_daily_work_minutes;

    //=====================================================================
    // RENDERIZAÇÃO DOS RESULTADOS
    //=====================================================================
    render_results( //Chama a função renderResults para exibir os resultados na interface do usuário, passando um objeto com os dados calculados (total, expectedDailyMinutes, dailyBalanceMinutes), os elementos do DOM onde os resultados serão exibidos e a função auxiliar minutesToHours para formatar os resultados de forma legível para o usuário.
        {
            total_worked_minutes,
            expected_daily_work_minutes,
            daily_work_balance_minutes
        },
        ui_elements,
        { minutes_to_hours }
    );
}