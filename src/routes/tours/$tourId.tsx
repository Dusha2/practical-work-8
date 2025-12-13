import { createFileRoute } from "@tanstack/react-router";
import { TourEditPage } from "@/features/tours/pages/TourEditPage";

export const Route = createFileRoute("/tours/$tourId")({
  component: TourEditPage,
});