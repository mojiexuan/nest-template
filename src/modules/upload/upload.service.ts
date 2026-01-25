import { unlink } from 'fs/promises';
import { join } from 'path';
import { Injectable } from '@nestjs/common';

export interface UploadedFileInfo {
  originalName: string;
  filename: string;
  path: string;
  size: number;
  mimetype: string;
}

interface MulterFile {
  originalname: string;
  filename: string;
  size: number;
  mimetype: string;
}

@Injectable()
export class UploadService {
  /**
   * 处理单个文件上传
   */
  handleUpload(file: MulterFile): UploadedFileInfo {
    return {
      originalName: file.originalname,
      filename: file.filename,
      path: `/uploads/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  /**
   * 处理多个文件上传
   */
  handleMultipleUpload(files: MulterFile[]): UploadedFileInfo[] {
    return files.map((file) => this.handleUpload(file));
  }

  /**
   * 删除文件
   */
  async deleteFile(filename: string): Promise<void> {
    const filePath = join(process.cwd(), 'uploads', filename);
    await unlink(filePath);
  }
}
