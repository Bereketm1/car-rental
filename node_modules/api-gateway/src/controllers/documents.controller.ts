import { Controller, Post, UseInterceptors, UploadedFile, HttpException, HttpStatus, Get, Param, Res, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import * as fs from 'fs';
import * as path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

@ApiTags('documents')
@Controller('api/documents')
export class DocumentsController {
  
  @Post('upload')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Upload a document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: any) {
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }
    
    // Save file manually to avoid importing multer diskStorage which might cause typing errors if @types/multer is missing
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `doc-${uniqueSuffix}${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);
    
    fs.writeFileSync(filePath, file.buffer);

    return {
      success: true,
      data: {
        filename: filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `/api/documents/${filename}`
      }
    };
  }

  @Get(':filename')
  @ApiOperation({ summary: 'Download/View document' })
  async getFile(@Param('filename') filename: string, @Res() res: any) {
    const filePath = path.join(process.cwd(), 'uploads', filename);
    if (!fs.existsSync(filePath)) {
      throw new HttpException('File not found', 404);
    }
    return res.sendFile(filePath);
  }
}
