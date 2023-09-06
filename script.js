// Definindo a URL base da API
const apiUrl = "https://rickandmortyapi.com/api/";

// Selecionando elementos do DOM
const campoBusca = document.getElementById("campoBusca"); // Campo de pesquisa
const resultado = document.getElementById("resultado"); // Resultado da pesquisa
const opcoesBusca = document.getElementById("opcoesBusca"); // Opções de busca
const homeDiv = document.getElementById("home"); // Div onde os personagens são exibidos
const numeroPa = document.getElementById("numero-pa"); // Número da página atual
let currentPage = 1; // Página atual

// Função para obter a quantidade de personagens da API
axios
  .get(apiUrl + "character")
  .then((response) => {
    const quantidadePersonagens = response.data.info.count;
    const nper = document.getElementById("nper");
    nper.innerHTML = `${quantidadePersonagens}`;
  })
  .catch((error) => {
    console.error("Erro ao obter quantidade de personagens:", error);
  });

// Função para obter a quantidade de localizações da API
axios
  .get(apiUrl + "location")
  .then((response) => {
    const quantidadeLocalizacoes = response.data.info.count;
    const nloc = document.getElementById("nloc");
    nloc.innerHTML = `${quantidadeLocalizacoes}`;
  })
  .catch((error) => {
    console.error("Error getting number of locations:", error);
  });

// Função para obter a quantidade de episódios da API
axios
  .get(apiUrl + "episode")
  .then((response) => {
    const quantidadeEpisodios = response.data.info.count;
    const nep = document.getElementById("nep");
    nep.innerHTML = `${quantidadeEpisodios}`;
  })
  .catch((error) => {
    console.error("Error getting number of episodes:", error);
  });

// Função para buscar o nome do último episódio a partir de sua URL
async function buscarNomeUltimoEpisodio(urlEpisodio) {
  try {
    const response = await axios.get(urlEpisodio);
    const ultimoEpisódio = response.data;
    return ultimoEpisódio.name;
  } catch (error) {
    console.error("Error getting last episode details:", error);
    return "Error getting episode details";
  }
}

