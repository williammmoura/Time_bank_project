/*
// ==============================
// 1. EVENTOS (liga HTML com lógica)
// ==============================
const form = document.getElementById('time_form');//Procura no HTML um elemento com id time_form e o armazena na variável form
const totalWorkedEl = document.getElementById('total_worked'); //Procura no HTML um elemento com id total_worked e o armazena na variável totalWorkedEl
const expectedWorkEl = document.getElementById('expected_work');
const balanceEl = document.getElementById('balance');
const overtimeEl = document.getElementById('overtime');
form.addEventListener("submit", handleSubmit);//Quando o usuário enviar o formulário, execute a função handleSubmit

// ==============================
// 2. FUNÇÃO PRINCIPAL (regra de negócio)
// ==============================

//A função handleSubmit é responsável por processar os dados do formulário, validar os horários e calcular o total de horas trabalhadas. Ela é executada quando o usuário envia o formulário, e inclui várias etapas de validação para garantir que os horários inseridos sejam válidos e estejam em uma sequência lógica. Se os dados forem válidos, a função calcula o total de horas trabalhadas e pode exibir o resultado para o usuário.
function handleSubmit(event) {
    //Prevenção do comportamento padrão do formulário
    event.preventDefault();//Impede que a página seja recarregada ao enviar o formulário

    //Executa manualmente a validação do HTML5 para garantir que os campos de horário sejam preenchidos corretamente. A função checkVisibility é uma função personalizada que verifica se os campos de horário estão visíveis e preenchidos corretamente. Se algum dos campos não estiver visível ou não for preenchido corretamente, um alerta é exibido para o usuário, solicitando que insira horários válidos.
    if(!form.checkValidity()) {
        form.reportValidity(); //Exibe mensagens de validação para os campos que não estão visíveis ou preenchidos corretamente
        return;
    }

    //Captura dos valores dos campos de inputs (tudo isso é string))
    const dailyHoursInput = document.getElementById('daily_hours').value;

    const startTime = document.getElementById('start_time').value;
    const breakStart = document.getElementById('break_start').value;
    const breakEnd = document.getElementById('break_end').value;
    const endTime = document.getElementById('end_time').value;

    //Conversão dos horários para minutos. Dentro da função timeToMinutes há "const parts = time.split(':');" que divide o horário em horas e minutos, e depois "const [hours, minutes] = parts.map(Number)" converte ambos para números usando "map(Number)". A função também inclui validações para garantir que os horários estejam no formato correto e dentro dos limites permitidos.
    const expectedDailyMinutes = timeToMinutes(dailyHoursInput);

    const start = timeToMinutes(startTime);
    const breakStartMinutes = timeToMinutes(breakStart);
    const breakEndMinutes = timeToMinutes(breakEnd);
    const end = timeToMinutes(endTime);

    //Validação dos horários, ou seja, verifica se algum dos horários é inválido (null) e exibe um alerta para o usuário caso isso ocorra. Essa validação é importante para garantir que os cálculos posteriores sejam feitos apenas com horários válidos.
    if(
        expectedDailyMinutes === null ||
        start === null || 
        breakStartMinutes === null || 
        breakEndMinutes === null || 
        end === null
    ) {
        alert("Por favor, insira horários válidos.");
        return;
    }

    //Normalização dos horários para considerar a virada de dia. A função normalizeTimes é responsável por ajustar os horários para garantir que eles sejam comparáveis, mesmo que alguns deles possam ocorrer após a meia-noite. Isso é feito adicionando 24 horas (em minutos) aos horários que ocorrem após a meia-noite, permitindo que a sequência lógica dos horários seja mantida.
    const normalized = normalizeTimes([start, breakStartMinutes, breakEndMinutes, end]);
    //Ex: 22:00 → 1320
    //    02:00 → 120
    //Solução: 02:00 + 24:00 → 120 + 1440 = 1560, mantendo a sequência lógica dos horários
    const [normStart, normBreakS, normBreakE, normEnd] = normalized; //Desestruturação dos horários normalizados (Divide o array em variáveis separadas)
    //Ex: [480, 720, 780, 990] vira normStart = 480, normBreakS = 720, normBreakE = 780, normEnd = 990

    //Validação da sequência lógica dos horários
    if(!(normStart <= normBreakS && normBreakS <= normBreakE && normBreakE <= normEnd)) {
        alert("A sequência dos horários é inválida. Certifique-se de que os horários estão em ordem lógica.");
        return;
    }

    //Cálculo dos períodos de trabalho
    const morningWork = normBreakS - normStart; //Cálculo do período da manhã
    const afternoonWork = normEnd - normBreakE; //Cálculo do período da tarde

    const total = morningWork + afternoonWork; //Total de horas trabalhadas

    const breakDuration = normBreakE - normBreakS; //Duração do intervalo em minutos, calculada subtraindo o horário de início do intervalo (normBreakS) do horário de término do intervalo (normBreakE)

    //SALDO DE HORAS
    const dailyBalanceMinutes = total - expectedDailyMinutes; //Calcula o saldo de horas em minutos, subtraindo o total de horas trabalhadas do total de horas esperadas (dailyHours convertido para minutos)
    const MAX_OVERTIME_MINUTES = 120; //Definição de um limite máximo de horas extras em minutos (2 horas extras)

    //Mostra os resultados para o usuário
    // TOTAL TRABALHADO
    totalWorkedEl.textContent = `Total trabalhado: ${minutesToHours(total)}`;
    // JORNADA ESPERADA
    expectedWorkEl.textContent = `Jornada esperada: ${minutesToHours(expectedDailyMinutes)}`;

    //Alerta: mais de 6 horas consecutivas de trabalho
    if(morningWork > 360 || afternoonWork > 360) {
        alert("ATEÇÃO! Período superior a 6 horas consecutivas de trabalho.")
    }

    //Alerta: intervalo inferior a 60 minutos
    if(breakDuration < 60) {
        alert("ATENÇÃO! O intervalo é inferior a 1 hora.");
    }

    //Alerta: mais de 2 horas extras no dia
    if(dailyBalanceMinutes > MAX_OVERTIME_MINUTES) {
        alert("ATENÇÃO! Você tem mais de 2 horas extras no dia.");
    }

    //console.log(`Esperado: ${minutesToHours(expectedDailyMinutes)}`);

    //Saldo de horas
    if (dailyBalanceMinutes > 0) {
        balanceEl.textContent = `Saldo positivo: +${minutesToHours(dailyBalanceMinutes)}`;
    } else if (dailyBalanceMinutes < 0) {
        balanceEl.textContent = `Saldo negativo: -${minutesToHours(Math.abs(dailyBalanceMinutes))}`;
    } else {
        balanceEl.textContent = "Saldo neutro: jornada cumprida";
    }

    //Horas extras
    if (dailyBalanceMinutes > 0) {
        overtimeEl.textContent = `Horas extras: ${minutesToHours(dailyBalanceMinutes)}`;
    } else {
        overtimeEl.textContent = "Horas extras: 0 horas";
    }

    const result = minutesToHours(total); //Converte o total de minutos para o formato de horas e minutos usando a função minutesToHours
    //console.log(`Total de horas trabalhadas: ${result}`);
}

// ==============================
// 3. FUNÇÕES AUXILIARES
// ==============================

//Função para converter horário em formato HH:MM para minutos
function timeToMinutes(time) {
    if(!time) return null; //Verifica se o valor existe

    const [hours, minutes] = time.split(':').map(Number); //Converte as partes do horário para números usando map(Number) e desestruturação para atribuir os valores a hours e minutes

    return hours * 60 + minutes; //Converte o horário para minutos 
}

//Função para converter minutos de volta para o formato de horas e minutos 
function minutesToHours(total){
    const hours = Math.floor(total / 60); //Calcula as horas inteiras
    const minutes = total % 60; //Calcula os minutos restantes
    return `${hours} horas e ${minutes} minutos`; //Retorna o total em formato de horas e minutos
}

//Função para normalizar os horários considerando a virada de dia
function normalizeTimes(times) {
    const normalized = [times[0]]; //O primeiro horário é mantido como referência para a normalização

    for(let i = 1; i < times.length; i++) { //Itera sobre os horários a partir do segundo elemento (índice 1) para comparar cada horário com o anterior e normalizá-los se necessário
        let current = times[i]; //O horário atual sendo processado
        const previous = normalized[i - 1]; //O horário anterior na lista normalizada

        //Se o tempo "voltou", soma 24h (1440 minutos)
        if(current < previous) {
            current += 1440; //Adiciona 24 horas (em minutos) ao horário atual para normalizá-lo em relação ao horário anterior
        }
        normalized.push(current); //Adiciona o horário normalizado à lista de horários normalizados
    }
    return normalized; //Retorna a lista de horários normalizados
}
