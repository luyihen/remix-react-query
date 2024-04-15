import { json, LoaderFunction } from "@remix-run/node";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useSearchParams } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const idx = url.searchParams.get("idx") || "1";
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idx}`);
  const data = await response.json();
  return json(data);
};

const fetchPokeAPI = async (idx: number) => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idx}/`);
  const data = await res.json();
  return data;
};

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const idx = parseInt(searchParams.get("idx") || "1", 10);

  console.log("useLoaderData: ", useLoaderData())

  const { data, isFetching } = useQuery({
    queryKey: ["PokeAPI", idx],
    queryFn: () => fetchPokeAPI(idx),
    initialData: useLoaderData(),
    staleTime: 10000,
    gcTime: 20000,
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

  console.log(data);
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