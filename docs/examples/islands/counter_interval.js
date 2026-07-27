const { html, ReactiveElement } = cami
class CounterElement extends ReactiveElement {
    count = 0;
    timer;
    get doubleCount() {
        return this.count * 2;
    }
    onConnect() {
        this.timer = setInterval(() => this.count++, 1000);
        this.effect(() => console.log(`Count: ${this.count}`));
        this.effect(() => console.log(`Double Count: ${this.doubleCount}`));
    }
    onDisconnect() {
        if (this.timer !== undefined)
            clearInterval(this.timer);
    }
    template() {
        return html `<div>Double Count: ${this.doubleCount}</div>`;
    }
}
customElements.define('counter-component', CounterElement);
