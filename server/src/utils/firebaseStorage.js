const crypto = require("crypto");
const { bucket } = require("../config/firebase");

const uploadImgToFirebase = async ({
  file,
  folder,
  filenamePrefix = "",
  makePublic = true,
}) => {
  if (!file) {
    throw new Error("No file provided");
  }
  const ext = file.mimetype.split("/")[1];
  const filename = `images/${folder}/${filenamePrefix}${crypto.randomUUID()}.${ext}`;
  const blob = bucket.file(filename);

  const stream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    stream.on("error", reject);
    stream.on("finish", async () => {
      if (makePublic) {
        await blob.makePublic();
      }

      const publicUrl = makePublic
        ? `https://storage.googleapis.com/${bucket.name}/${filename}`
        : filename;

      resolve({
        url: publicUrl,
        path: filename,
      });
    });

    stream.end(file.buffer);
  });
};

module.exports = { uploadImgToFirebase };
