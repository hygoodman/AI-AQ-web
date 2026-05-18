Component({
  properties: {
    item: {
      type: Object,
      value: {},
    },
    disabled: {
      type: Boolean,
      value: false,
    },
  },
  methods: {
    handleTap() {
      if (this.data.disabled) return
      this.triggerEvent('select', { key: this.data.item.key })
    },
  },
})