// Função para mostrar os detalhes de um personagem
async function mostrarPersonagem(personagem) {
  try {
    // Busca o nome do último episódio
    const ultimoEpisodioName = await buscarNomeUltimoEpisodio(
      personagem.episode[personagem.episode.length - 1]
    );

    // Define o estado do personagem com base no status
    let estadoPersonagem = "";
    switch (personagem.status) {
      case "Alive":
        estadoPersonagem = "background-color: #00FF00"; // Verde
        break;
      case "Dead":
        estadoPersonagem = "background-color: #FF0000"; // Vermelho
        break;
      default:
        estadoPersonagem = "background-color: #AAAAAA"; // Cinza
    }

    // Monta o HTML com os detalhes do personagem
    const resultado = document.getElementById("resultado");
    resultado.innerHTML = `
      <div class="container">
        <div class="row" style="justify-content: center;">
          <div class="col-md-6 offset-md-3 m-0">
            <div class="personagem" id="personagem-${personagem.id}">
              <img class="personagem-imagem img-fluid" style="max-width: 100%; max-height: 200px; border-radius: 4%;" src="${personagem.image}" alt="${personagem.name}">
              <div class="personagem-dados">
                <h2>${personagem.name}</h2>
                <div class="status">
                  <div class="exibirStatus" style="${estadoPersonagem}"></div>
                  <p>${personagem.status} - ${personagem.species}</p>
                </div>
                <p><span>Last Known Location:</span><br>${personagem.location.name}</p>
                <p><span>Last Seen:</span><br>${ultimoEpisodioName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Adiciona um evento de clique para exibir os detalhes do personagem em um modal
    const personagemDiv = document.getElementById(`personagem-${personagem.id}`);
    personagemDiv.addEventListener("click", () => {
      mostrarPersonagemModal(personagem);
    });

    // Limpa o campo de busca
    campoBusca.innerHTML = "";
  } catch (error) {
    console.error("Error showing character:", error);
    resultado.innerHTML = "An error occurred while displaying the character.";
  }
}

// Função para buscar um personagem pelo nome
function buscarPersonagem(nome) {
  axios
    .get(apiUrl + "character", {
      params: { name: nome },
    })
    .then((response) => {
      const personagens = response.data.results;

      if (personagens.length > 0) {
        mostrarPersonagem(personagens[0]);
      } else {
        resultado.innerHTML = "Character not found.";
      }

      exibirOpcoesBusca(personagens);
    })
    .catch((error) => {
      console.error("Error fetching character:", error);
      resultado.innerHTML = "An error occurred while fetching the character.";
    });
}

// Função para exibir opções de busca com base nos personagens encontrados
function exibirOpcoesBusca(personagens) {
  opcoesBusca.innerHTML = "";
  personagens.forEach((personagem) => {
    const opcao = document.createElement("div");
    opcao.textContent = personagem.name;
    opcao.classList.add("opcao-busca");
    opcao.addEventListener("click", () => {
      campoBusca.value = personagem.name;
      buscarPersonagem(personagem.name);
      opcoesBusca.innerHTML = "";
    });
    opcoesBusca.appendChild(opcao);
  });
}

// Listener para monitorar o input do campo de busca
campoBusca.addEventListener("input", () => {
  opcoesBusca.style.display = "block";
  resultado.style.display = "none";
  const nomePersonagem = campoBusca.value.trim();
  if (!nomePersonagem) {
    opcoesBusca.innerHTML = "";
    resultado.innerHTML = "";
  } else {
    opcoesBusca.innerHTML = "";
    buscarPersonagem(nomePersonagem);
  }
});

// Listener para exibir os detalhes do personagem ao clicar nas opções de busca
opcoesBusca.addEventListener("click", () => {
  opcoesBusca.style.display = "none";
  resultado.style.display = "block";
  mostrarPersonagem();
});

// Função para criar um elemento HTML representando um personagem
function criarElementoPersonagem(personagem, ultimoEpisodioName) {
  const personagemDiv = document.createElement("div");
  const textoDiv = document.createElement("div");
  const imagemDiv = document.createElement("div");

  personagemDiv.id = `personagem-${personagem.id}`;

  let estadoPersonagem = "";
  switch (personagem.status) {
    case "Alive":
      estadoPersonagem = "background-color: #00FF00"; // Verde
      break;
    case "Dead":
      estadoPersonagem = "background-color: #FF0000"; // Vermelho
      break;
    default:
      estadoPersonagem = "background-color: #AAAAAA"; // Cinza
  }

  personagemDiv.classList.add("personagem");
  textoDiv.classList.add("personagem-dados");
  imagemDiv.classList.add("personagem-imagem");

  textoDiv.innerHTML = `
    <h2>${personagem.name}</h2>
    <div class="status">
      <div class="exibirStatus" style="${estadoPersonagem}"></div>
      <p>${personagem.status} - ${personagem.species}</p>
    </div>
    <p><span>Last Known Location: </span><br>${personagem.location.name}</p>
    <p><span>Last Seen: </span><br>${ultimoEpisodioName}</p>
  `;
  imagemDiv.innerHTML = `<img src="${personagem.image}" alt="${personagem.name}" class="img-fluid" style="max-width: 100%; max-height: 200px; border-radius: 4%;">`;

  personagemDiv.innerHTML += imagemDiv.innerHTML;
  personagemDiv.appendChild(textoDiv);

  personagemDiv.addEventListener("click", () => {
    mostrarPersonagemModal(personagem);
  });

  return personagemDiv;
}

// Função para mostrar os detalhes do personagem em um modal
function mostrarPersonagemModal(characterDetails) {
  const modalTitle = document.getElementById("personagemModalLabel");
  const modalBody = document.getElementById("personagemModalBody");

  // Monta a lista de episódios
  const episodesList = characterDetails.episode
    .map((episodeUrl) => {
      const episodeNumber = episodeUrl.split("/").slice(-1)[0];
      return `Episódio ${episodeNumber}`;
    })
    .join(", ");

  // Obtém o número do último episódio
  const lastEpisodeUrl = characterDetails.episode[characterDetails.episode.length - 1];
  const lastEpisodeNumber = lastEpisodeUrl.split('/').pop();

  // Define o título e o conteúdo do modal
  modalTitle.textContent = characterDetails.name;
  modalBody.innerHTML = `
    <img src="${characterDetails.image}" alt="${characterDetails.name}" class="modal-img">
    <div class="modal-info">
      <p><b>Status: </b>${characterDetails.status}</p>
      <p><b>Specie: </b>${characterDetails.species}</p>
      <p><b>Last Known Location: </b>${characterDetails.location.name}</p>
      <p><b>Last Seen: </b>Episode ${lastEpisodeNumber}</p>
      <p><b>Gender: </b>${characterDetails.gender}</p>
      <p><b>Origin: </b>${characterDetails.origin.name}</p>
      <p><b>Seen: </b>${episodesList}</p>
    </div>
  `;

  // Exibe o modal
  const personagemModal = new bootstrap.Modal(document.getElementById("personagemModal"));
  personagemModal.show();
}

// Função para buscar personagens paginados
async function buscarPersonagensPaginados(pageNumber) {
  try {
    const pageSize = 20;
    const response = await axios.get(
      `https://rickandmortyapi.com/api/character/?page=${pageNumber}`
    );
    const data = response.data;
    return {
      personagens: data.results,
      info: {
        currentPage: data.info.page,
        totalPages: Math.ceil(data.info.count / pageSize),
      },
    };
  } catch (error) {
    console.error("Error when fetching paginated characters:", error);
    return {
      personagens: [],
      info: {
        currentPage: 1,
        totalPages: 1,
      },
    };
  }
}

