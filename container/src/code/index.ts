import { isFile } from "../util";

export const executeCode = (
  baseLanguage: string,
  filePath: string,
  extension: string
) => {
  if (baseLanguage == "python" && extension == "py") {
    if (isFile(filePath)) {
        
    }
  }
};
