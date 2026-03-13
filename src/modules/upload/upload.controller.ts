import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { UploadService } from './upload.service';

interface MulterFile {
  originalname: string;
  filename: string;
  size: number;
  mimetype: string;
}

@ApiTags('文件上传')
@ApiBearerAuth('JWT')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: '上传单个文件' })
  @ApiConsumes('multipart/form-data')
  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  uploadSingle(@UploadedFile() file: MulterFile) {
    if (!file) {
      throw new BadRequestException('请选择要上传的文件');
    }
    return this.uploadService.handleUpload(file);
  }

  @ApiOperation({ summary: '上传多个文件（最多10个）' })
  @ApiConsumes('multipart/form-data')
  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  uploadMultiple(@UploadedFiles() files: MulterFile[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('请选择要上传的文件');
    }
    return this.uploadService.handleMultipleUpload(files);
  }
}
