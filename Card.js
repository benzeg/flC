class Card {
	constructor(front = '', back = '', created_at = new Date().toISOString(), id = (Math.random()*Math.pow(10, 17)).toString()) {
		this._data = {
			front,
			back,
			created_at,
			id
		};
	}

	get front() {
		return this._data.front;
	}

	get back() {
		return this._data.back;
	}

	get createdAt() {
		return this._data.created_at;
	}

	set front(val) {
		this._data.front = val;
	} 

	set back(val) {
		this._data.back = val;
	}

	persist() {
		const storeData = JSON.parse(localStorage.getItem('FlC card storage'));
		const store = storeData ? new Stack(storeData) : new Stack();
		store.addOrUpdate(this._data);	
		localStorage.setItem('FlC card storage', JSON.stringify(store._data));
	}
}

class Stack {
	constructor(data = { stack: [], id: (Math.random()*Math.pow(10, 17)).toString() }) {
		this._data = data;
		this._nullCount = 0;
  }
  
  get stack() {
    return this._data.stack;
  }

  get size() {
    return this._data.stack.length;
  }

  addOrUpdate(item) {
		const locale = this.getCardIndexById(item);
		if (this._data.stack[locale] === null) {
			this._nullCount--;
		}
    this._data.stack[locale] = item;
    return this;
  }

  delete(item) {
		const locale = this.getCardIndexById(item.id);
		if (this._data.stack[locale]) {
			this._data.stack[locale] = null;
			this._nullCount++;
		}
  }

  getCardIndexById(item) {
		if (!item.id) {
			item.id = (Math.random()*Math.pow(10, 17)).toString();
			return this._data.stack.length;
		}

    let i = 0;
    while (i < this._data.stack.length) {
      if (this._data.stack[i].id === item.id) {
        break;
      }
      i++;
    }
    return i;
  }
}