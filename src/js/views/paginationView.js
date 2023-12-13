import View from './view.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

export class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      // 查找最近的祖先元素 .closest 未找到返回null
      const btn = e.target.closest('.btn--inline');
      // 点击的可能是空的元素
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      // console.log(goToPage);
      handler(goToPage);
    });
  }

  _generateMarkup() {
    // 当前页
    const curPage = this._data.page;
    // 总页数
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // 第1页，还有其他页
    if (curPage === 1 && numPages > 1) {
      return `
        <button data-goto='${
          curPage + 1
        }' class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }

    // 最后一页
    if (curPage === numPages && numPages > 1) {
      return `
        <button data-goto='${
          curPage - 1
        }' class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
      `;
    }

    // 中间页
    if (curPage < numPages) {
      return `
        <button data-goto='${
          curPage - 1
        }' class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
        <button data-goto='${
          curPage + 1
        }'class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }

    // 只有1页
    return '';
  }
}

export default new PaginationView();
