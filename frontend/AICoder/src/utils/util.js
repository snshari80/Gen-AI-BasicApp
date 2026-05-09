export const createMessage = (query, response) => {
    return {
    id: crypto.randomUUID(), // optional but recommended
    query,
    response,
    timestamp: new Date().toISOString(),
    sessionid:sessionStorage.getItem('sessionId')
  };
};
