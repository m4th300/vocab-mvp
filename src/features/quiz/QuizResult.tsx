import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/ui/Button';

export default function QuizResult() {
  const loc = useLocation();
  const navigate = useNavigate();
  const p = new URLSearchParams(loc.search);
  const score = Number(p.get('score') ?? '0');

  return (
    <div className="p-6 md:p-8 grid place-items-center">
      <div className="card p-8 w-full max-w-md text-center">
        <div className="text-2xl font-semibold mb-2">Résultat</div>
        <div className="text-5xl font-bold mb-4">{score}</div>
        <div className="flex justify-center gap-2">
          <Button onClick={()=>navigate('/quiz')}>Relancer</Button>
          <Button variant="outline" onClick={()=>navigate('/')}>Retour Dashboard</Button>
        </div>
      </div>
    </div>
  );
}
