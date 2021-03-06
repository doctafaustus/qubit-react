import exposeReact from '../exposeReact'

describe('exposeReact', () => {
  afterEach(() => {
    window.__qubit = undefined
  })

  it('exposes React to the correct location', () => {
    const fakeReact = {}
    exposeReact(fakeReact)
    expect(window.__qubit.react.React).toBe(fakeReact)
  })

  it('runs all onReactReady handlers', () => {
    const onReactReady = [jest.fn(), jest.fn()]
    window.__qubit = {
      react: {
        onReactReady: onReactReady
      }
    }
    exposeReact({})
    onReactReady.forEach(fn => expect(fn).toHaveBeenCalled())
  })

  it('runs onReactReady handlers with React', () => {
    const fakeReact = {}
    // Not using .toHaveBeenCalledWith because we need === match
    const onReactReady = jest.fn(React => expect(React).toBe(fakeReact))
    window.__qubit = {
      react: {
        onReactReady: [onReactReady]
      }
    }
    exposeReact(fakeReact)
  })

  it('runs clears onReactReady handlers after running them', () => {
    const onReactReady = [() => {}, () => {}]
    window.__qubit = {
      react: {
        onReactReady: onReactReady
      }
    }
    exposeReact({})
    expect(window.__qubit.react.onReactReady).toEqual([])
  })

  it('catches errors thrown from onReactReady handlers', () => {
    window.__qubit = {
      react: {
        onReactReady: [() => { throw new Error('onReactReady error') }]
      }
    }
    expect(() => {
      exposeReact({})
    }).not.toThrow()
  })

  it('runs all onReactReady handlers even if one throws', () => {
    const onReactReady = [
      jest.fn(),
      jest.fn(() => { throw new Error('onReactReady error') }),
      jest.fn()
    ]
    window.__qubit = {
      react: {
        onReactReady: onReactReady
      }
    }
    exposeReact({})
    onReactReady.forEach(fn => expect(fn).toHaveBeenCalled())
  })
})
