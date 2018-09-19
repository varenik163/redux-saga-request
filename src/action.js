export const REQUEST = "REQUEST";
export default request = params => ({ ...params, oldType: params.type, type: REQUEST })