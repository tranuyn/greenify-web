import { apiClient } from "@/lib/apiClient";
import type { MediaDto } from "@/types/media.types";

export interface UploadFilePayload {
  file?: File;
  uri?: string;
  name?: string;
  type?: string;
}

export const uploadService = {
  async uploadFile(payload: UploadFilePayload): Promise<MediaDto> {
    try {
      const formData = new FormData();
      if (payload.file) {
        formData.append("files", payload.file);
      } else if (payload.uri) {
        formData.append("files", {
          uri: payload.uri,
          name: payload.name ?? `upload-${Date.now()}.jpg`,
          type: payload.type ?? "image/jpeg",
        } as any);
      } else {
        throw new Error("No file provided for upload");
      }

      const { data } = await apiClient.post<MediaDto[]>("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: (data) => data,
      });
      const uploadedFile = data?.[0];

      if (!uploadedFile) {
        throw new Error("Upload response is empty");
      }

      return uploadedFile;
    } catch (error: any) {
      console.error(
        "Upload file failed:",
        error?.response?.data || error.message || error,
      );
      throw error;
    }
  },
};
