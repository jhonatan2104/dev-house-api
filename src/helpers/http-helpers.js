export const badRequest = (error, code=400) => ({
  status: code,
  body: { error: error.message }
});

export const successRequest = (data, code=200) => ({
    status: code,
    body: { data },
});
