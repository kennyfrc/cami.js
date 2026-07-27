(() => {
  if (customElements.get('cami-demo-island')) return

  const { html, ReactiveElement, store } = cami

  const products = [
    { id: 'mug', name: 'Island mug', price: 12, description: 'Ceramic · 350 ml' },
    { id: 'tote', name: 'Cami tote', price: 18, description: 'Canvas · natural' },
    { id: 'pins', name: 'Reactive pins', price: 8, description: 'Set of three' },
  ]

  const DemoCartStore = store({
    name: 'docs-live-cart',
    state: { items: [] },
  })

  DemoCartStore.defineAction('add', ({ state, payload }) => {
    const item = state.items.find((candidate) => candidate.id === payload.id)
    if (item) item.quantity += 1
    else state.items.push({ ...payload, quantity: 1 })
  })

  DemoCartStore.defineAction('decrease', ({ state, payload }) => {
    const item = state.items.find((candidate) => candidate.id === payload.id)
    if (!item) return
    if (item.quantity === 1) state.items = state.items.filter((candidate) => candidate.id !== payload.id)
    else item.quantity -= 1
  })

  DemoCartStore.defineAction('remove', ({ state, payload }) => {
    state.items = state.items.filter((candidate) => candidate.id !== payload.id)
  })

  class CamiDemoProducts extends ReactiveElement {
    template() {
      const { items } = DemoCartStore.getState()
      return html`
        <section class="cami-demo__subisland" aria-labelledby="demo-products-title">
          <div class="cami-demo__eyebrow">Product picker island</div>
          <h3 id="demo-products-title">Choose products</h3>
          <div class="cami-demo__product-grid">
            ${products.map((product) => {
              const quantity = items.find((item) => item.id === product.id)?.quantity || 0
              return html`
                <article class="cami-demo__product">
                  <div><strong>${product.name}</strong><small>${product.description}</small></div>
                  <span>$${product.price}</span>
                  <button @click=${() => DemoCartStore.dispatch('add', product)}>
                    ${quantity ? `Add another · ${quantity} in cart` : 'Add to cart'}
                  </button>
                </article>`
            })}
          </div>
        </section>`
    }
  }

  class CamiDemoCart extends ReactiveElement {
    template() {
      const { items } = DemoCartStore.getState()
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      return html`
        <section class="cami-demo__subisland" aria-labelledby="demo-cart-title">
          <div class="cami-demo__eyebrow">Cart summary island</div>
          <h3 id="demo-cart-title">Your cart</h3>
          ${items.length === 0
            ? html`<p class="cami-demo__empty">Choose a product to see shared state update here.</p>`
            : html`<ul class="cami-demo__cart-list">${items.map((item) => html`
                <li>
                  <div><strong>${item.name}</strong><small>$${item.price} each</small></div>
                  <div class="cami-demo__quantity" aria-label=${`${item.name} quantity`}>
                    <button class="secondary" @click=${() => DemoCartStore.dispatch('decrease', item)} aria-label=${`Decrease ${item.name}`}>−</button>
                    <output>${item.quantity}</output>
                    <button @click=${() => DemoCartStore.dispatch('add', item)} aria-label=${`Increase ${item.name}`}>+</button>
                    <button class="secondary" @click=${() => DemoCartStore.dispatch('remove', item)}>Remove</button>
                  </div>
                </li>`)}
              </ul>
              <output class="cami-demo__total">Total <strong>$${total}</strong></output>`}
        </section>`
    }
  }

  customElements.define('cami-demo-products', CamiDemoProducts)
  customElements.define('cami-demo-cart', CamiDemoCart)

  class CamiDemoIsland extends ReactiveElement {
    count = 0
    celsius = ''
    fahrenheit = ''
    elapsed = 0
    duration = 10
    remaining = 10
    timerRunning = false
    isOpen = false
    flightType = 'one-way'
    depart = ''
    returnDate = ''
    bookingMessage = ''
    todos = [
      { id: 1, text: 'Render the page on the server', done: true },
      { id: 2, text: 'Enhance one island with Cami', done: false },
    ]
    people = ['Ada Lovelace', 'Grace Hopper']
    selectedPerson = 'Ada Lovelace'
    circles = []
    nested = {
      workspace: 'Cami docs',
      team: {
        name: 'Examples',
        members: 2,
        lead: { name: 'Ada', role: 'Editor' },
      },
    }
    email = ''
    registeredEmail = ''
    posts = [{ id: 1, title: 'Server-rendered page, enhanced locally', body: 'Cami updates only the interactive island.' }]
    activeAnchor = ''
    intervalId = null
    countdownId = null

    onConnect() {
      if (this.kind === 'counter-interval' && !this.intervalId) {
        this.intervalId = window.setInterval(() => { this.count += 1 }, 1000)
      }
    }

    onDisconnect() {
      if (this.intervalId) window.clearInterval(this.intervalId)
      if (this.countdownId) window.clearInterval(this.countdownId)
      this.intervalId = null
      this.countdownId = null
    }

    get kind() {
      return this.getAttribute('kind') || 'counter'
    }

    updateCelsius(value) {
      this.celsius = value
      this.fahrenheit = value === '' ? '' : String(Math.round((Number(value) * 9 / 5 + 32) * 10) / 10)
    }

    updateFahrenheit(value) {
      this.fahrenheit = value
      this.celsius = value === '' ? '' : String(Math.round(((Number(value) - 32) * 5 / 9) * 10) / 10)
    }

    addTodo(event) {
      event.preventDefault()
      const input = event.currentTarget.elements.todo
      const text = input.value.trim()
      if (!text) return
      this.todos = [...this.todos, { id: Date.now(), text, done: false }]
      input.value = ''
    }

    addPerson(event) {
      event.preventDefault()
      const input = event.currentTarget.elements.person
      const name = input.value.trim()
      if (!name) return
      this.people = [...this.people, name]
      this.selectedPerson = name
      input.value = ''
    }

    startTimer() {
      if (this.timerRunning || this.remaining <= 0) return
      this.timerRunning = true
      this.countdownId = window.setInterval(() => {
        this.remaining = Math.max(0, this.remaining - 1)
        if (this.remaining === 0) this.pauseTimer()
      }, 1000)
    }

    pauseTimer() {
      if (this.countdownId) window.clearInterval(this.countdownId)
      this.countdownId = null
      this.timerRunning = false
    }

    resetTimer() {
      this.pauseTimer()
      this.remaining = this.duration
    }

    addCircle(event) {
      const rect = event.currentTarget.getBoundingClientRect()
      this.circles = [...this.circles, {
        x: Math.round(event.clientX - rect.left),
        y: Math.round(event.clientY - rect.top),
      }]
    }

    renderCounter() {
      return html`
        <div class="cami-demo">
          <strong>Count: ${this.count}</strong>
          <div class="cami-demo__row">
            <button @click=${() => this.count--} aria-label="Decrease">−</button>
            <button @click=${() => this.count++}>Increase</button>
            <button class="secondary" @click=${() => { this.count = 0 }}>Reset</button>
          </div>
        </div>`
    }

    renderTemperature() {
      return html`
        <div class="cami-demo">
          <div class="cami-demo__row">
            <label>Celsius <input type="number" .value=${this.celsius} @input=${(event) => this.updateCelsius(event.target.value)}></label>
            <span aria-hidden="true">⇄</span>
            <label>Fahrenheit <input type="number" .value=${this.fahrenheit} @input=${(event) => this.updateFahrenheit(event.target.value)}></label>
          </div>
        </div>`
    }

    renderNested() {
      return html`
        <div class="cami-demo cami-demo__nested">
          <p>Each control replaces one branch while preserving the rest of the object.</p>
          <div class="cami-demo__tree" aria-label="Nested state tree">
            <section>
              <code>root.workspace</code>
              <strong>${this.nested.workspace}</strong>
              <button class="secondary" @click=${() => {
                this.nested = {
                  ...this.nested,
                  workspace: this.nested.workspace === 'Cami docs' ? 'Cami handbook' : 'Cami docs',
                }
              }}>Rename root</button>
            </section>
            <section>
              <code>root.team</code>
              <strong>${this.nested.team.name}</strong>
              <span>${this.nested.team.members} members</span>
              <button class="secondary" @click=${() => {
                this.nested = {
                  ...this.nested,
                  team: { ...this.nested.team, members: this.nested.team.members + 1 },
                }
              }}>Add nested member</button>
            </section>
            <section>
              <code>root.team.lead</code>
              <strong>${this.nested.team.lead.name}</strong>
              <span>${this.nested.team.lead.role}</span>
              <button class="secondary" @click=${() => {
                this.nested = {
                  ...this.nested,
                  team: {
                    ...this.nested.team,
                    lead: {
                      ...this.nested.team.lead,
                      role: this.nested.team.lead.role === 'Editor' ? 'Principal editor' : 'Editor',
                    },
                  },
                }
              }}>Promote nested lead</button>
            </section>
          </div>
        </div>`
    }

    renderTodos() {
      return html`
        <div class="cami-demo">
          <form class="cami-demo__row cami-demo__todo-form" @submit=${(event) => this.addTodo(event)}>
            <input name="todo" aria-label="New todo" placeholder="Add a task">
            <button>Add</button>
          </form>
          <ul class="cami-demo__todo-list">${this.todos.map((todo) => html`
            <li>
              <label><input type="checkbox" .checked=${todo.done} @change=${() => {
                this.todos = this.todos.map((item) => item.id === todo.id ? { ...item, done: !item.done } : item)
              }}><span class=${todo.done ? 'is-done' : ''}>${todo.text}</span></label>
            </li>`)}</ul>
        </div>`
    }

    renderBlog() {
      return html`
        <div class="cami-demo">
          <form class="cami-demo__composer" @submit=${(event) => {
            event.preventDefault()
            const { title, body } = event.currentTarget.elements
            const nextTitle = title.value.trim()
            const nextBody = body.value.trim()
            if (!nextTitle || !nextBody) return
            this.posts = [{ id: Date.now(), title: nextTitle, body: nextBody, optimistic: true }, ...this.posts]
            event.currentTarget.reset()
          }}>
            <label>Title <input name="title" required placeholder="A useful title"></label>
            <label>Body <textarea name="body" required rows="3" placeholder="Write the post body"></textarea></label>
            <button>Publish optimistically</button>
          </form>
          <div class="cami-demo__post-list">${this.posts.map((post) => html`
            <article>
              <div class="cami-demo__row"><h3>${post.title}</h3>${post.optimistic ? html`<small class="cami-demo__badge">Optimistic</small>` : ''}</div>
              <p>${post.body}</p>
            </article>`)}
          </div>
        </div>`
    }

    renderCart() {
      return html`
        <div class="cami-demo cami-demo__cart-layout">
          <cami-demo-products></cami-demo-products>
          <cami-demo-cart></cami-demo-cart>
        </div>`
    }

    renderForm() {
      const valid = this.email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)
      if (this.registeredEmail) {
        return html`
          <section class="cami-demo cami-demo__success" aria-live="polite">
            <div class="cami-demo__success-icon" aria-hidden="true">✓</div>
            <div><strong>Registration complete</strong><p>${this.registeredEmail} is ready for the demo.</p></div>
            <button class="secondary" @click=${() => {
              this.email = ''
              this.registeredEmail = ''
            }}>Register another email</button>
          </section>`
      }
      return html`
        <form class="cami-demo" @submit=${(event) => {
          event.preventDefault()
          if (!valid || !this.email) return
          this.registeredEmail = this.email
        }}>
          <label>Email <input type="email" required .value=${this.email} @input=${(event) => { this.email = event.target.value }}></label>
          <small aria-live="polite">${!this.email ? 'Enter an email to continue.' : valid ? 'Email format looks good.' : 'Enter a complete email address.'}</small>
          <button ?disabled=${!valid || !this.email}>Register</button>
        </form>`
    }

    renderTimer() {
      const progress = this.duration === 0 ? 0 : this.remaining / this.duration * 100
      return html`
        <div class="cami-demo cami-demo__timer">
          <progress max="100" value=${progress}>${progress}%</progress>
          <output aria-live="polite">${this.remaining === 0 ? 'Time’s up!' : `${this.remaining} seconds remaining`}</output>
          <label>Countdown length: ${this.duration}s
            <input type="range" min="3" max="30" .value=${String(this.duration)} ?disabled=${this.timerRunning} @input=${(event) => {
              this.duration = Number(event.target.value)
              this.remaining = this.duration
            }}>
          </label>
          <div class="cami-demo__row">
            <button ?disabled=${this.timerRunning || this.remaining === 0} @click=${() => this.startTimer()}>Start</button>
            <button class="secondary" ?disabled=${!this.timerRunning} @click=${() => this.pauseTimer()}>Pause</button>
            <button class="secondary" @click=${() => this.resetTimer()}>Reset</button>
          </div>
        </div>`
    }

    renderModal() {
      this.afterRender('demo-modal', () => {
        const dialog = this.querySelector('.cami-demo__modal-dialog')
        if (!dialog) return
        if (this.isOpen && !dialog.open) dialog.showModal()
        if (!this.isOpen && dialog.open) dialog.close()
      }, [this.isOpen])
      return html`
        <div class="cami-demo">
          <button @click=${() => { this.isOpen = true }}>Open modal</button>
          <dialog
            class="cami-demo__modal-dialog"
            aria-labelledby="demo-modal-title"
            @close=${() => { this.isOpen = false }}
            @click=${(event) => { if (event.target === event.currentTarget) this.isOpen = false }}
          >
            <strong id="demo-modal-title">Viewport modal</strong>
            <p>This dialog is in the browser’s top layer, over the documentation page.</p>
            <button autofocus @click=${() => { this.isOpen = false }}>Close modal</button>
          </dialog>
        </div>`
    }

    renderFlight() {
      const today = new Date().toISOString().slice(0, 10)
      const needsReturn = this.flightType === 'return'
      const datesComplete = Boolean(this.depart && (!needsReturn || this.returnDate))
      const returnValid = !needsReturn || !this.returnDate || !this.depart || this.returnDate >= this.depart
      const canBook = datesComplete && returnValid
      return html`
        <form class="cami-demo" @submit=${(event) => {
          event.preventDefault()
          if (!canBook) return
          this.bookingMessage = needsReturn
            ? `Return flight booked: ${this.depart} → ${this.returnDate}`
            : `One-way flight booked for ${this.depart}`
        }}>
          <label>Trip type <select aria-label="Flight type" .value=${this.flightType} @change=${(event) => {
            this.flightType = event.target.value
            this.bookingMessage = ''
            if (this.flightType === 'one-way') this.returnDate = ''
          }}>
            <option value="one-way">One-way flight</option><option value="return">Return flight</option>
          </select></label>
          <label>Depart <input type="date" required min=${today} .value=${this.depart} @input=${(event) => {
            this.depart = event.target.value
            this.bookingMessage = ''
          }}></label>
          <label>Return <input type="date" required=${needsReturn} min=${this.depart || today} ?disabled=${!needsReturn} .value=${this.returnDate} @input=${(event) => {
            this.returnDate = event.target.value
            this.bookingMessage = ''
          }}></label>
          <button ?disabled=${!canBook}>Book flight</button>
          ${!returnValid ? html`<small role="alert">Choose a return date on or after departure.</small>` : ''}
          ${!datesComplete ? html`<small>Choose ${needsReturn ? 'both dates' : 'a departure date'} to enable booking.</small>` : ''}
          ${this.bookingMessage ? html`<output class="cami-demo__confirmation" aria-live="polite">${this.bookingMessage}</output>` : ''}
        </form>`
    }

    renderPopover(anchored = false) {
      if (anchored) return this.renderAnchoredPopover()
      return html`
        <div class="cami-demo">
          <div class="cami-demo__row">
            <button @click=${() => { this.isOpen = !this.isOpen }}>${anchored ? 'Toggle anchored note' : 'Toggle popover'}</button>
            ${this.isOpen ? html`<aside class="cami-demo__popover" role="status">${anchored ? 'Positioned beside its trigger.' : 'Popover state belongs to this island.'}</aside>` : ''}
          </div>
        </div>`
    }

    renderAnchoredPopover() {
      const labels = { top: 'Top anchor', right: 'Right anchor', bottom: 'Bottom anchor', left: 'Left anchor' }
      return html`
        <div class="cami-demo">
          <p>Choose any anchor. The same popover moves to that point.</p>
          <div class="cami-demo__anchor-stage">
            ${Object.keys(labels).map((anchor) => html`
              <button
                class=${`secondary cami-demo__anchor cami-demo__anchor--${anchor}`}
                aria-pressed=${this.activeAnchor === anchor}
                @click=${() => { this.activeAnchor = this.activeAnchor === anchor ? '' : anchor }}
              >${labels[anchor]}</button>`)}
            ${this.activeAnchor ? html`
              <aside class=${`cami-demo__anchored-note cami-demo__anchored-note--${this.activeAnchor}`} role="status">
                Anchored at ${labels[this.activeAnchor].toLowerCase()}.
              </aside>` : ''}
          </div>
        </div>`
    }

    renderContacts() {
      return html`
        <div class="cami-demo">
          <form class="cami-demo__row" @submit=${(event) => this.addPerson(event)}>
            <input name="person" aria-label="Contact name" placeholder="New contact">
            <button>Add</button>
          </form>
          <div class="cami-demo__contact-layout">
            <div class="cami-demo__contact-list" role="listbox" aria-label="Contacts">
              ${this.people.map((person) => html`
                <button
                  class=${person === this.selectedPerson ? '' : 'secondary'}
                  role="option"
                  aria-selected=${person === this.selectedPerson}
                  @click=${() => { this.selectedPerson = person }}
                >${person}</button>`)}
            </div>
            <section class="cami-demo__contact-card">
              <small>Selected contact</small>
              <strong>${this.selectedPerson}</strong>
              <button class="secondary" ?disabled=${this.people.length === 1} @click=${() => {
                const nextPeople = this.people.filter((person) => person !== this.selectedPerson)
                this.people = nextPeople
                this.selectedPerson = nextPeople[0] || ''
              }}>Delete contact</button>
            </section>
          </div>
        </div>`
    }

    renderCircles() {
      return html`
        <div class="cami-demo">
          <p>Click the surface to add circles.</p>
          <div class="cami-demo__surface" @click=${(event) => this.addCircle(event)}>
            ${this.circles.map((circle) => html`<span class="cami-demo__circle" style=${`left:${circle.x}px;top:${circle.y}px`}></span>`)}
          </div>
          <button class="secondary" @click=${() => { this.circles = [] }}>Clear</button>
        </div>`
    }

    template() {
      switch (this.kind) {
        case 'temperature': return this.renderTemperature()
        case 'counter-interval': return this.renderCounter()
        case 'nested': return this.renderNested()
        case 'todos':
        case 'todos-attributes': return this.renderTodos()
        case 'todos-server': return html`<div class="cami-demo"><small>Mock server state, isolated to this demo</small>${this.renderTodos()}</div>`
        case 'blog': return this.renderBlog()
        case 'cart': return this.renderCart()
        case 'form': return this.renderForm()
        case 'timer': return this.renderTimer()
        case 'modal': return this.renderModal()
        case 'flight': return this.renderFlight()
        case 'popover': return this.renderPopover(false)
        case 'anchored-popover': return this.renderPopover(true)
        case 'contacts': return this.renderContacts()
        case 'circles': return this.renderCircles()
        default: return this.renderCounter()
      }
    }
  }

  customElements.define('cami-demo-island', CamiDemoIsland)
})()
