import re
from typing import Optional
from PyPDF2 import PdfReader


def read_txt(file_path: str) -> str:
    """
    Reads the content of a text file.
    Args:
        file_path (str): Path to the text file.
    Returns:
        str: Content of the file.
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

def read_pdf(pdf_path: str) -> Optional[str]:
    """
    Extracts and cleans text from a PDF file.
    Args:
        pdf_path (str): Path to the PDF file.
    Returns:
        str: Cleaned text content, or None if extraction fails.
    """
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        # Basic cleaning: remove extra whitespace, non-printable chars
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'[^\x20-\x7E]', '', text)
        return text.strip()
    except Exception as e:
        print(f"Error extracting PDF text: {e}")
        return None

def read_document(file_path: str) -> str:
    """
    Reads a document (PDF or text) and returns its content.
    Args:
        file_path (str): Path to the document file.
    Returns:
        str: Content of the document.
    """
    if file_path.endswith('.pdf'):
        return read_pdf(file_path)
    elif file_path.endswith('.txt'):
        return read_txt(file_path)
    else:
        raise ValueError("Unsupported file format. Only .pdf and .txt are supported.")

# if __name__ == "__main__":
#     # Example usage
#     pdf_path = "geeta.pdf"
#     text = extract_clean_pdf_text(pdf_path)
#     print(text)
