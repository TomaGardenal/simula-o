# Indústria 4.0 - Simulador IoT e Big Data (Client-Side)

Este projeto simula um ambiente de Indústria 4.0 utilizando conceitos de Internet das Coisas (IoT), Big Data e análise estática em tempo real para painéis de Business Intelligence (BI).

![Screenshot do Sistema](https://via.placeholder.com/800x400.png?text=Dashboard+Ind%C3%BAstria+4.0) *(Ilustrativo)*

Nesta versão **100% estática (Client-Side)**, toda a lógica de streaming de dados, data warehouse relacional e motores de regras de negócio rodam unicamente via JavaScript no seu próprio navegador, garantindo independência e facilidade de deploy.

## 🚀 Como Executar

### Pré-requisitos
- Um Navegador Web moderno (Chrome, Edge, Firefox).

### Instalação

Como toda a simulação foi construída para Front-end:

1. Acesse a pasta do projeto `simulador_industria_40`
2. Arraste e solte o arquivo `index.html` em seu navegador web.
ou
1. Hospede o repositório como um site estático no **GitHub Pages**, **Vercel** ou **Netlify**.

---

## 🏗️ Arquitetura do Sistema (Simulação)

A arquitetura moderna deste projeto simula visual e logicamente no navegador os principais alicerces de Sistemas Distribuídos e Indústria 4.0:

1. **Camada Edge/Dispositivos (IoT Simulator)**: Um loop assíncrono interno no `app.js` atua autônomo gerando Stream contínuo de dados das máquinas virtuais (Tornos, Fresas, etc.).
2. **Camada de Regras e Lógica**: O JavaScript avalia as amostras em tempo real (on-the-fly) conferindo limites de vibrações, aplicando Regras de Negócio e injetando Anomalias aleatórias.
3. **Data Warehouse Simplificado (Em Memória)**: Objetos complexos, arrays de Histórico de Vibração limitados e Listas Encadeadas de alertas atuam como a base de dados em memória volátil gerindo a escalabilidade.
4. **Camada de Visualização (Dashboard VanillaJS + Chart.js)**: Painel limpo construído com HTML Semântico e Vanilla CSS + Tailwind (via CDN) consumindo o Warehouse vivo para pintar os gráficos e painéis de Business Intelligence de Custo Preventivo x Corretivo.

---

## 🏭 Conceitos: Indústria 4.0 e Big Data no Código

* **Gêmeos Digitais e IoT**: As variáveis acompanhadas pelo JavaScript são representações mecânicas da Fresa ou Torno na memória em tempo real.
* **Manutenção Preditiva x Corretiva**: Exposto no Dashboard a noção de Custo por ciclo, validando a tese na Indústria 4.0 de que monitoramento prevê quebras ao invés de deixá-las ocorrerem.

---
*Gerado por Engenharia Dinâmica de Sistemas Simulados.*
