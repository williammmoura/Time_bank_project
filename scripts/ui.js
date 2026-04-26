//ui.js

export function render_results({//função para renderizar os resultados na interface do usuário, recebendo um objeto com os dados calculados (total, expectedDailyMinutes, dailyBalanceMinutes) e os elementos do DOM e funções auxiliares necessários para exibir as informações de forma clara e formatada
    total_worked_minutes,
    expected_daily_work_minutes,
    daily_work_balance_minutes
}, 
ui_elements, 
helpers
){
    const { total_worked_display,
        expected_work_display, 
        balance_display,
        overtime_display
        } = ui_elements; //Desestruturação dos elementos do DOM para facilitar o acesso e manipulação dos elementos HTML onde os resultados serão exibidos
    
    const { minutes_to_hours } = helpers; //Desestruturação da função auxiliar para converter minutos em horas e minutos, facilitando a formatação dos resultados para exibição ao usuário

    //=====================================================================
    // RENDERIZAÇÃO DOS RESULTADOS
    //=====================================================================
    total_worked_display.textContent = `Total trabalhado: ${minutes_to_hours(total_worked_minutes)}`; //Exibe o total de horas trabalhadas no elemento total_worked_display, formatando o valor usando a função minutes_to_hours
    expected_work_display.textContent = `Jornada esperada: ${minutes_to_hours(expected_daily_work_minutes)}`; //Exibe a jornada esperada no elemento expected_work_display, formatando o valor usando a função minutes_to_hours

    // Saldo de horas + Horas extras
    if (daily_work_balance_minutes > 0) {
        balance_display.textContent = `Saldo positivo: +${minutes_to_hours(daily_work_balance_minutes)}`;
        overtime_display.textContent = `Horas extras: ${minutes_to_hours(daily_work_balance_minutes)}`;
    } else if (daily_work_balance_minutes < 0) {
        balance_display.textContent = `Saldo negativo: -${minutes_to_hours(Math.abs(daily_work_balance_minutes))}`;
        overtime_display.textContent = "Horas extras: 0 horas";
    } else {
        balance_display.textContent = "Saldo neutro: jornada cumprida";
        overtime_display.textContent = "Horas extras: 0 horas";
    }
}


