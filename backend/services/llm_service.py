from langchain_openai import OpenAIEmbeddings
from langchain_openai import ChatOpenAI

vision_llm = ChatOpenAI(
    model="gpt-4o",
    temperature=0,
    max_tokens=500,
)

llm = ChatOpenAI(
    model='gpt-4o-mini',
    temperature=0,
)

embeddings_model = OpenAIEmbeddings(
    model="text-embedding-3-small",
)