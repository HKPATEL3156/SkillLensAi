// User Profile APIs
export const getProfile = () => api.get("/auth/profile");
export const updateProfile = (data) => api.put("/auth/profile", data);
export const uploadProfilePhoto = (file) => {
	const formData = new FormData();
	formData.append("profilePhoto", file);
	return api.post("/auth/profile/photo", formData, { headers: { "Content-Type": "multipart/form-data" } });
};
import axios from "axios";

const api = axios.create({
	baseURL: "/api",
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

export const getCareer = () => api.get("/career/me");
export const updateCareer = (data) => api.post("/career/me", data);
export const uploadResume = (file) => {
	const formData = new FormData();
	formData.append("file", file);
	return api.post("/career/upload-resume", formData, { headers: { "Content-Type": "multipart/form-data" } });
};
export const uploadResult = (file) => {
	const formData = new FormData();
	formData.append("file", file);
	return api.post("/career/upload-result", formData, { headers: { "Content-Type": "multipart/form-data" } });
};
export const downloadResume = () => api.get("/career/download-resume", { responseType: "blob" });
export const downloadResult = () => api.get("/career/download-result", { responseType: "blob" });

export const changePassword = (data) => api.post("/auth/change-password", data);
export const deleteAccount = () => api.delete("/auth/delete-account");

export default api;
