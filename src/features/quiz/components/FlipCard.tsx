import { motion } from 'framer-motion';

export function FlipCard({ front, back, flipped }: { front: React.ReactNode; back: React.ReactNode; flipped: boolean }) {
  return (
    <div className="relative perspective-1000 w-full max-w-xl h-36">
      <motion.div
        className="absolute inset-0 card p-6 grid place-items-center backface-hidden"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="text-xl font-medium">{front}</div>
      </motion.div>
      <motion.div
        className="absolute inset-0 card p-6 grid place-items-center backface-hidden"
        animate={{ rotateY: flipped ? 0 : -180 }}
        transition={{ duration: 0.5 }}
        style={{ transform: 'rotateY(180deg)', transformStyle: 'preserve-3d' }}
      >
        <div className="text-xl font-medium">{back}</div>
      </motion.div>
    </div>
  );
}
