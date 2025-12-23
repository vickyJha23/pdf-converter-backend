import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as  path from "path";
import { OUTPUT_DIR } from "src/common/constants/file.constant";


@Injectable()
export class StorageService {
      async saveLocal(buffer:Buffer, fileName: string) {
             if(!fs.existsSync(OUTPUT_DIR)) {
                  fs.mkdirSync(OUTPUT_DIR, {recursive: true})      
             }
             
             const filePath = path.join(OUTPUT_DIR, fileName);
             fs.writeFileSync(filePath, buffer);
             return {
                  filePath: filePath
             }
       }
}