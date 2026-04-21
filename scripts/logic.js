//logic.js

//Função para converter horário em formato HH:MM para minutos
export function timeToMinutes(time) {
    if(!time) return null; //Verifica se o valor existe

    const [hours, minutes] = time.split(':').map(Number); //Converte as partes do horário para números usando map(Number) e desestruturação para atribuir os valores a hours e minutes

    return hours * 60 + minutes; //Converte o horário para minutos 
}

//Função para converter minutos de volta para o formato de horas e minutos 
export function minutesToHours(total){
    const hours = Math.floor(total / 60); //Calcula as horas inteiras
    const minutes = total % 60; //Calcula os minutos restantes
    return `${hours} horas e ${minutes} minutos`; //Retorna o total em formato de horas e minutos
}

//Função para normalizar os horários considerando a virada de dia
export function normalizeTimes(times) {
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