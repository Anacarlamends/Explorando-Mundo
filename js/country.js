// Função para fazer a requisição dos dados do país (princípio da responsabilidade única)
async function getCountry(url) {
  try {
      const response = await fetch(url);
      const country = await response.json();

      // Como a nova API retorna um array, pegamos o primeiro item
      return country[0];
  } catch (error) {
      console.log(error);
  }
}

// Função para lidar com os elementos de informação do país (princípio da responsabilidade única)
function countryInfoElementsHandler(country) {
  let topLevelDomain = [];
  let currencies = [];
  let languages = [];
  let borders = [];

  country.tld.map((element) => {
      topLevelDomain += `<span class="inline-block">${element}</span>`;
  });

  // Moedas agora são objetos
  Object.values(country.currencies || {}).map((currency) => {
      currencies += `<span class="inline-block">${currency.name}</span>`;
  });

  // Idiomas também são objetos
  Object.values(country.languages || {}).map((language) => {
      languages += `<span class="inline-block">${language}</span>`;
  });

  // Verifica se o país tem fronteiras
  if (country?.borders?.length) {
      country.borders.map((border) => {
          borders += ` <button class="btn">${border}</button> `;
      });
  } else {
      borders = '<p>Este país não tem fronteiras!</p>';
  }

  return {
      topLevelDomain,
      currencies,
      languages,
      borders,
  };
}

// Função responsável por renderizar os dados do país no documento
function renderCountryDocument(country) {
  const { topLevelDomain, currencies, languages, borders } = countryInfoElementsHandler(country);

  // Dados da esquerda, para serem renderizados dinamicamente
  const leftData = [
      { label: 'Nome Nativo', value: Object.values(country.name.nativeName)[0].common },
      { label: 'População', value: handlePopulationNumber(country.population) },
      { label: 'Região', value: country.region },
      { label: 'Sub-região', value: country.subregion },
      { label: 'Capital', value: country.capital },
  ];

  // Dados da direita, para serem renderizados dinamicamente
  const rightData = [
      { label: 'Domínio de internet (código TLD)', value: topLevelDomain },
      { label: 'Moedas', value: currencies },
      { label: 'Idiomas', value: languages },
  ];

  // Renderizando o HTML dinamicamente com os dados do país
  document.querySelector('.flex-container').innerHTML = `
    <img src="${country.flags.svg}" alt="country Image">
    <div class="country-text">
      <h3>${country.name.common}</h3>
      <div class="info">
        <div class="left">
          ${leftData
              .map((detail) => `<p class="details"><span class="strong">${detail.label}: </span> ${detail.value}</p>`)
              .join('')}
        </div>
        <div class="right">
          ${rightData
              .map((detail) => `<p class="details"><span class="strong">${detail.label}: </span> ${detail.value}</p>`)
              .join('')}
        </div>
      </div>
      <div class="border-container">
        <h5>Países fronteiriços:</h5>
        <div class="borders" id="borders">
          ${borders}
        </div>
      </div>
    </div>`;
}

// Função que lida com a lógica principal para buscar e renderizar os dados do país
async function countryHandler(url) {
  const country = await getCountry(url);
  renderCountryDocument(country);
  getClickedBorder();
}

// Função para lidar com cliques nos botões de fronteira
function getClickedBorder() {
  const button = document.querySelectorAll('button');
  const divContainer = document.querySelector('.flex-container');
  const baseAlphaUrl = 'https://restcountries.com/v3.1/alpha';

  button.forEach((element) => {
      element.addEventListener('click', () => {
          divContainer.innerHTML = '';
          countryHandler(`${baseAlphaUrl}/${element.innerText}`);
      });
  });
}

// Função para formatar o número da população
function handlePopulationNumber(population) {
  return population.toLocaleString('en-US');
}

// Função IIFE (Immediately Invoked Function Expression) para inicializar a página
(function () {
  const baseUrl = 'https://restcountries.com/v3.1/name';
  const urlSearchParams = new URLSearchParams(window.location.search);
  const countryName = urlSearchParams.get('name');

  countryHandler(`${baseUrl}/${countryName}?fullText=true`);
})();
