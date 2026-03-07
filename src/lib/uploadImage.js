export const uploadImage = async (file) => {
    try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            return data.url;
        } else {
            throw new Error(data.error || "Upload failed");
        }
    } catch (error) {
        console.error("Image upload utility error:", error);
        throw error;
    }
};
