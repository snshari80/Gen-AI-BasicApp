from langchain_text_splitters  import RecursiveCharacterTextSplitter

async def text_splitter(docs):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=200,
        chunk_overlap=50,
        length_function=len,
        separators=['\n\n','\n','. ','?','!',' '," "]
    )
    return text_splitter.split_documents(docs)