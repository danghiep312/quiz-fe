export function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function getLatexByApi(imageData) {
    imageData = imageData.replaceAll("data:image/png;base64,","")
    try {
      const response = await fetch("http://localhost:8000/api/ocr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_base64: imageData, // Gửi hình ảnh dưới dạng chuỗi base64
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.latex)
        let res = result.latex.replaceAll("$", "")
        console.log(res)
        return res;
      } else {
        alert("Gửi hình ảnh không thành công!");
        return "";
      }
    } catch (error) {
      console.error("Error sending image:", error);
      alert("Có lỗi xảy ra khi gửi hình ảnh!");
      return "";
    }
  };