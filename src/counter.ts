const serverUrl = import.meta.env.VITE_SERVER_URL;

export const incrementCounter = (): Promise<number> => {
  return fetch(`${serverUrl}/counter`, { method: 'POST' })
    .then(response => response.json())
    .then(response => response.count as number);
}

export const getCounter = (): Promise<number> => {
  return fetch(`${serverUrl}/counter`)
    .then(response => response.json())
    .then(response => response.count as number);
}

  
