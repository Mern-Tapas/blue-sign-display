import { useState } from "react";
import { Pagination } from "@bluesigns/ui";

function ListingPagination() {
  const [page, setPage] = useState(4);
  const pageCount = 12;
  return (
    <Pagination
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      summary={
        <>
          Showing <span className="text-fg figures">{(page - 1) * 12 + 1}–{page * 12}</span> of{" "}
          <span className="text-fg figures">{pageCount * 12}</span> products
        </>
      }
    />
  );
}

export const WithSummary = () => (
  <div style={{ maxWidth: 760 }}>
    <ListingPagination />
  </div>
);

export const FewPages = () => <Pagination page={1} pageCount={3} onPageChange={() => {}} className="sm:justify-center" />;

export const LinkMode = () => <Pagination page={7} pageCount={20} hrefFor={(p) => "/shop?category=footwear&page=" + p} className="sm:justify-center" />;

export const LastPage = () => <Pagination page={12} pageCount={12} onPageChange={() => {}} className="sm:justify-center" />;
