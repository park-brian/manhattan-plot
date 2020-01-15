export class Tooltip {
  constructor(html, config) {
    this.config = config;
    this.node = document.createElement("div");
    this.node.appendChild(html);
    this.setPosition();
  }

  setPosition() {
    let { x, y, placement, container } = this.config;
  }

  destroy() {
    this.node.remove();
  }
}
