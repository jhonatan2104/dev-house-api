export const badRequest = (error) => ({
  status: 400,
  body: { error }
});

export const successRequest = (code, data) => ({
    status: code,
    body: { data },
});