import { Button } from '@/ui/Button';

export function OptionButton({
  label,
  index,
  onClick
}: {
  label: string;
  index: number;
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      className="justify-start w-full"
      onClick={onClick}
    >
      <span className="mr-2 opacity-70">{index + 1}.</span> {label}
    </Button>
  );
}
