import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTag, ApiOperation, HttpMethod } from 'docupress-api';
import { UploadService } from './upload.service';

interface MulterFile {
  originalname: string;
  filename: string;
  size: number;
  mimetype: string;
}

@ApiTag({ name: '文件上传', description: '文件上传服务' })
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({
    method: HttpMethod.POST,
    path: '/api/upload/single',
    summary: '上传单个文件',
  })
  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  uploadSingle(@UploadedFile() file: MulterFile) {
    if (!file) {
      throw new BadRequestException('请选择要上传的文件');
    }
    return this.uploadService.handleUpload(file);
  }

  @ApiOperation({
    method: HttpMethod.POST,
    path: '/api/upload/multiple',
    summary: '上传多个文件（最多10个）',
  })
  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  uploadMultiple(@UploadedFiles() files: MulterFile[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('请选择要上传的文件');
    }
    return this.uploadService.handleMultipleUpload(files);
  }
}
