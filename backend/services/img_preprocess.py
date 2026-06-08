import cv2
import numpy as np


def preprocess_image(image_path: str) -> np.ndarray:
    """
    Preprocess image untuk meningkatkan akurasi OCR.

    Steps:
    1. Convert ke grayscale
    2. Resize jika terlalu kecil
    3. Apply bilateral filter (noise reduction)
    4. Apply adaptive threshold (teks lebih tajam)

    Args:
        image_path: Path ke file gambar

    Returns:
        Processed image (numpy array) siap untuk OCR
    """
    # Baca gambar
    img = cv2.imread(image_path)

    if img is None:
        raise ValueError(f"Tidak bisa membaca gambar: {image_path}")

    # Convert ke grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Resize jika gambar terlalu kecil (tinggi < 800px)
    height, width = gray.shape
    if height < 800:
        scale = 800 / height
        new_width = int(width * scale)
        gray = cv2.resize(gray, (new_width, 800), interpolation=cv2.INTER_CUBIC)

    # Bilateral filter - mengurangi noise tapi menjaga edge
    filtered = cv2.bilateralFilter(gray, 11, 17, 17)

    # Adaptive threshold - membuat teks hitam/putih yang tajam
    thresh = cv2.adaptiveThreshold(
        filtered, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )

    return thresh


def preprocess_image_simple(image_path: str) -> np.ndarray:
    """
    Preprocessing sederhana — untuk gambar yang sudah cukup jelas.

    Args:
        image_path: Path ke file gambar

    Returns:
        Processed image (numpy array)
    """
    img = cv2.imread(image_path)

    if img is None:
        raise ValueError(f"Tidak bisa membaca gambar: {image_path}")

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Simple threshold
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)

    return thresh
