from langchain_openai import OpenAIEmbeddings
from langchain_openai import ChatOpenAI


llm = ChatOpenAI(
    model='gpt-4o-mini',
    temperature=0,
)

embeddings_model = OpenAIEmbeddings(
    model="text-embedding-3-small",
)