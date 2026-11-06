//ui.js

//=====================================================================
// RENDERIZAÇÃO DOS RESULTADOS
//=====================================================================
export function render_results(//função para renderizar os resultados na   interface do usuário, recebendo um objeto com os dados calculados (total, expectedDailyMinutes, dailyBalanceMinutes) e os elementos do DOM e funções auxiliares necessários para exibir as informações de forma clara e formatada
    {
        total_worked_minutes,
        expected_daily_work_minutes,
        daily_work_balance_minutes
    }, 
    ui_elements, 
    helpers
    ){
    const { 
        card_total_worked,
        card_expected_work, 
        card_balance,
        card_overtime
        } = ui_elements; //Desestruturação dos elementos do DOM para facilitar o acesso e manipulação dos elementos HTML onde os resultados serão exibidos
    
    const { minutes_to_hours } = helpers; //Desestruturação da função auxiliar para converter minutos em horas e minutos, facilitando a formatação dos resultados para exibição ao usuário

    //=====================================================================
    // RENDERIZAÇÃO DOS RESULTADOS
    //===================================================================

    // CARDS
    card_total_worked.querySelector('.card_content').textContent =
    `Total: ${minutes_to_hours(total_worked_minutes)}`; //Atualiza o conteúdo do card de total de horas trabalhadas, utilizando a função auxiliar minutesToHours para formatar os minutos em um formato legível (horas e minutos) para o usuário

    card_expected_work.querySelector('.card_content').textContent =
    `Esperado: ${minutes_to_hours(expected_daily_work_minutes)}`; //Atualiza o conteúdo do card de horas esperadas, utilizando a função auxiliar minutesToHours para formatar os minutos em um formato legível (horas e minutos) para o usuário

    // SALDO DE HORAS + HORAS EXTRAS
    if (daily_work_balance_minutes > 0) {

        card_balance.querySelector('.card_content').textContent = 
        `Saldo positivo: +${minutes_to_hours(daily_work_balance_minutes)}`;
        card_balance.className = 'card positive'; //Adiciona uma classe CSS para estilizar o saldo positivo, indicando visualmente que o usuário tem um saldo favorável

        card_overtime.querySelector('.card_content').textContent =
        `Horas extras: ${minutes_to_hours(daily_work_balance_minutes)}`;


    } else if (daily_work_balance_minutes < 0) {
        card_balance.querySelector('.card_content').textContent = 
        `Saldo negativo: -${minutes_to_hours(Math.abs(daily_work_balance_minutes))}`;
        card_balance.className = 'card negative'; //Adiciona uma classe CSS para estilizar o saldo negativo, indicando visualmente que o usuário tem um saldo desfavorável

        card_overtime.querySelector('.card_content').textContent = "Horas extras: 0 horas"; //Atualiza o conteúdo do card de horas extras para indicar que não há horas extras, já que o saldo é negativo

    } else {
        card_balance.querySelector('.card_content').textContent = "Saldo neutro: jornada cumprida";
        card_balance.className = 'card neutral'; //Adiciona uma classe CSS para estilizar o saldo neutro, indicando visualmente que o usuário cumpriu exatamente a jornada esperada

        card_overtime.querySelector('.card_content').textContent = "Horas extras: 0 horas"; //Atualiza o conteúdo do card de horas extras para indicar que não há horas extras, já que o saldo é neutro
    }

    //PROGRESS BAR
    render_progress_bar(total_worked_minutes, expected_daily_work_minutes)
}

//=====================================================================
// RENDERIZAÇÃO DA PROGRESS BAR
//=====================================================================
function render_progress_bar(worked, expected) { //Função para renderizar a barra de progresso, recebendo os minutos trabalhados e os minutos esperados para calcular a porcentagem de progresso e atualizar a barra visualmente
    const progress_bar = document.getElementById('progress_bar'); //Obtém o elemento da barra de progresso onde a largura e a cor serão atualizadas para refletir o progresso do usuário em relação à jornada esperada

    const percentage = (worked / expected) * 100; //Calcula a porcentagem de progresso dividindo os minutos trabalhados pelos minutos esperados e multiplicando por 100 para obter um valor percentual, permitindo que a barra de progresso seja dimensionada proporcionalmente ao progresso do usuário em relação à jornada esperada

    progress_bar.style.width = `${Math.min(percentage, 100)}%`; //Define a largura da barra de progresso usando a porcentagem calculada, limitando a largura máxima a 100% para evitar que a barra ultrapasse o limite visual mesmo quando o usuário exceder a jornada esperada

    if (percentage > 100) { //Se a porcentagem de progresso for maior que 100%, indicando que o usuário excedeu a jornada esperada, a cor da barra de progresso é alterada para laranja para destacar visualmente que o usuário está em horas extras, enquanto se a porcentagem for menor ou igual a 100%, a cor da barra permanece azul, indicando que o usuário ainda está dentro da jornada esperada. Se a percentagem for menor que 100%, a cor da barra é vermelha, indicando que o usuário ainda não cumpriu a jornada esperada.
        progress_bar.style.backgroundColor = '#ff9800'; // extra
    } else if (percentage === 100) {
        progress_bar.style.backgroundColor = '#2196f3'; // normal
    } else {
        progress_bar.style.backgroundColor = '#fd0808'; // negativa
    }
}

