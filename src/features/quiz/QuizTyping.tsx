import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCardsStore } from '@/store/useCardsStore';
import { scheduleSession } from '@/core/logic/quiz/adaptivity';
import { isAlmostCorrect } from '@/core/logic/quiz/tolerance';
import { Input } from '@/ui/Input';
import { Button } from '@/ui/Button';
import { ProgressBar } from './components/ProgressBar';
import { FeedbackToast } from './components/FeedbackToast';

export default function QuizTyping() {
  const { cards, load } = useCardsStore();
  const loc = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(loc.search);
  const folderId = params.get('folder') ?? undefined;
  const hardcore = params.get('hardcore') === '1';

  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<null | 'correct' | 'almost' | 'wrong'>(null);
  const [score, setScore] = useState(0);

  useEffect(() => { void load({ folderId }); }, [folderId, load]);
  const session = useMemo(() => scheduleSession(cards), [cards]);
  const current = session[i];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') navigate('/quiz');
      if (e.key === 'Enter') submit();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function submit() {
    if (!current) return;
    const { ok, almost } = isAlmostCorrect(answer, current.definition, hardcore);
    const state = ok ? 'correct' : almost ? 'almost' : 'wrong';
    setFeedback(state);
    if (ok) setScore(score + 1);
    setTimeout(() => {
      setFeedback(null);
      setAnswer('');
      if (i + 1 < session.length) setI(i + 1);
      else navigate('/quiz/result?score=' + (ok ? score + 1 : score));
    }, 400);
  }

  if (!current) return <div className="p-6">Chargement…</div>;

  return (
    <div className="p-6 md:p-8 grid gap-4 max-w-2xl">
      <div className="text-sm text-[var(--muted)]">Question {i + 1} / {session.length}</div>
      <ProgressBar value={i} max={session.length - 1} />
      <div className="card p-5">
        <div className="text-sm text-[var(--muted)] mb-1">Que signifie :</div>
        <div className="text-xl font-semibold">{current.term}</div>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Tapez la réponse…"
          value={answer}
          onChange={e=>setAnswer(e.target.value)}
          onKeyDown={(e)=>{ if (e.key==='Enter') submit(); }}
        />
        <Button onClick={submit}>Valider</Button>
      </div>
      <FeedbackToast state={feedback} />
      {hardcore && <div className="text-xs text-[var(--muted)]">Mode hardcore actif : seule la réponse exacte est acceptée.</div>}
    </div>
  );
}
