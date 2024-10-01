const url = 'https://restcountries.com/v3.1/all';

const pageCountries = document.querySelector('.container');

// Pegar todos os países
async function getAllCountries() {
  const response = await fetch(url);
  const allCountries = await response.json();

  console.log(allCountries);

  allCountries.forEach((country) => {
    // Criando as tags HTML que vão receber os países
    const div = document.createElement('div');
    const imgDiv = document.createElement('div');
    const flag = document.createElement('img');
    const divCountryDetails = document.createElement('div');
    const title = document.createElement('h2');
    const population = document.createElement('p');
    const spanPopulation = document.createElement('span');
    const region = document.createElement('p');
    const spanRegion = document.createElement('span');
    const subregion = document.createElement('p');
    const spanSubregion = document.createElement('span');
    const capital = document.createElement('p');
    const spanCapital = document.createElement('span');

    flag.src = country.flags.svg;
    flag.setAttribute('alt', `Bandeira do país ${country.name.common}`);
    title.innerText = country.name.common;
    title.classList.add('title');
    population.innerText = 'População: ';
    spanPopulation.innerText = handlePopulationNumber(country.population);
    region.innerText = 'Região: ';
    spanRegion.innerText = country.region;
    spanRegion.classList.add('region');
    
    subregion.innerText = 'Sub-região: ';
    spanSubregion.innerText = country.subregion;
    spanSubregion.classList.add('subregion');
    
    capital.innerText = 'Capital: ';
    spanCapital.innerText = country.capital ? country.capital[0] : 'N/A'; // Verificar se há capital

    div.classList.add('country-container');
    imgDiv.classList.add('image-container');
    divCountryDetails.classList.add('country-details');

    imgDiv.appendChild(flag);
    divCountryDetails.appendChild(title);
    population.appendChild(spanPopulation);
    divCountryDetails.appendChild(population);
    region.appendChild(spanRegion);
    divCountryDetails.appendChild(region);
    subregion.appendChild(spanSubregion);
    divCountryDetails.appendChild(subregion);
    capital.appendChild(spanCapital);
    divCountryDetails.appendChild(capital);
    div.appendChild(imgDiv);
    div.appendChild(divCountryDetails);
    pageCountries.appendChild(div);
  });

  // Chamando função para pegar país quando for clicado
  getClickedCountry();
}

// Capturando texto enquanto ele é digitado no input
const searchInput = document.querySelector('#search-input');
if (searchInput) {
  searchInput.addEventListener('keyup', () => {
    let text = searchInput.value.toUpperCase();
    valueCompare(text);
  });
}

// Capturando região selecionada no select
const filterByRegion = document.getElementById('select-region'); // Corrigido para 'select-region'
filterByRegion.addEventListener('change', () => {
  const regionValue = filterByRegion.value;
  compareRegion(regionValue);
});

// Capturando sub-região selecionada no select
const filterBySubregion = document.getElementById('select-subregion'); // Adicionando seletor de sub-região
filterBySubregion.addEventListener('change', () => {
  const subregionValue = filterBySubregion.value;
  compareSubregion(subregionValue); // Função de filtragem por sub-região
});

// Capturando filtro de população
const filterByPopulation = document.getElementById('select-population');
filterByPopulation.addEventListener('change', () => {
  const populationValue = filterByPopulation.value;
  comparePopulation(populationValue); // Função de filtragem por população
});

// Comparando input com todos os países pegos da API e renderizados na página inicial
function valueCompare(name) {
  const countryTitle = pageCountries.getElementsByTagName('h2');
  const countryContainer = document.querySelectorAll('.country-container');

  // Fazendo a comparação a cada letra digitada no input
  for (let i = 0; i < countryTitle.length; i++) { // Corrigido para 'i < countryTitle.length'
    const match = countryContainer[i]?.getElementsByTagName('h2')[0];

    if (match) {
      let countryName = match.textContent || match.innerHTML;

      if (countryName.toUpperCase().indexOf(name) > -1) {
        countryContainer[i].style.display = '';
      } else {
        countryContainer[i].style.display = 'none';
      }
    }
  }
}

// Comparando filtro por região com todos os países pegos da API e renderizados na página inicial
function compareRegion(region) {
  const countryRegion = pageCountries.querySelectorAll('.region');
  const countryContainer = document.querySelectorAll('.country-container');

  if (!region) {
    countryContainer.forEach((container) => {
      container.style.display = '';
    });
  } else {
    countryContainer.forEach((container, i) => {
      const match = countryRegion[i]?.textContent || '';

      if (match === region) {
        container.style.display = '';
      } else {
        container.style.display = 'none';
      }
    });
  }
}

// Comparando filtro por sub-região com todos os países pegos da API
function compareSubregion(subregion) {
  const countrySubregion = pageCountries.querySelectorAll('.subregion');
  const countryContainer = document.querySelectorAll('.country-container');

  if (!subregion) {
    countryContainer.forEach((container) => {
      container.style.display = '';
    });
  } else {
    countryContainer.forEach((container, i) => {
      const match = countrySubregion[i]?.textContent || '';

      if (match === subregion) {
        container.style.display = '';
      } else {
        container.style.display = 'none';
      }
    });
  }
}

// Comparando filtro por população com todos os países pegos da API
function comparePopulation(population) {
  const countryContainer = document.querySelectorAll('.country-container');

  countryContainer.forEach((container) => {
    // Corrigir para acessar a população diretamente
    const countryPopulation = parseInt(container.querySelector('p span').innerText.replace(/\./g, ''), 10);

    let display = false;
    switch (population) {
      case '<1M':
        display = countryPopulation < 1000000;
        break;
      case '1M-10M':
        display = countryPopulation >= 1000000 && countryPopulation <= 10000000;
        break;
      case '10M-100M':
        display = countryPopulation >= 10000000 && countryPopulation <= 100000000;
        break;
      case '>100M':
        display = countryPopulation > 100000000;
        break;
      default:
        display = true;
    }

    container.style.display = display ? '' : 'none';
  });
}

// Linkando a div dos países à página de detalhes
function changePage(name) {
  window.location = `country.html?name=${name}`;
}

// Função que pega o país clicado
function getClickedCountry() {
  const countryContainer = document.querySelectorAll('.country-container');
  countryContainer.forEach((element) => {
    element.addEventListener('click', () => {
      changePage(element.querySelector('.title').innerHTML); // Alterado para buscar o título
    });
  });
}

// Função para tratar formato do valor da população
function handlePopulationNumber(population) {
  return population.toLocaleString('pt-BR'); // Alterado para 'pt-BR' para formatar a população
}

// Executar primeiro a função de pegar todos os países da API
getAllCountries();
