import { useQuery } from "@tanstack/react-query";
import {fetchService} from './useFunctions';

async function fetchMessage() {
  const res = JSON.parse(sessionStorage.getItem("messages") || "[]");
  return res;
}

export function usefetchQuery() {
  return useQuery({
    queryKey: ["fetchService"],
    queryFn: fetchService,
  });
}

export function usefetchMessage() {
  return useQuery({
    queryKey: ["fetchMessage"],
    queryFn: fetchMessage,
  });
}

