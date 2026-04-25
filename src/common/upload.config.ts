import { diskStorage } from 'multer';
import { extname, join } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      if (file.mimetype.startsWith('image')) {
        cb(null, join(process.cwd(), 'uploads/images'));
      } else if (file.mimetype.startsWith('video')) {
        cb(null, join(process.cwd(), 'uploads/videos'));
      } else if (
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        cb(null, join(process.cwd(), 'uploads/documents'));
      } else {
        cb(new Error('Invalid file type'), '');
      }
    },

    filename: (req, file, cb) => {
      const uniqueName =
        Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueName}${extname(file.originalname)}`);
    },
  }),

  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image',
      'video',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (
      file.mimetype.startsWith('image') ||
      file.mimetype.startsWith('video') ||
      allowedMimeTypes.includes(file.mimetype)
    ) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },

  limits: {
    fileSize: 50 * 1024 * 1024,
  },
};