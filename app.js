// Estado Global da Aplicação (Simulando o Banco de Dados)
let machinesList = [
    { id: 1, name: "Torno CNC - 01", status: "Normal", vibration_limit: 8.5, preventive_cost: 1000, corrective_cost: 5000 },
    { id: 2, name: "Torno CNC - 02", status: "Normal", vibration_limit: 8.6, preventive_cost: 1000, corrective_cost: 5100 },
    { id: 3, name: "Torno CNC - 03", status: "Normal", vibration_limit: 8.4, preventive_cost: 1050, corrective_cost: 4900 },
    { id: 4, name: "Torno CNC - 04", status: "Normal", vibration_limit: 8.7, preventive_cost: 1100, corrective_cost: 5200 },
    { id: 5, name: "Torno CNC - 05", status: "Normal", vibration_limit: 8.3, preventive_cost: 950, corrective_cost: 4800 },

    { id: 6, name: "Fresa - 01", status: "Normal", vibration_limit: 7.0, preventive_cost: 800, corrective_cost: 4000 },
    { id: 7, name: "Fresa - 02", status: "Normal", vibration_limit: 7.1, preventive_cost: 820, corrective_cost: 4100 },
    { id: 8, name: "Fresa - 03", status: "Normal", vibration_limit: 6.9, preventive_cost: 780, corrective_cost: 3900 },
    { id: 9, name: "Fresa - 04", status: "Normal", vibration_limit: 7.2, preventive_cost: 850, corrective_cost: 4200 },
    { id: 10, name: "Fresa - 05", status: "Normal", vibration_limit: 7.0, preventive_cost: 800, corrective_cost: 4000 },

    { id: 11, name: "Esteira Transportadora - A", status: "Normal", vibration_limit: 10.0, preventive_cost: 500, corrective_cost: 2500 },
    { id: 12, name: "Esteira Transportadora - B", status: "Normal", vibration_limit: 10.5, preventive_cost: 550, corrective_cost: 2700 },
    { id: 13, name: "Esteira Transportadora - C", status: "Normal", vibration_limit: 9.5, preventive_cost: 450, corrective_cost: 2300 },
    { id: 14, name: "Esteira Transportadora - D", status: "Normal", vibration_limit: 10.2, preventive_cost: 520, corrective_cost: 2600 },
    { id: 15, name: "Esteira Transportadora - E", status: "Normal", vibration_limit: 9.8, preventive_cost: 480, corrective_cost: 2400 },

    { id: 16, name: "Compressor principal - 01", status: "Normal", vibration_limit: 6.0, preventive_cost: 1200, corrective_cost: 6000 },
    { id: 17, name: "Compressor principal - 02", status: "Normal", vibration_limit: 6.2, preventive_cost: 1250, corrective_cost: 6200 },
    { id: 18, name: "Compressor principal - 03", status: "Normal", vibration_limit: 5.8, preventive_cost: 1150, corrective_cost: 5800 },
    { id: 19, name: "Compressor principal - 04", status: "Normal", vibration_limit: 6.1, preventive_cost: 1220, corrective_cost: 6100 },
    { id: 20, name: "Compressor principal - 05", status: "Normal", vibration_limit: 5.9, preventive_cost: 1180, corrective_cost: 5900 }
];

