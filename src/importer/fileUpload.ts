export async function handleFileUpload(
  file: Express.Multer.File,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (file.size === file.buffer.length) {
      resolve();
    } else {
      reject(new Error('File is not fully uploaded'));
    }
  });
}
