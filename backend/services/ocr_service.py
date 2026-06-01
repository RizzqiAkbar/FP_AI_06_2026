import pytesseract
from PIL import Image

def extract_text_from_image(image_path):
    try:
        # NOTE: Make sure Tesseract-OCR is installed on the system and in PATH.
        # Alternatively, uncomment and adjust the line below for Windows:
        # pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        image = Image.open(image_path)
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        print(f"OCR Error: {e}")
        return ""
