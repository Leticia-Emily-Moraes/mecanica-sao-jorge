/** Resposta de `fetch` simulada, só com o que a camada de API lê. */
export function fakeResponse(status: number, body?: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async (): Promise<unknown> => {
      if (body === undefined) {
        throw new SyntaxError('sem corpo');
      }
      return body;
    },
  } as unknown as Response;
}

/** Instala um `fetch` simulado e devolve o mock para asserções. */
export function mockFetch(): jest.Mock {
  const mock = jest.fn();
  global.fetch = mock as unknown as typeof fetch;
  return mock;
}
