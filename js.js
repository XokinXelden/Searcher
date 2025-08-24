// приложение
// представляет собой список репозиториев
//в итоге должно быть 2 элемента
// 1 - поле ввода с автокомплитом
// 2 - списка репозиториев

//Автокомплит - запрашивает данные о репозиториях через API Github каждый раз
// при обновлении значения поля ввода и выводить их в выпадающем меню прямо
//под собой. там должно быть перечислено 5 названий первых репозиториев, полученных
// с помощью запроса по ключевым словам
// При клике на любой из репозиториев - соответствующий репозиторий должен быть
//  представлен в списке добавленных репозиториев ниже

// Список репозиториев - должно быть НАЗВАНИЕ, АВТОР, КОЛ-ВО ЗВЁЗД на этом репозитории.
// кроме того должна быть кнопка удаления

// Примечание: если поле ввода пустое - поле автокомплита не отображается
// При вводе в поле - запрос не должен отправляться сразу, для избежания большого - кол ва запросов на сервер
// (думаю можно юзнуть ту штуку с блокировкой запроса и обновления таймера при повторном запросе)
// После клика (добавления) репозитория - поле ввода должно очищаться

const searchForm = document.querySelector(".search");
const repositoryVariants = document.querySelector(".repository_variants");
const favorite = document.querySelector(".container_favorite");

function enterBlock(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    console.log("yapy");
  }
}
let timer;
//приём инфы и преобразование её в JSON
async function searcher(result) {
  if (result === "") return;
  const searcher = await fetch(
    `https://api.github.com/search/repositories?q=${result}&page=1&per_page=5`
  );
  const promFromText = await searcher.text();
  const fromJSON = JSON.parse(promFromText);
  return fromJSON;
}

//Функция, которая заберёт значение из input
const getInputValue = () => document.querySelector(".search_place").value;

//Функция-фильтр добавления фоловов
const addFollow = (card) => {
  const allFavorites = favorite.querySelectorAll("h4");
  const allFavoritesArr = Object.values(allFavorites);
  let copy = false;
  allFavoritesArr.map((elem) => {
    if (
      elem.textContent.slice(16) ===
      card.querySelector(".name").textContent.slice(16)
    )
      copy = true;
  });
  if (!copy) {
    const favoriteCard = document.createElement("div");
    favoriteCard.classList.add("favorite_card");
    const deleteFavorite = document.createElement("button");
    deleteFavorite.classList.add("delete_favorite");
    favoriteCard.appendChild(card.querySelector(".name"));
    favoriteCard.appendChild(card.querySelector(".author"));
    favoriteCard.appendChild(card.querySelector(".stars"));
    deleteFavorite.addEventListener("click", () => {
      favoriteCard.replaceWith("");
    });
    favoriteCard.appendChild(deleteFavorite);
    favorite.appendChild(favoriteCard);
  }
};

//функция создающая карточки в ответ на поиск
const resultSearch = async (data) => {
  if (!!document.querySelector(".card")) {
    document.querySelector(".repository_variants").innerHTML = "";
  }
  const dataGit = await data;
  if ((await dataGit) === undefined) return;
  const dataItems = await dataGit["items"];

  let count = 0;
  await dataItems.forEach(async (repository) => {
    count++;
    const cardRepository = document.createElement("div");
    cardRepository.classList.add("card");
    const nameRepository = document.createElement("h4");
    nameRepository.classList.add("name");
    nameRepository.textContent = `Repository name: ${repository["name"]}`;
    const authorRepository = document.createElement("p");
    authorRepository.classList.add("author");
    authorRepository.textContent = `Author: ${repository["owner"]["login"]}`;
    const starsRepository = document.createElement("p");
    starsRepository.classList.add("stars");
    starsRepository.textContent = `Followers: ${repository["stargazers_count"]}`;
    cardRepository.appendChild(nameRepository);
    cardRepository.appendChild(authorRepository);
    cardRepository.appendChild(starsRepository);
    cardRepository.addEventListener("click", (e) => {
      addFollow(cardRepository);
      document.querySelector(".search_place").value = "";
      document.querySelector(".repository_variants").innerHTML = "";
    });

    repositoryVariants.appendChild(cardRepository);
  });
};
//настройка поля поиска
searchForm.addEventListener("input", (e) => {
  clearTimeout(timer);
  async function dontTach() {
    return (timer = setTimeout(async () => {
      console.log(await resultSearch(searcher(getInputValue())));
    }, 1000));
  }
  return dontTach();
});
