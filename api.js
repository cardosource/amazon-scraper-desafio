const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const porta = 3000;

app.use(cors());

// Usando o axios para fazer uma requisição GET com cabeçalhos.
async function buscarHtmlPalavraChave(palavraChave) {
  const url = `https://www.amazon.com.br/s?k=${encodeURIComponent(palavraChave)}`;
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
  };

  const resposta = await axios.get(url, { headers });
  return resposta.data; // retorna o conteúdo html
}

//Usando cheerio extrai o titulo
function extrairTitulo(container) {
  return container.find('h2[aria-label] > span').text().trim();
}

// Busca pela avaliacao com base no texto que contenha "de 5 estrelas".
function extrairAvaliacao($, container) {
  let avaliacao = '';
  container.find('span.a-declarative').each((_, el) => {
    const texto = el.attribs['popover-label'] || el.attribs['popoverlabel'] || $(el).text();
    if (texto && texto.includes('de 5 estrelas')) {
      avaliacao = texto.trim();
      return false; //para o loop
    }
  });
  return avaliacao;
}

// Extrai a url da imagem, pega o primeiro srcset.
function extrairUrlImagem($, container) {
  const imgContainer = container.closest('div.sg-col-inner').find('img.s-image').first();
  if (imgContainer.length === 0) return '';

  const srcset = imgContainer.attr('srcset') || '';
  if (srcset) {
    return srcset.split(',')[0].trim().split(' ')[0];
  }
  return imgContainer.attr('src') || '';
}

// Usa cheerio para carregar e extrair 3 produtos.
// Para cada item, chama as funções de extração de título, avaliação e imagem e cria um objeto.
function extrairProdutosDoHtml(html) {
  const $ = cheerio.load(html);
  const produtos = [];

  $('div.a-section.a-spacing-small.puis-padding-left-small.puis-padding-right-small').each((_, el) => {
    if (produtos.length >= 3) return false; //<------------------------3 itens

    const container = $(el);
    const titulo = extrairTitulo(container);

    if (!titulo) return; // ignora os sem títulos

    const avaliacao = extrairAvaliacao($, container);
    const urlImagem = extrairUrlImagem($, container);

    produtos.push({ titulo, avaliacao, urlImagem });
  });

  return produtos;
}

//Core, parte principal coordena extração e a pesquisa
// invoca a função buscarHtmlPalavraChave para pegar o html concluido usa o função extrairProdutosDoHtml 
// para pegar os detalhes.
async function buscarProdutos(palavraChave) {
  try {
    const html = await buscarHtmlPalavraChave(palavraChave);
    return extrairProdutosDoHtml(html);
  } catch (erro) {
    throw new Error('Erro ao buscar produtos: ' + erro.message);
  }
}



// chama buscarProdutos e retorna um JSON
app.get('/api/scrape', async (req, res) => {
  const palavraChave = req.query.keyword;
  if (!palavraChave) {
    return res.status(400).json({ erro: 'Parâmetro "keyword" é obrigatório' });
  }

  try {
    const produtos = await buscarProdutos(palavraChave);
    res.json(produtos);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

app.listen(porta, () => {
  console.log(`Servidor rodando:  http://localhost:${porta}`);
});

