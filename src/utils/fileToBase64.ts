export async function fileToBase64(file: File) {
    return new Promise<string | undefined>(((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onloadend = (res) => {
            resolve(res.target?.result as string | undefined)
        }
        reader.onerror = (err) => {
            reject(err)
        }
    }))
}
