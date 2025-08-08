const container = document.querySelector('.max-w-4xl, .max-w-6xl'); 
const divResultados = document.getElementById('results');
const campoPesquisa = document.querySelector('input[type="search"]');

campoPesquisa.addEventListener('input', async () => {
  const palavraChave = campoPesquisa.value.trim();

  if (palavraChave.length === 0) {
    divResultados.innerHTML = '';
    container.classList.replace('max-w-6xl', 'max-w-4xl'); 
    return;
  }

  try {
    const resposta = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(palavraChave)}`);
    if (!resposta.ok) {
      throw new Error('Erro na requisição');
    }

    const produtos = await resposta.json();
    container.classList.replace('max-w-4xl', 'max-w-6xl'); 

    divResultados.innerHTML = '';

    if (produtos.length === 0) {
      divResultados.innerHTML = '<p class="text-yellow-300">Nenhum produto encontrado.</p>';
      return;
    }

    produtos.forEach(produto => {
      const urlImagemValida = (typeof produto.urlImagem === 'string' && produto.urlImagem.trim() !== '');
      
      const card = document.createElement('div');
      card.className = 'bg-gray-800 bg-opacity-80 rounded-md p-4 flex flex-col items-center text-center text-gray-200 shadow-md';

      card.innerHTML = `
        <img src="${urlImagemValida ? encodeURI(produto.urlImagem) : 'https://via.placeholder.com/150'}" 
             alt="${produto.titulo}" 
             class="w-32 h-32 object-contain mb-4" />
        <h3 class="font-semibold mb-2">${produto.titulo}</h3>
        <p class="text-yellow-400 text-sm">${produto.avaliacao || 'Sem avaliação'}</p>
      `;

      divResultados.appendChild(card);
    });

  } catch (erro) {
    console.error('Erro na busca:', erro);
    divResultados.innerHTML = '<p class="text-red-600">Erro ao carregar os produtos.</p>';
    container.classList.replace('max-w-6xl', 'max-w-4xl');
  }
});

