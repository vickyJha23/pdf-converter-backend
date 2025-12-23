import multer, { Multer } from "multer";
import {v4 as uuid} from "uuid";
import { UPLOAD_DIR } from "src/common/constants/file.constant";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

export  const multerOptions:MulterOptions = {storage: multer.diskStorage({
      destination: UPLOAD_DIR,
      filename: function(req, file, cb){
           const fileName = `${uuid()}-${file.originalname}`;
           cb(null, fileName)  
      }
})
}


