import { Injectable } from "@nestjs/common";
import { PDFDocument } from "pdf-lib";
import { OUTPUT_DIR } from "src/common/constants/file.constant";
import * as fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

@Injectable()
export class PdfPreviewService {
     constructor() {}     
      async generate(filePath: string):Promise<Array<{page: number, previewUrl: string}>> { 
             const outPutDir = `${OUTPUT_DIR}/previews/${Date.now()}`;
             fs.mkdirSync(outPutDir, { recursive: true });
             const pdf = await PDFDocument.load(fs.readFileSync(filePath));
             const totalPages = pdf.getPageCount();
             const previews = [] as Array<{page: number, previewUrl:  string}>;
             for(let i = 0; i < totalPages; i++) {
                   const imagePath = `${outPutDir}/page-${i + 1}.png`;
                   await this.convertPageToImage(filePath, i + 1, imagePath);
                   previews.push({
                        page: i + 1,
                        previewUrl: `/static/${imagePath}`
                   });
             }
             return previews;
       }
        private async convertPageToImage(filePath: string, pageNumber: number, outputPath: string) {
                  const outputBase = outputPath.replace('.png', '');
                    const command = `pdftoppm -f ${pageNumber} -l ${pageNumber} -png "${filePath}" "${outputBase}"`;
                    await execAsync(command);
                    fs.renameSync(`${outputBase}-${pageNumber < 10 ? pageNumber.toString().padStart(2, "0"):pageNumber}.png`, outputPath);
        }

    }
