import { createFileRoute } from "@tanstack/react-router";
import { TourCreatePage } from "@/features/tours/pages/TourCreatePage";

export const Route = createFileRoute("/tours/new")({
  component: TourCreatePage,
});