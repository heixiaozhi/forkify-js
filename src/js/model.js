import { API_URL, RES_PER_PAGE, KEY } from './config';
import { getJson, sendJson } from './helpers';
import { AJAX } from './helpers';
import { async } from 'regenerator-runtime';
// 状态
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

// 加载Recipe
export const loadRecipe = async function (id) {
  try {
    // 必须加await 在异步函数里调用异步函数，默认返回的是一个promise 必须使用await等待值解析
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);

    // 解析数据
    // api中的数据变量格式转换为js格式
    state.recipe = createRecipeObject(data);
    console.log(state.recipe);

    // 当菜单已经存在书签中 给他标记已收藏
    // some 1个为true => true
    if (state.bookmarks.some(book => book.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (error) {
    console.error(`${error}******`);
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    // 根据query查询数据
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    // 从api获取的数据转换为自己所需的数据
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    console.log(state.search.results);
    state.search.page = 1;
  } catch (error) {
    console.error(`${error}******`);
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  // 根据页数返回相应的结果
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  // ing是对象，引用指向原储存地址，因此改变会同时改变
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // 添加书签
  state.bookmarks.push(recipe);

  // 标记当前菜单到书签中
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // 删除书签
  // 找到对应的id 然后再从数组中删除
  const index = state.bookmarks.findIndex(book => book.id === id);
  state.bookmarks.splice(index, 1);

  // 删除当前 recipe 的收藏标记
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clear = function () {
  localStorage.clear('bookmarks');
};
// clear();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3) {
          throw new Error(
            'Wrong ingredient format! Please use the correct format: '
          );
        }
        const [quantity, unit, description] = ingArr;
        // 属性名简写
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    console.log(data, '*****');
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
