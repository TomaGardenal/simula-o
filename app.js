// Estado Global da Aplicação (Simulando o Banco de Dados)
let machinesList = [
    { id: 1, name: "Torno CNC - 01", status: "Normal", vibration_limit: 8.5, preventive_cost: 1000, corrective_cost: 5000 },
    { id: 2, name: "Torno CNC - 02", status: "Normal", vibration_limit: 8.6, preventive_cost: 1000, corrective_cost: 5100 },
    { id: 3, name: "Torno CNC - 03", status: "Normal", vibration_limit: 8.4, preventive_cost: 1050, corrective_cost: 4900 },
    { id: 4, name: "Torno CNC - 04", status: "Normal", vibration_limit: 8.7, preventive_cost: 1100, corrective_cost: 5200 },
    { id: 5, name: "Torno CNC - 05", status: "Normal", vibration_limit: 8.3, preventive_cost: 950, corrective_cost: 4800 },
    { id: 6, name: "Torno CNC - 06", status: "Normal", vibration_limit: 8.5, preventive_cost: 1000, corrective_cost: 5000 },
    { id: 7, name: "Torno CNC - 07", status: "Normal", vibration_limit: 8.8, preventive_cost: 1050, corrective_cost: 5300 },
    { id: 8, name: "Torno CNC - 08", status: "Normal", vibration_limit: 8.2, preventive_cost: 1000, corrective_cost: 4700 },

    { id: 9, name: "Fresa - 01", status: "Normal", vibration_limit: 7.0, preventive_cost: 800, corrective_cost: 4000 },
    { id: 10, name: "Fresa - 02", status: "Normal", vibration_limit: 7.1, preventive_cost: 820, corrective_cost: 4100 },
    { id: 11, name: "Fresa - 03", status: "Normal", vibration_limit: 6.9, preventive_cost: 780, corrective_cost: 3900 },
    { id: 12, name: "Fresa - 04", status: "Normal", vibration_limit: 7.2, preventive_cost: 850, corrective_cost: 4200 },
    { id: 13, name: "Fresa - 05", status: "Normal", vibration_limit: 7.0, preventive_cost: 800, corrective_cost: 4000 },
    { id: 14, name: "Fresa - 06", status: "Normal", vibration_limit: 6.8, preventive_cost: 750, corrective_cost: 3800 },
    { id: 15, name: "Fresa - 07", status: "Normal", vibration_limit: 7.3, preventive_cost: 870, corrective_cost: 4300 },
    { id: 16, name: "Fresa - 08", status: "Normal", vibration_limit: 6.7, preventive_cost: 720, corrective_cost: 3700 },

    { id: 17, name: "Esteira Transportadora - A", status: "Normal", vibration_limit: 10.0, preventive_cost: 500, corrective_cost: 2500 },
    { id: 18, name: "Esteira Transportadora - B", status: "Normal", vibration_limit: 10.5, preventive_cost: 550, corrective_cost: 2700 },
    { id: 19, name: "Esteira Transportadora - C", status: "Normal", vibration_limit: 9.5, preventive_cost: 450, corrective_cost: 2300 },
    { id: 20, name: "Esteira Transportadora - D", status: "Normal", vibration_limit: 10.2, preventive_cost: 520, corrective_cost: 2600 },
    { id: 21, name: "Esteira Transportadora - E", status: "Normal", vibration_limit: 9.8, preventive_cost: 480, corrective_cost: 2400 },
    { id: 22, name: "Esteira Transportadora - F", status: "Normal", vibration_limit: 10.1, preventive_cost: 510, corrective_cost: 2550 },
    { id: 23, name: "Esteira Transportadora - G", status: "Normal", vibration_limit: 9.9, preventive_cost: 490, corrective_cost: 2450 },
    { id: 24, name: "Esteira Transportadora - H", status: "Normal", vibration_limit: 10.8, preventive_cost: 600, corrective_cost: 2800 },

    { id: 25, name: "Compressor principal - 01", status: "Normal", vibration_limit: 6.0, preventive_cost: 1200, corrective_cost: 6000 },
    { id: 26, name: "Compressor principal - 02", status: "Normal", vibration_limit: 6.2, preventive_cost: 1250, corrective_cost: 6200 },
    { id: 27, name: "Compressor principal - 03", status: "Normal", vibration_limit: 5.8, preventive_cost: 1150, corrective_cost: 5800 },
    { id: 28, name: "Compressor principal - 04", status: "Normal", vibration_limit: 6.1, preventive_cost: 1220, corrective_cost: 6100 },
    { id: 29, name: "Compressor principal - 05", status: "Normal", vibration_limit: 5.9, preventive_cost: 1180, corrective_cost: 5900 },
    { id: 30, name: "Compressor principal - 06", status: "Normal", vibration_limit: 6.3, preventive_cost: 1300, corrective_cost: 6300 },
    { id: 31, name: "Compressor principal - 07", status: "Normal", vibration_limit: 5.7, preventive_cost: 1100, corrective_cost: 5700 },
    { id: 32, name: "Compressor principal - 08", status: "Normal", vibration_limit: 6.4, preventive_cost: 1350, corrective_cost: 6400 }
];

