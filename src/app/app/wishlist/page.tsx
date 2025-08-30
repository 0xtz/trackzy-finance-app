import { Heart } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { api, HydrateClient } from "@/trpc/server";
import UpsertWishlistDialog from "./_components/upsert-wishlist-dialog";
import WishlistCards, {
  WishlistCardsSkeleton,
} from "./_components/wishlist-cards";

export default async function WishlistPage() {
  await connection();

  void api.wishlist.getAll.prefetch({
    page: 1,
    pageSize: 100,
  });

  return (
    <HydrateClient>
      {/* header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl">Wishlist</h2>

        <UpsertWishlistDialog>
          <Button size="sm">
            <Heart className="size-4" /> New Item
          </Button>
        </UpsertWishlistDialog>
      </div>

      {/* content */}
      <div className="mt-6">
        <Suspense fallback={<WishlistCardsSkeleton />}>
          <WishlistCards />
        </Suspense>
      </div>
    </HydrateClient>
  );
}
