export const resizeImage = (img, maxWidth, maxHeight) => {
  // 원본 이미지 크기
  const originalWidth = img.width;
  const originalHeight = img.height;

  // 크기 비율 계산
  let width = originalWidth;
  let height = originalHeight;

  if (originalWidth > maxWidth || originalHeight > maxHeight) {
    const widthRatio = maxWidth / originalWidth;
    const heightRatio = maxHeight / originalHeight;
    const ratio = Math.min(widthRatio, heightRatio);

    width = originalWidth * ratio;
    height = originalHeight * ratio;
  }

  // Canvas를 사용하여 리사이징
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  // 리사이징된 이미지를 반환
  return canvas.toDataURL("image/jpeg");
};
