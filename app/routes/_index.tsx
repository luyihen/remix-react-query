import { json, LoaderFunction } from "@remix-run/node";
import { useQuery, dehydrate, QueryClient } from "@tanstack/react-query";
import { useSearchParams } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const queryClient = new QueryClient()
  const url = new URL(request.url);
  const idx = url.searchParams.get("idx") || "1";
  queryClient.prefetchQuery({
    queryKey: ["PokeAPI", idx],
    queryFn: () => fetchPokeAPI(parseInt(idx)),
    staleTime: 5000,
    gcTime: 6000,
  })
  return json({ dehydratedState: dehydrate(queryClient) })
};

const fetchPokeAPI = async (idx: number) => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idx}/`);
  const data = await res.json();
  return data;
};

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const idx = parseInt(searchParams.get("idx") || "1", 10);
  const { data, isFetching } = useQuery({
    queryKey: ["PokeAPI", idx],
    queryFn: () => fetchPokeAPI(idx)
  });

  if (isFetching) {
    return <span>Loading...</span>;
  }

  const setPrev = () => {
    if (idx > 1) setSearchParams({ idx: String(idx - 1) });
  };

  const setNext = () => {
    setSearchParams({ idx: String(idx + 1) });
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <div>
        <img src={data?.sprites?.front_default} alt="Pokemon" />
      </div>
      <div>
        <button onClick={setPrev}>上一個</button>
        <button onClick={setNext}>下一個</button>
      </div>
      <div>
        <p>current id: {data?.id}</p>
      </div>
    </div>
  );
}