//=====================================================================
// RENDERIZAÇÃO DA LINHA DO TEMPO
//=====================================================================
export function render_timeline({ //Função para renderizar a linha do tempo visual, recebendo um objeto com os horários normalizados e o elemento do DOM onde a linha do tempo será exibida
    normalized_work_start,
    normalized_break_start,
    normalized_break_end,
    normalized_work_end
}){
    const timeline_bar = document.getElementById('timeline_bar'); //Obtém o elemento da barra de linha do tempo onde os horários serão representados visualmente
    
    //Limpa antes de desenhar a linha novamente
    timeline_bar.innerHTML = '';

    const total_duration = normalized_work_end - normalized_work_start; //Calcula a duração total do período de trabalho, considerando a virada de dia, subtraindo o horário de início do trabalho do horário de término do trabalho

    function minutes_to_label(minutes) { //Função auxiliar para converter minutos em um formato de horário legível (HH:MM), facilitando a exibição dos horários na linha do tempo de forma compreensível para o usuário
        const h = Math.floor(minutes / 60) % 24;
        const m = minutes % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }

    function create_segment(duration, class_name, start, end) { //Função auxiliar para criar um segmento da linha do tempo, recebendo a duração do segmento e a classe CSS para estilização
        const segment = document.createElement('div'); //Cria um elemento div para representar o segmento da linha do tempo
        segment.classList.add('timeline_segment', class_name); //Adiciona as classes CSS para estilizar o segmento de acordo com o tipo (trabalho, intervalo, etc.)
        
        const percentage = (duration / total_duration) * 100; //Calcula a largura do segmento como uma porcentagem da duração total, permitindo que a linha do tempo seja dimensionada proporcionalmente
        segment.style.width = `${percentage}%`; //Define a largura do segmento usando a porcentagem calculada

        //Adiciona um rótulo ao segmento para indicar o horário correspondente, utilizando a função auxiliar minutesToLabel para formatar os minutos em um formato de horário legível (HH:MM) para o usuário
        segment.textContent = 
        `${minutes_to_label(start)} - ${minutes_to_label(end)}`;
        segment.style.fontSize = '0.7rem';
        segment.style.color = '#fff';
        segment.style.display = 'flex';
        segment.style.alignItems = 'center';
        segment.style.justifyContent = 'center';

        return segment;
    }

    //SEGMENTOS da linha do tempo
    const work_start_segment = create_segment( // Segmento do período de trabalho antes do intervalo, calculado pela diferença entre o horário de início do trabalho e o horário de início do intervalo, utilizando a função auxiliar createSegment para criar o elemento visual correspondente na linha do tempo
        normalized_break_start - normalized_work_start,
        'work_segment',
        normalized_work_start,
        normalized_break_start
    );
    
    const break_segment = create_segment(
        normalized_break_end - normalized_break_start,
        'break_segment',
        normalized_break_start,
        normalized_break_end
    );

    const work_end_segment = create_segment(
        normalized_work_end - normalized_break_end,
         'work_segment',
         normalized_break_end,
         normalized_work_end
    );

    //Adiciona os segmentos à barra da linha do tempo
    timeline_bar.appendChild(work_start_segment);
    timeline_bar.appendChild(break_segment);
    timeline_bar.appendChild(work_end_segment);
}

// ======================================================
// CONFIGURAÇÃO DO TEMA (CLARO / ESCURO)
// ======================================================

export function setup_theme_toggle() { //Função para configurar o botão de alternância de tema, permitindo que o usuário alterne entre o tema claro e escuro, armazenando a preferência no localStorage para persistência entre sessões.

    const theme_toggle = document.getElementById('theme_toggle'); //Obtém o elemento do botão de alternância de tema no DOM.

    //Verifica se o botão existe antes de adicionar o event listener, garantindo que o código não quebre caso o elemento não esteja presente na página.
    if (!theme_toggle){
        return;
    }

    //Recupera a preferência de tema do localStorage, permitindo que o tema escolhido pelo usuário seja mantido entre sessões.
    const saved_theme = localStorage.getItem('selected_theme');

    //Verifica se o usuário escolheu o tema escuro
    const dark_mode_enebled = saved_theme === 'dark_mode';

    //Aplica o tema salvo ao body
    document.body.classList.toggle('dark_mode', dark_mode_enebled);

    //Atualiza o texto do botão
    update_theme_button(theme_toggle);

    // Aguarda o clique do usuário
    theme_toggle.addEventListener('click', function() {

        // Alterna a classe dark_mode no body
        document.body.classList.toggle('dark_mode');

        // Verifica se o modo escuro está ativo
        const dark_mode_enabled =
            document.body.classList.contains('dark_mode');

        // Salva a preferência no navegador
        if (dark_mode_enabled) {
            localStorage.setItem('selected_theme', 'dark_mode');
        } else {
            localStorage.setItem('selected_theme', 'light_mode');
        }

        // Atualiza o texto do botão
        update_theme_button(theme_toggle);

    });
}

// =============================================
// ATUALIZAÇÃO DO TEXTO DO BOTÃO
// =============================================

function update_theme_button(theme_toggle) {

    const dark_mode_enabled =
        document.body.classList.contains('dark_mode');

    if (dark_mode_enabled) {
        theme_toggle.textContent = 'Ativar modo claro';
    } else {
        theme_toggle.textContent = 'Ativar modo escuro';
    }
}
