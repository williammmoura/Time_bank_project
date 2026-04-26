//logic.js

//Função para converter horário em formato HH:MM para minutos
export function time_to_minutes(time_string) {
    if(!time_string) return null; //Verifica se o valor existe

    const [hours, minutes] = time_string.split(':').map(Number); //Converte as partes do horário para números usando map(Number) e desestruturação para atribuir os valores a hours e minutes

    return hours * 60 + minutes; //Converte o horário para minutos 
}

//Função para converter minutos de volta para o formato de horas e minutos 
export function minutes_to_hours(total_minutes){
    const hours = Math.floor(total_minutes / 60); //Calcula as horas inteiras
    const minutes = total_minutes % 60; //Calcula os minutos restantes
    return `${hours} horas e ${minutes} minutos`; //Retorna o total em formato de horas e minutos
}

//Função para normalizar os horários considerando a virada de dia
export function normalize_times(times_list) {
    const normalized_list = [times_list[0]]; //O primeiro horário é mantido como referência para a normalização

    for(let i = 1; i < times_list.length; i++) { //Itera sobre os horários a partir do segundo elemento (índice 1) para comparar cada horário com o anterior e normalizá-los se necessário
        let current_time = times_list[i]; //O horário atual sendo processado
        const previous_time = normalized_list[i - 1]; //O horário anterior na lista normalizada

        //Se o tempo "voltou", soma 24h (1440 minutos)
        if(current_time < previous_time) { //Verifica se o horário atual é menor que o horário anterior, indicando que ocorreu uma virada de dia
            current_time += 1440; //Adiciona 24 horas (em minutos) ao horário atual para normalizá-lo em relação ao horário anterior
        }
        normalized_list.push(current_time); //Adiciona o horário normalizado à lista de horários normalizados
    }
    return normalized_list; //Retorna a lista de horários normalizados
}