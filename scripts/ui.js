//ui.js

export function renderResults({//função para renderizar os resultados na interface do usuário, recebendo um objeto com os dados calculados (total, expectedDailyMinutes, dailyBalanceMinutes) e os elementos do DOM e funções auxiliares necessários para exibir as informações de forma clara e formatada
    total,
    expectedDailyMinutes, 
    dailyBalanceMinutes
}, elements, helpers){

    const { totalWorkedEl, expectedWorkEl, balanceEl, overtimeEl } = elements; //Desestruturação dos elementos do DOM para facilitar o acesso e manipulação dos elementos HTML onde os resultados serão exibidos
    const { minutesToHours } = helpers; //Desestruturação da função auxiliar para converter minutos em horas e minutos, facilitando a formatação dos resultados para exibição ao usuário

    totalWorkedEl.textContent = `Total trabalhado: ${minutesToHours(total)}`; //Exibe o total de horas trabalhadas no elemento totalWorkedEl, formatando o valor usando a função minutesToHours
    expectedWorkEl.textContent = `Jornada esperada: ${minutesToHours(expectedDailyMinutes)}`; //Exibe a jornada esperada no elemento expectedWorkEl, formatando o valor usando a função minutesToHours

    // Saldo de horas
    if (dailyBalanceMinutes > 0) {
        balanceEl.textContent = `Saldo positivo: +${minutesToHours(dailyBalanceMinutes)}`;
        overtimeEl.textContent = `Horas extras: ${minutesToHours(dailyBalanceMinutes)}`;
    } else if (dailyBalanceMinutes < 0) {
        balanceEl.textContent = `Saldo negativo: -${minutesToHours(Math.abs(dailyBalanceMinutes))}`;
        overtimeEl.textContent = "Horas extras: 0 horas";
    } else {
        balanceEl.textContent = "Saldo neutro: jornada cumprida";
        overtimeEl.textContent = "Horas extras: 0 horas";
    }
}