let alertsData = [];
// Histórico de leituras para o gráfico: { machineId: [ {timestamp, vibration, temp} ] }
let readingsHistory = {};
machinesList.forEach(m => {
    readingsHistory[m.id] = [];
});

const maxDataPoints = 20; // Pontos máximos no gráfico por máquina
let vibChart = null;
const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#ef4444"];

// --- FUNÇÕES UTILITÁRIAS ---
function formatMoney(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatTime(dateObj) {
    return dateObj.toLocaleTimeString('pt-BR');
}

// --- MÓDULO SIMULADOR IOT & LÓGICA DE NEGÓCIO (Anteriormente Backend) ---
function simulateIoTStream() {
    const now = new Date();
    
    machinesList.forEach(machine => {
        // Gerador de vibração normal: base (60% do limite) +- ruído
        let base_vibration = machine.vibration_limit * 0.6;
        let vibration = base_vibration + (Math.random() * 2.5 - 1.0); // Ruído
        let temp = 40.0 + Math.random() * 25.0;

        // 5% de chance de gerar uma anomalia (vibração perigosa) se já não estiver em alerta
        if (Math.random() < 0.05 && machine.status === "Normal") {
            vibration = machine.vibration_limit + (Math.random() * 2.5 + 0.5); 
            temp = 60.0 + Math.random() * 35.0; // temperatura sobe
        }

        // 1. Armazena a leitura
        readingsHistory[machine.id].push({
            timestamp: now,
            vibration: parseFloat(vibration.toFixed(2)),
            temp: parseFloat(temp.toFixed(2))
        });

        // Limita o tamanho do array para não travar o navegador
        if (readingsHistory[machine.id].length > maxDataPoints) {
            readingsHistory[machine.id].shift();
        }

        // 2. Lógica de Detecção de Anomalias (Regra de Negócio)
        if (vibration > machine.vibration_limit) { // Passou do limite
            if (machine.status !== "Alerta" && machine.status !== "Manutenção") {
                machine.status = "Alerta";
                // Gera alerta
                alertsData.unshift({
                    id: Date.now() + Math.random(),
                    machine_id: machine.id,
                    timestamp: now,
                    message: `Risco de falha na ${machine.name} – Vibração anormal detectada (${vibration.toFixed(1)} mm/s). Manutenção recomendada.`,
                    resolved: false
                });
            }
        } 
        // Se a vibração voltou sozinho pro normal por 3 leituras seguidas não resolvemos o alerta, a manutenção que tem que resolver.
    });

    // Limita o histórico de alertas para a UI
    if (alertsData.length > 50) alertsData.length = 50;
}

// Resolve problemas da máquina (chamado pelo botão)
window.resolveMachine = function(machineId) {
    const machine = machinesList.find(m => m.id === machineId);
    if(machine) {
        machine.status = "Normal";
        // Marca alertas daquela maquina como resolvidos
        alertsData.forEach(a => {
            if(a.machine_id === machine.id && !a.resolved) {
                a.resolved = true;
            }
        });
        refreshUI();
    }
}

// --- MÓDULO DE INTERFACE (Dashboard) ---

function updateStats() {
    let machines_in_alert = machinesList.filter(m => m.status === "Alerta").length;
    let total_alerts = alertsData.length;
    
    // Custo Preventiva (Cenário: Fazer preventiva em todo mundo 4 vezes ao ano)
    let prev_cost = machinesList.reduce((acc, m) => acc + m.preventive_cost, 0) * 4;
    
    // Custo Falhas (Cenário: Quantos alertas de quebra nós tivemos * custo corretivo da maquina)
    let corr_cost = alertsData.filter(a => !a.resolved || a.resolved).reduce((acc, a) => {
        const m = machinesList.find(x => x.id === a.machine_id);
        return acc + (m ? m.corrective_cost : 0);
    }, 0);

    document.getElementById("kpi-machines").innerText = machinesList.length;
    document.getElementById("kpi-alerts").innerText = machines_in_alert;
    document.getElementById("kpi-prev-cost").innerText = formatMoney(prev_cost);
    document.getElementById("kpi-corr-cost").innerText = formatMoney(corr_cost);
}

function updateMachines() {
    const container = document.getElementById("machines-container");
    container.innerHTML = "";

    machinesList.forEach(m => {
        const isAlert = m.status === "Alerta";
        let borderColor = "border-green-500";
        let statusBadge = `<span class="px-2 py-1 bg-green-900 text-green-300 text-xs rounded-full font-bold">NORMAL</span>`;
        let mainBg = "bg-gray-700";
        
        if (isAlert) {
            borderColor = "border-red-500";
            statusBadge = `<span class="px-2 py-1 bg-red-900 text-red-300 text-xs rounded-full font-bold animate-pulse">ALERTA / FALHA EMININENTE</span>`;
            mainBg = "alert-card";
        }

        const btnFix = isAlert ? 
            `<button onclick="resolveMachine(${m.id})" class="mt-3 w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded text-sm transition font-bold"><i class="fa-solid fa-screwdriver-wrench"></i> Realizar Manutenção (+${formatMoney(m.corrective_cost)})</button>` : 
            `<button onclick="resolveMachine(${m.id})" class="mt-3 w-full bg-gray-600 hover:bg-gray-500 text-white p-2 rounded text-sm transition"><i class="fa-solid fa-clipboard-check"></i> Manutenção Prev. (+${formatMoney(m.preventive_cost)})</button>`;

        const html = `
            <div class="${mainBg} p-4 rounded-lg border border-gray-600 border-t-4 ${borderColor} relative shadow-lg">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-bold text-lg">${m.name}</h4>
                    ${statusBadge}
                </div>
                <div class="text-sm text-gray-400 mt-2 space-y-1">
                    <p><i class="fa-solid fa-wave-square"></i> Limite Vibração: <span class="text-gray-200">${m.vibration_limit} mm/s</span></p>
                    <p><i class="fa-solid fa-shield-halved"></i> Preventiva: <span class="text-blue-300">${formatMoney(m.preventive_cost)}</span></p>
                    <p><i class="fa-solid fa-fire"></i> Falha (Corretiva): <span class="text-red-300">${formatMoney(m.corrective_cost)}</span></p>
                </div>
                ${btnFix}
            </div>
        `;
        container.innerHTML += html;
    });
}

function updateAlerts() {
    const container = document.getElementById("alerts-container");
    container.innerHTML = "";

    if (alertsData.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-sm italic">Nenhum evento registrado no sistema.</p>`;
        return;
    }

    // Mostra os 15 mais recentes
    alertsData.slice(0, 15).forEach(a => {
        const m = machinesList.find(x => x.id === a.machine_id);
        const mName = m ? m.name : `Máquina ${a.machine_id}`;
        const isResolved = a.resolved;
        const icon = isResolved ? `<i class="fa-solid fa-check-circle text-green-500"></i>` : `<i class="fa-solid fa-triangle-exclamation text-red-500"></i>`;
        const textCls = isResolved ? "text-gray-500 line-through" : "text-gray-200";

        const html = `
            <div class="bg-gray-700 p-3 rounded mb-2 border-l-2 ${isResolved ? 'border-green-500' : 'border-red-500'}">
                <div class="flex justify-between items-center text-xs text-gray-400 mb-1">
                    <span>${formatTime(a.timestamp)}</span>
                    ${icon}
                </div>
                <p class="text-sm font-semibold text-blue-300">${mName}</p>
                <p class="text-xs ${textCls} mt-1">${a.message}</p>
            </div>
        `;
        container.innerHTML += html;
    });
}

function initChart() {
    const ctx = document.getElementById('vibrationChart').getContext('2d');
    Chart.defaults.color = '#9ca3af';

    vibChart = new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 400 }, // pequena animação suave
            interaction: { mode: 'nearest', axis: 'x', intersect: false },
            elements: { line: { tension: 0.3 }, point: { radius: 1, hitRadius: 5 } },
            scales: {
                y: { title: { display: true, text: 'Vibração (mm/s)' }, grid: { color: 'rgba(75, 85, 99, 0.3)' } },
                x: { grid: { color: 'rgba(75, 85, 99, 0.3)' } }
            },
            plugins: { legend: { position: 'top' }, tooltip: { mode: 'index', intersect: false } }
        }
    });
}

