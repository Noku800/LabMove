/* =========================
   LabMove - Script
   ========================= */

let ideias = JSON.parse(localStorage.getItem("labmoveIdeias")) || [];
let projetos = JSON.parse(localStorage.getItem("labmoveProjetos")) || [];

/* ---------- Persistência ---------- */
function salvar() {
  localStorage.setItem("labmoveIdeias", JSON.stringify(ideias));
  localStorage.setItem("labmoveProjetos", JSON.stringify(projetos));
}

/* ---------- Tema ---------- */
function initTheme() {
  const saved = localStorage.getItem("labmoveTheme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
  updateThemeIcon(saved);

  document.getElementById("themeToggle").addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("labmoveTheme", next);
    updateThemeIcon(next);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector(".theme-icon");
  if (icon) icon.textContent = theme === "dark" ? "☀️" : "🌙";
}

/* ---------- Contador de caracteres ---------- */
function initCharCount() {
  const desc = document.getElementById("descricao");
  const counter = document.getElementById("charCount");
  if (!desc || !counter) return;

  desc.addEventListener("input", () => {
    counter.textContent = desc.value.length;
  });
}

/* ---------- Navegação ---------- */
function irPara(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.section === id);
  });
}

function initNav() {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      irPara(btn.dataset.section);
    });
  });
}

