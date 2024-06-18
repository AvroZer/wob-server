import { diskStorage } from 'multer';
import * as fs from 'fs';
import { NotFoundException } from '@nestjs/common';

const generateId = () =>
  Array(18)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');

const normalizeFileName = (req, file, callback) => {
  const fileExtName = file.originalname.split('.').pop();

  callback(null, `${generateId()}.${fileExtName}`);
};

export const fileStorage = diskStorage({
  destination: './gallery',
  filename: normalizeFileName,
});

export const deleteFile = async (filePath: string) => {
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    throw new NotFoundException('Фотография не найдена');
  }
};