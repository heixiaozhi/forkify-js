import * as model from './model.js';
import searchView from './views/searchView.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import { async } from 'regenerator-runtime';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

//parcel 热加载
// if (model.hot) {
//   model.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipes = async function () {
  try {
    // window.location.hash 是 JavaScript 中的一个属性，用于获取或设置 URL 的片段部分（即 "#" 后面的部分）。该属性返回一个字符串，包含 "#" 后面的全部内容（包括 "#"），如果没有 "#"，则返回空字符串。
    // window.location.hash 是只读的，但你可以设置它的值，从而改变当前 URL 的片段部分。当你改变 window.location.hash 的值时，浏览器不会重新加载页面，但会触发 hashchange 事件。
    // 获取当前导航栏的hash值
    const id = window.location.hash.slice(1);
    //console.log(id);
    if (!id) return;
    recipeView.renderSpinner();

    // 0 更新 recipeView 和 选中的 search recipe
    resultsView.update(model.getSearchResultsPage());

    // 1 更新收藏视图
    bookmarksView.update(model.state.bookmarks);

    // 2 Loading recipe
    // async异步函数返回一个promise 因此要使用await
    await model.loadRecipe(id);

    // 3 Redering recipe
    recipeView.render(model.state.recipe);
    //相当于 new RecipeView().render()
  } catch (error) {
    console.log(error);
    recipeView.renderErrorMessage();
  }
};

const controlSearchResults = async function () {
  try {
    // 加载
    resultsView.renderSpinner();

    // 得到搜索词
    const query = searchView.getQuery();
    // 假如搜索结果为空未做任何东西
    //console.log(query);
    if (!query) return;

    // 加载搜索结果
    await model.loadSearchResults(query);

    // 渲染搜索结果
    //console.log(model.state.search);
    resultsView.render(model.getSearchResultsPage());

    // 渲染分页按钮
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (goToPage) {
  // 渲染新的搜索结果
  resultsView.render(model.getSearchResultsPage(goToPage));
  // 渲染新的分页按钮
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // 更新菜谱servings
  model.updateServings(newServings);
  // 更新recipe view
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 添加到书签
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 更新状态
  //console.log(model.state.recipe);
  recipeView.update(model.state.recipe);

  // 渲染到bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // 渲染加载菜单
    addRecipeView.renderSpinner();

    // upload 上传 recipe data
    await model.uploadRecipe(newRecipe);

    // 渲染 recipe
    recipeView.render(model.state.recipe);

    // 改变 id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // 渲染 书签
    bookmarksView.render(model.state.bookmarks);

    // 关闭窗口
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error('***', error);
    addRecipeView.renderErrorMessage(error.message);
  }
};

// 订阅者初始化
const init = function () {
  bookmarksView.addHandlerBookmarks(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('Hello');
};
init();
