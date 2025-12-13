import { createFileRoute } from "@tanstack/react-router";
import { ToursListPage } from "@/features/tours/pages/ToursListPage";

export const Route = createFileRoute("/tours/")({
  component: ToursListPage,
});