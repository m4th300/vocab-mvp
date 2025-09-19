import { Button } from '@/ui/Button';
import { motion } from 'framer-motion';

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
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.12 }}>
      <Button
        variant="outline"
        className="justify-start w-full"
        onClick={onClick}
      >
        <span className="mr-2 opacity-70">{index + 1}.</span> {label}
      </Button>
    </motion.div>
  );
}
