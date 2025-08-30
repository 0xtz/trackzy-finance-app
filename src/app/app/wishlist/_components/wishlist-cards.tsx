"use client";

import {
  Check,
  Edit,
  ExternalLink,
  Heart,
  MoreVertical,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { GLOBAL_CONFIG } from "@/lib/global-config";
import { formatCurrency } from "@/lib/utils";
import { api, type RouterOutputs } from "@/trpc/react";
import UpsertWishlistDialog from "./upsert-wishlist-dialog";

export default function WishlistCards() {
  const [data] = api.wishlist.getAll.useSuspenseQuery({
    page: 1,
    pageSize: 100,
  });

  const utils = api.useUtils();

  const { mutateAsync: togglePurchased, isPending: isToggling } =
    api.wishlist.togglePurchased.useMutation({
      onSuccess: async () => {
        await utils.wishlist.getAll.invalidate();
      },
    });

  const { mutateAsync: deleteItem, isPending: isDeleting } =
    api.wishlist.delete.useMutation({
      onSuccess: async ({ success }) => {
        if (!success) {
          return;
        }
        await utils.wishlist.getAll.invalidate();
      },
    });

  const handleTogglePurchased = async (id: string, purchased: boolean) => {
    try {
      await togglePurchased({ id, purchased });
      toast.success(
        purchased
          ? "Item marked as purchased!"
          : "Item marked as not purchased!"
      );
    } catch {
      toast.error("Failed to update item status");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteItem({ id });
      toast.success(`"${name}" has been deleted from your wishlist`);
    } catch {
      toast.error("Failed to delete item");
    }
  };

  if (data.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Heart className="mb-4 size-12 text-muted-foreground" />
        <h3 className="mb-2 font-medium text-lg">No wishlist items yet</h3>
        <p className="text-muted-foreground">
          Start adding items to your wishlist to track your desired purchases.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.items.map((item) => (
        <WishlistCard
          isDeleting={isDeleting}
          isToggling={isToggling}
          item={item}
          key={item.id}
          onDelete={handleDelete}
          onTogglePurchased={handleTogglePurchased}
        />
      ))}
    </div>
  );
}

function WishlistCard({
  item,
  onTogglePurchased,
  onDelete,
  isToggling,
  isDeleting,
}: {
  item: RouterOutputs["wishlist"]["getAll"]["items"][number];
  onTogglePurchased: (id: string, purchased: boolean) => Promise<void>;
  onDelete: (id: string, name: string) => Promise<void>;
  isToggling: boolean;
  isDeleting: boolean;
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <>
      <Card
        className={`transition-all duration-200 hover:shadow-md ${
          item.purchased ? "bg-muted/50 opacity-75" : ""
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="line-clamp-2 text-lg">{item.name}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="size-8 shrink-0"
                  disabled={isDeleting}
                  size="icon"
                  variant="ghost"
                >
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="size-4" />
                  Edit Item
                </DropdownMenuItem>

                <DropdownMenuItem
                  disabled={isToggling}
                  onClick={() => onTogglePurchased(item.id, !item.purchased)}
                >
                  <Check className="size-4" />
                  {item.purchased
                    ? "Mark as not purchased"
                    : "Mark as purchased"}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  disabled={isDeleting}
                  onClick={() => onDelete(item.id, item.name)}
                  variant="destructive"
                >
                  <Trash className="size-4" />
                  Delete Item
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          <div className="aspect-video overflow-hidden rounded-md bg-muted">
            {/** biome-ignore lint/performance/noImgElement:dynamic input links */}
            <img
              alt={item.name}
              className="h-full w-full object-cover"
              src={item.image ?? GLOBAL_CONFIG.fallbackImage}
            />
          </div>

          <p className="line-clamp-3 text-muted-foreground text-sm">
            {item?.description ?? "No description"}
          </p>
        </CardContent>

        <CardFooter className="flex flex-wrap justify-end gap-2 pt-0">
          {item.estimated_price && (
            <Badge className="font-mono" variant="outline">
              {formatCurrency(Number(item.estimated_price))}
            </Badge>
          )}

          {item.url && (
            <Button asChild size="icon" variant="link">
              <Link
                className="flex items-center justify-center space-x-2 text-sm"
                href={item.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                <ExternalLink className="size-4" />
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>

      <UpsertWishlistDialog
        item={item}
        onOpenChange={setIsEditDialogOpen}
        open={isEditDialogOpen}
      />
    </>
  );
}

// Loading skeleton component
export function WishlistCardsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map(() => (
        <Card key={crypto.randomUUID()}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
