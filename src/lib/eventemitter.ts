export type ListenerFunction = (data?: any) => void

type Listener = {
  func: ListenerFunction
  once?: boolean
  context?: any
}

type Listeners = Listener[]

type ListenersMap = {
  [key: string]: Listeners
}

export default class EventEmitter {
  private events: ListenersMap = Object.create(null)

  listeners(name: string) {
    const events = this.events
    return events[name] || (events[name] = [])
  }

  hasListener(name: string) {
    const listeners = this.events && this.events[name]
    return listeners && listeners.length > 0
  }

  on(name: string, func: ListenerFunction, context?: any) {
    this.listeners(name).push({
      func,
      once: false,
      context,
    })
  }

  once(name: string, func: ListenerFunction, context?: any) {
    this.listeners(name).push({
      func,
      once: true,
      context,
    })
  }

  off(name: string, func: ListenerFunction) {
    const listeners = this.listeners(name)
    const newListeners: Listeners = []
    const len = listeners.length

    for (let i = 0; i < len; i++) {
      const item = listeners[i]
      if (item.func !== func) {
        newListeners.push(item)
      }
    }

    this.events[name] = newListeners
  }

  emit(name: string, data?: any) {
    const listeners = this.listeners(name)

    const len = listeners.length
    for (let i = 0; i < len; i++) {
      const item = listeners[i]
      const { func, context } = item

      if (context) {
        func.call(context, data)
      }
      else {
        func(data)
      }

      if (item.once) {
        this.off(name, func)
      }
    }
  }
}
