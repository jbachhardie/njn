const { drive } = require("../src/index")

function* toIterator(input) {
  yield* input
}

function pause(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

test("executes actions in sequence", async () => {
  let state = 1
  const input = [{ type: "sum", value: 1 }, { type: "multiply", value: 2 }]
  const driver = ({ type, ...params }) => {
    switch (type) {
      case "sum":
        return (state = state + params.value)
      case "multiply":
        return (state = state * params.value)
      default:
        return 0
    }
  }
  await drive(toIterator(input), driver)
  expect(state).toBe(4)
})

test("returns result of last action", async () => {
  let state = 1
  const input = [{ type: "sum", value: 1 }, { type: "multiply", value: 2 }]
  const driver = ({ type, ...params }) => {
    switch (type) {
      case "sum":
        return (state = state + params.value)
      case "multiply":
        return (state = state * params.value)
      default:
        return 0
    }
  }
  expect(await drive(toIterator(input), driver)).toBe(4)
})

test("passes driver response to iterator", async () => {
  let state = 2
  const generator = function*() {
    const response = yield { type: "get" }
    return { type: "multiply", value: response }
  }
  const driver = ({ type, ...params }) => {
    switch (type) {
      case "get":
        return 5
      case "multiply":
        return (state = state * params.value)
      default:
        return 0
    }
  }
  expect(await drive(generator(), driver)).toBe(10)
})

test("awaits async driver", async () => {
  let state = 1
  const input = [{ type: "sum", value: 1 }, { type: "multiply", value: 2 }]
  const driver = async ({ type, ...params }) => {
    await pause(1)
    switch (type) {
      case "sum":
        return (state = state + params.value)
      case "multiply":
        return (state = state * params.value)
      default:
        return 0
    }
  }
  expect(await drive(toIterator(input), driver)).toBe(4)
})

test("passes resolved driver response to iterator when async driver", async () => {
  let state = 2
  const generator = function*() {
    const response = yield { type: "get" }
    return { type: "multiply", value: response }
  }
  const driver = async ({ type, ...params }) => {
    await pause(1)
    switch (type) {
      case "get":
        return 5
      case "multiply":
        return (state = state * params.value)
      default:
        return 0
    }
  }
  expect(await drive(generator(), driver)).toBe(10)
})