let alertsData = [];
let accumulated_accident_cost = 0; // Total pago em acidentes
let total_revenue = 0; // Faturamento
let total_expenses = 0; // Despesas
// Histórico de leituras para o gráfico: { machineId: [ {timestamp, vibration, temp} ] }
let readingsHistory = {};
machinesList.forEach(m => {
    m.accident_cost = m.corrective_cost * (Math.floor(Math.random() * 8) + 8); // Custo do acidente
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

        // Finanças: Faturamento por ciclo baseado no status
        if (machine.status === "Normal") {
            total_revenue += machine.preventive_cost * 0.60; // Operação normal = ganho muito bom (Aumentado)
        } else if (machine.status === "Alerta") {
            total_revenue += machine.preventive_cost * 0.25; // Operação em alerta = ganho reduzido (Aumentado)
        }
        // Se Acidente = 0 ganho (máquina parada)

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
            if (machine.status === "Normal") {
                machine.status = "Alerta";
                // Gera alerta
                alertsData.unshift({
                    id: Date.now() + Math.random(),
                    machine_id: machine.id,
                    timestamp: now,
                    type: "alerta",
                    message: `Risco de falha na ${machine.name} – Vibração anormal detectada (${vibration.toFixed(1)} mm/s). Manutenção recomendada.`,
                    resolved: false
                });
            } else if (machine.status === "Alerta" && Math.random() < 0.05) {
                machine.status = "Acidente";
                alertsData.unshift({
                    id: Date.now() + Math.random(),
                    machine_id: machine.id,
                    timestamp: now,
                    type: "acidente",
                    message: `[ACIDENTE GRAVE] A máquina ${machine.name} colapsou! Operador ferido, ambulância a caminho. (${vibration.toFixed(1)} mm/s).`,
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
window.resolveMachine = function (machineId) {
    const machine = machinesList.find(m => m.id === machineId);
    if (machine) {
        if (machine.status === "Acidente") {
            accumulated_accident_cost += machine.accident_cost;
            total_expenses += machine.accident_cost;
        } else if (machine.status === "Alerta") {
            total_expenses += machine.corrective_cost;
        } else if (machine.status === "Normal") {
            total_expenses += machine.preventive_cost;
        }
        machine.status = "Normal";
        // Marca alertas daquela maquina como resolvidos
        alertsData.forEach(a => {
            if (a.machine_id === machine.id && !a.resolved) {
                a.resolved = true;
            }
        });
        refreshUI();
    }
}

// Melhorar a máquina para suportar mais vibração
window.upgradeMachine = function (machineId) {
    const machine = machinesList.find(m => m.id === machineId);
    if (machine && machine.status !== "Acidente") {
        const upgradeCost = machine.preventive_cost * 2.5 * (machine.level || 1);

        machine.vibration_limit = parseFloat((machine.vibration_limit * 1.15).toFixed(2));
        machine.level = (machine.level || 1) + 1;

        // Aumenta os custos de manutenção (e consequentemente os lucros na simulação) e atualiza o risco do acidente
        machine.preventive_cost = Math.floor(machine.preventive_cost * 1.25);
        machine.corrective_cost = Math.floor(machine.corrective_cost * 1.30);
        machine.accident_cost = machine.corrective_cost * (Math.floor(Math.random() * 8) + 8);

        total_expenses += upgradeCost;

        alertsData.unshift({
            id: Date.now() + Math.random(),
            machine_id: machine.id,
            timestamp: new Date(),
            type: "upgrade",
            message: `[UPGRADE] ${machine.name} aprimorada para Nível ${machine.level}. Lucros e custos aumentados.`,
            resolved: true
        });

        refreshUI();
    }
}

// --- MÓDULO DE INTERFACE (Dashboard) ---

function updateStats() {
    let machines_in_alert = machinesList.filter(m => m.status === "Alerta" || m.status === "Acidente").length;
    let total_alerts = alertsData.length;

    // Custo Falhas (Cenário: Quantos alertas de quebra nós tivemos * custo corretivo da maquina)
    let corr_cost = alertsData.filter(a => a.type !== "acidente" && (!a.resolved || a.resolved)).reduce((acc, a) => {
        const m = machinesList.find(x => x.id === a.machine_id);
        return acc + (m ? m.corrective_cost : 0);
    }, 0);

    let acc_cost = alertsData.filter(a => a.type === "acidente" && !a.resolved).reduce((acc, a) => {
        const m = machinesList.find(x => x.id === a.machine_id);
        return acc + (m ? m.accident_cost : 0);
    }, 0) + accumulated_accident_cost;

    document.getElementById("kpi-machines").innerText = machinesList.length;
    document.getElementById("kpi-alerts").innerText = machines_in_alert;
    document.getElementById("kpi-corr-cost").innerText = formatMoney(corr_cost);

    const accCostEl = document.getElementById("kpi-acc-cost");
    if (accCostEl) accCostEl.innerText = formatMoney(acc_cost);

    // Finanças
    let net_profit = total_revenue - total_expenses;
    document.getElementById("kpi-revenue").innerText = formatMoney(total_revenue);
    document.getElementById("kpi-expenses").innerText = formatMoney(total_expenses);
    document.getElementById("kpi-profit").innerText = formatMoney(net_profit);

    // Colorize profit correctly
    const profitEl = document.getElementById("kpi-profit");
    if (net_profit < 0) {
        profitEl.className = "text-3xl font-bold mt-2 text-red-400";
    } else {
        profitEl.className = "text-3xl font-bold mt-2 text-blue-400";
    }
}

function updateMachines() {
    const container = document.getElementById("machines-container");
    container.innerHTML = "";

    machinesList.forEach(m => {
        const isAlert = m.status === "Alerta";
        const isAccident = m.status === "Acidente";
        let borderColor = "border-green-500";
        let statusBadge = `<span class="px-2 py-1 bg-green-900 text-green-300 text-xs rounded-full font-bold">NORMAL</span>`;
        let mainBg = "bg-gray-700";
        let btnFix = "";

        if (isAccident) {
            borderColor = "border-purple-500";
            statusBadge = `<span class="px-2 py-1 bg-purple-900 text-purple-300 text-xs rounded-full font-bold animate-pulse"><i class="fa-solid fa-skull-crossbones"></i> ACIDENTE GRAVE</span>`;
            mainBg = "bg-purple-900 bg-opacity-30 alert-card";
            btnFix = `<button onclick="resolveMachine(${m.id})" class="mt-3 w-full bg-purple-600 hover:bg-purple-500 text-white p-2 rounded text-sm transition font-bold shadow-[0_0_10px_rgba(168,85,247,0.5)]"><i class="fa-solid fa-truck-medical"></i> Socorrer e Indenizar (+${formatMoney(m.accident_cost)})</button>`;
        } else if (isAlert) {
            borderColor = "border-red-500";
            statusBadge = `<span class="px-2 py-1 bg-red-900 text-red-300 text-xs rounded-full font-bold animate-pulse">ALERTA / FALHA EMININENTE</span>`;
            mainBg = "alert-card";
            btnFix = `<button onclick="resolveMachine(${m.id})" class="mt-3 w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded text-sm transition font-bold"><i class="fa-solid fa-screwdriver-wrench"></i> Realizar Manutenção (+${formatMoney(m.corrective_cost)})</button>`;
        } else {
            btnFix = `<button onclick="resolveMachine(${m.id})" class="mt-3 w-full bg-gray-600 hover:bg-gray-500 text-white p-2 rounded text-sm transition"><i class="fa-solid fa-clipboard-check"></i> Manutenção Prev. (+${formatMoney(m.preventive_cost)})</button>`;
        }

        const lvl = m.level || 1;
        const upgradeCost = m.preventive_cost * 2.5 * lvl;
        const btnUpgrade = !isAccident ? `<button onclick="upgradeMachine(${m.id})" class="mt-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded text-sm transition font-bold"><i class="fa-solid fa-arrow-up-right-dots"></i> Upgrade (Nível ${lvl + 1}) / (-${formatMoney(upgradeCost)})</button>` : '';

        const html = `
            <div class="${mainBg} p-4 rounded-lg border border-gray-600 border-t-4 ${borderColor} relative shadow-lg">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-bold text-lg">${m.name}</h4>
                    ${statusBadge}
                </div>
                <div class="text-sm text-gray-400 mt-2 space-y-1">
                    <p><i class="fa-solid fa-wave-square"></i> Limite Vibração: <span class="text-gray-200">${m.vibration_limit.toFixed(2)} mm/s</span> <span class="bg-indigo-900 text-indigo-300 text-[10px] px-1 rounded ml-1 font-bold">NVL ${lvl}</span></p>
                    <p><i class="fa-solid fa-shield-halved"></i> Preventiva: <span class="text-blue-300">${formatMoney(m.preventive_cost)}</span></p>
                    <p><i class="fa-solid fa-fire"></i> Falha (Corretiva): <span class="text-red-300">${formatMoney(m.corrective_cost)}</span></p>
                    ${isAccident ? `<p class="mt-1 pt-1 border-t border-purple-800"><i class="fa-solid fa-notes-medical text-purple-400"></i> Custo Hospitalar/Ind.: <span class="text-purple-300 font-bold">${formatMoney(m.accident_cost)}</span></p>` : ''}
                </div>
                <div class="mt-3 space-y-2">
                    ${btnFix}
                    ${btnUpgrade}
                </div>
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
    if (machinesList.length === 0 || !vibChart) return;

    let newDatasets = [];
    let commonLabels = [];

    // Tentar pegar os labels da primeira maquina como ref (todas batem na msm hora no simulador local)
    const firstId = machinesList[0]?.id;
    if (firstId && readingsHistory[firstId] && readingsHistory[firstId].length > 0) {
        commonLabels = readingsHistory[firstId].map(r => formatTime(r.timestamp));
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
    for (let i = 0; i < 5; i++) {
        simulateIoTStream();
    }
    refreshUI();

    // Inicia fluxo constante (2.5s)
    setInterval(gameLoop, 2500);
}

// Executa ao carregar
document.addEventListener("DOMContentLoaded", bootstrap);
