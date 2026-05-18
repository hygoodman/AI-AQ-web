Component({
  properties: {
    item: {
      type: Object,
      value: {},
    },
  },
  methods: {
    handleTap() {
      this.triggerEvent('select', { id: this.data.item.id })
    },
  },
})
