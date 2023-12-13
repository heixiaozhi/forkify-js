import previewView from './previewView.js';
import View from './view.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

export class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = "Don't find the results, please again one more time!";
  _essage = '';

  _generateMarkup() {
    // _generateMarkup是私有方法，建议使用this.render()
    //return this._data.map(previewView._generateMarkup).join('');
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
