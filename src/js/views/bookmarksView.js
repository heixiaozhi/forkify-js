import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

export class BookmarksView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet, find a nice recipe and bookmark it';
  _essage = '';

  _generateMarkup() {
    // 返回多个li
    return this._data.map(result => previewView.render(result, false)).join('');
  }

  addHandlerBookmarks(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookmarksView();
