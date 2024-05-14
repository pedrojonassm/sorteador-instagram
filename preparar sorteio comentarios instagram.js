// DIV com scroll
const commentsContainer = document.querySelector(".x5yr21d.xw2csxc.x1odjw0f.x1n2onr6");

// Função para rolar até o final do container de comentários
const scrollToBottom = () => {
    commentsContainer.scrollTop = commentsContainer.scrollHeight;
};

// Função para verificar se o scroll atingiu o final
const isScrollAtBottom = () => {
    return commentsContainer.scrollTop >= (commentsContainer.scrollHeight - commentsContainer.offsetHeight);
};

// Função para aguardar um determinado tempo
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};

let lLoadingComments = false;

// Função para carregar mais conteúdo
const loadMoreContent = async () => {
    lLoadingComments = true;
    while (!isScrollAtBottom()) {
        while (!isScrollAtBottom()) {
            // Se o scroll não estiver no final, continue rolando até o final
            scrollToBottom();
            // Aguarde um curto período de tempo antes de verificar novamente
            await sleep(500); // Aguarde 0.5 segundos
        }

        await sleep(5000); // Espera 3 segundos para garantir
    }
    lLoadingComments = false
    console.log("Fim do conteúdo alcançado. Não há mais conteúdo para carregar.");
};

// Função para criar o arquivo TXT e iniciar o download
const downloadTextFile = (content, filename) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

// Função para criar o conteúdo do arquivo TXT com base no mapa de comentários

const generateTextContent = (commentsMap) => {
    const minMentions = 1;
    let content = '';
    let start = 1;
    Object.entries(commentsMap).forEach(([user, mentions]) => {
        if (mentions.length > minMentions) {
            const totalNumbers = Math.ceil(mentions.length / minMentions); // Calcula o número total de números
            const end = start + totalNumbers - 1; // Calcula o final do intervalo
            content += `${user} marcou ${mentions.length}, isso lhe dá ${totalNumbers} número${totalNumbers > 1 ? 's' : ''}: De ${start} até ${end}\n`;
            start = end + 1;
        }
    });
    return content;
};

function downloadFile() {
    // PEGAR COMENTÁRIOS

    const commentsMap = {};

    // Seletor para encontrar os elementos que contêm o nome do usuário que comentou
    const userElements = document.querySelectorAll("div > div > div > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(1) > span > span > div > a");

    // Seletor para encontrar os elementos que contêm o nome do usuário marcado no comentário
    const mentionElements = document.querySelectorAll("div > div > div > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(2) > span > a"); // Cada a aqui é um @

    // Itera sobre os elementos para extrair os usuários e seus respectivos comentários
    userElements.forEach((userElement, index) => {
        const user = userElement.textContent.trim();
        const mentionElement = mentionElements[index];
        
        // Se o usuário já estiver no mapa, adicionamos o usuário mencionado apenas se ele ainda não estiver na lista de menções
        if (mentionElement){
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
    // DOWNLOAD DO ARQUIVO

    // Gere o conteúdo do arquivo TXT
    const textContent = generateTextContent(commentsMap);

    // Nome do arquivo TXT
    const filename = 'sorteioUsuarios.txt';

    // Inicie o download do arquivo TXT
    downloadTextFile(textContent, filename);
}


function main() {

    const lDownloadButton = document.createElement("button");
    const lLoadButton = document.createElement("button");

    // Cria o botão de download
    lLoadButton.textContent = "Carregar comentários";
    lLoadButton.style.position = "fixed";
    lLoadButton.style.bottom = "50px";
    lLoadButton.style.right = "20px";
    lLoadButton.style.zIndex = "9999";
  
    lLoadButton.addEventListener("click", () => {
        loadMoreContent(); // Inicie o processo de carregamento de mais conteúdo
    });

    // Cria o botão de download
    lDownloadButton.textContent = "Download arquivo";
    lDownloadButton.style.position = "fixed";
    lDownloadButton.style.bottom = "20px";
    lDownloadButton.style.right = "20px";
    lDownloadButton.style.zIndex = "9999";
  
    lDownloadButton.addEventListener("click", () => {
        if (lLoadingComments){
            console.log("Ainda estamos carregando o conteúdo, por favor espere.");
        } else
            downloadFile();
    });

    document.body.appendChild(lLoadButton);
    document.body.appendChild(lDownloadButton);
  }
  
  main();