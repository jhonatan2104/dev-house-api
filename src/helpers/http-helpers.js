export const badRequest = (error) => ({
  status: 400,
  body: { error }
});

export const successRequest = (data, code=200) => ({
    status: code,
    body: { data },
});