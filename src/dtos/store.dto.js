
export const bodyToStore = (body) => ({
  name: body.name,
  address: body.address,
});

export const responseFromStore = (storeId, data) => ({
  storeId: storeId,
  name: data.name,
  address: data.address,
});