const serverUrl = import.meta.env.VITE_SERVER_URL;

export function setupCounter(element: HTMLButtonElement) {
  
  const incrementCounter = () => {
    fetch(`${serverUrl}/counter`, { method: 'POST' })
      .then(response => response.json())
      .then(response => element.innerHTML = `count is ${response.count}`);
  }

  const getCounter = () => {
    fetch(`${serverUrl}/counter`)
      .then(response => response.json())
      .then(response => element.innerHTML = `count is ${response.count}`);
  }

  element.addEventListener('click', () => incrementCounter())
  getCounter();
}
