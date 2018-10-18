export const REQUEST = 'REQUEST';
const request = params => ({ ...params, oldType: params.type, type: REQUEST });
export default request;
