import './App.css';
import { useMutation } from "@tanstack/react-query";
import { usefetchQuery, usefetchMessage } from "./hooks/useQuery";
import { sendMessage } from "./hooks/useFunctions";
import AIResponseCard from './components/Prompt-Response';
import AIPromptInput from './components/Prompt-Input';
import AIResponseLoader from './components/Prompt-Loader'

function App() {
  const { isLoading } = usefetchQuery();
  const mutation = useMutation({
    mutationFn: sendMessage,
  });

  const onSubmit = (message: str, mode: str) => {
    const data = { code: message, mode: mode }
    mutation.mutate(data)
  }

  const { data } = usefetchMessage()
  if (isLoading) {
    return <>Loading......</>
  }

  console.log(mutation, "mutation");

  const messagePreFetch = data?.length != 0;
  const messageResponse = mutation?.data?.length != undefined;
  const chatResponse = mutation?.data?.length != undefined ? mutation?.data : (data?.length != 0 ? data : [])

  return (
    <>
      {(messagePreFetch) || (messageResponse) ?
        <>
          {chatResponse.map((i: any) => {
            return (
              <AIResponseCard key={i?.id} prompt={i?.query} text={i?.response?.response} timestamp={i.timestamp} />
            )
          })}
          {mutation.status === 'pending' && <AIResponseLoader />}
        </>
        : ''}
      <AIPromptInput onSubmit={onSubmit} />
    </>
  )
}

export default App