// Função para carregar os personagens na página
async function carregarPersonagens(currentPage) {
  try {
    const { personagens, info } = await buscarPersonagensPaginados(currentPage);

    personagens.forEach(async (personagem) => {
      const ultimoEpisodioName = await buscarNomeUltimoEpisodio(
        personagem.episode[personagem.episode.length - 1]
      );
      const personagemDiv = criarElementoPersonagem(
        personagem,
        ultimoEpisodioName
      );

      const colDiv = document.createElement("div");
      colDiv.classList.add("col-md-6", "col-12");
      colDiv.appendChild(personagemDiv);

      homeDiv.appendChild(colDiv);
    });
  } catch (error) {
    console.error("Erro ao carregar personagens:", error);
  }
}

// Função para carregar a página anterior
function carregarPaginaAnterior() {
  if (currentPage > 1) {
    currentPage--;
    numeroPa.innerHTML = `${currentPage}`;
    homeDiv.innerHTML = "";
    carregarPersonagens(currentPage);
  }
}

// Função para carregar a próxima página
function carregarProximaPagina() {
  currentPage++;
  numeroPa.innerHTML = `${currentPage}`;
  homeDiv.innerHTML = "";
  carregarPersonagens(currentPage);
}

// Listeners para os botões de paginação
document
  .getElementById("pagina-anterior")
  .addEventListener("click", carregarPaginaAnterior);
document
  .getElementById("proxima-pagina")
  .addEventListener("click", carregarProximaPagina);

// Inicializa a página carregando os personagens da página atual
carregarPersonagens(currentPage);

// Função para alternar o tema escuro e claro
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-theme");
});

// Define o tema com base no valor armazenado em localStorage
window.addEventListener("load", () => {
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-theme");
  }
});

// Função para rolar a página para o topo ao clicar no logotipo
document.addEventListener('DOMContentLoaded', function () {
  const logoImage = document.getElementById('logo');

  logoImage.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
