import axios from 'axios'

const getFileReaderBuffer = async (file) => {
  const fileReader = new FileReader()
  return new Promise((resolve, reject) => {
    fileReader.onload = () => {
      resolve(fileReader.result)
    }
    fileReader.onerror = () => {
      reject(fileReader.error)
    }
    fileReader.readAsArrayBuffer(file)
  })
}
export async function checkUrlType(url) {
  try {
    const response = await axios.get(url, { responseType: 'blob' })
    const contentType = response.headers['content-type']
    const size = response.data.size // Blob object size in bytes

    let type = 'url'
    if (contentType.startsWith('image/')) {
      type = 'image'
    } else if (contentType === 'application/json') {
      type = 'json'
    }

    return {
      type,
      size,
      mimeType: contentType
    }
  } catch (error) {
    console.error(`Failed to fetch URL: ${url}`)
    return {
      type: 'unknown',
      size: 0,
      mimeType: 'unknown'
    }
  }
}

export const safelyJSONParse = (value) => {
  try {
    return JSON.parse(value)
  } catch (error) {
    return null
  }
}