/* ---------- Segurança ---------- */
function escapeHTML(text) {
  if (!text) return "";
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ---------- Adicionar ideia ---------- */
function adicionarIdeia() {
  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const categoria = document.getElementById("categoria").value;

  if (!titulo || !descricao || !categoria) {
    alert("Preencha todos os campos!");
    return;
  }

  ideias.push({
    id: Date.now(),
    titulo,
    descricao,
    categoria,
    votos: 0,
    status: "Nova",
    criadoEm: new Date().toISOString(),
  });

  salvar();

  document.getElementById("titulo").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("charCount").textContent = "0";

  const resultado = document.getElementById("resultadoIA");
  if (resultado) {
    resultado.hidden = true;
    resultado.innerHTML = "";
  }

  atualizar();
  irPara("ideiasArea");
}

/* ---------- Votar ---------- */
function votar(id) {
  const ideia = ideias.find((i) => i.id === id);
  if (!ideia) return;

  ideia.votos++;
  salvar();
  atualizar();
}

/* ---------- Excluir ideia ---------- */
function excluirIdeia(id) {
  if (!confirm("Tem certeza que deseja excluir esta ideia?")) return;

  // Remove projeto vinculado, se existir
  projetos = projetos.filter((p) => p.ideiaId !== id);
  ideias = ideias.filter((i) => i.id !== id);

  salvar();
  atualizar();
}

/* ---------- Criar projeto ---------- */
function criarProjeto(id) {
  const ideia = ideias.find((i) => i.id === id);
  if (!ideia) return;

  if (projetos.some((p) => p.ideiaId === id)) {
    alert("Essa ideia já virou um projeto!");
    return;
  }

  projetos.push({
    id: Date.now(),
    ideiaId: id,
    nome: ideia.titulo,
    descricao: ideia.descricao,
    status: "Planejamento",
    criadoEm: new Date().toISOString(),
  });

  ideia.status = "Em projeto";
  salvar();
  atualizar();
  irPara("projetosArea");
}

/* ---------- Alterar status do projeto ---------- */
function mudarStatus(id, status) {
  const projeto = projetos.find((p) => p.id === id);
  if (!projeto) return;

  projeto.status = status;
  salvar();
  atualizar();
}

/* ---------- Excluir projeto ---------- */
function excluirProjeto(id) {
  if (!confirm("Tem certeza que deseja excluir este projeto?")) return;

  const projeto = projetos.find((p) => p.id === id);
  if (projeto) {
    const ideia = ideias.find((i) => i.id === projeto.ideiaId);
    if (ideia) ideia.status = "Nova";
  }

  projetos = projetos.filter((p) => p.id !== id);
  salvar();
  atualizar();
}

/* ---------- Análise com IA (simulada) ---------- */
function analisarIA() {
  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const categoria = document.getElementById("categoria").value;

  if (!titulo || !descricao || !categoria) {
    alert("Preencha título, descrição e categoria antes de usar a IA.");
    return;
  }

  const texto = (titulo + " " + descricao).toLowerCase();

  // Prioridade
  let prioridade = "Média";
  let prioridadeClass = "media";

  const palavrasAlta = [
    "energia", "segurança", "acessibilidade", "desperdício",
    "água", "lixo", "bullying", "saúde", "emergência", "risco"
  ];
  const palavrasBaixa = [
    "decoração", "evento", "festa", "música", "cor", "estética"
  ];

  if (palavrasAlta.some((p) => texto.includes(p))) {
    prioridade = "Alta";
    prioridadeClass = "alta";
  } else if (palavrasBaixa.some((p) => texto.includes(p))) {
    prioridade = "Baixa";
    prioridadeClass = "baixa";
  }

  // Sugestões por categoria
  const sugestoesPorCategoria = {
    Sustentabilidade: [
      "Criar um protótipo sustentável de baixo custo.",
      "Medir o consumo ou impacto antes e depois da solução.",
      "Pesquisar materiais recicláveis ou reutilizáveis.",
      "Apresentar os resultados para a direção da escola.",
    ],
    Tecnologia: [
      "Começar com um protótipo simples (MVP).",
      "Testar com um grupo pequeno de alunos.",
      "Coletar feedback dos usuários.",
      "Iterar a solução com base nos testes.",
    ],
    Espaços: [
      "Mapear os espaços existentes e seus problemas.",
      "Conversar com quem usa o espaço diariamente.",
      "Propor melhorias de baixo custo e alto impacto.",
      "Criar um plano de implementação por etapas.",
    ],
    Educação: [
      "Identificar as dificuldades de aprendizagem mais comuns.",
      "Propor métodos ativos ou gamificação.",
      "Testar a ideia em uma turma piloto.",
      "Documentar os resultados e compartilhar.",
    ],
    Eventos: [
      "Definir público-alvo e objetivos claros.",
      "Criar um cronograma realista.",
      "Buscar apoio de professores e direção.",
      "Avaliar o evento com feedback dos participantes.",
    ],
    Saúde: [
      "Pesquisar dados sobre o problema de saúde/bem-estar.",
      "Propor ações preventivas e de conscientização.",
      "Envolver profissionais da área (enfermeiros, psicólogos).",
      "Criar campanhas visuais e interativas.",
    ],
  };

  const sugestoes = sugestoesPorCategoria[categoria] || [
    "Conversar com alunos e funcionários.",
    "Identificar a principal causa do problema.",
    "Criar uma solução de baixo custo.",
    "Testar a solução antes da implementação completa.",
  ];

  // Impacto estimado
  let impacto = "Médio";
  if (prioridade === "Alta") impacto = "Alto";
  if (prioridade === "Baixa") impacto = "Baixo a Médio";

  const resultado = document.getElementById("resultadoIA");
  resultado.hidden = false;
  resultado.innerHTML = `
<strong>🤖 Análise Inteligente do LabMove</strong>

📌 <strong>Problema analisado:</strong>
${escapeHTML(descricao)}

📊 <strong>Categoria:</strong> ${escapeHTML(categoria)}

🔥 <strong>Prioridade sugerida:</strong>
<span class="priority ${prioridadeClass}">${prioridade}</span>

📈 <strong>Impacto estimado:</strong> ${impacto}

💡 <strong>Sugestões de próximos passos:</strong>
${sugestoes.map((s) => "• " + s).join("\n")}

🧠 <em>Esta análise é um apoio. A decisão final deve ser tomada pela equipe do LabMove.</em>
  `.trim();
}

/* ---------- Atualizar interface ---------- */
function atualizar() {
  // Métricas
  document.getElementById("totalIdeias").textContent = ideias.length;
  document.getElementById("totalVotos").textContent = ideias.reduce(
    (total, i) => total + i.votos,
    0
  );
  document.getElementById("totalProjetos").textContent = projetos.length;
  document.getElementById("totalConcluidos").textContent = projetos.filter(
    (p) => p.status === "Concluído"
  ).length;

  // Filtros
  const filtroCat = document.getElementById("filtroCategoria")?.value || "";
  const filtroOrd = document.getElementById("filtroOrdenacao")?.value || "votos";
  const filtroStatus = document.getElementById("filtroStatusProjeto")?.value || "";

  // Ideias
  let ideiasFiltradas = [...ideias];

  if (filtroCat) {
    ideiasFiltradas = ideiasFiltradas.filter((i) => i.categoria === filtroCat);
  }

  if (filtroOrd === "votos") {
    ideiasFiltradas.sort((a, b) => b.votos - a.votos);
  } else if (filtroOrd === "recentes") {
    ideiasFiltradas.sort((a, b) => b.id - a.id);
  } else {
    ideiasFiltradas.sort((a, b) => a.id - b.id);
  }

  const lista = document.getElementById("listaIdeias");

  if (!ideiasFiltradas.length) {
    lista.innerHTML = `
      <div class="empty-state">
        ${ideias.length === 0
          ? "Nenhuma ideia cadastrada ainda.<br>Que tal criar a primeira?"
          : "Nenhuma ideia encontrada com esse filtro."}
      </div>`;
  } else {
    lista.innerHTML = ideiasFiltradas
      .map((i) => {
        const statusClass =
          i.status === "Nova" ? "nova" : "em-projeto";
        return `
        <div class="idea">
          <h3>${escapeHTML(i.titulo)}</h3>
          <div class="idea-meta">
            <span class="badge">${escapeHTML(i.categoria)}</span>
            <span class="status-badge ${statusClass}">${escapeHTML(i.status)}</span>
          </div>
          <p>${escapeHTML(i.descricao)}</p>
          <div class="idea-actions">
            <button class="action small" onclick="votar(${i.id})">
              👍 Apoiar (${i.votos})
            </button>
            ${
              i.status === "Nova"
                ? `<button class="action small secondary" onclick="criarProjeto(${i.id})">
                    🛠️ Transformar em projeto
                   </button>`
                : ""
            }
            <button class="action small danger" onclick="excluirIdeia(${i.id})">
              🗑️ Excluir
            </button>
          </div>
        </div>`;
      })
      .join("");
  }

  // Projetos
  let projetosFiltrados = [...projetos];
  if (filtroStatus) {
    projetosFiltrados = projetosFiltrados.filter(
      (p) => p.status === filtroStatus
    );
  }

  // Ordenar por mais recentes
  projetosFiltrados.sort((a, b) => b.id - a.id);

  const listaProjetos = document.getElementById("listaProjetos");

  if (!projetosFiltrados.length) {
    listaProjetos.innerHTML = `
      <div class="empty-state">
        ${projetos.length === 0
          ? "Nenhum projeto criado ainda.<br>Transforme uma ideia em projeto!"
          : "Nenhum projeto com esse status."}
      </div>`;
  } else {
    listaProjetos.innerHTML = projetosFiltrados
      .map((p) => {
        const statusClass = p.status
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(" ", "-");

        return `
        <div class="project">
          <h3>${escapeHTML(p.nome)}</h3>
          <p>${escapeHTML(p.descricao)}</p>
          <div class="project-actions">
            <select onchange="mudarStatus(${p.id}, this.value)">
              <option value="Planejamento" ${p.status === "Planejamento" ? "selected" : ""}>📋 Planejamento</option>
              <option value="Desenvolvimento" ${p.status === "Desenvolvimento" ? "selected" : ""}>⚙️ Desenvolvimento</option>
              <option value="Teste" ${p.status === "Teste" ? "selected" : ""}>🧪 Teste</option>
              <option value="Concluído" ${p.status === "Concluído" ? "selected" : ""}>✅ Concluído</option>
            </select>
            <span class="status-badge ${statusClass}">${escapeHTML(p.status)}</span>
            <button class="action small danger" onclick="excluirProjeto(${p.id})">
              🗑️ Excluir
            </button>
          </div>
        </div>`;
      })
      .join("");
  }
}

/* ---------- Inicialização ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initCharCount();
  initNav();
  atualizar();
});
