function parseQuery(s: string) {
  const params = new URLSearchParams(s);

  return {
    get: (name: string) => params.get(name),
    getAll: (name: string) => params.getAll(name),
    values: () =>
      Array.from(params.keys()).reduce((p, c) => {
        p[c] = params.get(c);
        return p;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }, {} as Record<string, any>)
  };
}

export { parseQuery };
