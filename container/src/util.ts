export const isFile = (path: string) => {
    const file = path.split("/")[path.split("/").length - 1];
    return file.split(".").length >= 2 ? true : false;
  };