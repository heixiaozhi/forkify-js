import { mark } from 'regenerator-runtime';
import icons from 'url:../../img/icons.svg'; // Parcel 2

export default class Views {
  _data;
  /**
   * 渲染数据到dom上
   * @param {Object | Object[]} data 这个数据用来去渲染（e.g. recipe)
   * @param {boolean}  [render=true] if false, 创建一个markup 字符串渲染到dom上
   * @returns {undefined | string} 当 render=false 返回一个markup string
   * @this {Object} View instance
   * @author smileZ
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderErrorMessage();
    this._data = data;
    const markUp = this._generateMarkup();

    if (!render) return markUp;

    this._clear();
    // 插入到容器中
    this._parentEl.insertAdjacentHTML('afterbegin', markUp);
  }

  update(data) {
    this._data = data;
    // 获取更新后的html字符串
    const newMarkup = this._generateMarkup();
    //用于在现有的 HTML 文档中插入新的 HTML 标记。
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // 获取所有的dom元素进行对比

    // 更新后的dom元素
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // 更新之前的dom元素
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));
    //console.log(newElements, curElements);

    // 通过对比差异，改变元素中值
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // isEqualNode 判断dom元素(节点）是否相等
      //console.log(curEl, newEl.isEqualNode(curEl));

      // 更新改变后的文本
      // newEl的第一个子节点 nodeValue获得“当前”节点的文本内容 (text也算文本节点)
      // textContent 属性是用来获取或设置一个节点及其所有子节点的文本内容。
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(curEl.textContent, newEl.textContent);
        curEl.textContent = newEl.textContent;
      }

      // 更新改变的属性
      if (!newEl.isEqualNode(curEl)) {
        // 获取元素的所有属性并返回一个集合（集合包含 属性-属性值 的对象）
        //console.log(newEl.attributes);
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    // 清空容器内容
    this._parentEl.innerHTML = '';
  }

  renderErrorMessage(message = this._errorMessage) {
    const markUp = `
      <div class="error">
        <div>
            <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
        <p>${message}</p>
      </div>`;
    this._clear();
    // 插入到容器中
    this._parentEl.insertAdjacentHTML('afterbegin', markUp);
  }

  rendermessage(message = this._message) {
    const markUp = ` 
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
     </div>`;
    this._clear();
    // 插入到容器中
    this._parentEl.insertAdjacentHTML('afterbegin', markUp);
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
  `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}
