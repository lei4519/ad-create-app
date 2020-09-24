import {Epage, ref} from 'enhance-wxapp'

function useCount() {
  const count = ref(0)
  const add = () => {
    count.value++
  }
  return {
    count,
    add
  }
}

Epage({
  setup() {
    return useCount()
  }
})
