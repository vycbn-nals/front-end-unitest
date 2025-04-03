export function setupCounter(element: HTMLButtonElement) {
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    if (element) {
      element.innerHTML = `count is ${counter}`
    } else {
      console.error('The provided element is null or undefined.')
    }
  }
  if (element) {
    element.addEventListener('click', () => setCounter(counter + 1))
  } else {
    console.error('The provided element is null or undefined.')
  }
  setCounter(0)
}
