// ==============================
// 1. EVENTOS (liga HTML com lógica)
// ==============================
const form = document.getElementById('time_form');//Procura no HTML um elemento com id time_form e o armazena na variável form
form.addEventListener("submit", handleSubmit);//Quando o usuário enviar o formulário, execute a função handleSubmit

// ==============================
// 2. FUNÇÃO PRINCIPAL (regra de negócio)
// ==============================

//A função handleSubmit é responsável por processar os dados do formulário, validar os horários e calcular o total de horas trabalhadas. Ela é executada quando o usuário envia o formulário, e inclui várias etapas de validação para garantir que os horários inseridos sejam válidos e estejam em uma sequência lógica. Se os dados forem válidos, a função calcula o total de horas trabalhadas e pode exibir o resultado para o usuário.
function handleSubmit(event) {
    //Prevenção do comportamento padrão do formulário
    event.preventDefault();//Impede que a página seja recarregada ao enviar o formulário

    //Captura dos valores dos campos de inputs (tudo isso é string))
    const startTime = document.getElementById('start_time').value;
    const breakStart = document.getElementById('break_start').value;
    const breakEnd = document.getElementById('break_end').value;
    const endTime = document.getElementById('end_time').value;

    //Conversão dos horários para minutos. Dentro da função timeToMinutes há "const parts = time.split(':');" que divide o horário em horas e minutos, e depois "const [hours, minutes] = parts.map(Number)" converte ambos para números usando "map(Number)". A função também inclui validações para garantir que os horários estejam no formato correto e dentro dos limites permitidos.
    const start = timeToMinutes(startTime);
    const breakS = timeToMinutes(breakStart);
    const breakE = timeToMinutes(breakEnd);
    const end = timeToMinutes(endTime);

    //Validação dos horários, ou seja, verifica se algum dos horários é inválido (null) e exibe um alerta para o usuário caso isso ocorra. Essa validação é importante para garantir que os cálculos posteriores sejam feitos apenas com horários válidos.
    if(start === null || breakS === null || breakE === null || end === null) {
        alert("Por favor, insira horários válidos.");
        return;
    }

    //Normalização dos horários para considerar a virada de dia. A função normalizeTimes é responsável por ajustar os horários para garantir que eles sejam comparáveis, mesmo que alguns deles possam ocorrer após a meia-noite. Isso é feito adicionando 24 horas (em minutos) aos horários que ocorrem após a meia-noite, permitindo que a sequência lógica dos horários seja mantida.
    const normalized = normalizeTimes([start, breakS, breakE, end]);
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

    //Validação de duração,ou seja, verifica se os períodos de trabalho da manhã e da tarde estão dentro do limite permitido de 6 horas consecutivas (360 minutos). Se algum dos períodos exceder esse limite, um alerta é exibido para o usuário, indicando que a duração de trabalho é inválida.
    if(!isValidDuration(morningWork) || !isValidDuration(afternoonWork)) {
        alert("Duração de trabalho inválida. O período de trabalho não pode exceder 6 horas consecutivas.");
        return;
    }

    const total = morningWork + afternoonWork; //Total de horas trabalhadas

    const result = minutesToHours(total); //Converte o total de minutos para o formato de horas e minutos usando a função minutesToHours
    console.log(`Total de horas trabalhadas: ${result}`);
}

// ==============================
// 3. FUNÇÕES AUXILIARES
// ==============================

//Função para converter horário em formato HH:MM para minutos
function timeToMinutes(time) {
    if(!time) return null; //Verifica se o valor existe

    const timeParts = time.split(':');
    if(timeParts.length !== 2) return null; //Valida se o formato é correto

    const [hours, minutes] = timeParts.map(Number); //Converte as partes do horário para números usando map(Number) e desestruturação para atribuir os valores a hours e minutes

    if(isNaN(hours) || isNaN(minutes)) return null; //Valida se os valores são números
    if(hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null; //Valida se os valores estão dentro do intervalo permitido 

    return hours * 60 + minutes; //Converte o horário para minutos 
}

//Validação de período consecutivo de trabalho (nesta regra será permitido o período máximo de 6 horas consecutivas)
function isValidDuration(duration) {
    return duration >= 0 && duration <= 360; //Limite de 360 minutos (6 horas) para um período de trabalho consecutivo
}

//Função para converter minutos de volta para o formato de horas e minutos 
function minutesToHours(total){
    const hours = Math.floor(total / 60); //Calcula as horas inteiras
    const minutes = total % 60; //Calcula os minutos restantes
    return `${hours} horas e ${minutes} minutos`; //Retorna o total em formato de horas e minutos
}