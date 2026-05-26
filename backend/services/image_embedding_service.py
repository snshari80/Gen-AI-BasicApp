import zipfile
from pathlib import Path
from langchain_core.documents import Document
from langchain_core.messages import HumanMessage, SystemMessage
import base64
from services.llm_service import vision_llm
import os

IMAGE_PATH = "images_cache"
UPLOAD_PATH = "uploads_cache"

if not os.path.exists(IMAGE_PATH):
    os.makedirs(IMAGE_PATH, exist_ok=True)

async def image_embedding(file_path)->list:
    extracted = []
    ext = Path(file_path).suffix.lower().lstrip(".")
    if ext == "docx":
        with zipfile.ZipFile(str(file_path) , "r") as z:
            media_files = [f for f in z.namelist() if f.startswith("word/media")]
            for media_file in media_files:
                ext_media =Path(media_file).suffix.lower().lstrip(".")
                if ext_media in ["png", "jpeg","jpg"]:
                    image_data = z.read(media_file)
                    image_name = f"{Path(file_path).stem}_{Path(media_file).name}"
                    image_source_path = f"{IMAGE_PATH}/{image_name}"
                    with open(str(image_source_path), "wb") as f:
                        f.write(image_data)
                    extracted.append({
                        "source_path" : image_source_path,
                        "source_docx":  Path(file_path).stem,
                        "source_image_name":image_name
                    })
    if extracted:
        return await summarize_image_with_llm(extracted)

    return []

async def summarize_image_with_llm(extracted: list)->list:

    image_documents = [] 

    for file in extracted:

            with open(str(file["source_path"]), "rb") as f:
                image_byte = f.read()
            
            ext = Path(file["source_path"]).suffix.lower().lstrip(".")
            media_type = f"image/{ext}"
            bs64_media = base64.b64encode(image_byte).decode("utf-8")

            message = HumanMessage(content=[
                {
                "type":"text",
                 "text":(
                        "You are analyzing an docoument image from upload by user"
                        "This image from the file" + file["source_docx"] +".\n\n"
                        "Please provide the details of this image"
                        "1.what is concept and topics related to image"
                )
                },
                {
                    "type":'image_url',
                    "image_url":{
                        "url":f"data:{media_type};base64,{bs64_media}",
                        "details":"high"
                    }
                }
            ])

            response = vision_llm.invoke([message])

            
            img_doc = Document(
                page_content=f"[IMAGE SUMMARY from {file['source_docx']}]: {response.content}]",
                metadata={
                    "source_type": "image_summary",
                    "file_name":file['source_docx'],
                    "image_name":file['source_image_name']
                }
            )

            image_documents.append(img_doc)

    return image_documents
