import { Skeleton } from "@mui/material";

/**
 * Reusable loading placeholder for list/table content — CircleReload stays
 * reserved for buttons, modals, and the full-page Reload overlay; anything
 * showing a list of rows while data loads uses this instead.
 */
const ListSkeleton = ({ rows = 5, height = 3.5 }) => {
    return (
        <div className="w-full grid gap-3">
            {Array.from({ length: rows }).map((_, i) => (
                <Skeleton key={i} variant="rounded" height={`${height}rem`} className="w-full" />
            ))}
        </div>
    );
};

export default ListSkeleton;
