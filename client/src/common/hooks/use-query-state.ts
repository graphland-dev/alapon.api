import { useState, useEffect } from "react";

interface QueryParams {
  [key: string]: string;
}

type UpdateQueryParams = (newParams: QueryParams) => void;

const useQueryParams = (
  initialState: QueryParams
): [QueryParams, UpdateQueryParams] => {
  const [queryParams, setQueryParams] = useState(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params: QueryParams = {};
    urlSearchParams.forEach((value, key) => {
      params[key] = value;
    });
    return { ...initialState, ...params };
  });

  useEffect(() => {
    const urlSearchParams = new URLSearchParams();
    for (const key in queryParams) {
      urlSearchParams.set(key, queryParams[key]);
    }

    const newUrl = `${window.location.pathname}?${urlSearchParams.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [queryParams]);

  const updateQueryParams: UpdateQueryParams = (newParams) => {
    setQueryParams((prevParams) => ({
      ...prevParams,
      ...newParams,
    }));
  };

  return [queryParams, updateQueryParams];
};

export default useQueryParams;
