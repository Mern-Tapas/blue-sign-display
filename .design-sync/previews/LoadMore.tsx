import { useState } from "react";
import { LoadMore } from "@bluesigns/ui";

function Paged() {
  const [count, setCount] = useState(24);
  const [loading, setLoading] = useState(false);
  const load = () => {
    setLoading(true);
    setTimeout(() => {
      setCount((c) => Math.min(132, c + 24));
      setLoading(false);
    }, 700);
  };
  return <LoadMore loaded={count} total={132} onLoadMore={load} loading={loading} />;
}

export const Default = () => <Paged />;

export const Loading = () => <LoadMore loaded={48} total={132} loading onLoadMore={() => {}} />;

export const ReviewsNoun = () => <LoadMore loaded={10} total={1284} noun="reviews" label="Show more reviews" onLoadMore={() => {}} />;

export const AllLoaded = () => <LoadMore loaded={132} total={132} onLoadMore={() => {}} />;
