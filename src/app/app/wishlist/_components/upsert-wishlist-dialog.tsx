"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type WishlistFormSchema,
  wishlistFormSchema,
} from "@/lib/z-schemas/wishlist";
import { api, type RouterOutputs } from "@/trpc/react";

export default function UpsertWishlistDialog({
  children,
  item,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: {
  item?: RouterOutputs["wishlist"]["getAll"]["items"][number];
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = externalOpen ?? internalOpen;
  const setOpen = externalOnOpenChange ?? setInternalOpen;

  const form = useForm({
    resolver: zodResolver(wishlistFormSchema),
    defaultValues: {
      name: item?.name ?? "",
      description: item?.description ?? "",
      estimated_price: item?.estimated_price ?? "",
      url: item?.url ?? "",
      image: item?.image ?? "",
      purchased: item?.purchased ?? false,
    },
  });

  const utils = api.useUtils();
  const { mutateAsync: upsertItem, isPending } =
    api.wishlist.upsert.useMutation({
      onSuccess: async (data) => {
        if (!data.success) {
          toast.error("Failed to save wishlist item");
          return;
        }

        await utils.wishlist.getAll.invalidate();
        toast.success(
          item
            ? "Wishlist item updated successfully!"
            : "Wishlist item created successfully!"
        );

        form.reset();
        setOpen(false);
      },
      onError: (error) => {
        toast.error(`Failed to save item: ${error.message}`);
      },
    });

  const onSubmit = async (data: WishlistFormSchema) => {
    try {
      await upsertItem({
        ...data,
        id: item?.id,
      });
    } catch {
      // Error handling is done in the mutation
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {item ? "Edit Wishlist Item" : "Add Wishlist Item"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter item name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Enter item description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimated_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0.00"
                      step="0.01"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purchased"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Mark as purchased</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                disabled={isPending}
                onClick={() => setOpen(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button disabled={isPending} type="submit">
                {(isPending && "Saving...") ||
                  (item ? "Update Item" : "Add Item")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