function updateChartData() {
    if(machinesList.length === 0 || !vibChart) return;

    let newDatasets = [];
    let commonLabels = [];

    // Tentar pegar os labels da maquina 1 como ref (todas batem na msm hora no simulador local)
    if(readingsHistory[1].length > 0) {
        commonLabels = readingsHistory[1].map(r => formatTime(r.timestamp));
    }

    machinesList.forEach((m, index) => {
        const reads = readingsHistory[m.id];
        newDatasets.push({
            label: m.name,
            data: reads.map(r => r.vibration),
            borderColor: colors[index % colors.length],
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 2,
            pointHoverRadius: 5
        });
    });

    vibChart.data.labels = commonLabels;
    vibChart.data.datasets = newDatasets;
    vibChart.update();
}

// Fluxo de Atualização da UI
function refreshUI() {
    updateStats();
    updateMachines();
    updateAlerts();
    updateChartData();
}

// Loop Principal
function gameLoop() {
    simulateIoTStream();
    refreshUI();
}

// Boot
function bootstrap() {
    // Inicializa Chart
    initChart();
    
    // Simula primeiros pontos rápidos
    for(let i=0; i<5; i++){
        simulateIoTStream();
    }
    refreshUI();

    // Inicia fluxo constante (2.5s)
    setInterval(gameLoop, 2500);
}

// Executa ao carregar
document.addEventListener("DOMContentLoaded", bootstrap);
