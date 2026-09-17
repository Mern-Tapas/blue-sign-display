import { InfiniteScrollSentinel, Inset, LoadMore, ProductImage, sampleData } from "@bluesigns/ui";

const { products } = sampleData;

export const LoadingNextPage = () => (
  <div style={{ maxWidth: 640 }}>
    <Inset size="sm">
      <ul className="grid grid-cols-4 gap-3">
        {products.slice(0, 8).map((p) => (
          <li key={p.id} className="flex flex-col gap-1.5">
            <ProductImage src={p.images[0]!} alt={p.name} sizes="150px" wrapperClassName="aspect-square rounded-md" />
            <span className="line-clamp-1 text-caption">{p.name}</span>
          </li>
        ))}
      </ul>
      <div className="pt-5 pb-2">
        <InfiniteScrollSentinel hasMore loading onLoadMore={() => {}}>
          <LoadMore loaded={8} total={products.length} onLoadMore={() => {}} loading />
        </InfiniteScrollSentinel>
      </div>
    </Inset>
  </div>
);

export const EndOfList = () => (
  <div style={{ maxWidth: 640 }}>
    <Inset size="sm">
      <ul className="grid grid-cols-4 gap-3">
        {products.slice(0, 8).map((p) => (
          <li key={p.id} className="flex flex-col gap-1.5">
            <ProductImage src={p.images[0]!} alt={p.name} sizes="150px" wrapperClassName="aspect-square rounded-md" />
            <span className="line-clamp-1 text-caption">{p.name}</span>
          </li>
        ))}
      </ul>
      <div className="pt-5 pb-2">
        <InfiniteScrollSentinel hasMore={false} onLoadMore={() => {}}>
          <LoadMore loaded={8} total={8} onLoadMore={() => {}} />
        </InfiniteScrollSentinel>
      </div>
    </Inset>
  </div>
);
