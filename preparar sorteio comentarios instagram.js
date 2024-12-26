// DIV com scroll
const commentsContainer = document.querySelector(
  ".x5yr21d.xw2csxc.x1odjw0f.x1n2onr6"
);

// Função para rolar até o final do container de comentários
const scrollToBottom = () => {
  commentsContainer.scrollTop = commentsContainer.scrollHeight;
};

// Função para verificar se o scroll atingiu o final
const isScrollAtBottom = () => {
  return (
    commentsContainer.scrollTop >=
    commentsContainer.scrollHeight - commentsContainer.offsetHeight
  );
};

// Função para verificar se tem o carregando
const hasLoading = () => {
  return (
    document.querySelector(".xemfg65.xa4qsjk.x1ka1v4i.xbv57ra") != undefined
  );
};

// Função para aguardar um determinado tempo
const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

let lLoadingComments = false;

// Função para carregar mais conteúdo
const loadMoreContent = async () => {
  lLoadingComments = true;
  while (hasLoading()) {
    while (!isScrollAtBottom()) {
      // Se o scroll não estiver no final, continue rolando até o final
      scrollToBottom();
      // Aguarde um curto período de tempo antes de verificar novamente
      await sleep(500); // Aguarde 0.5 segundos
    }
    await sleep(500); // Aguarde 0.5 segundos
  }
  lLoadingComments = false;
  alert(
    "Fim do conteúdo alcançado. Verifique se não há mais comentários, caso exista clique para carregar mais comentários."
  );
};

// Função para criar o arquivo TXT e iniciar o download
const downloadTextFile = (content, filename) => {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(content)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

const getUserComents = () => {
  return document.querySelectorAll(
    "div > div > div > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(1) > span > span > div > a"
  );
};

const getMentions = () => {
  return document.querySelectorAll(
    "div > div > div > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(2) > span > a"
  ); // Cada a aqui é um @
};

// Função para criar Hashmap de usuario e Lista de pessoas marcadas:
const generateCommentsMap = () => {
  // Seletor para encontrar os elementos que contêm o nome do usuário que comentou
  const userElements = getUserComents();

  // Seletor para encontrar os elementos que contêm o nome do usuário marcado no comentário
  const mentionElements = getMentions();

  const commentsMap = {};
  // Itera sobre os elementos para extrair os usuários e seus respectivos comentários
  userElements.forEach((userElement, index) => {
    const user = userElement.textContent.trim();
    const mentionElement = mentionElements[index];

    // Se o usuário já estiver no mapa, adicionamos o usuário mencionado apenas se ele ainda não estiver na lista de menções
    if (mentionElement) {
      if (user in commentsMap) {
        const mention = mentionElement.textContent.trim();
        if (!commentsMap[user].includes(mention)) {
          commentsMap[user].push(mention);
        }
      } else {
        const mention = mentionElement.textContent.trim();
        commentsMap[user] = [mention];
      }
    }
  });
  return commentsMap;
};

// Função para criar o Texto com usuarios e menções

const generateTextWithMentions = () => {
  // PEGAR COMENTÁRIOS

  const commentsMap = generateCommentsMap();

  const minMentions = 1;
  let content = "";
  let start = 1;
  let lIndex = 1;
  Object.entries(commentsMap).forEach(([user, mentions]) => {
    if (mentions.length > minMentions) {
      const totalNumbers = Math.ceil(mentions.length / minMentions); // Calcula o número total de números
      const end = start + totalNumbers - 1; // Calcula o final do intervalo
      content += `${lIndex}. ${user} marcou ${
        mentions.length
      }, isso lhe dá ${totalNumbers} número${
        totalNumbers > 1 ? "s" : ""
      }: De ${start} até ${end}\n`;
      start = end + 1;
      lIndex++;
    }
  });
  return content;
};

const generateUserCount = () => {
  const userElements = getUserComents();

  const commentsMap = {};
  // Itera sobre os elementos para extrair os usuários e seus respectivos comentários
  userElements.forEach((userElement, index) => {
    const user = userElement.textContent.trim();

    // Se o usuário já estiver no mapa, adicionamos o usuário mencionado apenas se ele ainda não estiver na lista de menções
    if (user in commentsMap) {
      commentsMap[user] = commentsMap[user] + 1;
    } else {
      commentsMap[user] = 1;
    }
  });
  return commentsMap;
};

// Função para criar o Texto só com usuarios

const generateTextWithUsers = () => {
  const commentsMap = generateUserCount();

  let content = "";
  let start = 1;
  let lIndex = 1;
  Object.entries(commentsMap).forEach(([user, count]) => {
    const end = start + count - 1; // Calcula o final do intervalo
    content += `${lIndex}. ${user} comentou ${count} vezes, isso lhe dá ${count} número${
      count > 1 ? "s" : ""
    }: De ${start} até ${end}\n`;
    start = end + 1;
    lIndex++;
  });
  return content;
};

function downloadFile(prFunction) {
  // DOWNLOAD DO ARQUIVO

  // Gere o conteúdo do arquivo TXT
  const textContent = prFunction();

  // Nome do arquivo TXT
  const filename = "sorteioUsuarios.txt";

  // Inicie o download do arquivo TXT
  downloadTextFile(textContent, filename);
}

function main() {
  const lDownloadButtonMentions = document.createElement("button");
  const lDownloadButtonUsers = document.createElement("button");
  const lLoadButton = document.createElement("button");

  // Cria o botão de download
  lLoadButton.textContent = "Carregar comentários";
  lLoadButton.style.position = "fixed";
  lLoadButton.style.bottom = "80px";
  lLoadButton.style.right = "20px";
  lLoadButton.style.zIndex = "9999";

  lLoadButton.addEventListener("click", () => {
    loadMoreContent(); // Inicie o processo de carregamento de mais conteúdo
  });

  // Cria o botão de download por menções
  lDownloadButtonMentions.textContent = "Download arquivo de menções";
  lDownloadButtonMentions.style.position = "fixed";
  lDownloadButtonMentions.style.bottom = "50px";
  lDownloadButtonMentions.style.right = "20px";
  lDownloadButtonMentions.style.zIndex = "9999";

  lDownloadButtonMentions.addEventListener("click", () => {
    if (lLoadingComments) {
      alert("Ainda estamos carregando o conteúdo, por favor espere.");
    } else downloadFile(generateTextWithMentions);
  });

  // Cria o botão de download por menções
  lDownloadButtonUsers.textContent = "Download arquivo de contador de usuários";
  lDownloadButtonUsers.style.position = "fixed";
  lDownloadButtonUsers.style.bottom = "20px";
  lDownloadButtonUsers.style.right = "20px";
  lDownloadButtonUsers.style.zIndex = "9999";

  lDownloadButtonUsers.addEventListener("click", () => {
    if (lLoadingComments) {
      alert("Ainda estamos carregando o conteúdo, por favor espere.");
    } else downloadFile(generateTextWithUsers);
  });

  document.body.appendChild(lLoadButton);
  document.body.appendChild(lDownloadButtonMentions);
  document.body.appendChild(lDownloadButtonUsers);
}

main();
