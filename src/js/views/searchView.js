class SearchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    // 获取input框中输入的值
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    // 在HTML表单中点击一个按钮时，它会触发表单的提交。
    // 这是因为按钮被设计为与表单关联，并且当点击按钮时，浏览器会自动提交表单。
    // submit 关联的是 form 表单，button默认type='submit'
    // 因此对form表单使用submit监听
    this._parentEl.addEventListener('submit', function (e) {
      // 防止默认表单刷新 必须要放第一行
      e.preventDefault();
      // this 错误 因为监听函数的this是监听事件的目标元素 可以使用箭头函数来解决这个问题
      // e.target 是点击的元素对象
      // console.log(this, e.target);
      // console.log(this._parentEl.querySelector('.search__btn'));
      handler();
    });
  }
}

export default new SearchView();
