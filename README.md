## Desafio de Scraping Amazon com Node.js
Para este desafio, desenvolvi uma aplicação Node.js que realiza  scraping da página de resultados da Amazon usando  palavra-chave como entrada. 

O objetivo é a extração das informações; titulo, avaliação e imagem de qualquer produtos e exibir em uma página a parte, informações vindas da API.

### Tecnologias  Usadas
 - Express: servidor HTTP (endpoint)

- Axios: requisições HTTP.

- Cheerio parecido com JSDOM porem mais eficaz, lidar com HTML e extração.

- Cors: requisições cross-origin.

- TailwindCSS ( @tailwindcss/cli)  estilização simples para a interface web.

- Http-server: Iniciar aplicar local 

## Funcionalidades Implementadas
Endpoint

`http://localhost:3000/api/scrape?keyword=bombom`

As informações tratadas retornam 3 primeiros resultados:


# Codificação API

Nesse desafio foi implementada  função composta para organiza o processo em etapas menores.
- Primeira ação, busca qualquer conteúdo na página amazon em seguida lê o conteúdo
- Filtra as informações necessárias;  nome, avaliação e imagem.

O código auto explicavel e simples de atualizar , cada parte faz uma tarefa e tem responsabilidade especifica.


## Instrução de uso

Para rodar a aplicação e instalar as dependências.

`npm install`

rodar a aplicação:
`npm start`

# Codificação comsumo (html)
-  um codigo sem padronização apenas consumo da api.
- acessar aplicar web...
- http://127.0.0.1:8080



## Código:


```

// Scraping no html da Amazon pelo conteudo especificnado ( axios)
async function buscarHtmlPalavraChave(palavraChave) { ... }

// Extrai o título .
function extrairTitulo(container) { ... }

// Extrais a avaliação.
function extrairAvaliacao($, container) { ... }

// Busca a url da imagem.
function extrairUrlImagem($, container) { ... }

// Extrai  apenas  3 itens no html em colaboração com  as funções de extração.
function extrairProdutosDoHtml(html) { ... }

// Retorna lista.
async function buscarProdutos(palavraChave) { ... }

// Rota da API.
app.get('/api/scrape', async (req, res) => { ... });

```

