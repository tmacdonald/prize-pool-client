export function setupCounter(element: HTMLButtonElement) {
  
  const incrementCounter = () => {
    fetch('https://prize-pool-server.fly.dev/counter', { method: 'POST' })
      .then(response => response.json())
      .then(response => element.innerHTML = `count is ${response.count}`);
  }

  const getCounter = () => {
    fetch('https://prize-pool-server.fly.dev/counter')
      .then(response => response.json())
      .then(response => element.innerHTML = `count is ${response.count}`);
  }

  element.addEventListener('click', () => incrementCounter())
  getCounter();
}
