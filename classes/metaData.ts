export interface MetaData {
  createdAt: number;
  friendlyName: string;
}

export default {
  makeMetaData(friendlyName: string): MetaData {
    return {
      createdAt: Date.now(),
      friendlyName,
    };
  },
};
