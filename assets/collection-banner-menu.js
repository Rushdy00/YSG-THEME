customElements.whenDefined('header-menu').then(() => {
  const HeaderMenu = customElements.get('header-menu');

  class CollectionBannerMenu extends HeaderMenu {
    constructor() {
      super();
      this._enterTimer = null;
      this._leaveTimer = null;
      this.addEventListener('mouseenter', this.onMouseEnter.bind(this));
      this.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    }

    onMouseEnter() {
      clearTimeout(this._leaveTimer);
      this._enterTimer = setTimeout(() => {
        this.mainDetailsToggle.setAttribute('open', '');
      }, 80);
    }

    onMouseLeave() {
      clearTimeout(this._enterTimer);
      this._leaveTimer = setTimeout(() => {
        this.close();
      }, 120);
    }
  }

  customElements.define('collection-banner-menu', CollectionBannerMenu);
});
