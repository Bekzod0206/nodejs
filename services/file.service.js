import { v4 } from "uuid"
import fs from "fs"
import path, { dirname } from "path"
import { fileURLToPath } from "url";

class FileServiceClass {
  async save(file) {
    try {
      const fileName = v4() + ".jpg"
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const currentDir = __dirname

      const staticDir = path.join(currentDir, '..', 'static')
      const filePath = path.join(staticDir, fileName)
      if (!fs.existsSync(staticDir)) {
        fs.mkdirSync(staticDir, { recursive: true });
      }
      file.mv(filePath)
      return fileName

    } catch (error) {
      console.log("hello error")
      throw new Error(`Error saving file: ${error}`)
    }
  }
}

const FileService = new FileServiceClass()
export {FileService}