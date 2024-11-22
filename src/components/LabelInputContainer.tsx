import { cn } from "@/lib/utils";

export const LabelInputContainer = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={cn("flex flex-col space-y-2 w-full text-white", className)}>
      {children}
    </div>
  );
  