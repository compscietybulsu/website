import { api } from "./api";

export async function uploadImage(file, token) {
  const { signature, timestamp, folder, apiKey, cloudName } = await api.get(
    "/api/uploads/signature",
    { token }
  );

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Image upload failed");
  return data.secure_url;
}