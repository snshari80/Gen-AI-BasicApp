from langchain_text_splitters  import RecursiveCharacterTextSplitter
import os
from pathlib import Path

async def text_splitter(docs):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=200,
        chunk_overlap=50,
        length_function=len,
        separators=['\n\n','\n','. ','?','!',' '," "]
    )
    return text_splitter.split_documents(docs)

async def remove_chunked_file(file_path:Path):
    print(file_path)
    file_path = os.path.abspath(file_path)
    if os.path.exists(file_path):
        os.remove(file_path)
        return { "status": "Images chunk deleted" }
    else:
        return { "status": "Images chunk not found" }